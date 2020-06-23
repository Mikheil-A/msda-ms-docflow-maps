import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as ol from 'openlayers';

@Component({
  selector: '[openlayers]',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() orgId = 1;
  @Input() clientToken = 'aceeb1c1-b378-439e-821a-843abcabaafc';
  @Input() parkingLayerId: string;
  @Input() center = ol.proj.transform([44.7805792, 41.7128489], 'EPSG:4326', 'EPSG:3857');

  @Output() featureClick = new EventEmitter();

  private _map: ol.Map;
  private _markersLayer: ol.layer.Vector;
  private _drawingLayer: ol.layer.Vector;
  private _drawingInteraction: ol.interaction.Draw;

  searchResult$: Observable<any>;

  get map() {
    return this._map;
  }

  constructor(
    private _http: HttpClient,
    private _elementRef: ElementRef
  ) {
  }

  ngOnInit() {
    this._initMap();
    this._initMarkersLayer();
    this._initDrawingLayer();
    this._initParkingLayer();
    this._initMapEvents();

    // this._addMesaureTool('Polygon', (e: any) => {
    //   const format = new ol.format.WKT();
    //   const geometry = e.feature.getGeometry();
    //   const size = this._map.getSize();
    //   this._map.getView().fit(geometry.getExtent(), { size });
    //   const wktGeometry = format.writeGeometry(geometry);
    // });
  }

  private _initMarkersLayer() {
    this._markersLayer = new ol.layer.Vector({
      zIndex: 2,
      source: new ol.source.Vector()
    });

    this._map.addLayer(this._markersLayer);
  }

  private _initDrawingLayer() {
    this._drawingLayer = new ol.layer.Vector({
      zIndex: 1,
      source: new ol.source.Vector({ wrapX: false })
    });

    this._map.addLayer(this._drawingLayer);
  }

  private _initParkingLayer() {
    this._map.addLayer(
      new ol.layer.Tile({
        zIndex: 2,
        source: new ol.source.TileWMS({
          urls: ['/geoserver/tgis/wms'],
          projection: 'EPSG:3857',
          params: {
            env: 'fill_opacity:0;',
            LAYERS: 'LR_TR_AVTOSADGOMEBI',
            transparent: true
          }
        })
      })
    );
  }

  private _initMap() {
    this._map = new ol.Map({
      target: this._elementRef.nativeElement,
      view: new ol.View({
        zoom: 14,
        maxZoom: 22,
        center: this.center
      })
    });

    // Request URL: https://urban.tbilisi.gov.ge/tbilisimap-core/api/msdaws/getTmapOverlayLayersTree
    this._http.post('/tbilisimap-core/api/managelayersws/getLayersInGroups', {
      params: { orgId: this.orgId, viewLevel: 1 },
      clientToken: this.clientToken
    }).subscribe((res: any) => {
      Array.prototype.forEach.call(res.data[0].lrs, (lr) => {
        if (!lr.sourceUrl) return;
        this.map.addLayer(
          new ol.layer.Tile({
            visible: Boolean(lr.isSelected),
            source: new ol.source.OSM({
              url: lr.sourceUrl.replace(/\$(\{[xyz]\})/g, '$1'),
              maxZoom: lr.paramsJson.numZoomLevels,
              crossOrigin: null
            })
          })
        );
      });
    });
  }

  private _initMapEvents() {
    this._map.on('click', (e: any) => {
      const source = this._markersLayer.getSource();
      source.clear();

      // Request URL: https://urban.tbilisi.gov.ge/tbilisimap-core/api/msdaws/getTmapOverlayLayersTree
      const [x, y] = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
      this._http.post('/tbilisimap-core/api/managelayersws/getLayersInfos', {
        params: { x, y, lrsIds: this.parkingLayerId, orgId: this.orgId, viewLevel: 1 },
        clientToken: this.clientToken
      }).subscribe((res: any) => {
        this.featureClick.emit(res);

        if (res.data.length > 0) {
          const feature = new ol.Feature(
            new ol.geom.Point(e.coordinate)
          );

          feature.setStyle(
            new ol.style.Style({
              image: new ol.style.Icon({
                rotateWithView: false,
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: '//raw.githubusercontent.com/jonataswalker/map-utils/master/images/marker.png'
              })
            })
          );

          source.addFeature(feature);
        }
      });
      // const result = this._map.forEachFeatureAtPixel(e.pixel, (feature, layer) => ({ feature, layer }));
      // if (result) {
      //   const { feature, layer } = result;
      //   if (feature && layer) {
      //     this.featureClick.emit({ feature, layer });
      //   }
      // }
    });

    this._map.on('pointermove', (e: any) => {
      const pixel = this._map.getEventPixel(e.originalEvent);
      const hit = this._map.hasFeatureAtPixel(pixel);
      const targetElement = this._map.getTargetElement() as HTMLElement;
      targetElement.style.cursor = hit ? 'pointer' : '';
    });
  }

  // private _addInteraction(type: ol.geom.GeometryType) {
  //   this._removeInteraction();

  //   const source = this._drawingLayer.getSource();
  //   this._drawingInteraction = new ol.interaction.Draw({ type, source });
  //   this._map.addInteraction(this._drawingInteraction);

  //   return this._drawingInteraction;
  // }

  // private _removeInteraction() {
  //   if (!this._drawingInteraction) return;

  //   this._map.removeInteraction(this._drawingInteraction);
  //   this._drawingInteraction = null;
  // }

  // private _addMesaureTool(type: ol.geom.GeometryType, onDrawEnd: ol.EventsListenerFunctionType) {
  //   const source = this._drawingLayer.getSource();

  //   source.clear();

  //   const interaction = this._addInteraction(type);

  //   interaction.on('drawstart', () => {
  //     source.clear();
  //   });

  //   interaction.on('drawend', onDrawEnd);

  //   return interaction;
  // }

  drawWkt(geometryWkt: string, clear = true) {
    if (!geometryWkt) return;

    const source = this._drawingLayer.getSource();

    if (clear) {
      source.clear();
    }

    const format = new ol.format.WKT();
    const geometry = format.readGeometry(geometryWkt.replace(/,\)$/g, ')'));
    const feature = new ol.Feature({ geometry });

    source.addFeature(feature);

    if (geometry instanceof ol.geom.Point) {
      const center = geometry.getCoordinates();
      this._map.getView().animate({ center, zoom: 18 });
    } else {
      const size = this._map.getSize();
      this._map.getView().fit(geometry.getExtent(), { size });
    }
  }

  doSearch(searchText: string, page = 0, size = 20) {
    this.searchResult$ = null;

    if (searchText.length < 3) {
      return;
    }

    this.searchResult$ = this._http.post('/tbilisimap-core/api/mapsearchws/searchAll', {
      params: { searchText, page, size, orgId: this.orgId },
      clientToken: this.clientToken
    });
  }

}

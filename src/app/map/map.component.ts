import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as ol from 'openlayers';

@Component({
  selector: '[openlayers]',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() orgId = 1;
  @Input() clientToken = 'aceeb1c1-b378-439e-821a-843abcabaafc';
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

  constructor(private _http: HttpClient, private _elementRef: ElementRef) {}

  ngOnInit() {
    this._initMap();
    this._initMarkersLayer();
    this._initDrawingLayer();

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
      source: new ol.source.Vector(),
    });

    this._map.addLayer(this._markersLayer);
  }

  private _initDrawingLayer() {
    this._drawingLayer = new ol.layer.Vector({
      zIndex: 1,
      source: new ol.source.Vector({ wrapX: false }),
    });

    this._map.addLayer(this._drawingLayer);
  }

  private _initMap() {
    this._map = new ol.Map({
      target: this._elementRef.nativeElement,
      view: new ol.View({
        zoom: 14,
        maxZoom: 22,
        center: this.center,
      }),
    });

    this._http
      .post('/tbilisimap-core/api/managelayersws/getLayersInGroups', {
        params: { orgId: this.orgId, viewLevel: 1 },
        clientToken: this.clientToken,
      })
      .subscribe((res: any) => {
        Array.prototype.forEach.call(res.data[0].lrs, (lr) => {
          if (!lr.sourceUrl) return;
          this.map.addLayer(
            new ol.layer.Tile({
              visible: Boolean(lr.isSelected),
              source: new ol.source.OSM({
                url: lr.sourceUrl.replace(/\$(\{[xyz]\})/g, '$1'),
                maxZoom: lr.paramsJson.numZoomLevels,
                crossOrigin: null,
              }),
            })
          );
        });
      });
  }

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
      clientToken: this.clientToken,
    });
  }
}

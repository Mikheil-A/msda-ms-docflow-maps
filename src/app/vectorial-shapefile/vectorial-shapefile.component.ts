import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as ol from 'openlayers';

declare var shp: any;

@Component({
  selector: 'app-vectorial-shapefile',
  templateUrl: './vectorial-shapefile.component.html',
  styleUrls: ['./vectorial-shapefile.component.scss'],
})
export class VectorialShapefileComponent implements OnInit {
  vectorialShapefileForm: FormGroup;

  @ViewChild('olMap')
  olMap: any;

  constructor() {}

  ngOnInit(): void {
    this._initializeForm();

    /*    setTimeout(() => {
      shp('assets/aslan.zip').then(function (data) {
        // console.log('test uploaded data:', data);
      });
    }, 1000);*/
  }

  private _initializeForm() {
    this.vectorialShapefileForm = new FormGroup({
      shapefileName: new FormControl(null, Validators.required),
      shapefile: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
    });
  }

  convert(input_json) {
    // convert the json-input to WKT
    // "JavaScript: Convert GeoJSON Polygon to WKT - bl.ocks.org": http://bl.ocks.org/tyrasd/829d090e2400fd1ca59e9b2523847d28, https://gist.github.com/tyrasd/829d090e2400fd1ca59e9b2523847d28
    // var wkt_str =
    //   'POLYGON((' +
    //   input_json.coordinates.map((ring, index) => {
    //     console.log('ring', ring, ring[0], ring[1]);
    //     return ring[0] + ' ' + ring[1];
    //   }) +
    //   ')';

    // convert the json-input to WKT
    // "JavaScript: Convert GeoJSON to WKT I": https://gist.github.com/milkbread/6991519
    var wkt_str = 'POLYGON((';
    input_json.coordinates.forEach(function (p, i) {
      //	console.log(p)
      if (i < input_json.coordinates.length - 1)
        wkt_str = wkt_str + p[0] + ' ' + p[1] + ', ';
      else wkt_str = wkt_str + p[0] + ' ' + p[1] + '))';
    });

    console.log('wkt_str', wkt_str);
    return wkt_str;
  }

  add() {
    console.log(this.vectorialShapefileForm.value);
  }

  onShapefileUpload(e) {
    let reader = new FileReader();
    reader.addEventListener('load', (event) => {
      shp(event.target.result).then((data) => {
        console.log('data>>>>>', data); // you should stirgigy this. es unda gastringo
        /*const geoJson = {
          type: data.features[0].geometry.type,
          coordinates: [...data.features[0].geometry.coordinates[0]],
        };
        console.log('>>>>>>', geoJson);
        const wktText = this.convert(geoJson);
        this.olMap.drawWkt(wktText);*/

        const geojson_format = new ol.format.GeoJSON();
        console.log('geojson_format>>', geojson_format);
        let testFeature = geojson_format.readFeature(JSON.stringify(data));
        console.log('testFeature', testFeature);
        const wkt = new ol.format.WKT({});
        const out = wkt.writeFeature(testFeature);
        console.log('out', out);
        this.olMap.drawWkt(out);
      });
    });
    reader.readAsArrayBuffer(e.target.files[0]);
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import WKT from 'ol/format/WKT';
import GeoJSON from 'ol/format/GeoJSON';

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
  }

  private _initializeForm() {
    this.vectorialShapefileForm = new FormGroup({
      shapefile: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
    });
  }

  add() {
    console.log(this.vectorialShapefileForm.value);
  }

  onShapefileUpload(e) {
    let reader = new FileReader();
    reader.addEventListener('load', (event) => {
      shp(event.target.result).then((geoJson) => {
        const options = {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        };
        const features = new GeoJSON().readFeatures(geoJson, options);
        const wktOutputString = new WKT().writeFeatures(features);
        this.olMap.drawWkt(wktOutputString);
      });
    });
    reader.readAsArrayBuffer(e.target.files[0]);
  }
}

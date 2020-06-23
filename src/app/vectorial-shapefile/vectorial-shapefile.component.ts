import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// import 'shapefile';
// import * as shapefile from 'shapefile';
// import * as shpjs from 'shpjs';
// import * as shp from 'shpjs';

declare var shp: any;

// var shapefile = require("shapefile");

@Component({
  selector: 'app-vectorial-shapefile',
  templateUrl: './vectorial-shapefile.component.html',
  styleUrls: ['./vectorial-shapefile.component.scss'],
})
export class VectorialShapefileComponent implements OnInit {
  vectorialShapefileForm: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this._initializeForm();

    setTimeout(() => {
      shp('assets/aslan.zip').then(function (data) {
        // console.log('test uploaded data:', data);
      });
    }, 1000);
  }

  private _initializeForm() {
    this.vectorialShapefileForm = new FormGroup({
      shapefileName: new FormControl(null, Validators.required),
      shapefile: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
    });
  }

  add() {
    console.log(this.vectorialShapefileForm.value);
  }

  onShapefileUpload(e) {
    console.log('event', e.target.files[0]);
    console.log('event target value', e.target.value);
    // console.log('files', e.target.files[0]);

    let reader = new FileReader();
    reader.addEventListener('load', (event) => {
      console.log(111111, event);

      shp(event.target.result).then((data) => {
        console.log('data', data);
      });
    });

    reader.readAsArrayBuffer(e.target.files[0]);

    // let bufferFile = reader.readAsArrayBuffer(e);
    // console.log('bufferFile', bufferFile);

    // shp(bufferFile).then(function (data) {
    //   console.log('uploaded file>>>:', data);
    // });

    // shp(e.target.files[0]).then(function (geojson) {
    //   console.log('geojson', geojson);
    // });

    /*    let reader = new FileReader();

      reader.addEventListener('load', (event) => {
        // shp(event.target.result)
        //   .then(geoJson => {
        //     shapeArchiveFile = value;
        //
        //     $scope.$apply(() => {
        //       $scope.shapefileMapOptions = {
        //         center: center,
        //         onInit: mapService => {
        //           $timeout(() => {
        //             mapService.drawingLayerAddFeatureCollection(geoJson);
        //             mapService.map.zoomToExtent(mapService.drawingLayer.getDataExtent());
        //           });
        //         }
        //       };
        //     });
        //
        //     $scope.addFormData();
        //   }, error => {
        //     $scope.showMessageDialog('ატვირთული zip ფაილი უნდა შეიცავდეს მხოლოდ ერთ ცალ .shp და ერთ ცალ .shx ფაილს.', () => {
        //       $scope.formData.shapefile = null;
        //     });
        //   });
      });*/

    // shpjs(e.target.files[0]).then(function (geojson) {
    //   //see bellow for whats here this internally call shp.parseZip()
    //   console.log(geojson);
    // });

    // shapefile
    //   .open(e.target.files[0])
    //   .then((source) =>
    //     source.read().then(function log(result) {
    //       if (result.done) return;
    //       console.log('result value: ', result.value);
    //       return source.read().then(log);
    //     })
    //   )
    //   .catch((error) => console.error(error.stack));
  }

  onInputChange(e) {
    console.log('>>>', e);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

declare var shp: any;

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

  add() {
    console.log(this.vectorialShapefileForm.value);
  }

  onShapefileUpload(e) {
    let reader = new FileReader();
    reader.addEventListener('load', (event) => {
      shp(event.target.result).then((data) => {
        console.log('data', data); // you should stirgigy this. es unda gastringo
      });
    });
    reader.readAsArrayBuffer(e.target.files[0]);
  }
}

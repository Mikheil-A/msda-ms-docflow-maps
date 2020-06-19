import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
    console.log('onShapefileUpload event', e);
  }
}

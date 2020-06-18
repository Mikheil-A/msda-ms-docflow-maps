import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-cadastral-entity',
  templateUrl: './cadastral-entity.component.html',
  styleUrls: ['./cadastral-entity.component.scss']
})
export class CadastralEntityComponent implements OnInit {
  cadastralEntityForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this._initializeForm();
  }

  private _initializeForm() {
    this.cadastralEntityForm = new FormGroup({
      'cadastralCode': new FormControl(null, Validators.required),
      'address': new FormControl(null, Validators.required),
      'landType': new FormControl(null, Validators.required)
    });
  }

  add() {
    console.log(this.cadastralEntityForm.value);

    this.cadastralEntityForm.controls['address'].setValue('test1');
    this.cadastralEntityForm.controls['landType'].setValue('test2');
  }
}

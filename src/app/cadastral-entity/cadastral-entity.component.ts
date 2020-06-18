import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-cadastral-entity',
  templateUrl: './cadastral-entity.component.html',
  styleUrls: ['./cadastral-entity.component.scss']
})
export class CadastralEntityComponent implements OnInit {
  cadastralEntity: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this._initializeForm();
  }

  private _initializeForm() {
    this.cadastralEntity = new FormGroup({
      'cadastralCode': new FormControl(null, Validators.required),
      'address': new FormControl(null, Validators.required),
      'landType': new FormControl(null, Validators.required)
    });
  }

  add() {
    console.log(this.cadastralEntity.value);
  }
}

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-cadastral-entity',
  templateUrl: './cadastral-entity.component.html',
  styleUrls: ['./cadastral-entity.component.scss'],
})
export class CadastralEntityComponent implements OnInit, AfterViewInit {
  cadastralEntityForm: FormGroup;

  @ViewChild('cadastralCodeInputField') cadastralCodeInputField: ElementRef;

  constructor() {}

  ngOnInit(): void {
    this._initializeForm();
  }

  ngAfterViewInit() {
    this._listenToCadastralCodeInputField();
  }

  private _listenToCadastralCodeInputField() {
    fromEvent(this.cadastralCodeInputField.nativeElement, 'keyup')
      .pipe(debounceTime(1000))
      .subscribe(() => {
        // todo send request here
        console.log(
          'this.cadastralCodeInputField.nativeElement.value',
          this.cadastralCodeInputField.nativeElement.value
        );
      });
  }

  private _initializeForm() {
    this.cadastralEntityForm = new FormGroup({
      cadastralCode: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      landType: new FormControl(null, Validators.required),
    });
  }

  add() {
    console.log(this.cadastralEntityForm.value);

    this.cadastralEntityForm.controls['address'].setValue('test1');
    this.cadastralEntityForm.controls['landType'].setValue('test2');
  }
}

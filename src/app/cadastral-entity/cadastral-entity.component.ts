import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastral-entity',
  templateUrl: './cadastral-entity.component.html',
  styleUrls: ['./cadastral-entity.component.scss'],
})
export class CadastralEntityComponent implements OnInit, AfterViewInit {
  cadastralEntityForm: FormGroup;

  @ViewChild('cadastralCodeInputField')
  cadastralCodeInputFieldRef: ElementRef;

  @ViewChild('olMap')
  olMap: any;

  constructor(private _httpClient: HttpClient) {}

  ngOnInit(): void {
    this._initializeForm();
  }

  ngAfterViewInit() {
    this._listenToCadastralCodeInputField();
  }

  private _setReadonlyFieldsValues(res) {
    this.cadastralEntityForm.controls['address'].setValue(res.data.property[0].address);
    this.cadastralEntityForm.controls['landType'].setValue(
      res.data.property[0].parcelFunction
    );
  }

  private _listenToCadastralCodeInputField() {
    fromEvent(this.cadastralCodeInputFieldRef.nativeElement, 'keyup')
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this._httpClient
          .post('/api/tbilisimap-core/api/msdaws/getParcelByCadcode', {
            data: {
              cadcode: this.cadastralCodeInputFieldRef.nativeElement.value, // Example of cadastral code: 03.02.21.440
            },
          })
          .subscribe((res: any) => {
            this._setReadonlyFieldsValues(res);
            this.olMap.drawWkt(res.data.wktShape);
          });
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
  }

  addOlInteraction() {
    this.olMap.addOlInteraction();
  }
}

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
            console.log('res.data.wktShape', res.data.wktShape);
            this.olMap.drawWkt(res.data.wktShape);

            // generated from aslan.zip
            // this.olMap.drawWkt(
            //   'POLYGON((44.7103970229938 41.74357887213198, 44.71125439968339 41.74397424501405, 44.71235318358756 41.74375537057794, 44.71336598269435 41.74355056989313, 44.71346573340633 41.74258565407756, 44.711415107384326 41.74219445629645, 44.71064868500101 41.7428073744982, 44.7103970229938 41.74357887213198))'
            // );
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
}

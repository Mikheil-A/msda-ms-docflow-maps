import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  radioButtonValue: number=1;

  changeRadioButton(event) {
    this.radioButtonValue = event.value;
  }
}

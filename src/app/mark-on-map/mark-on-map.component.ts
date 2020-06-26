import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-mark-on-map',
  templateUrl: './mark-on-map.component.html',
  styleUrls: ['./mark-on-map.component.scss'],
})
export class MarkOnMapComponent implements OnInit {
  @ViewChild('olMap')
  olMap: any;

  constructor() {}

  ngOnInit(): void {}

  toggleInteraction(event) {
    if (event.checked) {
      this.olMap.addOlInteraction();
    } else {
      this.olMap.removeInteraction();
    }
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-mark-on-map',
  templateUrl: './mark-on-map.component.html',
  styleUrls: ['./mark-on-map.component.scss'],
})
export class MarkOnMapComponent implements OnInit {
  isInteractionOn: boolean = false;

  @ViewChild('olMap')
  olMap: any;

  constructor() {}

  ngOnInit(): void {}

  toggleInteraction(event) {
    this.isInteractionOn = event.checked;
    if (event.checked) {
      this.olMap.addOlInteraction();
    } else {
      this.olMap.removeInteraction();
    }
  }
}

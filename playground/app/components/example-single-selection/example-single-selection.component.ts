import { Component } from '@angular/core';

@Component({
  selector: 'example-single-selection',
  templateUrl: 'example-single-selection.component.html',
  styleUrls: ['example-single-selection.component.scss']
})
export class ExampleSingleSelectionComponent {

  public chips = [
    { name: 'Tag A', value: 1 },
    { name: 'Tag B', value: 2 },
    { name: 'Tag C', value: 3 },
    { name: 'Tag D', value: 4 },
  ];

  public chip

  change(event) {
    console.log(event);
  }
}

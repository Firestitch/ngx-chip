import { Component } from '@angular/core';

@Component({
  selector: 'example-with-array',
  templateUrl: 'example-with-array.component.html',
  styleUrls: ['example-with-array.component.scss']
})
export class ExampleWithArrayComponent {

  public listOfChips = [
    { name: 'Tag 1', value: 1 },
    { name: 'Tag 2', value: 2 },
    { name: 'Tag 3', value: 3 },
    { name: 'Tag 4', value: 4 },
  ];

  public selected = [];

  selectionChange(val) {
    const valIndex = this.selected.indexOf(val);
    if (valIndex === -1) {
      this.selected.push(val);
    } else {
      this.selected.splice(valIndex, 1);
    }
  }
}

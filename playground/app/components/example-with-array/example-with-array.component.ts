import { Component } from '@angular/core';

@Component({
  selector: 'example-with-array',
  templateUrl: 'example-with-array.component.html',
  styleUrls: ['example-with-array.component.scss']
})
export class ExampleWithArrayComponent {

  public listOfChips = [
    { name: 'Tag A', value: 1 },
    { name: 'Tag B', value: 2 },
    { name: 'Tag C', value: 3 },
    { name: 'Tag D', value: 4 },
  ];

  public selectedIds = [];

  selectionChange(val) {
    const valIndex = this.selectedIds.indexOf(val);
    if (valIndex === -1) {
      this.selectedIds.push(val);
    } else {
      this.selectedIds.splice(valIndex, 1);
    }
  }
}

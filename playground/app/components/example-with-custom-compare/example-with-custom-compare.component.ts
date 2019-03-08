import { Component } from '@angular/core';

@Component({
  selector: 'example-with-custom-compare',
  templateUrl: 'example-with-custom-compare.component.html',
  styleUrls: ['example-with-custom-compare.component.scss']
})
export class ExampleWithCustomCompareComponent {

  public listOfChips = [
    { name: 'Tag A', value: 1 },
    { name: 'Tag B', value: 2 },
    { name: 'Tag C', value: 3 },
    { name: 'Tag D', value: 4 },
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

  compare(modelValue, optionValue) {
    return modelValue === optionValue;
  }
}

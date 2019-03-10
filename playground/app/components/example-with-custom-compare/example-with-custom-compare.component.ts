import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'example-with-custom-compare',
  templateUrl: 'example-with-custom-compare.component.html',
  styleUrls: ['example-with-custom-compare.component.scss']
})
export class ExampleWithCustomCompareComponent implements OnInit {

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

  compare(modelValue, optionValue) {
    return modelValue === optionValue;
  }

  ngOnInit() {

  }
}

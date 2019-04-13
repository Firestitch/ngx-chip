import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'example-with-custom-compare',
  templateUrl: 'example-with-custom-compare.component.html',
  styleUrls: ['example-with-custom-compare.component.scss']
})
export class ExampleWithCustomCompareComponent implements OnInit {

  public listOfChips = [];
  public selected = [];

  selectionChange(chip) {
    chip.selected = !chip.selected;

    const valIndex = this.selected.indexOf(chip.value);
    if (valIndex === -1) {
      this.selected.push(chip.value);
    } else {
      this.selected.splice(valIndex, 1);
    }
  }

  compare(modelValue, optionValue) {
    return modelValue === optionValue;
  }

  ngOnInit() {
    setTimeout(() => {

      this.listOfChips = [
        { name: 'Tag 1', value: 1, selected: true },
        { name: 'Tag 2', value: 2, selected: true },
        { name: 'Tag 3', value: 3 },
        { name: 'Tag 4', value: 4 }
      ];

      this.selected = [1, 2];
    }, 500);
  }
}

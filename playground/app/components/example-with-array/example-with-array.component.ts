import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';


@Component({
  selector: 'example-with-array',
  templateUrl: 'example-with-array.component.html',
  styleUrls: ['example-with-array.component.scss']
})
export class ExampleWithArrayComponent implements OnInit {

  public chips = [];
  public selected;
  public checkboxes = {};

  ngOnInit() {

      this.chips = [
        { name: 'Tag 1', value: 1 },
        { name: 'Tag 2', value: 2 },
        { name: 'Tag 3', value: 3 },
        { name: 'Tag 4', value: 4 }
      ];
  }

  checkboxChange(event) {
    if (!this.selected) {
      this.selected = [];
    }

    this.checkboxes[event.source.value.value] = event.checked;
    const valIndex = this.selected.indexOf(event.source.value);
    if (valIndex === -1) {
      this.selected.push(event.source.value);
    } else {
      this.selected.splice(valIndex, 1);
    }

    this.selected = this.selected.splice(0);
  }

  chipsChange(event) {

    if (!this.selected) {
      this.selected = [];
    }

    this.chips.forEach(chip => {
      this.checkboxes[chip.value] = this.selected.indexOf(chip) >= 0;
    });
  }
}

import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'example-with-custom-compare',
  templateUrl: 'example-with-custom-compare.component.html',
  styleUrls: ['example-with-custom-compare.component.scss']
})
export class ExampleWithCustomCompareComponent implements OnInit {

  public chips = [];
  public selected = [];
  public checkboxes = {};

  compare(o1, o2) {
    return o1 === o2;
  }

  checkboxChange(event) {
    const value = event.source.value.id;
    this.checkboxes[value] = event.checked;
    const valIndex = this.selected.indexOf(value);
    if (valIndex === -1) {
      this.selected.push(value);
    } else {
      this.selected.splice(valIndex, 1);
    }

    this.selected = this.selected.splice(0);
  }

  chipsChange(event) {
    this.chips.forEach(chip => {
      this.checkboxes[chip.id] = this.selected.indexOf(chip.id) >= 0;
    });
  }

  ngOnInit() {

    this.chips = [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
      { name: 'Tag 4', id: 4 }
    ];

    this.selected = [1, 2];
    this.checkboxes[1] = true;
    this.checkboxes[2] = true;
  }
}

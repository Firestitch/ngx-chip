import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatCheckbox } from '@angular/material/checkbox';

import { FsLabelModule } from '@firestitch/label';

import { FsChipComponent } from '../../../../src/app/components/chip/chip.component';
import { FsChipsComponent } from '../../../../src/app/components/chips/chips.component';


@Component({
  selector: 'example-with-array',
  templateUrl: './example-with-array.component.html',
  styleUrls: ['./example-with-array.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsLabelModule,
    MatCheckbox,
    FormsModule,
    FsChipsComponent,
    FsChipComponent,
    JsonPipe,
  ],
})
export class ExampleWithArrayComponent implements OnInit {

  public chips = [];
  public selected = [];
  public checkboxes = {};

  public ngOnInit() {

    this.chips = [
      { name: 'Tag 1', value: 1 },
      { name: 'Tag 2', value: 2 },
      { name: 'Tag 3', value: 3 },
      { name: 'Tag 4', value: 4 },
    ];
  }

  public checkboxChange(event) {
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

  public chipsChange() {

    if (!this.selected) {
      this.selected = [];
    }

    this.chips.forEach((chip) => {
      this.checkboxes[chip.value] = this.selected.indexOf(chip) >= 0;
    });
  }
}

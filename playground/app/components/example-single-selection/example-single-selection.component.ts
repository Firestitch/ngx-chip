import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FsLabelModule } from '@firestitch/label';
import { FsChipsComponent } from '../../../../src/app/components/chips/chips.component';
import { FormsModule } from '@angular/forms';
import { FsChipComponent } from '../../../../src/app/components/chip/chip.component';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'example-single-selection',
    templateUrl: './example-single-selection.component.html',
    styleUrls: ['./example-single-selection.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsLabelModule,
        FsChipsComponent,
        FormsModule,
        FsChipComponent,
        JsonPipe,
    ],
})
export class ExampleSingleSelectionComponent {

  public chips = [
    { name: 'Tag A', value: 1 },
    { name: 'Tag B', value: 2 },
    { name: 'Tag C', value: 3 },
    { name: 'Tag D', value: 4 },
  ];

  public chip = [];

  public change(event) {
    console.log(event);
  }
}

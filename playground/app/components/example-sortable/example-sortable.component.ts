import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FsChipsComponent } from '../../../../src/app/components/chips/chips.component';
import { FormsModule } from '@angular/forms';
import { FsChipComponent } from '../../../../src/app/components/chip/chip.component';
import { FsChipSuffixDirective } from '../../../../src/app/directives/chip-suffix.directive';
import { FsLabelModule } from '@firestitch/label';
import { JsonPipe } from '@angular/common';


@Component({
    selector: 'example-sortable',
    templateUrl: './example-sortable.component.html',
    styleUrls: ['./example-sortable.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsChipsComponent,
        FormsModule,
        FsChipComponent,
        FsChipSuffixDirective,
        FsLabelModule,
        JsonPipe,
    ],
})
export class ExampleSortableComponent implements OnInit {

  public chips = [];

  public ngOnInit(): void {
    this.chips = [
      { name: 'Tag 1', value: 1 },
      { name: 'Tag 2', value: 2 },
      { name: 'Tag 3', value: 3 },
      { name: 'Tag 4', value: 4 },
    ];
  }

  public remove(event: MouseEvent): void {
    console.log('remove', event);
  }

  public suffixClick({ data, event }): void {
    console.log('suffixClick', data, event);
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';

import { FsLabelModule } from '@firestitch/label';
import { FsMessage } from '@firestitch/message';

import { FsChipSelectComponent } from '../../../../src/app/components/chip-select/chip-select.component';
import { FsChipSelectTriggerDirective } from '../../../../src/app/components/chip-select/chip-select-trigger.directive';
import { FsChipSelectOptionComponent } from '../../../../src/app/components/chip-select/chip-select-option.component';

@Component({
  selector: 'example-chip-select',
  templateUrl: './example-chip-select.component.html',
  styleUrls: ['./example-chip-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsLabelModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    FsChipSelectComponent,
    FsChipSelectTriggerDirective,
    FsChipSelectOptionComponent,
  ],
})
export class ExampleChipSelectComponent {

  public size: 'small' | 'tiny' | 'micro' | 'large' | 'medium' = 'medium';

  public filterOptions = [
    { value: 'source', label: 'Source' },
    { value: 'aircraft_size', label: 'Aircraft size' },
    { value: 'status', label: 'Status' },
    { value: 'posted_to', label: 'Posted to' },
    { value: 'aircraft_fleet', label: 'Aircraft fleet' },
    { value: 'aircraft_model', label: 'Aircraft model' },
  ];

  private _message = inject(FsMessage);

  public onSelect(value: string) {
    const option = this.filterOptions.find(opt => opt.value === value);
    this._message.success(`Selected: ${option?.label || value}`);
  }
}


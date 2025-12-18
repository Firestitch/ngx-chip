import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';

import { FsColorPickerModule } from '@firestitch/colorpicker';
import { FsLabelModule } from '@firestitch/label';
import { FsMessage } from '@firestitch/message';


import { FsChipComponent } from '../../../../src/app/components/chip/chip.component';
import { FsChipPrefixDirective } from '../../../../src/app/directives/chip-prefix.directive';
import { FsChipSubcontentDirective } from '../../../../src/app/directives/chip-subcontent.directive';
import { FsChipSuffixDirective } from '../../../../src/app/directives/chip-suffix.directive';

@Component({
  selector: 'example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsLabelModule,
    MatCheckbox,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FsColorPickerModule,
    MatSelect,
    MatOption,
    NgTemplateOutlet,
    FsChipComponent,
    FsChipPrefixDirective,
    FsChipSuffixDirective,
    FsChipSubcontentDirective,
  ],
})
export class ExampleComponent {

  public image;
  public showImage;
  public showIcon;
  public removable;
  public actionable = false;
  public size: any = 'medium';
  public outlined = false;
  public outlineDash = false;
  public selected = false;
  public showPrefix = false;
  public showSuffix = false;
  public show = true;
  public selectable = false;
  public backgroundColor = '#e7e7e7';
  public borderColor = '';
  public color;
  public icon;
  public config: any = {};
  public mm = [1, 2, 3];
  public actions = [];

  private _cdRef = inject(ChangeDetectorRef); 
  private _message = inject(FsMessage);

  public imageChanged() {
    this.image = this.showImage ? '/assets/headshot2.jpg' : '';
  }

  public refresh() {
    this.show = false;
    this._cdRef.detectChanges();
    setTimeout(() => {
      this.show = true;
      this._cdRef.detectChanges();
    });
  }

  public prefixClick() {
    this._message.success('Prefix clicked');
  } 

  public suffixClick() {
    this._message.success('Suffix clicked');
  }

  public chipSelectedToggled(e) {
    this.selected = e.selected;
    this._message.success(`Chip ${   e.selected ? 'Selected' : 'Unselected'}`);
  }

  public actionsChanged() {
    this.actions = this.actionable ? 
      [
        {
          icon: 'help',
          click: () => {
            this._message.success('Action clicked');
          },
        },
      ]
      : [];
    this._cdRef.markForCheck();
  }

  public removedChanged() {
    if (this.removable) {
      this.selectable = false;
      this.selected = false;
    }
  }

  public selectedChanged() {
    if (this.selected || this.selectable) {
      this.removable = false;
    }
  }

  public chipRemoved() {
    this._message.success('Removed Clicked');
  }

  public chipClicked() {
    this._message.success('Chip clicked');
  }
}

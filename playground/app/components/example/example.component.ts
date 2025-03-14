import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';

import { FsMessage } from '@firestitch/message';

@Component({
  selector: 'example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent {

  public image;
  public showImage;
  public showIcon;
  public removable;
  public actionable = false;
  public size: any = 'large';
  public outlined = false;
  public selected = false;
  public selectable = false;
  public backgroundColor = '';
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

  public chipRemoved(e) {
    this._message.success('Removed Clicked');
  }
}

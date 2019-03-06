import { Component } from '@angular/core';
import { FsMessage } from '@firestitch/message';

@Component({
  selector: 'example',
  templateUrl: 'example.component.html',
  styleUrls: ['example.component.scss']
})
export class ExampleComponent {

  public image;
  public showImage;
  public removable;
  public outlined = false;
  public selected = false;
  public selectable = false;
  public backgroundColor = '';
  public color;
  public config: any = {};

  constructor(private fsMessage: FsMessage) {}

  imageChanged() {
    this.image = this.showImage ? '/assets/headshot2.jpg' : '';
  }

  chipSelectedToggled(e) {
    this.selected = e.selected;
    this.fsMessage.success('Chip ' + ( e.selected ? 'Selected' : 'Unselected'));
  }

  removedChanged() {
    if (this.removable) {
      this.selectable = false;
      this.selected = false;
    }
  }

  selectedChanged() {
    if (this.selected || this.selectable) {
      this.removable = false;
    }
  }

  chipRemoved() {
    this.fsMessage.success('Removed Clicked');
  }
}

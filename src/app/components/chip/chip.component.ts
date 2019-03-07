import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { Subject } from 'rxjs';

@Component({
  selector: 'fs-chip',
  templateUrl: 'chip.component.html',
  styleUrls: ['chip.component.scss']
})
export class FsChipComponent implements OnInit, OnDestroy {

  @Input() public attribute: any;
  @Input() public selectable = false;
  @Input() public selected = false;
  @Input() public removable = false;
  @Input() public image: string;

  @Input() set backgroundColor(value) {
    debugger;
    this._backgroundColor = value;
    this.updateStyles();
  };

  @Input() set borderColor(value) {
    this.styles.borderColor = value;
    this.updateStyles();
  }
  @Input() set color(value) {
    this._color = value;
    this.updateStyles();
  }

  get color() {
    return this._color;
  }

  @Input() set outlined(value) {
    this._outlined = value;
    this.updateStyles();
  };

  get outlined() {
    return this._outlined;
  }

  @Output() public clicked = new EventEmitter();
  @Output() public selectedToggled = new EventEmitter();
  @Output() public removed = new EventEmitter();

  public styles = {
    backgroundColor: '',
    borderColor: '',
    color: ''
  };

  public $destroy = new Subject();

  private _backgroundColor = '';
  private _color = '';
  private _outlined = false;

  constructor() {}

  public ngOnInit() {}

  public ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  public click() {
    this.clicked.emit(this.attribute);

    if (this.selectable) {
      this.selected = !this.selected;
      this.selectedToggled.emit({ attribute: this.attribute, selected: this.selected });
    }
  }

  public remove(event) {
    this.removed.next(event);
  }

  private isContrastYIQBlack(hexcolor) {
    if (!hexcolor) {
      return true;
    }

    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    return yiq >= 200;
  }

  private updateStyles() {
    this.styles.backgroundColor = this._backgroundColor;

    if (this._color) {
      this.styles.color = this._color;
    } else if (!this._outlined) {
      this.styles.color = this.isContrastYIQBlack(this.styles.backgroundColor) ? '#474747' : '#fff';
    }

    if (this._outlined) {
      this.styles.backgroundColor = '';

      if (this._color) {
        this.styles.borderColor = this._color;
      }
    }
  }

}

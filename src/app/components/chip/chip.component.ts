import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
} from '@angular/core';

import { Subject } from 'rxjs';
import { FsChipsService } from '../../services/chips.service';


@Component({
  selector: 'fs-chip',
  templateUrl: 'chip.component.html',
  styleUrls: ['chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsChipComponent implements OnInit, OnDestroy {

  @HostBinding('class.fs-chip') fsChip = true;
  @HostBinding('class.outlined') _outlined = false;
  @HostBinding('class.selectable') _selectable = false;
  @HostBinding('class.imaged') _image = false;
  @HostBinding('class.selected') _selected = false;
  @HostBinding('class.removable') _removable = false;
  @HostBinding('style.backgroundColor') styleBackgroundColor = '';
  @HostBinding('style.color') styleColor = '';
  @HostBinding('style.borderColor') styleBorderColor = '';

  @HostBinding('class.small') classSmall = false;

  @Input('size') set setSize(value) {
    this._size = value;
    this.classSmall = value === 'small';
  };

  @HostListener('click')
  public click() {

    if (this.selectable) {
      this.selected = !this.selected;
      this.selectedToggled.emit({ value: this.value, selected: this.selected });

      if (this._chips) {
        this._chips.selectionChanged(this.selected, this.value);
      }
    }
  }

  @Input() public value = null;

  @Input() set backgroundColor(value) {
    this._backgroundColor = value;
    this.updateStyles();
  };

  @Input() set borderColor(value) {
    this.styleBorderColor = value;
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

  @Input() set removable(value) {
    this._removable = value;
  };

  get removable() {
    return this._removable;
  }

  @Input() set selectable(value) {
    this._selectable = value;
  };

  get selectable() {
    return this._selectable;
  }

  @Input() set selected(value) {
    this._selected = value;
  };

  get selected() {
    return this._selected;
  }

  @Input() set image(value) {
    this._image = value;
  };

  get image() {
    return this._image;
  }

  @Output() public selectedToggled = new EventEmitter();
  @Output() public removed = new EventEmitter();

  public $destroy = new Subject();

  private _backgroundColor = '';
  private _color = '';
  private _size;

  constructor(@Optional() private _chips: FsChipsService) {}

  public ngOnInit() {
    if (this._chips) {
      this._chips.register(this);
    }
  }

  public ngOnDestroy() {
    if (this._chips) {
      this._chips.destroy(this);
    }

    this.$destroy.next();
    this.$destroy.complete();
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
    this.styleBackgroundColor = this._backgroundColor;

    if (this._color) {
      this.styleColor = this._color;
    } else if (!this._outlined) {
      this.styleColor = this.isContrastYIQBlack(this.styleBackgroundColor) ? '#474747' : '#fff';
    }

    if (this._outlined) {
      this.styleBackgroundColor = '';

      if (this._color) {
        this.styleBorderColor = this._color;
      }
    }
  }
}

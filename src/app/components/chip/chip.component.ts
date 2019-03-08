import {
  ChangeDetectionStrategy,
  EventEmitter,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChipsService } from '../../services/chips.service';


@Component({
  selector: 'fs-chip',
  templateUrl: 'chip.component.html',
  styleUrls: ['chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsChipComponent implements OnInit, OnDestroy {

  @Input() public attribute: any;
  @Input() public selected = false;
  @Input() public selectable = false;
  @Input() public value = null;
  @Input() public removable = false;
  @Input() public image: string;

  @Input() set backgroundColor(value) {
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

  constructor(
    private _chipsService: ChipsService,
    private _cd: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    this._chipsService.valuesChange$
      .pipe(
        takeUntil(this.$destroy),
      )
      .subscribe(() => {
        if (this._chipsService.modelValue) {
          const hasValueSelected = this._chipsService.modelValue.indexOf(this.value) !== -1;

          if (hasValueSelected) {
            if (!this.selected) {
              this.selected = true;
            }
          } else {
            if (this.selected) {
              this.selected = false;
            }
          }
        }

        this._cd.markForCheck();
      })
  }

  public ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  public click() {
    this.clicked.emit(this.attribute);

    if (this.selectable) {
      this.selected = !this.selected;
      this.selectedToggled.emit({ attribute: this.attribute, selected: this.selected });

      if (this.selected) {
        this._chipsService.addModelValue(this.value);
      } else {
        this._chipsService.removeModelValue(this.value);
      }
    }
  }

  public remove(event) {
    this._chipsService.removeModelValue(this.value);
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

import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { FsChipSuffixDirective } from '../../directives';


@Component({
  selector: 'fs-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsChipComponent implements OnDestroy, OnChanges {

  @ViewChild(TemplateRef, { static: true }) 
  public templateRef: TemplateRef<void>;

  @ContentChildren(FsChipSuffixDirective) 
  public chipSuffixes: QueryList<FsChipSuffixDirective>;

  @Input() 
  public selectable = false;

  @Input()
  public removable = true;

  @Input() 
  public value: any;

  @Input() 
  public maxWidth: string;

  @Input() 
  public width: string;

  @Input() public backgroundColor;

  @Input() public borderColor;

  @Input() public color;

  @Input() public outlined;

  @Input() 
  public icon: string;
  
  @Input() 
  public image: string;
  
  @Input('selected') 
  public set setSelected(value: boolean) {
    this.classes.selected = value;
    this._selected = value;
  }

  public get selected() {
    return this._selected;
  }

  @Output() public selectedToggled = new EventEmitter();
  @Output() public removed = new EventEmitter();

  public styles: any = {};
  public classes: any = {};
  public hasChips: boolean;

  private _destroy$ = new Subject();
  private _selected = false;

  constructor(
    private _cdRef: ChangeDetectorRef,
  ) {}

  @Input('size') public set setSize(value) {
    this.classes['size-small'] = value === 'small';
    this.classes['size-tiny'] = value === 'tiny';
    this.classes['size-micro'] = value === 'micro';
  }

  public click() {
    if (this.selectable) {
      this.setSelected = !this.selected;
      this.selectedToggled.emit({ value: this.value, selected: this.selected });
    }
  }

  public select() {
    this.setSelected = true;
    this._cdRef.markForCheck();
  }

  public unselect() {
    this.setSelected = false;
    this._cdRef.markForCheck();
  }

  public get destroy$(): Observable<any> {
    return this._destroy$.asObservable();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if(changes.selectable) {
      this.classes.selectable = this.selectable;
    }

    if(changes.removable) {
      this.classes.removable = this.removable;
    }

    if(changes.icon) {
      this.classes.iconed = !!this.icon;
    }

    if(changes.image) {
      this.classes.imaged = !!this.image;
    }

    // this.classes.actionable = this.chipSuffixes.length !== 0 || 
    // (this.removed.observed && this.removable);

    this._updateStyles();
  }

  public actionClick(action, event: MouseEvent) {
    if(action.click) {
      action.click(event);
    }
  }

  public chipSuffixClick(chipSuffix: FsChipSuffixDirective, event: MouseEvent) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    chipSuffix.click.emit({ event, data: chipSuffix.data });
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public remove(event: MouseEvent) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    this.removed.next(event);
  }

  private _isContrastYIQBlack(hexcolor) {
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

  private _updateStyles() {
    this.styles.backgroundColor = this.backgroundColor;
    this.styles.borderColor = this.borderColor;
    this.styles.width = this.width;
    this.classes.outlined = this.outlined;

    if (this.color) {
      this.styles.color = this.color;
    } else if (!this.outlined) {
      this.styles.color = this._isContrastYIQBlack(this.backgroundColor) ? '#474747' : '#fff';
    }

    if (this.outlined) {
      this.styles.backgroundColor = '';

      if (this.color) {
        this.styles.borderColor = this.color;
      }
    }

    this._cdRef.markForCheck();
  }
}

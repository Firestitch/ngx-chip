import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';


import { Observable, Subject } from 'rxjs';

import { FsChipsComponent } from '../chips/chips.component';


@Component({
  selector: 'fs-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsChipComponent implements OnDestroy, OnChanges {

  @ViewChild(TemplateRef, { static: true }) 
  public templateRef: TemplateRef<void>;

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
  public actions: {
    icon: string, 
    click: (event: MouseEvent) => void, 
    type?: 'remove',
    link?: string,
    linkTarget?: string,
  }[] = [];

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

  private _destroy$ = new Subject();
  private _selected = false;


  constructor(
    @Optional() public chips: FsChipsComponent,
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
    this.actions = this.actions
      .filter((action) => action.type !== 'remove');

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

    if(this.removed.observed && this.removable) {
      this.actions.push({
        icon: 'remove_circle_outline',
        click: (event) => this.remove(event),
        type: 'remove',
      });
    }

    this.classes.actionable = this.actions.length !== 0;

    this._updateStyles();
  }

  public actionClick(action, event: MouseEvent) {
    if(action.click) {
      action.click(event);
    }
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

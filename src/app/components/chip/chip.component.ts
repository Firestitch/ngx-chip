import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { Observable, Subject } from 'rxjs';


@Component({
  selector: 'fs-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsChipComponent implements OnInit, OnDestroy {

  @HostBinding('class.fs-chip') 
  public fsChip = true;

  @HostBinding('class.outlined') 
  public _outlined = false;

  @Input()
  @HostBinding('class.selectable') 
  public selectable = false;
  
  @Input()
  @HostBinding('class.removable') 
  public removable = true;
  
  @HostBinding('style.backgroundColor') 
  public styleBackgroundColor = '';

  @HostBinding('style.color') 
  public styleColor = '';

  @HostBinding('style.borderColor') 
  public styleBorderColor = '';

  @HostBinding('class.size-small') 
  public classSmall = false;

  @HostBinding('class.size-tiny') 
  public classTiny = false;

  @HostBinding('class.size-micro') 
  public classMicro = false;

  @Input() public value;
  
  @Input() 
  @HostBinding('class.iconed') 
  public icon;
  
  @Input() 
  @HostBinding('class.imaged') 
  public image;
  
  @Input() 
  @HostBinding('class.selected') 
  public selected = false;

  @Output() public selectedToggled = new EventEmitter();
  @Output() public removed = new EventEmitter();

  private _destroy$ = new Subject();

  private _backgroundColor = '';
  private _color = '';

  constructor(
    private _cdRef: ChangeDetectorRef,
  ) {}

  @Input('size') public set setSize(value) {
    this.classSmall = value === 'small';
    this.classTiny = value === 'tiny';
    this.classMicro = value === 'micro';
  }

  @HostListener('click')
  public click() {
    if (this.selectable) {
      this.selected = !this.selected;
      this.selectedToggled.emit({ value: this.value, selected: this.selected });
    }
  }

  @Input() public set backgroundColor(value) {
    this._backgroundColor = value;
    this._updateStyles();
  }

  @Input() public set borderColor(value) {
    this.styleBorderColor = value;
    this._updateStyles();
  }

  @Input() public set color(value) {
    this._color = value;
    this._updateStyles();
  }

  public get destroy$(): Observable<any> {
    return this._destroy$.asObservable();
  }

  @Input() public set outlined(value) {
    this._outlined = value;
    this._updateStyles();
  }

  public select() {
    this.selected = true;
    this._cdRef.markForCheck();
  }

  public unselect() {
    this.selected = false;
    this._cdRef.markForCheck();
  }

  public ngOnInit() {
    if(this.removed.observers.length === 0) {
      this.removable = false;
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
    this.styleBackgroundColor = this._backgroundColor;

    if (this._color) {
      this.styleColor = this._color;
    } else if (!this._outlined) {
      this.styleColor = this._isContrastYIQBlack(this.styleBackgroundColor) ? '#474747' : '#fff';
    }

    if (this._outlined) {
      this.styleBackgroundColor = '';

      if (this._color) {
        this.styleBorderColor = this._color;
      }
    }

    this._cdRef.markForCheck();
  }
}

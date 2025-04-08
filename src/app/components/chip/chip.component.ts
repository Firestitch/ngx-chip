import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { FsChipSubcontentDirective } from '../../directives/chip-subcontent.directive';
import { FsChipSuffixDirective } from '../../directives/chip-suffix.directive';


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

  @ContentChild(FsChipSubcontentDirective, { read: TemplateRef })
  public chipSubcontentTemplateRef: TemplateRef<void>;

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

  @Input() public backgroundColor = '#e7e7e7';

  @Input() public borderColor;

  @Input() public color;

  @Input() public shape: 'round' | 'square' = 'round';

  @Input() public outlined;

  @Input() 
  public icon: string;
  
  @Input() 
  public image: string;
  
  @Input() public selected: boolean;

  @Input() public size: 'small' | 'tiny' | 'micro' | 'large' = 'large';

  @Output() public selectedToggled = new EventEmitter();
  @Output() public removed = new EventEmitter();

  public styles: any = {};
  public hasChips: boolean;

  private _destroy$ = new Subject();

  constructor(
    private _cdRef: ChangeDetectorRef,
  ) {}

  public click() {
    if (this.selectable) {
      this.selected = !this.selected;
      this.selectedToggled.emit({ value: this.value, selected: this.selected });
    }
  }

  public select() {
    this.selected = true;
    this._cdRef.markForCheck();
  }

  public unselect() {
    this.selected = false;
    this._cdRef.markForCheck();
  }

  public get destroy$(): Observable<any> {
    return this._destroy$.asObservable();
  }

  public ngOnChanges() {
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
    this.styles.backgroundColor = this.outlined ? 'transparent' : this.backgroundColor;
    this.styles.borderColor = this.borderColor;
    this.styles.width = this.width;

    if (this.color) {
      this.styles.color = this.color;
    } else if (!this.outlined) {
      this.styles.color = this._isContrastYIQBlack(this.backgroundColor) ? '#474747' : '#fff';
    }

    if (this.outlined) {
      if (this.color) {
        this.styles.borderColor = this.color;
      }
    }

    this._cdRef.markForCheck();
  }
}

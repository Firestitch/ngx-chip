import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, EventEmitter, Input, OnChanges, OnDestroy, Output, QueryList, SimpleChanges, TemplateRef, ViewChild, inject } from '@angular/core';

import { MatIcon } from '@angular/material/icon';

import { Observable, Subject } from 'rxjs';

import { FsChipPrefixDirective } from '../../directives/chip-prefix.directive';
import { FsChipSubcontentDirective } from '../../directives/chip-subcontent.directive';
import { FsChipSuffixDirective } from '../../directives/chip-suffix.directive';
import { FsChipPrefixComponent } from '../chip-prefix/chip-prefix.component';
import { FsChipSuffixComponent } from '../chip-suffix/chip-suffix.component';


@Component({
  selector: 'fs-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsChipPrefixComponent,
    NgTemplateOutlet,
    MatIcon,
    NgStyle,
    FsChipSuffixComponent,
    NgClass,
  ],
})
export class FsChipComponent implements OnDestroy, OnChanges {

  @ViewChild(TemplateRef, { static: true }) 
  public templateRef: TemplateRef<void>;

  @ContentChildren(FsChipSuffixDirective) 
  public chipSuffixes: QueryList<FsChipSuffixDirective>;

  @ContentChildren(FsChipPrefixDirective)
  public chipPrefixes: QueryList<FsChipPrefixDirective>;

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

  @Input() public backgroundColor;

  @Input() public borderColor;

  @Input() public color;

  @Input() public shape: 'round' | 'square' = 'round';

  @Input() public outlined;

  @Input() public icon: string;
  
  @Input() public image: string;
  
  @Input() public selected: boolean;
  
  @Input() public padding: string;

  @Input() public contrastColor: string;

  @Input() public size: 'small' | 'tiny' | 'micro' | 'large' = 'large';

  @Output() public selectedToggled = new EventEmitter();
  @Output() public removed = new EventEmitter();
  @Output() public click = new EventEmitter();

  public hasChips: boolean;
  public defaultColor = '#474747';
  public defaultBackgroundColor = '#e7e7e7';

  private _destroy$ = new Subject();  
  private _cdRef = inject(ChangeDetectorRef);

  public clicked() {
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

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.backgroundColor) {
      this.contrastColor = this.defaultColor;

      if(this.backgroundColor && this.backgroundColor !== 'transparent') {
        this.contrastColor = this._isContrastYIQBlack(this.backgroundColor) ?
          this.defaultColor : '#fff';
      }
    }
  }

  public actionClick(action, event: MouseEvent) {
    if(action.click) {
      action.click(event);
    }
  }

  public chipSuffixClick(chipSuffix: FsChipSuffixDirective, event: MouseEvent, value: any) {
    if(chipSuffix.click.observed) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      chipSuffix.click.emit({ event, data: value ?? chipSuffix.data });
    }
  }

  public chipPrefixClick(chipPrefix: FsChipPrefixDirective, event: MouseEvent, value: any) {
    if(chipPrefix.click.observed) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      chipPrefix.click.emit({ event, data: value ?? chipPrefix.data });
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
}

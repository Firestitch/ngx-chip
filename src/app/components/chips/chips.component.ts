import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  IterableDiffer,
  IterableDiffers,
  OnDestroy,
  QueryList,
  ViewChild,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { FsChipComponent } from '../chip/chip.component';


@Component({
  selector: 'fs-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsChipsComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CdkDropList,
    NgClass,
    CdkDrag,
    CdkDragHandle,
    MatIcon,
    NgTemplateOutlet,
  ],
})
export class FsChipsComponent implements OnDestroy, ControlValueAccessor, AfterContentInit {

  @ViewChild(CdkDropList, { static: true })
  public dropList: CdkDropList;

  @ContentChildren(FsChipComponent)
  public chips: QueryList<FsChipComponent>;

  @Input() public compare: (item: any, value: any) => boolean;

  @Input() public multiple = true;

  @Input() public sortable = false;

  @Input() public selectable = false;

  @Input() public orientation: 'horizontal' | 'vertical' = 'horizontal';

  @Input() public width;

  public onChange: (value) => void;
  public onTouch: (value) => void;

  private _value = [];
  private _destroy$ = new Subject();
  private _chipDiffer: IterableDiffer<FsChipComponent>;
  private _cdRef = inject(ChangeDetectorRef);
  private _iterable = inject(IterableDiffers);

  constructor() {
    this._chipDiffer = this._iterable.find([]).create();
  }

  public drop(event: CdkDragDrop<string[]>) {
    const chipArray = this.chips.toArray();
    moveItemInArray(chipArray, event.previousIndex, event.currentIndex);
    this.chips.reset(chipArray);

    this._value = this.chips
      .map((chip) => {
        return this._value.find((item) => this._compareFn(item, chip.value));
      })
      .filter((item) => !!item);

    this.change();
  }

  public change() {
    this.onChange([...this._value]);
  }

  public ngAfterContentInit(): void {
    this._subscribeToSelectionChange();
    this._subscribeChanges();
  }

  public sortPredicate = (index: number) => {
    return !this._value || index <= this._value.length - 1;
  };
 
  public set value(value) {
    if (this._value !== value) {
      this._value = value;

      this.change();
      this.onTouch(this._value);
    }
  }

  public get value() {
    return this._value;
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public select(chip: FsChipComponent) {
    this._value = [
      ...this._value, 
      chip.value,
    ];
    
    chip.select();
    this.change();
  }
  
  public unselect(chip: FsChipComponent) {
    chip.unselect();
    this._value = this._value
      .filter((item) => !this._compareFn(item, chip.value));

    this.change();
  }

  public writeValue(value: any) {
    this._value = [...(value || [])];
    this._updateChips();
  }

  public registerOnChange(fn) {
    this.onChange = fn;
  }

  public registerOnTouched(fn) {
    this.onTouch = fn;
  }

  public get orientationVertical(): boolean {
    return this.orientation === 'vertical' || this.sortable;
  }

  private _subscribeToSelectionChange() {
    const changed = this._chipDiffer.diff(this.chips);
    changed?.forEachAddedItem((change) => {
      change.item.hasChips = true;
      change.item.selectedToggled
        .pipe(
          takeUntil(change.item.destroy$),
          takeUntil(this._destroy$),
        )
        .subscribe(({ selected, value }) => {
          if(this.multiple) {
            if (selected) {
              this.value.push(value);
            } else {
              const valueIndex = this.value.findIndex((item) => {
                return this._compareFn(item, value);
              });

              if (valueIndex > -1) {
                this.value.splice(valueIndex, 1);
              }
            }
          }

          this.change();
          this.onTouch(this._value);
        });
    });
  }

  /**
   * Update selection if item was added or removed
   */
  private _subscribeChanges() {
    this.chips.changes
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._subscribeToSelectionChange();
        this._cdRef.markForCheck();
        this._updateChips();
      });

    this._cdRef.markForCheck();
  }

  private _compareFn(item, chipValue) {
    if (this.compare) {
      return this.compare(item, chipValue);
    }

    return item === chipValue;
  }

  private _updateChips() {
    if (this.multiple && this.chips) {
      if(this.orientationVertical) {
        const chips = this.chips.toArray()
          .sort((c1, c2) => {
            const aIndex = this._value.findIndex((item) => this._compareFn(item, c1.value));
            const bIndex = this._value.findIndex((item) => this._compareFn(item, c2.value));
          
            // If both are in _value, sort by their position in _value
            if (aIndex !== -1 && bIndex !== -1) {
              return aIndex - bIndex;
            }
          
            // If only one is in _value, it comes first
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
          
            // If neither is in _value, maintain original order
            return 0;
          });

        this.chips.reset(chips);
      }

      this.chips.forEach((chip) => {
        const selected = this.value
          .some((item) => {
            return this._compareFn(item, chip.value);
          });

        if(selected) {
          chip.select();
        } else {
          chip.unselect();
        }
      });
    }
  }
}

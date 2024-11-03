import {
  AfterContentInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChildren,
  forwardRef,
  Input,
  IterableDiffer,
  IterableDiffers,
  OnDestroy,
  QueryList,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { FsChipComponent } from '../chip';


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
})
export class FsChipsComponent implements OnDestroy, ControlValueAccessor, AfterContentInit {

  @ViewChild(CdkDropList, { static: true })
  public dropList: CdkDropList;

  @ContentChildren(FsChipComponent)
  public chips: QueryList<FsChipComponent>;

  @Input() public compare;

  @Input() public multiple = true;

  @Input() public sortable = false;

  public onChange: (value) => void;
  public onTouch: (value) => void;

  private _value = [];
  private _selectable = false;
  private _destroy$ = new Subject();
  private _chipDiffer: IterableDiffer<FsChipComponent>;

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _iterable: IterableDiffers,
  ) {
    this._chipDiffer = this._iterable.find([]).create();
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this._value, event.previousIndex, event.currentIndex);
    this.onChange(this._value);
  }

  public ngAfterContentInit(): void {
    this._subscribeToSelectionChange();
    this._subscribeChanges();
  }
 
  public set value(value) {
    if (this._value !== value) {
      this._value = value;

      this.onChange(this._value);
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

  public writeValue(value: any) {
    if (value !== this.value) {
      this._value = value;
    }

    this._updateChips();
  }

  public registerOnChange(fn) {
    this.onChange = fn;
  }
  public registerOnTouched(fn) {
    this.onTouch = fn;
  }

  private _subscribeToSelectionChange() {
    const changed = this._chipDiffer.diff(this.chips);
    changed?.forEachAddedItem((change) => {
      this._selectable = this.chips.some((chip) => chip.selectable);
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
          } else {
            this.chips
              .forEach((chip) => {
                if(!this._compareFn(chip.value, value)) {
                  chip.unselect();
                }
              });

            this.value = selected ? value : null;
          }

          this.onChange(this._value);
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

  private _compareFn(o1, o2) {
    if (this.compare) {
      return this.compare(o1, o2);
    }

    return o1 === o2;
  }

  private _updateChips() {
    if (this.multiple && this._selectable) {
      if (Array.isArray(this.value)) {
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
}

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

  @Input() public width;

  public onChange: (value) => void;
  public onTouch: (value) => void;

  private _value = [];
  private _destroy$ = new Subject();
  private _chipDiffer: IterableDiffer<FsChipComponent>;

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _iterable: IterableDiffers,
  ) {
    this._chipDiffer = this._iterable.find([]).create();
  }

  public drop(event: CdkDragDrop<string[]>) {
    const chipArray = this.chips.toArray();
    moveItemInArray(chipArray, event.previousIndex, event.currentIndex);
    this.chips.reset(chipArray);

    this._value = chipArray
      .filter((chip) => this.selectable ? chip.selected : true)
      .map((chip) => chip.value);

    this.onChange(this._value);
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

  public select(chip: FsChipComponent) {
    this._value = [
      ...this._value, 
      chip.value,
    ];
    
    chip.select();
    this.onChange(this._value);
  }
  
  public unselect(chip: FsChipComponent) {
    chip.unselect();
    this._value = this._value
      .filter((item) => !this._compareFn(item, chip.value));

    this.onChange(this._value);
  }
  
  public updateChipOrder() {
    const chipArray = this.chips.toArray()
      .sort((a, b) => {
        const aSelected = this._value.find((item) => this._compareFn(item, a.value));
        const bSelected = this._value.find((item) => this._compareFn(item, b.value));
      
        if (aSelected === bSelected) return 0;

        return aSelected ? -1 : 1;
      });

    this.chips.reset(chipArray);
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
          // } else {
          //   this.chips
          //     .forEach((chip) => {
          //       if(!this._compareFn(chip.value, value)) {
          //         chip.unselect();
          //       }
          //     });

          //   this.value = selected ? value : null;
          // }

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

  private _compareFn(item, chipValue) {
    if (this.compare) {
      return this.compare(item, chipValue);
    }

    return item === chipValue;
  }

  private _updateChips() {
    if (this.multiple) {
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

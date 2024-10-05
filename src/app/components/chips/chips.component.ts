import {
  AfterContentInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChildren,
  forwardRef,
  HostBinding,
  Input,
  IterableDiffer,
  IterableDiffers,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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

  @HostBinding('class.fs-chips') 
  public classFsChips = true;

  @HostBinding('class.has-chips') 
  public classHasChips = false;

  @ContentChildren(FsChipComponent)
  public chips: QueryList<FsChipComponent>;

  @Input() public compare;

  @Input() public multiple = true;

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
  
  public setDisabledState?(isDisabled: boolean): void {
    //
  }

  public ngAfterContentInit(): void {
    this._subscribeToSelectionChanges();
    this._subscribeToItemsChange();
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
      change.item.selectedToggled
        .pipe(
          takeUntil(change.item.destroy$),
          takeUntil(this._destroy$),
        )
        .subscribe(({ selected, value }) => {
          if (!selected) {
            const valueIndex = this.value.findIndex((item) => {
              return this._compareFn(item, value);
            });

            if (valueIndex > -1) {
              this.value.splice(valueIndex, 1);

              this.onChange(this._value);
              this.onTouch(this._value);
            }
          } else {
            this.value.push(value);

            this.onChange(this._value);
            this.onTouch(this._value);
          }
        });
    });
  }

  /**
   * Update ngModel value when selection changed
   */
  private _subscribeToSelectionChanges() {
    this._subscribeToSelectionChange();
    this.chips.changes
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._subscribeToSelectionChange();
      });
  }

  /**
   * Update selection if item was added or removed
   */
  private _subscribeToItemsChange() {
    this.chips.changes
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.classHasChips = this.chips.length !== 0;
        this._cdRef.markForCheck();
        this._updateChips();
      });

    this.classHasChips = this.chips.length !== 0;
    this._cdRef.markForCheck();
  }

  private _compareFn(o1, o2) {
    if (this.compare) {
      return this.compare(o1, o2);
    }

    return o1 === o2;
  }

  private _updateChips() {
    if (this.multiple && Array.isArray(this.value) && this.chips) {
      this.chips.forEach((chip) => {
        const selected = this.value
          .some((o) => {
            return this._compareFn(o, chip.value);
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

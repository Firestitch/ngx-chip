import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  forwardRef,
  HostBinding,
  Input,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { find } from 'lodash-es';

import { FsChipsService } from '../../services/chips.service';


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
    FsChipsService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsChipsComponent implements OnDestroy, ControlValueAccessor {

  @HostBinding('class.fs-chips') public classFsChips = true;
  @HostBinding('class.has-chips') public classHasChips = false;

  @Input() public compare;

  @Input() public multiple = true;

  public onChange: (value) => void;
  public onTouch: (value) => void;

  private _value = [];
  private _destroy$ = new Subject();

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _chipsService: FsChipsService,
  ) {
    this._subscribeToItemsChange();
    this._subscribeToSelectionChange();
  }

  public get chips() {
    return this._chipsService.chips;
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
    this._destroy$.next();
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

  /**
   * Update ngModel value when selection changed
   */
  private _subscribeToSelectionChange() {
    this._chipsService.selectionChanged$
      .pipe(
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
  }

  /**
   * Update selection if item was added or removed
   */
  private _subscribeToItemsChange() {
    this._chipsService.chipItemsChanged$
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.classHasChips = !!this._chipsService.chips.length;
        this._updateChips();
      });
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

        chip.selected = find(this.value, (o) => {
          return this._compareFn(o, chip.value);
        }) !== undefined;
      });
    }

    this._cdRef.markForCheck();
  }
}

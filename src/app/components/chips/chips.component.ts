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
  templateUrl: 'chips.component.html',
  styleUrls: ['chips.component.scss'],
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

  @HostBinding('class.fs-chips') classFsChips = true;
  @HostBinding('class.has-chips') classHasChips = false;

  @Input()
  public compare;

  @Input() multiple = true;

  public onChange: any = () => {};
  public onTouch: any = () => {};

  private _value = [];
  private _destroy$ = new Subject();

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _chipsService: FsChipsService,
  ) {
    this.subscribeToItemsChange();
    this.subscribeToSelectionChange();
  }

  get chips() {
    return this._chipsService.chips;
  }

  set value(value) {
    if (this._value !== value) {
      this._value = value;

      this.onChange(this._value);
      this.onTouch(this._value);
    }
  }

  get value() {
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

    this.updateChips();
  }

  public registerOnChange(fn) { this.onChange = fn;  }
  public registerOnTouched(fn) { this.onTouch = fn; }

  /**
   * Update ngModel value when selection changed
   */
  private subscribeToSelectionChange() {
    this._chipsService.selectionChanged$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(({ selected, value }) => {
        if (!selected) {
          const valueIndex = this.value.findIndex((item) => {
            return this.compareFn(item, value);
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
  private subscribeToItemsChange() {
    this._chipsService.chipItemsChanged$
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.classHasChips = !!this._chipsService.chips.length;
        this.updateChips();
      })
  }

  private compareFn(o1, o2) {
    if (this.compare) {
      return this.compare(o1, o2);
    }
    return o1 === o2;
  }

  private updateChips() {
    if (this.multiple && Array.isArray(this.value) && this.chips) {
      this.chips.forEach((chip) => {

        chip.selected = find(this.value, (o) => {
          return this.compareFn(o, chip.value);
        }) !== undefined;
      });
    }

    this._cdRef.markForCheck();
  }
}

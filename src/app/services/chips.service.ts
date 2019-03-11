import { Injectable, OnDestroy, QueryList } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FsChipComponent } from '../components/chip/chip.component';


@Injectable()
export class ChipsService implements OnDestroy {

  // ngModel value
  public modelValue = [];
  // array of selected values
  public selectedValues = [];
  public compareFn = this._compareFn;

  public multiple = true;
  public chips: QueryList<FsChipComponent> = undefined;

  private _valuesChange$ = new Subject<any>();
  private _destroy$ = new Subject();

  get valuesChange$(): Observable<any> {
    return this._valuesChange$.pipe(
      takeUntil(this._destroy$)
    );
  }

  /**
   * Send event for all chips to refresh their selected status
   */
  public updateSelected() {
    this.selectedValues = [];

    if (Array.isArray(this.modelValue) && this.chips) {
      this._updateSelectedValues();
    }

    this._valuesChange$.next(this.selectedValues);
  }

  public addModelValue(value) {
    if (Array.isArray(this.modelValue)) {
      if (!this.multiple) {
        this.modelValue.length = 0;
      }
      this.modelValue.push(value);
      this._updateSelectedValues();
    }
  }

  public removeModelValue(value) {
    if (Array.isArray(this.modelValue)) {
      const valueIndex = this.modelValue.findIndex((modelItem) => {
        return this.compareFn(modelItem, value);
      });

      if (valueIndex > -1) {
        this.modelValue.splice(valueIndex, 1);
        this._updateSelectedValues();
      }
    }
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _compareFn(modelValue, chipValue) {
    return modelValue.value === chipValue.value;
  }

  private _updateSelectedValues() {
    this.modelValue.forEach((modelItem) => {
      const selectedChip = this.chips.find((chip) => {
        return this.compareFn(modelItem, chip.value);
      });

      if (selectedChip) {
        this.selectedValues.push(selectedChip.value);
      }
    });
  }
}

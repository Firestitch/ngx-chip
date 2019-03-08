import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Injectable()
export class ChipsService implements OnDestroy {
  public modelValue = [];
  public multiple = true;
  private _valuesChange$ = new Subject<any>();
  private _destroy$ = new Subject();

  get valuesChange$(): Observable<any> {
    return this._valuesChange$.pipe(
      takeUntil(this._destroy$)
    );
  }

  public updateSelected() {
    this._valuesChange$.next(this.modelValue);
  }

  public addModelValue(value) {
    if (Array.isArray(this.modelValue)) {
      if (this.multiple) {
        this.modelValue.push(value)
      } else {
        this.modelValue.length = 0;
        this.modelValue.push(value);
      }
    }
  }

  public removeModelValue(value) {
    if (Array.isArray(this.modelValue)) {
      const valueIndex = this.modelValue.indexOf(value);

      if (valueIndex > -1) {
        this.modelValue.splice(valueIndex, 1);
      }
    }
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}

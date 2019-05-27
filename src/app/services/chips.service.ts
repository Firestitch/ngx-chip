import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';


@Injectable()
export class FsChipsService implements OnDestroy {

  public chips = [];

  private _chipItemsChanged$ = new Subject();
  private _selectionChanged$ = new Subject();
  private _destroy$ = new Subject<void>();

  constructor() {}

  get selectionChanged$() {
    return this._selectionChanged$.
      pipe(
        takeUntil(this._destroy$),
    );
  }

  get chipItemsChanged$() {
    return this._chipItemsChanged$
      .pipe(
        takeUntil(this._destroy$),
        debounceTime(50),
      )
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public selectionChanged(selected: boolean, value: any) {
    this._selectionChanged$.next({
      selected: selected,
      value: value,
    })
  }

  public register(chip) {
    this.chips.push(chip);
    this._chipItemsChanged$.next();
  }

  public destroy(chip) {
    const index = this.chips.indexOf(chip);

    if (index > -1) {
      this.chips.splice(index, 1);
      this._chipItemsChanged$.next();
    }
  }
}

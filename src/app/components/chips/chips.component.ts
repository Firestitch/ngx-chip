import {
  Component,
  ContentChildren,
  DoCheck,
  forwardRef,
  Input,
  IterableDiffers,
  OnInit,
  TrackByFunction,
  QueryList,
  AfterViewInit,
  OnDestroy,
  HostBinding,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FsChipComponent } from '../chip/chip.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { find, filter } from 'lodash-es';

@Component({
  selector: 'fs-chips',
  templateUrl: 'chips.component.html',
  styleUrls: ['chips.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FsChipsComponent),
    multi: true
  }]
})
export class FsChipsComponent implements ControlValueAccessor, OnInit, OnDestroy, AfterViewInit {

  @HostBinding('class.fs-chips') fsChipsClass = true;

  @ContentChildren(FsChipComponent, { descendants: true }) chips: QueryList<FsChipComponent>;

  @Input() trackBy: TrackByFunction<any>;
  @Input() ngModel = [];
  @Input() compare;
  @Input() multiple = true;

  public onChange: any = () => {};
  public onTouched: any = () => {};

  private $destroy = new Subject();
  private _differ: any;

  constructor(
    private _differs: IterableDiffers
  ) {}

  ngAfterViewInit() {

    let changeDiff = this._differ.diff(this.chips);
    if (changeDiff) {
      changeDiff.forEachAddedItem(change => {
        this.addChip(change.item);
      });
    }

    this.chips.changes
      .pipe(
        takeUntil(this.$destroy),
      )
      .subscribe(chips => {

        changeDiff = this._differ.diff(chips);
        if (changeDiff) {
          changeDiff.forEachAddedItem((change) => {
            this.addChip(change.item);
          });

          changeDiff.forEachRemovedItem((change) => {
            this.updateChips();
          });
        }
      });
  }

  public ngOnInit() {
    this._differ = this._differs.find([]).create(this.trackBy || null);
  }

  public ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  public writeValue(value: any) {
    this.updateChips();
  }

  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  private compareFn(o1, o2) {
    if (this.compare) {
      return this.compare(o1, o2);
    }
    return o1 === o2;
  }

  private updateChips() {
    if (this.multiple && Array.isArray(this.ngModel) && this.chips) {
      this.chips.forEach((chip) => {

        chip.selected = find(this.ngModel, (o) => {
          return this.compareFn(o, chip.value);
        }) !== undefined;
      });
    }
  }

  private addChip(component: FsChipComponent) {
    component.selectedToggled
    .pipe(
      takeUntil(this.$destroy)
    )
    .subscribe((e) => {

      if (this.multiple) {

        if (!Array.isArray(this.ngModel)) {
          this.ngModel = [];
        }

        const valueIndex = this.ngModel.findIndex((modelItem) => {
          return this.compareFn(modelItem, component.value);
        });

        if (valueIndex > -1) {
          this.ngModel.splice(valueIndex, 1);
        } else {
          this.ngModel.push(component.value);
        }

      } else {

        this.chips.forEach((chip) => {
          if (component !== chip) {
            chip.selected = false;
          };
        });

        this.ngModel = component.value;
      }

      this.onChange(this.ngModel);
      this.onTouched(this.ngModel);
    });
  }
}

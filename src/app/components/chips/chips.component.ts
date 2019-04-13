import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  DoCheck,
  forwardRef,
  Input,
  IterableDiffer,
  IterableDiffers,
  OnInit,
  Provider,
  TrackByFunction,
  QueryList,
  AfterViewInit,
  OnDestroy,
  HostBinding,
  ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ChipsService } from '../../services/chips.service';
import { FsChipComponent } from '../chip/chip.component';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';


export const CHIP_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FsChipsComponent),
  multi: true
};


@Component({
  selector: 'fs-chips',
  templateUrl: 'chips.component.html',
  styleUrls: ['chips.component.scss'],
  providers: [ ChipsService, CHIP_VALUE_ACCESSOR ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FsChipsComponent implements ControlValueAccessor, OnInit, OnDestroy, AfterViewInit {

  @HostBinding('class.fs-chips') fsChipsClass = true;

  @Input() public trackBy: TrackByFunction<any>;
  @Input() set multiple(value) {
    this._chipsService.multiple = value;
  }

  @Input() set compare(value) {
    this._chipsService.compareFn = value;
  }

  @ContentChildren(FsChipComponent, { descendants: true }) chips: QueryList<FsChipComponent>;
  // set chips(value: QueryList<FsChipComponent>) {

  //   debugger;
  //   value.forEach(component => {
  //     component.selectedToggled
  //     .pipe(
  //       takeUntil(this.$destroy)
  //     )
  //     .subscribe((e) => {
  //       debugger;
  //     });

  //     //attatchChips(this._chipsService);
  //   });
  //   this._chipsService.chips = value;
  // };

  public onChange: any = () => {};
  public onTouched: any = () => {};

  private $destroy = new Subject();
  private _differ: any;

  constructor(
    private _chipsService: ChipsService,
    private _differs: IterableDiffers,
    private cd: ChangeDetectorRef
  ) {}

  public ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

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
            // TODO destroy
          });
        }
      });
  }

  private addChip(component: FsChipComponent) {
    component.selectedToggled
    .pipe(
      takeUntil(this.$destroy)
    )
    .subscribe(() => {
      this.onChange(this._chipsService.modelValue);
    });
  }

  public ngOnInit() {
    this._differ = this._differs.find([]).create(this.trackBy || null);

    // this._chipsService.valuesChange$
    // .pipe(
    //   takeUntil(this.$destroy)
    // )
    // .subscribe(() => {
    //   this.onChange(this._chipsService.modelValue);
    // });
  }

  /*
  this is calling every tick BAD!
  */
  // public ngDoCheck() {
  //   if (this._differ) {
  //     const changes = this._differ.diff(this._chipsService.modelValue);

  //     if (changes) {
  //       this._chipsService.updateSelected();
  //     }
  //   }
  // }

  public writeValue(value: any) {
    console.log(value);
    this._chipsService.modelValue = value;
  }

  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}

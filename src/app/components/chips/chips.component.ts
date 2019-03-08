import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  forwardRef,
  Input,
  IterableDiffer,
  IterableDiffers,
  OnInit,
  Provider,
  TrackByFunction,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ChipsService } from '../../services/chips.service';


export const CHIP_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FsChipsComponent),
  multi: true
};


@Component({
  selector: 'fs-chips',
  templateUrl: 'chips.component.html',
  providers: [ ChipsService, CHIP_VALUE_ACCESSOR ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FsChipsComponent implements ControlValueAccessor, OnInit, DoCheck {

  @Input() public trackBy: TrackByFunction<any>;
  @Input() set multiple(value) {
    this._chipsService.multiple = value;
  }

  public onChange: any = () => {};
  public onTouched: any = () => {};

  private _differ: IterableDiffer<any>;

  constructor(
    private _chipsService: ChipsService,
    private _differs: IterableDiffers
  ) {}

  public ngOnInit() {
    this._differ = this._differs.find([]).create(this.trackBy || null);
  }

  public ngDoCheck() {
    if (this._differ) {
      const changes = this._differ.diff(this._chipsService.modelValue);

      if (changes) {
        this._chipsService.updateSelected();
      }
    }
  }

  public writeValue(value: any) {
    this._chipsService.modelValue = value;
  }

  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

}

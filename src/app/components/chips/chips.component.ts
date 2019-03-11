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
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ChipsService } from '../../services/chips.service';
import { FsChipComponent } from '../chip/chip.component';
import { Subject } from 'rxjs';


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
export class FsChipsComponent implements ControlValueAccessor, OnInit, DoCheck, OnDestroy {

  @Input() public trackBy: TrackByFunction<any>;
  @Input() set multiple(value) {
    this._chipsService.multiple = value;
  }

  @Input() set compare(value) {
    this._chipsService.compareFn = value;
  }

  @ContentChildren(FsChipComponent, { descendants: true })
  set chips(value: QueryList<FsChipComponent>) {
    value.forEach(component => {
      component.attatchChips(this._chipsService);
    });
    this._chipsService.chips = value;

    // HACK: To avoid pressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this._chipsService.updateSelected();
    });
  };

  public onChange: any = () => {};
  public onTouched: any = () => {};

  private $destroy = new Subject();
  private _differ: IterableDiffer<any>;

  constructor(
    private _chipsService: ChipsService,
    private _differs: IterableDiffers
  ) {}

  public ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

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
    this.onChange(value);
  }

  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}

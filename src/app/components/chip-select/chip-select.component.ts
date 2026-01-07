import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  inject,
} from '@angular/core';

import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedPosition,
} from '@angular/cdk/overlay';
import { MatIcon } from '@angular/material/icon';

import { Subject, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsChipComponent } from '../chip/chip.component';

import { FsChipSelectOptionComponent } from './chip-select-option.component';
import { FsChipSelectTriggerDirective } from './chip-select-trigger.directive';


@Component({
  selector: 'fs-chip-select',
  templateUrl: './chip-select.component.html',
  styleUrls: ['./chip-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    FsChipComponent,
    MatIcon,
    NgTemplateOutlet,
  ],
})
export class FsChipSelectComponent implements OnDestroy, AfterContentInit {

  @ViewChild('chip', { static: true })
  public chip: FsChipComponent;

  @ViewChild('overlayOrigin', { static: true })
  public overlayOrigin: CdkOverlayOrigin;

  @ContentChild(FsChipSelectTriggerDirective)
  public trigger: FsChipSelectTriggerDirective;

  @ContentChildren(FsChipSelectOptionComponent)
  public options: QueryList<FsChipSelectOptionComponent>;

  @Input() public size: 'small' | 'tiny' | 'micro' | 'large' | 'medium' = 'medium';
  @Input() public backgroundColor: string;
  @Input() public borderColor: string;
  @Input() public color: string;
  @Input() public shape: 'round' | 'square' = 'round';
  @Input() public outlined: boolean;
  @Input() public outlineDash: boolean;

  @Output() public select = new EventEmitter<any>();

  public isOpen = false;

  public positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 2,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -2,
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 2,
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -2,
    },
  ];

  private _destroy$ = new Subject<void>();
  private _cdRef = inject(ChangeDetectorRef);

  public ngAfterContentInit() {
    this._subscribeToOptions();
    this.options.changes
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this._subscribeToOptions());
  }

  public toggleDropdown() {
    this.isOpen = !this.isOpen;
    this._cdRef.markForCheck();
  }

  public closeDropdown() {
    this.isOpen = false;
    this._cdRef.markForCheck();
  }

  public onOptionSelect(value: any) {
    this.select.emit(value);
    this.closeDropdown();
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _subscribeToOptions() {
    if (this.options.length === 0) {
      return;
    }

    merge(...this.options.map((opt) => opt.select))
      .pipe(takeUntil(this._destroy$))
      .subscribe((value) => this.onOptionSelect(value));
  }
}


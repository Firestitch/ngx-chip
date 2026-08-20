import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, Output, QueryList, SimpleChanges, TemplateRef, ViewChild, inject } from '@angular/core';

import { MatIcon } from '@angular/material/icon';

import { Observable, Subject, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsChipPrefixDirective } from '../../directives/chip-prefix.directive';
import { FsChipSubcontentDirective } from '../../directives/chip-subcontent.directive';
import { FsChipSuffixDirective } from '../../directives/chip-suffix.directive';
import { FsChipPrefixComponent } from '../chip-prefix/chip-prefix.component';
import { FsChipSuffixComponent } from '../chip-suffix/chip-suffix.component';


@Component({
  selector: 'fs-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsChipPrefixComponent,
    NgTemplateOutlet,
    MatIcon,
    NgStyle,
    FsChipSuffixComponent,
    NgClass,
  ],
})
export class FsChipComponent
implements AfterContentInit, OnDestroy, OnChanges {

  @ViewChild(TemplateRef, { static: true }) 
  public templateRef: TemplateRef<void>;

  // Initialized so the template can read `.length` and iterate before the first
  // content query refresh. The chip renders its own `<ng-template>`, and change
  // detection can reach that view before the declaring view has assigned these
  // queries — Angular skips `refreshContentQueries` when it traverses a view in
  // targeted mode. Angular replaces both instances on the first refresh.
  @ContentChildren(FsChipSuffixDirective)
  public chipSuffixes: QueryList<FsChipSuffixDirective> = new QueryList();

  @ContentChildren(FsChipPrefixDirective)
  public chipPrefixes: QueryList<FsChipPrefixDirective> = new QueryList();

  @ContentChild(FsChipSubcontentDirective, { read: TemplateRef })
  public chipSubcontentTemplateRef: TemplateRef<void>;

  @Input() 
  public selectable = false;

  @Input()
  public removable = true;

  @Input() 
  public value: any;

  @Input() 
  public maxWidth: string;

  @Input() 
  public width: string;

  @Input() public backgroundColor;

  @Input() public borderColor;

  @Input() public color;

  /**
   * "none" keeps every chip behaviour — removing, prefixes, suffixes, image,
   * subcontent — but drops the chip's own decoration, so the content reads as
   * plain inline text. `outlined` stays independent of this.
   */
  @Input() public shape: 'round' | 'square' | 'none' = 'round';

  @Input() public outlined: boolean;

  @Input() public outlineDash: boolean;

  @Input() public icon: string;
  
  @Input() public image: string;
  
  @Input() public selected: boolean;

  @HostBinding('class.disabled')
  @Input() public disabled: boolean;

  @Input() public padding: string;

  @Input() public contrastColor: string;

  @Input() public size: 'small' | 'tiny' | 'micro' | 'large' | 'medium' = 'medium';

  @Output() public selectedToggled = new EventEmitter();
  @Output() public removed = new EventEmitter();
  @Output() public click = new EventEmitter();

  public hasChips: boolean;
  public defaultColor = '#474747';
  public defaultBackgroundColor = '#e7e7e7';

  private _destroy$ = new Subject();
  private _cdRef = inject(ChangeDetectorRef);

  // Only here for its `changes` stream, which a single ContentChild does not have.
  // Comparing chipSubcontentTemplateRef by reference on every check would be unsafe:
  // a content query can read as unset on a targeted-mode traversal (see the note on
  // chipSuffixes), so the comparison would flip and mark the view on every pass.
  @ContentChildren(FsChipSubcontentDirective)
  private _chipSubcontents: QueryList<FsChipSubcontentDirective> = new QueryList();

  /**
   * A content query result changing does not mark an OnPush view dirty by itself,
   * so a prefix or suffix added or removed after the first render would not be
   * painted until something else happened to check this view. This only ever calls
   * markForCheck, so nothing that renders today renders differently — it adds
   * repaints that were previously missed.
   */
  public ngAfterContentInit(): void {
    merge(
      this.chipSuffixes.changes,
      this.chipPrefixes.changes,
      this._chipSubcontents.changes,
    )
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._cdRef.markForCheck();
      });
  }

  /**
   * An explicit backgroundColor always wins. Otherwise both `outlined` and
   * shape="none" mean the chip carries no fill of its own.
   */
  public get chipBackgroundColor(): string {
    if (this.backgroundColor) {
      return this.backgroundColor;
    }

    return this.outlined || this.shape === 'none' ?
      undefined :
      this.defaultBackgroundColor;
  }

  public clicked(event: MouseEvent) {
    if (this.disabled) {
      event.stopImmediatePropagation();
      event.stopPropagation();

      return;
    }

    // The `click` output collides with the native click event name, so when a
    // consumer binds `(click)` on the chip it would otherwise fire twice (once via
    // this emit, once via native bubbling). Stop the native event so the `click`
    // output is the single source of truth — but only when it's actually observed.
    // When nothing listens to `(click)` (e.g. fs-autocomplete-chips, which relies
    // on the click bubbling to its own wrapping handler), the native event must be
    // left to propagate.
    if (this.click.observed) {
      event.stopPropagation();
    }

    if (this.selectable) {
      this.selected = !this.selected;
      this.selectedToggled.emit({ value: this.value, selected: this.selected });
    }

    this.click.emit(event);
  }

  public select() {
    this.selected = true;
    this._cdRef.markForCheck();
  }

  public unselect() {
    this.selected = false;
    this._cdRef.markForCheck();
  }

  public get destroy$(): Observable<any> {
    return this._destroy$.asObservable();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.backgroundColor) {
      this.contrastColor = this.defaultColor;

      if(this.backgroundColor && this.backgroundColor !== 'transparent') {
        const rgb = this._parseColor(this.backgroundColor);

        if (rgb) {
          // Light backgrounds get a very dark shade of their own hue so the text
          // reads as part of the chip's colour rather than a flat grey; dark
          // backgrounds fall back to white for legibility.
          this.contrastColor = this._isLight(rgb) ? this._darken(rgb) : '#fff';
        }
      }
    }
  }

  public actionClick(action, event: MouseEvent) {
    if(action.click) {
      action.click(event);
    }
  }

  public chipSuffixClick(chipSuffix: FsChipSuffixDirective, event: MouseEvent, value: any) {
    if(chipSuffix.click.observed) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      chipSuffix.click.emit({ event, data: value ?? chipSuffix.data });
    }
  }

  public chipPrefixClick(chipPrefix: FsChipPrefixDirective, event: MouseEvent, value: any) {
    if(chipPrefix.click.observed) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      chipPrefix.click.emit({ event, data: value ?? chipPrefix.data });
    }
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public remove(event: MouseEvent) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    this.removed.next(event);
  }

  private _isLight([r, g, b]: number[]): boolean {
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    return yiq >= 200;
  }

  /**
   * A very dark version of the given colour: same hue and saturation, lightness
   * pinned low. Greys stay grey (close to the default text colour).
   */
  private _darken([r, g, b]: number[]): string {
    const { h, s } = this._rgbToHsl(r, g, b);

    return `hsl(${h}, ${s}%, 22%)`;
  }

  /**
   * Parses #rgb, #rrggbb, rgb() and rgba() into [r, g, b]. Returns null for
   * anything else (named colours, gradients, css variables).
   */
  private _parseColor(color: string): number[] | null {
    const value = String(color).trim();

    const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hex) {
      let digits = hex[1];
      if (digits.length === 3) {
        digits = digits.split('').map((d) => d + d).join('');
      }

      return [0, 2, 4].map((i) => parseInt(digits.substr(i, 2), 16));
    }

    const rgb = value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (rgb) {
      return [rgb[1], rgb[2], rgb[3]].map(Number);
    }

    return null;
  }

  private _rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const d = max - min;

    if (d === 0) {
      return { h: 0, s: 0, l: Math.round(l * 100) };
    }

    const s = d / (1 - Math.abs(2 * l - 1));
    let h: number;
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }

    h = Math.round(h * 60);
    if (h < 0) {
      h += 360;
    }

    return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
  }
}

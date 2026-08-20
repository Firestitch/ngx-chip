import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

import { FsMessage } from '@firestitch/message';

import { FsChipComponent } from '../../../../src/app/components/chip/chip.component';
import { FsChipPrefixDirective } from '../../../../src/app/directives/chip-prefix.directive';
import { FsChipSubcontentDirective } from '../../../../src/app/directives/chip-subcontent.directive';
import { FsChipSuffixDirective } from '../../../../src/app/directives/chip-suffix.directive';


interface KitchenSinkConfig {
  // Shape and size
  shape: 'round' | 'square' | 'none';
  size: 'micro' | 'tiny' | 'small' | 'medium' | 'large';

  // Decoration
  outlined: boolean;
  outlineDash: boolean;
  overrideBackground: boolean;
  backgroundColor: string;
  overrideColor: boolean;
  color: string;
  overrideBorderColor: boolean;
  borderColor: string;
  padding: string;

  // Content
  image: boolean;
  icon: string;
  text: string;
  subcontent: boolean;
  prefix: boolean;
  suffix: boolean;
  suffixLink: boolean;

  // Behaviour
  removable: boolean;
  selectable: boolean;
  selected: boolean;
  disabled: boolean;
  clickable: boolean;

  // Sizing
  maxWidth: string;
  width: string;
}

interface LoggedEvent {
  name: string;
  time: string;
  payload: string;
}

const defaultConfig: KitchenSinkConfig = {
  shape: 'round',
  size: 'medium',

  outlined: false,
  outlineDash: false,
  overrideBackground: false,
  backgroundColor: '#569cd6',
  overrideColor: false,
  color: '#ffffff',
  overrideBorderColor: false,
  borderColor: '#569cd6',
  padding: '',

  image: true,
  icon: '',
  text: 'Jessey Wing',
  subcontent: false,
  prefix: false,
  suffix: false,
  suffixLink: false,

  removable: false,
  selectable: false,
  selected: false,
  disabled: false,
  clickable: false,

  maxWidth: '',
  width: '',
};


@Component({
  selector: 'kitchen-sink',
  templateUrl: './kitchen-sink.component.html',
  styleUrls: ['./kitchen-sink.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,

    MatButton,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatExpansionModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSlideToggle,
    MatTab,
    MatTabGroup,

    FsChipComponent,
    FsChipPrefixDirective,
    FsChipSuffixDirective,
    FsChipSubcontentDirective,
  ],
})
export class KitchenSinkComponent {

  public config: KitchenSinkConfig = { ...defaultConfig };
  public events: LoggedEvent[] = [];
  public removed = false;

  /** Typed rather than inline in the template, which strictTemplates widens to string. */
  public shapes: ('round' | 'square' | 'none')[] = ['round', 'square', 'none'];

  private _cdRef = inject(ChangeDetectorRef);
  private _message = inject(FsMessage);

  public get image(): string {
    return this.config.image ? '/assets/headshot2.jpg' : '';
  }

  public get backgroundColor(): string {
    return this.config.overrideBackground ? this.config.backgroundColor : null;
  }

  public get color(): string {
    return this.config.overrideColor ? this.config.color : null;
  }

  public get borderColor(): string {
    return this.config.overrideBorderColor ? this.config.borderColor : null;
  }

  public reset(): void {
    this.config = { ...defaultConfig };
    this.events = [];
    this.restore();
  }

  public restore(): void {
    this.removed = false;
    this._cdRef.markForCheck();
  }

  public chipRemoved(): void {
    this.removed = true;
  }

  public chipClicked(): void {
    this._log('click');
  }

  public selectedToggled(event: { value: any, selected: boolean }): void {
    this.config.selected = event.selected;
  }

  public prefixClicked(data: unknown): void {
    this._message.success('Prefix clicked');
    this._log('prefix click', data);
  }

  public suffixClicked(data: unknown): void {
    this._message.success('Suffix clicked');
    this._log('suffix click', data);
  }

  public clearEvents(): void {
    this.events = [];
  }

  private _log(name: string, payload?: unknown): void {
    const date = new Date();
    const time = [date.getHours(), date.getMinutes(), date.getSeconds()]
      .map((part) => String(part).padStart(2, '0'))
      .join(':');

    this.events = [
      { name, time, payload: payload === undefined ? '' : JSON.stringify(payload).slice(0, 120) },
      ...this.events,
    ].slice(0, 40);

    this._cdRef.markForCheck();
  }

}

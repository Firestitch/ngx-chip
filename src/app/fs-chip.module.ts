import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsLabelModule } from '@firestitch/label';

import { FsChipPrefixComponent } from './components/chip-prefix/chip-prefix.component';
import { FsChipSelectOptionComponent } from './components/chip-select/chip-select-option.component';
import { FsChipSelectTriggerDirective } from './components/chip-select/chip-select-trigger.directive';
import { FsChipSelectComponent } from './components/chip-select/chip-select.component';
import { FsChipSuffixComponent } from './components/chip-suffix/chip-suffix.component';
import { FsChipComponent } from './components/chip/chip.component';
import { FsChipsComponent } from './components/chips/chips.component';
import { FsChipPrefixDirective } from './directives/chip-prefix.directive';
import { FsChipSubcontentDirective } from './directives/chip-subcontent.directive';
import { FsChipSuffixDirective } from './directives/chip-suffix.directive';

@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    MatIconModule,
    MatTooltipModule,
    FsLabelModule,
    FsChipsComponent,
    FsChipComponent,
    FsChipSuffixComponent,
    FsChipPrefixComponent,
    FsChipPrefixDirective,
    FsChipSuffixDirective,
    FsChipSubcontentDirective,
    FsChipSelectComponent,
    FsChipSelectTriggerDirective,
    FsChipSelectOptionComponent,
  ],
  exports: [
    FsChipsComponent,
    FsChipComponent,
    FsChipSuffixDirective,
    FsChipPrefixDirective,
    FsChipSubcontentDirective,
    FsChipSelectComponent,
    FsChipSelectTriggerDirective,
    FsChipSelectOptionComponent,
  ],
})
export class FsChipModule {
  public static forRoot(): ModuleWithProviders<FsChipModule> {
    return {
      ngModule: FsChipModule,
    };
  }
}

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsLabelModule } from '@firestitch/label';

import { FsChipSuffixComponent } from './components/chip-suffix/chip-suffix.component';
import { FsChipComponent } from './components/chip/chip.component';
import { FsChipsComponent } from './components/chips/chips.component';
import { FsChipSubcontentDirective } from './directives/chip-subcontent.directive';
import { FsChipSuffixDirective } from './directives/chip-suffix.directive';

@NgModule({
  imports: [
    CommonModule,

    DragDropModule,
    MatIconModule,
    MatTooltipModule,

    FsLabelModule,
  ],
  exports: [
    FsChipsComponent,
    FsChipComponent,
    FsChipSuffixDirective,
    FsChipSubcontentDirective,
  ],
  declarations: [
    FsChipsComponent,
    FsChipComponent,
    FsChipSuffixComponent,
    FsChipSuffixDirective,
    FsChipSubcontentDirective,
  ],
})
export class FsChipModule {
  public static forRoot(): ModuleWithProviders<FsChipModule> {
    return {
      ngModule: FsChipModule,
    };
  }
}

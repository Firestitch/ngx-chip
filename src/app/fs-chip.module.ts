import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsLabelModule } from '@firestitch/label';

import { FsChipComponent, FsChipsComponent, FsChipSuffixComponent } from './components';
import { FsChipSubcontentDirective, FsChipSuffixDirective } from './directives';

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

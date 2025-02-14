import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsLabelModule } from '@firestitch/label';

import { FsChipComponent, FsChipsComponent, FsChipSuffixComponent } from './components';
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
  ],
  declarations: [
    FsChipsComponent,
    FsChipComponent,
    FsChipSuffixComponent,
    FsChipSuffixDirective,  
  ],
})
export class FsChipModule {
  public static forRoot(): ModuleWithProviders<FsChipModule> {
    return {
      ngModule: FsChipModule,
    };
  }
}

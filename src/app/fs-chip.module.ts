import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';

import { FsLabelModule } from '@firestitch/label';

import { FsChipActionComponent } from './components/chip-action/chip-action.component';
import { FsChipComponent } from './components/chip/chip.component';
import { FsChipsComponent } from './components/chips/chips.component';

@NgModule({
  imports: [
    CommonModule,

    DragDropModule,
    MatIconModule,

    FsLabelModule,
  ],
  exports: [
    FsChipsComponent,
    FsChipComponent,
  ],
  declarations: [
    FsChipsComponent,
    FsChipComponent,
    FsChipActionComponent,
  ],
})
export class FsChipModule {
  public static forRoot(): ModuleWithProviders<FsChipModule> {
    return {
      ngModule: FsChipModule,
    };
  }
}

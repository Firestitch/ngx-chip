import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule, MatIconModule } from '@angular/material';

import { FsLabelModule } from '@firestitch/label';

import { FsChipsComponent } from './components/chips/chips.component';

import { FsChipComponent } from './components/chip/chip.component';

@NgModule({
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule,
    FsLabelModule
  ],
  exports: [
    FsChipsComponent,
    FsChipComponent,
  ],
  declarations: [
    FsChipsComponent,
    FsChipComponent,
  ]
})
export class FsChipModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsChipModule
    };
  }
}

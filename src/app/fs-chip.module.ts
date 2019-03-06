import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsChipComponent } from './components/chip/chip.component';

import { MatChipsModule, MatIconModule } from '@angular/material';

import { FsLabelModule } from '@firestitch/label';

@NgModule({
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule,
    FsLabelModule
  ],
  exports: [
    FsChipComponent,
  ],
  declarations: [
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

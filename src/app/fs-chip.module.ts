import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { FsLabelModule } from '@firestitch/label';

import { FsChipsComponent } from './components/chips/chips.component';
import { FsChipComponent } from './components/chip/chip.component';

@NgModule({
  imports: [
    CommonModule,
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

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';


import { FsColorPickerModule } from '@firestitch/colorpicker';
import { FsExampleModule } from '@firestitch/example';
import { FsLabelModule } from '@firestitch/label';
import { FsMessageModule } from '@firestitch/message';
import { FsChipModule } from '@firestitch/package';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import {
  ExampleComponent,
  ExamplesComponent,
  ExampleSingleSelectionComponent,
  ExampleSortableSelectedComponent,
  ExampleWithArrayComponent,
  ExampleWithCustomCompareComponent,
} from './components';
import { ExampleSortableComponent } from './components/example-sortable';
import { AppMaterialModule } from './material.module';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FsChipModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsLabelModule,
    FsColorPickerModule,
    FsExampleModule.forRoot(),
    FsMessageModule.forRoot(),
    RouterModule.forRoot(routes, {}),
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ExampleComponent,
    ExampleWithArrayComponent,
    ExampleSingleSelectionComponent,
    ExampleWithCustomCompareComponent,
    ExampleSortableComponent,
    ExampleSortableSelectedComponent,
  ],
  providers: [],
})
export class PlaygroundModule {
}

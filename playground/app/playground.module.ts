import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';

import { FsChipModule } from '@firestitch/package';
import { FsColorPickerModule } from '@firestitch/colorpicker';
import { FsLabelModule } from '@firestitch/label';

import { AppMaterialModule } from './material.module';
import {
  ExampleComponent,
  ExamplesComponent,
  ExampleSingleSelectionComponent,
  ExampleWithArrayComponent,
  ExampleWithCustomCompareComponent,
} from './components';
import { AppComponent } from './app.component';

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
    ],
    providers: []
})
export class PlaygroundModule {
}

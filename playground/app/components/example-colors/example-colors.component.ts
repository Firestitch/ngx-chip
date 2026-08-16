import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FsLabelModule } from '@firestitch/label';

import { FsChipComponent } from '../../../../src/app/components/chip/chip.component';
import { FsChipsComponent } from '../../../../src/app/components/chips/chips.component';


@Component({
  selector: 'example-colors',
  templateUrl: './example-colors.component.html',
  styleUrls: ['./example-colors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsLabelModule,
    FsChipsComponent,
    FsChipComponent,
  ],
})
export class ExampleColorsComponent {

  // Background only — text colour is derived from the background hue
  public backgroundOnly = [
    { name: 'Blue', backgroundColor: '#e3f2fd' },
    { name: 'Green', backgroundColor: '#c8e6c9' },
    { name: 'Orange', backgroundColor: '#ffe0b2' },
    { name: 'Pink', backgroundColor: '#fce4ec' },
    { name: 'Purple', backgroundColor: '#e1bee7' },
    { name: 'Yellow', backgroundColor: '#fff9c4' },
    { name: 'Teal', backgroundColor: '#b2dfdb' },
    { name: 'Grey', backgroundColor: '#e7e7e7' },
  ];

  // Dark backgrounds — text falls back to white
  public darkBackgroundOnly = [
    { name: 'Blue', backgroundColor: '#1976d2' },
    { name: 'Green', backgroundColor: '#388e3c' },
    { name: 'Red', backgroundColor: '#d32f2f' },
    { name: 'Purple', backgroundColor: '#7b1fa2' },
    { name: 'Dark', backgroundColor: '#333333' },
  ];

  // Background + explicit foreground colour
  public backgroundAndColor = [
    { name: 'Blue', backgroundColor: '#e3f2fd', color: '#1565c0' },
    { name: 'Green', backgroundColor: '#c8e6c9', color: '#2e7d32' },
    { name: 'Orange', backgroundColor: '#ffe0b2', color: '#e65100' },
    { name: 'Pink', backgroundColor: '#fce4ec', color: '#c2185b' },
    { name: 'Purple', backgroundColor: '#e1bee7', color: '#6a1b9a' },
    { name: 'Navy on white', backgroundColor: '#ffffff', color: '#1a237e' },
  ];

  public removed(chip) {
    console.log('removed', chip);
  }
}

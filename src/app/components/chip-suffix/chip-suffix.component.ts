import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';


@Component({
  selector: 'fs-chip-suffix',
  templateUrl: './chip-suffix.component.html',
  styleUrls: ['./chip-suffix.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgTemplateOutlet,
    MatIcon,
    MatTooltip,
  ],
})
export class FsChipSuffixComponent {

  @Input() public icon: string;

  @Input() public link: string;

  @Input() public linkTarget: string;

  @Input() public color: string;

  @Input() public show: boolean = true;

  @Input() public tooltip: string;
  
  @Output() public click = new EventEmitter<MouseEvent>();  

}

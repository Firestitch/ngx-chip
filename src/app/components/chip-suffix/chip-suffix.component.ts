import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';


@Component({
  selector: 'fs-chip-suffix',
  templateUrl: './chip-suffix.component.html',
  styleUrls: ['./chip-suffix.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

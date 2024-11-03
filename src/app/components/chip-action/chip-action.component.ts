import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';


@Component({
  selector: 'fs-chip-action',
  templateUrl: './chip-action.component.html',
  styleUrls: ['./chip-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsChipActionComponent {

  @Input() public icon;

  @Input() public link;

  @Input() public linkTarget;

  @Input() public color;

  @Output() public actionClick = new EventEmitter<MouseEvent>();
}

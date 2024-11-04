import {
  Directive,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';


@Directive({
  selector: 'fs-chip-suffix',
})
export class FsChipSuffixDirective {

  @Input() public icon;

  @Input() public link;

  @Input() public linkTarget;

  @Input() public color;

  @Output() public actionClick = new EventEmitter<MouseEvent>();
}

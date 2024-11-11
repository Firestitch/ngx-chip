import {
  Directive,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';

import { FsChipSuffixDirective } from './chip-suffix.directive';


@Directive({
  selector: '[fsChipSuffix]',
})
export class FsChipRemoveSuffixDirective extends FsChipSuffixDirective {

  @Input() public icon: string;

  @Input() public link: string;

  @Input() public linkTarget: string;

  @Input() public color: string;

  @Output() public click = new EventEmitter<MouseEvent>();

  public templateRef = inject(TemplateRef);
}

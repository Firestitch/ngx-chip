import {
  Directive,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';


@Directive({
  selector: '[fsChipSuffix]',
})
export class FsChipSuffixDirective {

  @Input() public icon: string;

  @Input() public link: string;

  @Input() public linkTarget: string;

  @Input() public color: string;

  @Output() public click = new EventEmitter<MouseEvent>();

  public templateRef = inject(TemplateRef);
}

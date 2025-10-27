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
    standalone: true,
})
export class FsChipSuffixDirective {

  @Input() public icon: string;

  @Input() public link: string;

  @Input() public linkTarget: string;

  @Input() public color: string;

  @Input() public data: any;

  @Input() public tooltip: string;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() public click = new EventEmitter<{ event: MouseEvent, data: any }>();

  public templateRef = inject(TemplateRef);
}

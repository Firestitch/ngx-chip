import {
  Directive,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';


@Directive({
  selector: '[fsChipPrefix]',
  standalone: true,
})
export class FsChipPrefixDirective {

  @Input() public icon: string;

  @Input() public color: string;

  @Input() public data: any;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() public click = new EventEmitter<{ event: MouseEvent, data: any }>();

  public templateRef = inject(TemplateRef);
}

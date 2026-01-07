import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';


@Component({
  selector: 'fs-chip-select-option',
  template: `
    <div class="fs-chip-select-option" (click)="optionClick()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .fs-chip-select-option {
      padding: 10px 16px;
      cursor: pointer;
      white-space: nowrap;

      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FsChipSelectOptionComponent {

  @Input() public value: any;

  @Output() public select = new EventEmitter<any>();

  public el = inject(ElementRef);

  public optionClick() {
    this.select.emit(this.value);
  }
}


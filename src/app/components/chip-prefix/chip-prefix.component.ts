import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';


@Component({
  selector: 'fs-chip-prefix',
  templateUrl: './chip-prefix.component.html',
  styleUrls: ['./chip-prefix.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsChipPrefixComponent {

  @Input() public icon: string;

  @Input() public color: string;

  @Input() public show: boolean = true;

  @Input() public tooltip: string;
  
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() public click = new EventEmitter<MouseEvent>();  
  
  public get clickable() {
    return this.click.observers.length !== 0;
  }

}

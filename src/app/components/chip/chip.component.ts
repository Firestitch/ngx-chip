import {  Component, Input, OnInit, OnChanges,
          SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fs-chip',
  templateUrl: 'chip.component.html',
  styleUrls: [ 'chip.component.scss' ]
})
export class FsChipComponent implements OnInit, OnChanges, OnDestroy {

  @Input() attribute: any;
  @Input() selectable = false;
  @Input() selected = false;
  @Input() outlined = false;
  @Input() removable = false;
  @Input() backgroundColor: string;
  @Input() borderColor: string;
  @Input() color = '';
  @Input() image: string;
  @Input() value: any;

  @Output() clicked = new EventEmitter();
  @Output() selectedToggled = new EventEmitter();
  @Output() removed = new EventEmitter();

  public $destroy = new Subject();
  public styles = {
    backgroundColor: '',
    borderColor: '',
    color: ''
  };

  private isContrastYIQBlack(hexcolor) {
    if (!hexcolor) {
      return true;
    }

    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 200;
  }

  ngOnChanges(changes: SimpleChanges) {

    this.styles.backgroundColor = this. backgroundColor;
    this.styles.borderColor = this. borderColor;
    this.styles.color = this. color;

    if (!this.color && !this.outlined) {
      this.styles.color = this.isContrastYIQBlack(this.backgroundColor) ? '#474747' : '#fff';
    }

    if (this.outlined) {
      this.styles.backgroundColor = '';

      if (this.color) {
        this.styles.borderColor = this.color;
      }
    }
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  ngOnInit() {

    this.clicked
    .pipe(takeUntil(this.$destroy))
    .subscribe(() => {
      if (this.selectable) {
        this.selected = !this.selected;
        this.selectedToggled.emit({ selected: this.selected, value: this.value });
      }
    });
  }
}

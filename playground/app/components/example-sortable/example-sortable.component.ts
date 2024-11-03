import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';


@Component({
  selector: 'example-sortable',
  templateUrl: './example-sortable.component.html',
  styleUrls: ['./example-sortable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleSortableComponent implements OnInit {

  public chips = [];

  public ngOnInit(): void {
    this.chips = [
      { name: 'Tag 1', value: 1 },
      { name: 'Tag 2', value: 2 },
      { name: 'Tag 3', value: 3 },
      { name: 'Tag 4', value: 4 },
    ];
  }

}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';


@Component({
  selector: 'example-sortable-selected',
  templateUrl: './example-sortable-selected.component.html',
  styleUrls: ['./example-sortable-selected.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleSortableSelectedComponent implements OnInit {

  public chips = [];
  public selected = [
    { name: 'Tag 2', value: 2 },
    { name: 'Tag 1', value: 1 },
    { name: 'Tag 4', value: 4 },
  ];
  
  public ngOnInit(): void {
    this.chips = [
      { name: 'Tag 1', value: 1 },
      { name: 'Tag 2', value: 2 },
      { name: 'Tag 3', value: 3 },
      { name: 'Tag 4', value: 4 },
    ];
  }

  public compare = (item, value) => {
    return item.value === value.value;
  };

  public suffixClick(event: { event: MouseEvent, data: any }) {
    this.selected = this.selected.map((item) => {
      if (item.value === event.data.value) {
        return { ...item, name: 'Changed' };
      }

      return item;
    });
  }

}

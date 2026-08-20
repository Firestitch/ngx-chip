import { ChangeDetectionStrategy, Component } from '@angular/core';

import { environment } from '@env';
import { FsExampleModule } from '@firestitch/example';
import { ExampleComponent } from '../example/example.component';
import { KitchenSinkComponent } from '../kitchen-sink/kitchen-sink.component';
import { ExampleColorsComponent } from '../example-colors/example-colors.component';
import { ExampleChipSelectComponent } from '../example-chip-select/example-chip-select.component';
import { ExampleSortableComponent } from '../example-sortable/example-sortable.component';
import { ExampleSortableSelectedComponent } from '../example-sortable-selected/example-sortable-selected.component';
import { ExampleWithArrayComponent } from '../example-with-array/example-with-array.component';
import { ExampleWithCustomCompareComponent } from '../example-with-custom-compare/example-with-custom-compare.component';
import { ExampleSingleSelectionComponent } from '../example-single-selection/example-single-selection.component';


@Component({
    templateUrl: './examples.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsExampleModule,
        KitchenSinkComponent,
        ExampleComponent,
        ExampleColorsComponent,
        ExampleChipSelectComponent,
        ExampleSortableComponent,
        ExampleSortableSelectedComponent,
        ExampleWithArrayComponent,
        ExampleWithCustomCompareComponent,
        ExampleSingleSelectionComponent,
    ],
})
export class ExamplesComponent {
  public config = environment;
}

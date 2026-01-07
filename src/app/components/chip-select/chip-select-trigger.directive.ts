import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';


@Component({
  selector: 'fs-chip-select-trigger',
  template: `<ng-template #templateRef><ng-content></ng-content></ng-template>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FsChipSelectTriggerDirective {

  @ViewChild('templateRef', { static: true })
  public templateRef: TemplateRef<void>;
}

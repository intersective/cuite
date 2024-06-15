import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-action-popover',
  templateUrl: './action-popover.component.html',
  styleUrls: ['./action-popover.component.scss']
})
export class ActionPopoverComponent {

  @Input() actions: Array<{
    icon?: string;
    text: string;
    data?: any;
  }>;
  @Input() onClick;
  constructor(
    private popoverController: PopoverController
  ) { }

  click(action) {
    this.popoverController.dismiss(action);
  }
}

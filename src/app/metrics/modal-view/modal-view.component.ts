import { Component, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Metric } from "../metrics.service";

@Component({
  selector: "app-metric-view",
  templateUrl: "./modal-view.component.html",
  styleUrls: ["./modal-view.component.css"],
})
export class MetricModalViewComponent {
  @Input() data: Metric;

  constructor(private modalController: ModalController) {}

  dismissModal() {
    this.modalController.dismiss();
  }
}

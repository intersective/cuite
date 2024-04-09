import { Component, Input } from "@angular/core";
import type { Metric } from "../metrics.service";
@Component({
  selector: "app-metric",
  templateUrl: "./metric.component.html",
  styleUrls: ["./metric.component.css"],
})
export class MetricComponent {
  @Input() data: Metric;
  @Input() index: number;
}

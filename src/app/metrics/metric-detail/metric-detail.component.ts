import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-metric-detail',
  templateUrl: './metric-detail.component.html',
  styleUrls: ['./metric-detail.component.css']
})
export class MetricDetailComponent implements OnInit {
  metric: any;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    console.log(this.metric);
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}

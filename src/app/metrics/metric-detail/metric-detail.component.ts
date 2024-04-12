import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-metric-detail',
  templateUrl: './metric-detail.component.html',
  styleUrls: ['./metric-detail.component.scss']
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

  async onSelectAction(event: any) {
    const action = event.detail.value;
    switch (action) {
      case 'edit':
        this.editMetric();
        break;
      case 'delete':
        this.deleteMetric();
        break;
      case 'archive':
        this.archiveMetric();
        break;
      case 'duplicate':
        this.duplicateMetric();
        break;
      default:
        console.log('Action not recognized');
    }
  }

  editMetric() {
  }

  deleteMetric() {
  }

  archiveMetric() {
  }

  duplicateMetric() {
  }
}

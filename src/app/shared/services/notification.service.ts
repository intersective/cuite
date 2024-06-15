import { Injectable } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { AlertOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {}

  dismiss() {
    return this.modalController.dismiss();
  }

  /**
   * futher customised filter
   */
  private modalConfig({ component, componentProps }, options = {}) {
    const config = Object.assign(
      {
        component,
        componentProps,
      },
      options
    );

    return config;
  }

  async modal(component, componentProps, options?) {
    const modal = await this.modalController.create(this.modalConfig({ component, componentProps }, options));
    return await modal.present();
  }

  async alert(config: AlertOptions) {
    const alert = await this.alertController.create(config);
    return await alert.present();
  }

  // toast message pop up, by default, shown success message for 2 seconds.
  async presentToast(message, success= true, duration= 2000) {
    let color = 'success';
    if (!success) {
      color = 'danger';
    }
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'top',
      color : color
    });
    toast.present();
  }

}

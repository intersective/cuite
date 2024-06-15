import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Template, TemplateLibraryService } from '../template-library.service';
import { PopupService } from '../../shared/popup/popup.service';
import { StorageService } from '@services/storage.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-template-details',
  templateUrl: './template-details.component.html',
  styleUrls: ['./template-details.component.scss'],
})
export class TemplateDetailsComponent {

  template: Template;
  loadingTemplate = true;
  importingTemplate = false;
  categoryLeadImage = '/assets/exp-placeholder.png';
  deletingTemplate = false;
  isTemplatepublic = false;
  showToggle = true;

  constructor(
    private route: ActivatedRoute,
    private service: TemplateLibraryService,
    private popupService: PopupService,
    private storage: StorageService,
    private router: Router,
  ) {
    this.route.params.subscribe(params => {
      this.fetchTemplate(params.templateId);
    });
  }

  fetchTemplate(templateId: string) {
    this.loadingTemplate = true;
    this.service.getTemplate(templateId).subscribe(res => {
      if (res === null) {
        return;
      }
      this.template = res;
      this.isTemplatepublic = this.template.isPublic;
      this.checkUserRole();

      this.service.getCategories().forEach(category => {
        if (category.id === res.type) {
          this.categoryLeadImage = category.leadImage;
        }
      });

      this.loadingTemplate = false;
    });
  }

  importTemplate(templateId: string) {
    this.importingTemplate = true;
    this.service.importExperienceUrl(templateId).subscribe(res => {
      if (!res) {
        return;
      }
      this.importingTemplate = false;
      const apikey = this.storage.getUser().apikey;
      if (!apikey) {
        this.popupService.showToast('Failed to create the experience!');
        return;
      }
      this.popupService.showImportExp({
        action: 'create',
        uuid: this.template.uuid,
        url: `${res}&appkey=${environment.appkey}&apikey=${apikey}`
      });
    });
  }

  deleteTemplate() {
    this.popupService.showAlert({
      message: 'Delete <strong>' + this.template.name + '</strong> experience template.<br/>This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: this.deleteTemplateConfirm.bind(this)
        },
      ]
    });
  }

  deleteTemplateConfirm() {
    this.popupService.showLoading({
      message: 'Deleting the template'
    });
    this.service.deleteTemplate(this.template.uuid).subscribe(res => {
      setTimeout(() => this.popupService.dismissLoading(), 500);
      if (res.success) {
        this.popupService.showToast('Success: "' + this.template.name + '" template deleted.', {color: 'success'});
        this.router.navigate(['/templates']);
      } else {
        this.popupService.showToast(res.message);
      }
    });
  }

  canDelete() {
    const myInfo = this.storage.getUser();
    if (myInfo && this.template) {
      return !this.template.isPublic && (myInfo.role === 'inst_admin' || myInfo.role === 'cs_admin');
    }
    return false;
  }

  /**
  * Method get call then toggle button change.
  * this will show a alert to get confirmation from user.
  * if user confirm it will call updateTemplateVisibilityConfirm method.
  * @params $event - event data of toggle change.
  **/
  updateTemplateVisibility($event: CustomEvent) {

    let alertMessage = `This action will make this template ${this.template.isPublic && !this.isTemplatepublic ? 'unavailable' : 'available'} to every Practera user globally, do you still want to change it?`;

    this.popupService.showAlert({
      message: alertMessage,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { this.isTemplatepublic = false }
        },
        {
          text: 'Confirm',
          handler: this.updateTemplateVisibilityConfirm.bind(this)
        },
      ]
    });
  }

  /**
    * It call core graphql API to update template visibility to what user selected.
    * if that success it fetch the current template again and update the UI.
   **/
  updateTemplateVisibilityConfirm() {
    this.service.updateTemplateVisibility(this.template.uuid, this.isTemplatepublic).subscribe(res => {
      if (res.success) {
        this.popupService.showToast(`Template visibility update to ${this.isTemplatepublic ? 'public' : 'private'}`, 
        { color : 'success', icon : "checkmark"}
        );
        this.fetchTemplate(this.template.uuid);
      } else {
        this.isTemplatepublic = false;
        this.popupService.showToast(`Action could not complete`, 
        { color : 'danger', icon : "checkmark"}
        );
      }
    });
  }

  checkUserRole() {
    if (this.storage.getUser().role === 'cs_admin') {
      this.showToggle = true;
    } else {
      this.showToggle = false;
    }
  }

}

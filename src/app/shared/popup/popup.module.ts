import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { PopupService } from './popup.service';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { DescriptionComponent } from './description/description.component';
import { TagsComponent } from './tags/tags.component';
import { TagsViewComponent } from './tags-view/tags-view.component';
import { DuplicateExperienceComponent } from './duplicate-experience/duplicate-experience.component';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { TemplateInfoComponent } from './template-info/template-info.component';
import { BriefInfoComponent } from './brief-info/brief-info.component';
import { StatusInfoPopoverComponent } from './status-info-popover/status-info-popover.component';

@NgModule({
    imports: [
        SharedModule,
        NgbTypeaheadModule
    ],
    providers: [
        PopupService
    ],
    declarations: [
        DescriptionComponent,
        TagsComponent,
        TagsViewComponent,
        DuplicateExperienceComponent,
        CreateTemplateComponent,
        TemplateInfoComponent,
        BriefInfoComponent,
        StatusInfoPopoverComponent
    ],
    exports: [
        DescriptionComponent,
        TagsComponent,
        TagsViewComponent,
        DuplicateExperienceComponent,
        CreateTemplateComponent,
        TemplateInfoComponent,
        BriefInfoComponent,
    ]
})

export class PopupModule {

}

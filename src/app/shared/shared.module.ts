import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { NavbarComponent } from '@components/navbar/navbar.component';
import { StorageService } from '@services/storage.service';
import { ActionPopoverComponent } from '@components/action-popover/action-popover.component';
import { FilestackService } from './filestack/filestack.service';
import { PreviewComponent } from './filestack/preview/preview.component';
import { ActionFooterComponent } from '@app/components/action-footer/action-footer.component';
import { OnboardingTemplateDetailComponent } from '@app/components/onboarding-template-detail/onboarding-template-detail.component';
import { VideoConversionComponent } from '@app/components/video-conversion/video-conversion.component';
import { FilterByPipe } from './filter-by.pipe';

@NgModule({
    declarations: [
        NavbarComponent,
        ActionPopoverComponent,
        PreviewComponent,
        ActionFooterComponent,
        OnboardingTemplateDetailComponent,
        VideoConversionComponent,
        FilterByPipe,
    ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule
    ],
    exports: [
        CommonModule,
        IonicModule,
        FormsModule,
        NavbarComponent,
        ActionPopoverComponent,
        ActionFooterComponent,
        OnboardingTemplateDetailComponent,
        VideoConversionComponent,
        FilterByPipe,
    ],
    providers: [
        StorageService,
        FilestackService
    ]
})
export class SharedModule { }

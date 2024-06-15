import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Template, TemplateLibraryService} from '../template-library.service';

@Component({
  selector: 'app-browse-templates',
  templateUrl: './browse-templates.component.html',
  styleUrls: ['./browse-templates.component.scss'],
})
export class BrowseTemplatesComponent {

  heading: string;
  headingHighlight: string;
  emptyResultsString: string;
  templates: Template[] = [];
  loadingTemplates = true;
  leadImage: string;
  description: string;
  isCustomTemplates = false;

  constructor(private route: ActivatedRoute, private service: TemplateLibraryService) {

    this.route.url.subscribe(segment => {
      this.route.params.subscribe(params => {
      if (segment[0].path === 'search') {
        this.loadTemplatesByFilter(params.filter);
      } else if (segment[0].path === 'custom') {
        this.loadCustomTemplates();
      } else {
        this.loadTemplatesByCategory(params.categoryName);
      }
      });
    });
  }

  loadTemplatesByFilter(filter: string) {
    this.loadingTemplates = true;

    this.service.getTemplatesByFilter(filter).subscribe(res => {
      if (res === null) {
        return;
      }
      this.templates = res;
      this.heading = this.templates.length + ' results for ';
      this.headingHighlight = filter;
      this.emptyResultsString = 'No results for ' + filter;

      this.loadingTemplates = false;
    });
  }

  loadTemplatesByCategory(categoryId: string) {
    this.loadingTemplates = true;

    if (categoryId) {
      this.service.getCategories().forEach(category => {
        if (category.id === categoryId) {
          this.leadImage = category.leadImage;
          this.description = category.description;
          this.heading = category.name;
          this.emptyResultsString = 'Could not find any templates for category - ' + category.name;
        }
      });
    }

    this.service.getTemplatesByCategory(categoryId).subscribe(res => {
      if (res === null) {
        return;
      }
      this.templates = res;
      this.loadingTemplates = false;
    });
  }

  loadCustomTemplates() {
    this.loadingTemplates = true;
    this.isCustomTemplates = true;
    this.heading = 'Private Templates';
    this.service.getCustomTemplates().subscribe(res => {
      if (res === null) {
        return;
      }
      this.templates = res;
      this.loadingTemplates = false;
    });
  }

}

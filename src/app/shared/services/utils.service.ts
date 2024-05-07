import * as XLSX from 'xlsx';
import { Injectable, Inject } from '@angular/core';
import * as _ from 'lodash';
import { DOCUMENT } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '@services/storage.service';
import { environment } from '@environments/environment';
import { AnalyticsService } from './analytics.service';
import * as moment from 'moment';
import Delta from 'quill-delta';

// @TODO: enhance Window reference later, we shouldn't refer directly to browser's window object like this
declare var window: any;
declare var hbspt: any;
declare var document: any;

@Injectable({
  providedIn: 'root'
})

export class UtilsService {
  private lodash;
  protected _eventsSubject = new Subject<{ key: string, value: any }>();

  constructor(
    // @Inject(DOCUMENT) private document: Document,
    private storage: StorageService,
    private http: HttpClient,
    private analytics: AnalyticsService
  ) {
    if (_) {
      this.lodash = _;
    } else {
      throw new Error('Lodash not available');
    }
  }

  /**
   * isMobile
   * @description grouping device type into 2 group (mobile/desktop) and return true if mobile, otherwise return false
   * @example https://github.com/ionic-team/ionic/blob/master/angular/src/providers/platform.ts#L71-L115
   */
  isMobile() {
    return window.innerWidth <= 576;
  }

  isEmpty(value: any): boolean {
    return this.lodash.isEmpty(value);
  }

  isEqual(value: any, other: any): boolean {
    return this.lodash.isEqual(value, other);
  }

  each(collections, callback) {
    return this.lodash.each(collections, callback);
  }

  unset(object, path) {
    return this.lodash.unset(object, path);
  }

  find(collections, callback) {
    return this.lodash.find(collections, callback);
  }

  has(object, path) {
    return this.lodash.has(object, path);
  }

  indexOf(array, value, fromIndex = 0) {
    return this.lodash.indexOf(array, value, fromIndex);
  }

  remove(collections, callback) {
    return this.lodash.remove(collections, callback);
  }

  openUrl(url, options?: { target: String }) {
    options = options || { target: '_self' };
    return window.open(url, options.target);
  }

  // given an array and a value, check if this value is in this array, if it is, remove it, if not, add it to the array
  addOrRemove(array: Array<any>, value) {
    const position = this.indexOf(array, value);
    if (position > -1) {
      // find the position of this value and remove it
      array.splice(position, 1);
    } else {
      // add it to the value array
      array.push(value);
    }
    return array;
  }

  changeThemeColor(color) {
    document.documentElement.style.setProperty('--ion-color-primary', color);
    document.documentElement.style.setProperty('--ion-color-primary-shade', color);
  }

  changeCardBackgroundImage(image) {
    document.documentElement.style.setProperty('--practera-card-background-image', 'url(\'' + image + '\')');
  }

  // broadcast the event to whoever subscribed
  broadcastEvent(key: string, value: any) {
    this._eventsSubject.next({ key, value });
  }

  // get Event to subscribe to
  getEvent(key: string): Observable<any> {
    return this._eventsSubject.asObservable()
      .pipe(
        filter(e => e.key === key),
        map(e => e.value)
      );
  }

  // transfer url query string to an object
  urlQueryToObject(query: string) {
    return JSON.parse('{"' + decodeURI(query).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
  }

  /**
   * This is a time formatter that transfer time/date string to a nice string
   * It will return different string based on the comparision with 'compareWith' (default is today)
   * Any time before yesterday(one day before 'compareWith') will return 'Yesterday'
   * Any time today(the same day as 'compareWith') will return the time
   * Any other time will just return the date in "3 May" format
   * @param time        [The time string going to be formatted (In UTC timezone)]
   * @param compareWith [The time string used to compare with]
   */
  timeFormatter(time: string, compareWith?: string) {
    if (!time) {
      return '';
    }
    // if no compareWith provided, compare with today
    let compareDate = new Date();
    if (compareWith) {
      compareDate = new Date(this.iso8601Formatter(compareWith));
    }
    const date = new Date(this.iso8601Formatter(time));
    if (date.getFullYear() === compareDate.getFullYear() && date.getMonth() === compareDate.getMonth()) {
      if (date.getDate() === compareDate.getDate() - 1) {
        return 'Yesterday';
      }
      if (date.getDate() === compareDate.getDate() + 1) {
        return 'Tomorrow';
      }
      if (date.getDate() === compareDate.getDate()) {
        return new Intl.DateTimeFormat('en-US', {
          hour12: true,
          hour: 'numeric',
          minute: 'numeric'
        }).format(date);
      }
    }
    return new Intl.DateTimeFormat('en-GB', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  utcToLocal(time: string, display: string = 'all') {
    if (!time) {
      return '';
    }
    const date = new Date(this.iso8601Formatter(time));
    switch (display) {
      case 'date':
        const today = new Date();
        if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()) {
          if (date.getDate() === today.getDate() - 1) {
            return 'Yesterday';
          }
          if (date.getDate() === today.getDate()) {
            return 'Today';
          }
          if (date.getDate() === today.getDate() + 1) {
            return 'Tomorrow';
          }
        }
        return new Intl.DateTimeFormat('en-GB', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }).format(date);

      case 'time':
        return new Intl.DateTimeFormat('en-US', {
          hour12: true,
          hour: 'numeric',
          minute: 'numeric'
        }).format(date);

      default:
        return new Intl.DateTimeFormat('en-GB', {
          hour12: true,
          hour: 'numeric',
          minute: 'numeric',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }).format(date);
    }
  }

  timeComparer(timeString: string, comparedString?: string) {
    const time = new Date(this.iso8601Formatter(timeString));
    let compared = new Date();
    if (comparedString) {
      compared = new Date(this.iso8601Formatter(comparedString));
    }
    if (time.getTime() < compared.getTime()) {
      return -1;
    }
    if (time.getTime() === compared.getTime()) {
      return 0;
    }
    if (time.getTime() > compared.getTime()) {
      return 1;
    }
  }

  /**
  * Format the time string
  * 1. Add 'T' between date and time, for compatibility with Safari
  * 2. Add 'Z' at last to indicate that it is UTC time, browser will automatically convert the time to local time
  *
  * Example time string: '2019-08-06 15:03:00'
  * After formatter: '2019-08-06T15:03:00Z'
  *
  * SAFARI enforce ISO 8601 (no space as time delimiter allowed)
  * T for time delimiter
  * Z for timezone (UTC) delimiter (+0000)
  */
  iso8601Formatter(time: Date | string) {
    try {
      if (typeof time === 'string') {
        let tmpTime = time;
        if (!time.includes('GMT') && !(time.toLowerCase()).includes('z')) {
          tmpTime += ' GMT+0000';
        }
        return (new Date(tmpTime)).toISOString();
      }
      return time.toISOString();
    } catch (err) {
      // in case the above doesn't work on Safari
      if (typeof time === 'string') {
        // add "T" between date and time, so that it works on Safari
        time = time.replace(' ', 'T');
        // add "Z" to indicate that it is UTC time, it will automatically convert to local time
        return time + 'Z';
      }
      return time.toISOString();
    }
  }

  /**
 * Get the user's current location from IP
 */
  getIpLocation() {
    this._ipAPI().subscribe(
      res => this.storage.setCountry(res.country_name),
      err => console.log(err)
    );
  }

  private _ipAPI(): Observable<any> {
    return this.http.get('https://ipapi.co/json');
  }

  removeAllSpecialCharactersAndToLower(type: string): string {
    type = type.replace(/[!@#^_.$&*%\s\-]/g, ''); // eslint-disable-line
    type = type.toLowerCase();
    return type;
  }

  /**
   * This is used to create a HubSpot form on the page
   */
  createHubSpotForm(
    formOptions: { formId: string, target?: string, category?: string },
    hiddenValues?: [{ name: string; value: any }]
  ) {
    hbspt.forms.create({
      region: 'na1',
      portalId: environment.onboarding.portalId,
      formId: formOptions.formId,
      target: formOptions.target || '#form',
      onFormReady: function ($form) {
        hiddenValues.forEach(v => {
          if (environment.onboarding.formInRawHtml) {
            document.querySelector(`.hs-form input[name="${v.name}"]`).value = v.value;
          } else {
            document.getElementById('hs-form-iframe-0').contentDocument.querySelector(`input[name="${v.name}"]`).value = v.value;
          }
        });
      },
      onFormSubmit: (function ($form) {
        this.analytics.track('Submit', {
          category: formOptions.category
        });
      }).bind(this)
    });
    window.jQuery = window.jQuery || function (nodeOrSelector) {
      if (typeof (nodeOrSelector) === 'string') {
        return document.querySelector(nodeOrSelector);
      }
      return nodeOrSelector;
    };
  }

  /**
   * This method will return the icon related to onboarding project type
   * @param projectType type of the project user selected in onboarding
   * @returns icon (string) of the project
   */
  getIconForHeader(projectType: string) {
    switch (projectType) {
      case 'industryProject':
        return 'fa-building';
      case 'internship':
        return 'fa-user-astronaut';
      case 'workSimulation':
        return 'fa-briefcase';
      case 'mentoring':
        return 'fa-hands-helping';
      case 'accelerator':
        return 'fa-rocket';
    }
  }

  getDateDifferenceInMinutes(dateOne: string, datetwo?: string) {
    const d1 = moment(new Date(dateOne));
    let d2;
    if (!datetwo) {
      d2 = moment(new Date());
    } else {
      d2 = moment(new Date(datetwo));
    }
    return d1.diff(d2, 'minutes');
  }

  utcLocalforScheduleMessages(time: string, display: string = 'all') {
    if (!time) {
      return '';
    }
    const date = new Date(this.iso8601Formatter(time));
    switch (display) {
      case 'date':
        return new Intl.DateTimeFormat('en-GB', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric'
        }).format(date);
      case 'time':
        return new Intl.DateTimeFormat('en-US', {
          hour12: true,
          hour: 'numeric',
          minute: 'numeric'
        }).format(date);
    }
  }

  browserTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  getUserRolesForUI(role) {
    switch (role) {
      case 'participant':
        return 'learner';
      case 'mentor':
        return 'expert';
      default:
        return role;
    }
  }

  /**
   * This will check if quill editor content is empty or not.
   * reason we need this is quill will return html tags. if user hit enter without any text quill still send html content.
   * so we can't just check null, ''.
   * ex: - if user just hist enter 2 times without type any word quill will return this.
   * <p><br/></p><p><br/></p>
   * if we only check null or '' user will be able to submit empty values in quill editor.
   * @param editorContent content user typed in quill editor.
   * @returns boolean - if content is only empty html tags or it have text in it.
   */
  isQuillContentEmpty(editorContent: string) {
    if (editorContent.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
      return true;
    }
    return false;
  }

  /**
   * This method will add matcher to the clipboard of the quill editor.
   * And it will make sure every thing user paste will paste as plain text. without any formating that pasting text have.
   * Reason we need this.
   * User may copy and paste some formated text that may contain formats we are not supporting. So if those send as message
   * UI/UX will out. becouse we didn't support them. that's why we make sure we remove formating from text that user paste to text editor.
   * @param quillEditor Quill text editor instance
   * @returns quill clipboard matcher event
   */
  formatQuillClipboard(quillEditor) {
    return quillEditor.clipboard.addMatcher(Node.ELEMENT_NODE, function (node, delta) {
      const plaintext = node.innerText;
      return new Delta().insert(plaintext);
    });
  }
  
  generateXLSX(data, header = null) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { header });
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Metrics');

    // save to file
    return XLSX.writeFile(workbook, 'metrics_report.xlsx', { bookType: 'xlsx', type: 'string' });
  }
}

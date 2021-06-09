import { Component, OnInit, Input } from '@angular/core';
import { Experience, Statistics, Tag, OverviewService } from './overview.service';
import { UtilsService } from '@services/utils.service';
import { PopupService } from '@shared/popup/popup.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  stats = [
    {
      label: 'Live experiences',
      value: '',
      description: 'Displays all experiences which are currently live. An experience is live when the status is moved from "Draft" to "Live" and the content is now visible to all registered users.'
    },
    {
      label: 'Recently active participants and mentors',
      value: '',
      description: 'Reflects the percentage of participants who logged in at least once during the past 7 days out of the total number.'
    },
    {
      label: 'Feedback loops completed',
      value: '',
      description: `
        <p>Reflects the started and completed feedback loops. A feedback loop counts as completed if all stages are completed:</p>
        <ul>
          <li>Assessment submitted by a team</li>
          <li>Mentor reviewed assessment and submitted feedback</li>
          <li>Team members read feedback</li>
        </ul>
        <p>A feedback loop helps participants to process the way they learn in practice and is triggered after certain events (e.g. moderated assessment) which can happen multiple times over the duration of a program.</p>`
    },
    {
      label: 'Feedback quality score',
      value: '',
      description: `This is the average rating given by participants to mentors' feedback based on how helpful they find it (on a scale of 0-100%). It is done at the end of the feedback loop and can happen multiple times during the course of the program (e.g. moderated assessment). `
    }
  ];
  sortList = [
    'created time',
    'participant count',
    'mentor count',
    'recent active participants',
    'recent active mentors',
    'feedback loops completed',
    'on-track/off-track',
    'feedback quality score',
    'issue',
  ];
  sortDesc = true;
  sortBy = this.sortList[0];
  tags: Tag[] = [];
  types = ['all'];
  status = 'all';
  type = 'all';
  @Input() skeletonOnly: boolean;

  loadingExps = false;
  experiencesRaw: Experience[] = [];
  experiences: Experience[] = [];
  remainingExperiences: Experience[] = [];

  constructor(
    private service: OverviewService,
    private utils: UtilsService,
    private popupService: PopupService,
  ) { }

  ngOnInit() {
    if (this.skeletonOnly) {
      this.loadingExps = true;
      return;
    }
    this.loadExperiences();

    // when experience tags get updated, update the experiences data
    this.utils.getEvent('exp-tags-updated').subscribe(event => {
      if (!this.utils.has(event, 'experience') || !this.utils.has(event, 'tags')) {
        return ;
      }
      this.experiences = this._updateTags(this.experiences, event.experience, event.tags);
      this.experiencesRaw = this._updateTags(this.experiencesRaw, event.experience, event.tags);
      this._getAllTags();
    });

    // when experience get archived/deleted, reload the experiences data
    this.utils.getEvent('exps-reload').subscribe(event => {
      this.loadExperiences();
    });
  }

  loadExperiences() {
    this.loadingExps = true;
    this.service.getExperiences().subscribe(res => {
      // reformat tags from string[] to Tag[]
      this.experiencesRaw = res;
      // get all tags
      this._getAllTags();
      // get all types
      this._getAllTypes();
      this.filterAndOrder();
      this._refreshLiveExpStats();
      this.loadingExps = false;
    });
  }

  private _getAllTypes() {
    const typeCounts: any = {};
    this.experiencesRaw.forEach(exp => {
      if (typeCounts[exp.type]) {
        typeCounts[exp.type]++;
      } else {
        typeCounts[exp.type] = 1;
      }
    });
    this.types = [...['all'], ...Object.keys(typeCounts).sort((a, b) => {
      if (typeCounts[a] > typeCounts[b]) {
        return -1;
      }
      if (typeCounts[a] < typeCounts[b]) {
        return 1;
      }
      return 0;
    })];
  }

  loadMore(event) {
    setTimeout(
      () => {
        this._renderExperiences(false);
        event.target.complete();
      },
      500
    );
  }

  private _renderExperiences(init = true) {
    const maxExp = 7;
    if (init) {
      // only display 7 experiences at once
      this.remainingExperiences = [];
      if (this.experiences.length > maxExp) {
        this.remainingExperiences = this.experiences.splice(maxExp, this.experiences.length - maxExp);
      }
    } else {
      // load 7 more experiences
      if (this.remainingExperiences.length <= maxExp) {
        this.experiences = [...this.experiences, ...this.remainingExperiences];
        this.remainingExperiences = [];
      } else {
        this.experiences = [...this.experiences, ...this.remainingExperiences.splice(0, maxExp)];
      }
    }
  }

  /**
   * Given experiences raw data, get all tags and the count for each of them
   */
  private _getAllTags() {
    this.tags = [];
    this.experiencesRaw.forEach(exp => {
      exp.tags.forEach(t => {
        const index = this.tags.findIndex(tt => t === tt.name);
        if (index < 0) {
          this.tags.push({
            name: t,
            count: 1,
            active: false
          });
        } else {
          this.tags[index].count += 1;
        }
      });
    });
  }

  private _calculateTags() {
    this.tags.forEach(t => t.count = 0);
    this.experiences.forEach(exp => {
      exp.tags.forEach(t => {
        const index = this.tags.findIndex(tt => t === tt.name);
        if (index > -1) {
          this.tags[index].count += 1;
        }
      });
    });
    this.tags = [...this.tags];
  }

  private _updateTags(experiences: Experience[], experience: Experience, tags: string[]) {
    return experiences.map(exp => {
      if (exp.uuid === experience.uuid) {
        exp.tags = tags;
      }
      return exp;
    });
  }

  filterAndOrder() {
    this.experiences = JSON.parse(JSON.stringify(this.experiencesRaw));
    this._filterByTag();
    this._filterByStatus();
    this._filterByType();
    this._sort();
    this._calculateTags();
    this._calculateStatistics();
    this._renderExperiences();
  }

  private _filterByTag() {
    const activeTags = this.tags.filter(t => t.active).map(t => t.name);
    if (!activeTags.length) {
      return;
    }
    this.experiences = this.experiences.filter(exp => exp.tags.find(t => activeTags.includes(t)));
  }

  private _filterByStatus() {
    if (this.status === 'all') {
      this.experiences = this.experiences.filter(exp => exp.status !== 'archived');
      return;
    }
    this.experiences = this.experiences.filter(exp => exp.status === this.status);
  }

  private _filterByType() {
    if (this.type === 'all') {
      return;
    }
    this.experiences = this.experiences.filter(exp => exp.type === this.type);
  }

  private _sort() {
    const index = this.sortList.findIndex(s => s === this.sortBy);
    switch (index) {
      case 0:
        if (!this.sortDesc) {
          this.experiences.reverse();
        }
        break;

      case 1:
        this.experiences.sort((a, b) => {
          if (this.sortDesc) {
            return a.statistics.registeredUserCount.participant > b.statistics.registeredUserCount.participant ? -1 : 1;
          }
          return a.statistics.registeredUserCount.participant < b.statistics.registeredUserCount.participant ? -1 : 1;
        });
        break;

      case 2:
        this.experiences.sort((a, b) => {
          if (this.sortDesc) {
            return a.statistics.registeredUserCount.mentor > b.statistics.registeredUserCount.mentor ? -1 : 1;
          }
          return a.statistics.registeredUserCount.mentor < b.statistics.registeredUserCount.mentor ? -1 : 1;
        });
        break;

      case 3:
        this.experiences.sort((a, b) => {
          if (this.sortDesc) {
            return a.statistics.activeUserCount.participant > b.statistics.activeUserCount.participant ? -1 : 1;
          }
          return a.statistics.activeUserCount.participant < b.statistics.activeUserCount.participant ? -1 : 1;
        });
        break;

      case 4:
        this.experiences.sort((a, b) => {
          if (this.sortDesc) {
            return a.statistics.activeUserCount.mentor > b.statistics.activeUserCount.mentor ? -1 : 1;
          }
          return a.statistics.activeUserCount.mentor < b.statistics.activeUserCount.mentor ? -1 : 1;
        });
        break;

      case 5:
        this.experiences.sort((a, b) => {
          if (this.sortDesc) {
            return a.statistics.feedbackLoopCompleted > b.statistics.feedbackLoopCompleted ? -1 : 1;
          }
          return a.statistics.feedbackLoopCompleted < b.statistics.feedbackLoopCompleted ? -1 : 1;
        });
        break;

      case 6:
        this.experiences.sort((a, b) => {
          if (this.sortDesc) {
            return a.statistics.onTrackRatio > b.statistics.onTrackRatio ? -1 : 1;
          }
          return a.statistics.onTrackRatio < b.statistics.onTrackRatio ? -1 : 1;
        });
        break;

      case 7:
        this.experiences.sort((a, b) => {
          if (this.sortDesc) {
            return a.statistics.reviewRatingAvg > b.statistics.reviewRatingAvg ? -1 : 1;
          }
          return a.statistics.reviewRatingAvg < b.statistics.reviewRatingAvg ? -1 : 1;
        });
        break;

      case 8:
        this.experiences.sort((a, b) => {
          if (this.sortDesc) {
            return a.todoItemCount > b.todoItemCount ? -1 : 1;
          }
          return a.todoItemCount < b.todoItemCount ? -1 : 1;
        });
        break;
    }
  }

  private _calculateStatistics() {
    let liveExpCount = 0;
    let activeUsers = 0;
    let totalUsers = 0;
    let fbCompleted = 0;
    let fbStarted = 0;
    let reviewRatingAvg = 0;
    this.experiences.forEach(exp => {
      if (exp.status === 'live') {
        liveExpCount ++;
      }
      const stat = exp.statistics;
      activeUsers += stat.activeUserCount.participant + stat.activeUserCount.mentor;
      totalUsers += stat.registeredUserCount.participant + stat.registeredUserCount.mentor;
      fbCompleted += stat.feedbackLoopCompleted;
      fbStarted += stat.feedbackLoopStarted;
      if (reviewRatingAvg === 0) {
        reviewRatingAvg = stat.reviewRatingAvg;
      } else if (stat.reviewRatingAvg > 0) {
        // if stat.reviewRatingAvg <= 0, don't count it for the average
        reviewRatingAvg = (reviewRatingAvg + stat.reviewRatingAvg) / 2;
      }
    });
    this.stats[0].value = liveExpCount.toString();
    this.stats[1].value = totalUsers ? `${ Math.round(activeUsers * 100 / totalUsers) }%` : '0%';
    this.stats[2].value = fbStarted ? `${ fbCompleted }/${ fbStarted }` : '0/0';
    this.stats[3].value = `${ Math.round(reviewRatingAvg * 100) }%`;
  }

  private _refreshLiveExpStats() {
    const uuids = this.experiencesRaw.filter(e => ['live', 'draft'].includes(e.status)).map(e => e.uuid);
    this.service.getExpsStatistics(uuids).subscribe(res => {
      if (!res) {
        return;
      }
      res.forEach(exp => {
        // update both experiencesRaw and experiences
        const expRawIndex = this.experiencesRaw.findIndex(e => e.uuid === exp.uuid);
        if (expRawIndex >= 0 && !this.utils.isEqual(this.experiencesRaw[expRawIndex].statistics, exp.statistics)) {
          this.experiencesRaw[expRawIndex].statistics = exp.statistics;
        }
        const expIndex = this.experiences.findIndex(e => e.uuid === exp.uuid);
        if (expIndex >= 0 && !this.utils.isEqual(this.experiences[expIndex].statistics, exp.statistics)) {
          this.experiences[expIndex].statistics = exp.statistics;
        }
      });
    });
  }

  /**
   * Deprecated. We are redirecting user to the template library directly now.
   * Keep the code here, so that when we allow user to manually create experience, we can use back this function
   */
  add() {
    this.popupService.showCreateExp();
  }

  createReport() {
    let reportOverview: (string | number)[][] = [
      [
        'Experiences Overview',
        'Value',
        'Description'
      ]
    ];
    this.stats.forEach(s => reportOverview.push([
      s.label,
      s.value,
      s.description.replace(/(<([^>]+)>)/ig, '')
    ]));
    reportOverview = [
      ...reportOverview,
      ...[
        [],
        ['filters'],
        [
          'Status',
          'Type',
          'Sort by',
          'Sort order',
        ],
        [
          this.status,
          this.type,
          this.sortBy,
          this.sortDesc ? 'Desc' : 'Asc'
        ],
        [],
        ['filter by tags'],
        ['selected']
      ],
      ...this.tags.filter(t => t.active).map(a => [a.name]),
    ];

    const reportPerExp: (string | number)[][] = [
      [
        'Experience',
        'Type',
        'Description',
        'Tags list',
        'Status',
        'no. of issues',
        'Enrolment - Total',
        'Enrolment - Admin',
        'Enrolment - Coordinator',
        'Enrolment - Mentor',
        'Enrolment - Participant',
        'Registered - Total',
        'Registered - Admin',
        'Registered - Coordinator',
        'Registered - Mentor',
        'Registered - Participant',
        'On-track',
        'Recent activity - Participant',
        'Recent activity - Mentor',
        'Feedback Loops - Completed',
        'Feedback Loops - Started',
        'Feedback Quality Score',
      ]
    ];
    [...this.experiences, ...this.remainingExperiences].forEach(exp => {
      let totalEnrolled = 0;
      let totalRegistered = 0;
      for (const c of ['admin', 'coordinator', 'mentor', 'participant']) {
        totalEnrolled += exp.statistics.enrolledUserCount[c];
        totalRegistered += exp.statistics.registeredUserCount[c];
      }
      reportPerExp.push([
        exp.name,
        exp.type,
        exp.description ? exp.description.replace(/(<([^>]+)>)/ig, '') : '',
        exp.tags.join(','),
        exp.status,
        exp.todoItemCount,
        totalEnrolled,
        exp.statistics.enrolledUserCount.admin,
        exp.statistics.enrolledUserCount.coordinator,
        exp.statistics.enrolledUserCount.mentor,
        exp.statistics.enrolledUserCount.participant,
        totalRegistered,
        exp.statistics.registeredUserCount.admin,
        exp.statistics.registeredUserCount.coordinator,
        exp.statistics.registeredUserCount.mentor,
        exp.statistics.registeredUserCount.participant,
        exp.statistics.onTrackRatio < 0 ? '-' : exp.statistics.onTrackRatio.toFixed(2),
        exp.statistics.activeUserCount.participant,
        exp.statistics.activeUserCount.mentor,
        exp.statistics.feedbackLoopCompleted,
        exp.statistics.feedbackLoopStarted,
        exp.statistics.reviewRatingAvg > 1 ? 1 : exp.statistics.reviewRatingAvg,
      ]);
    });

    // generate worksheet
    const ws1: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(reportOverview);
    const ws2: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(reportPerExp);
    // generate workbook and add the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');
    XLSX.utils.book_append_sheet(wb, ws2, 'Reporting per experience');

    // save to file
    XLSX.writeFile(wb, 'report.xlsx');
  }

}

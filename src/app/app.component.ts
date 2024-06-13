import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NavigationEnd, Router } from '@angular/router';
import { UtilsService } from '@services/utils.service';
import { StorageService } from '@services/storage.service';
import { PusherService } from '@shared/pusher/pusher.service';
import { AnalyticsService } from './shared/services/analytics.service';
import { ApolloService } from '@shared/apollo/apollo.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private router: Router,
    public utils: UtilsService,
    private storage: StorageService,
    private pusherService: PusherService,
    private analytics: AnalyticsService,
    private apolloService: ApolloService,
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.utils.getIpLocation();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.analytics.page(event.url);
        const user = this.storage.getUser();
        if (user.uuid) {
          const role = user.role ? user.role : null;
          const userInfo = {
            role: ['admin', 'inst_admin'].includes(role) ? 'author' : role,
            isInstitutionAdmin: role === 'inst_admin',
            institutionUuid: user.institutionUuid ? user.institutionUuid : null,
            institutionName: user.institutionName ? user.institutionName : null
          };
          this.analytics.identify(user.uuid, userInfo);
        } else {
          this.analytics.identify('anonymous');
        }
      }
    });
    let searchParams = null;
    let queryString = '';
    if (window.location.search) {
      queryString =  window.location.search.substring(1);
    } else if (window.location.hash) {
      queryString = window.location.hash.substring(2);
    }
    searchParams = new URLSearchParams(queryString);

    if (searchParams.has('do')) {
      switch (searchParams.get('do')) {
        case 'secure':
          if (searchParams.has('auth_token')) {
            const queries = this.utils.urlQueryToObject(queryString);
            return this.router.navigate(['auth', searchParams.get('auth_token'), queries]);
          }
          break;
      }
    }

    if (searchParams.has('jwt')) {
      const queries = this.utils.urlQueryToObject(queryString);
      return this.router.navigate(['auth/jwt', searchParams.get('jwt'), queries]);
    }
  }

  initializeApp() {
    this.platform.ready().then(async() => {
      // initialise Pusher
      await this.pusherService.initialise();
      this.apolloService.initiateCoreClient();
    });
  }
}

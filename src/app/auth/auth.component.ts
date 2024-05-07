import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { NotificationService } from '@services/notification.service';
import { PusherService } from '@shared/pusher/pusher.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {

  redirect: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notificationService: NotificationService,
    private pusherService: PusherService,
  ) { }

  ngOnInit() {
    this.redirect = this.route.snapshot.paramMap.get('redirect');
    const token = this.route.snapshot.paramMap.get('token');
    // auth token login
    if (token) {
      return this.authService.directLogin(token).subscribe(
        res => this._handleRedirection(),
        err => this._error()
      );
    }

    const jwt = this.route.snapshot.paramMap.get('jwt');
    // jwt login
    if (jwt) {
      return this.authService.jwtLogin(jwt).subscribe(
        res => this._handleRedirection(),
        err => this._error()
      );
    }
    return this._error();
  }

  private async _handleRedirection() {
    switch (this.redirect) {
      case 'progress-only':
        this.router.navigate(['progress-only']);
        break;
      case 'chat-only':
        await this.pusherService.initialise();
        this.router.navigate(['chat-only']);
        break;
      case 'overview-only':
        this.router.navigate(['overview-only']);
        break;
      case 'institution-metrics':
        this.router.navigate(['metrics', 'institution']);
        break;
      case 'experience-metrics':
        this.router.navigate(['metrics', 'experience']);
        break;
      default:
        this.router.navigate(['dashboard']);
        break;
    }
  }

  private _error() {
    this.notificationService.alert({
      message: 'Your link is invalid or expired.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            this.router.navigate(['/error']);
          }
        }
      ]
    });
  }
}

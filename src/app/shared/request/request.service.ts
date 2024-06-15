import { Injectable, Optional, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpParameterCodec } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, concatMap, map } from 'rxjs/operators';
import { UtilsService } from '@services/utils.service';
import { StorageService } from '@services/storage.service';
import { environment } from '@environments/environment';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { urlFormatter } from 'helper';

export class QueryEncoder implements HttpParameterCodec {
  encodeKey(k: string): string {
    return encodeURIComponent(k);
  }

  encodeValue(v: string): string {
    return encodeURIComponent(v);
  }

  decodeKey(k: string): string {
    return decodeURIComponent(k);
  }

  decodeValue(v: string): string {
    return decodeURIComponent(v);
  }
}

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private appkey = environment.appkey;
  private apiUrl = environment.APIEndpoint;
  private apiUrlOld = environment.APIEndpointOld;

  constructor(
    private http: HttpClient,
    private utils: UtilsService,
    private storage: StorageService,
    private router: Router,
    private apollo: Apollo
  ) {}

  /**
   * @param header header values
   */
  appendHeaders(header = {'Content-Type': 'application/json'}) {
    const headers = new HttpHeaders(header);
    return headers;
  }

  /**
   *
   * @param options parameters
   */
  setParams(options) {
    let params: any;
    if (!this.utils.isEmpty(options)) {
      params = new HttpParams();
      this.utils.each(options, (value, key) => {
        params = params.append(key, value);
      });
    }
    return params;
  }

  /**
   *
   * @param endPoint endpoint url
   * @param options  http options
   * @param headers  additional header values
   */
  get(endPoint: string = '', httpOptions?: any): Observable<any> {
    if (!httpOptions) {
      httpOptions = {
        headers: '',
        params: ''
      };
    }
    if (!this.utils.has(httpOptions, 'headers')) {
      httpOptions.headers = '';
    }
    if (!this.utils.has(httpOptions, 'params')) {
      httpOptions.params = '';
    }
    return this.http.get<any>(urlFormatter(this.getPrefixUrl(endPoint), endPoint), {
      headers: this.appendHeaders(httpOptions.headers),
      params: this.setParams(httpOptions.params)
    })
      .pipe(concatMap(response => {
        this._refreshApikey(response);
        return of(response);
      }))
      .pipe(
        catchError((error) => this.handleError(error))
      );
  }

  post(endPoint: string = '', data, httpOptions?: any): Observable<any> {
    if (!httpOptions) {
      httpOptions = {
        headers: '',
        params: ''
      };
    }
    if (!this.utils.has(httpOptions, 'headers')) {
      httpOptions.headers = '';
    }
    if (!this.utils.has(httpOptions, 'params')) {
      httpOptions.params = '';
    }
    return this.http.post<any>(urlFormatter(this.getPrefixUrl(endPoint), endPoint), data, {
      headers: this.appendHeaders(httpOptions.headers),
      params: this.setParams(httpOptions.params)
    })
      .pipe(concatMap(response => {
        this._refreshApikey(response);
        return of(response);
      }))
      .pipe(
        catchError((error) => this.handleError(error))
      );
  }

  delete(endPoint: string = '', httpOptions?: any): Observable<any> {
    if (!httpOptions) {
      httpOptions = {
        headers: '',
        params: ''
      };
    }
    if (!this.utils.has(httpOptions, 'headers')) {
      httpOptions.headers = '';
    }
    if (!this.utils.has(httpOptions, 'params')) {
      httpOptions.params = '';
    }
    return this.http.delete<any>(urlFormatter(this.getPrefixUrl(endPoint), endPoint), {
      headers: this.appendHeaders(httpOptions.headers),
      params: this.setParams(httpOptions.params)
    })
      .pipe(concatMap(response => {
        this._refreshApikey(response);
        return of(response);
      }))
      .pipe(
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Get the api prefix based on api endpoint name
   */
  public getPrefixUrl(endPoint: string) {
    if (endPoint.includes('api/')) {
      return this.apiUrlOld;
    }
    return this.apiUrl;
  }

  public getAppkey() {
    return this.appkey;
  }

  public apiResponseFormatError(msg = '') {
    console.error('API response format error.\n' + msg);
    return;
  }

  handleError(error: HttpErrorResponse) {
    if (isDevMode()) {
      console.error(error); // log to console instead
    }
    // log the user out if jwt expired
    if (this.utils.has(error, 'error.message') && error.error.message === 'Session expired') {
      this.router.navigate(['/logout']);
    }
    // Return the error response data
    return throwError(error.error);
  }

  /**
   * Refresh the apikey (JWT token) if API returns it
   *
   */
  private _refreshApikey(response) {
    if (this.utils.has(response, 'apikey')) {
      this.storage.setUser({apikey: response.apikey});
    }
  }

  // further enhance this for error reporting (piwik)
  private log(message: string) {
    console.log(message);
  }
}

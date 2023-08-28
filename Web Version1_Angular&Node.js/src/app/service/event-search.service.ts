import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom, Subject } from 'rxjs';

declare var Geohash: any;

@Injectable({
  providedIn: 'root',
})
export class EventSearchService {
  constructor(private http: HttpClient) {}

  // private params
  private preGeocodingAPI =
    'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyC2djqPyaFZTIE2jdeoR0It0bQJ_YiZ6bs';

  private eventSearchAPI = 'http://localhost:3000/api/eventSearch/';
  private ticketMasterSuggestAPI =
    'https://app.ticketmaster.com/discovery/v2/suggest';

  private ticketMatsterApiKey = 'qNHGBwrCsREw50tqWDbzj99LyRfEJlc3';

  private eventSearchData: any;
  private eventSearchList = new Subject();
  public eventSearchListOb = this.eventSearchList.asObservable();

  private showTable1 = new Subject();
  public showTable1Ob = this.showTable1.asObservable();

  private dirtyOrNot = new Subject();
  public dirtyOrNotOb = this.dirtyOrNot.asObservable();

  //functions
  async submitHandler(
    keyword: string,
    distance: string,
    category: string,
    location: string,
    isAuto: boolean,
    autoLocation: string
  ) {
    console.log(
      'Key: ' +
        keyword +
        '; Dis: ' +
        distance +
        '; Cat: ' +
        category +
        '; Loc: ' +
        location +
        '; autoDetect: ' +
        isAuto +
        '; autoLocation: ' +
        autoLocation
    );

    let lat;
    let lng;
    let finalLocation;
    if (isAuto) {
      lat = autoLocation.split(',')[0];
      lng = autoLocation.split(',')[1];
      // finalLocation = autoLocation;
      finalLocation = Geohash.encode(lat, lng, 5);
    } else {
      const response$ = this.geoCoding(location);
      const t: any = await lastValueFrom(response$);
      console.log(t);
      if (t['status'] != 'ZERO_RESULTS') {
        lat = t.results[0]['geometry']['location']['lat'];
        console.log(lat);
        lng = t['results'][0]['geometry']['location']['lng'];
        finalLocation = Geohash.encode(lat, lng, 5);
      } else {
        finalLocation = undefined;
      }
    }

    if (finalLocation == undefined) {
      this.eventSearchData = [];
    } else {
      if (category == '') {
        let params = new HttpParams()
          .set('keyword', keyword)
          .set('geoPoint', finalLocation)
          .set('radius', distance)
          .set('unit', 'miles')
          .set('apikey', this.ticketMatsterApiKey);

        const eventSearchResponse$ = this.http.get(this.eventSearchAPI, {
          params: params,
        });
        const tData: any = await lastValueFrom(eventSearchResponse$);
        console.log(tData._embedded);

        if (tData._embedded != undefined) {
          this.eventSearchData = tData._embedded.events;
        } else {
          this.eventSearchData = [];
        }

        console.log(this.eventSearchData);
      } else {
        let params = new HttpParams()
          .set('keyword', keyword)
          .set('geoPoint', finalLocation)
          .set('radius', distance)
          .set('unit', 'miles')
          .set('segmentId', category)
          .set('apikey', this.ticketMatsterApiKey);

        const eventSearchResponse$ = this.http.get(this.eventSearchAPI, {
          params: params,
        });

        const tData: any = await lastValueFrom(eventSearchResponse$);
        console.log(tData._embedded);

        if (tData._embedded != undefined) {
          this.eventSearchData = tData._embedded.events;
        } else {
          this.eventSearchData = [];
        }

        console.log(this.eventSearchData);
      }
    }
    this.eventSearchList.next(this.eventSearchData);

    this.showTable1.next('table');

    this.dirtyOrNot.next(true);
  }

  loadingTable1() {
    this.eventSearchList.next(this.eventSearchData);
  }

  geo_IPLocation() {
    const IPInfoAPI = 'https://ipinfo.io/?token=b2a289d7dc271c';
    return this.http.get(IPInfoAPI);
  }

  geoCoding(loc: string) {
    let geoApiParams = new HttpParams().set('address', loc);
    return this.http.get(this.preGeocodingAPI, { params: geoApiParams });
  }

  ticketMasterSuggest(text: string) {
    let params = new HttpParams()
      .set('keyword', text)
      .set('apikey', this.ticketMatsterApiKey);
    return this.http.get(this.ticketMasterSuggestAPI, { params: params });
  }

  clearButtonSetting() {
    this.dirtyOrNot.next(false);
  }
  //geohash code encode
}

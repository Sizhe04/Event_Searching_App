import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { last, lastValueFrom, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventDetailsService {
  constructor(private http: HttpClient) {}

  private eventDetailsAPI = 'http://localhost:3000/api/eventDetails/';
  private venueDetailsAPI = 'http://localhost:3000/api/venueDetails/';
  private spotifyAPI = 'http://localhost:3000/spotify/search/';
  private albumAPI = 'http://localhost:3000/spotify/album/';

  private ticketMatsterApiKey = 'qNHGBwrCsREw50tqWDbzj99LyRfEJlc3';

  private eventDetails = new Subject();
  public eventDetailsOb = this.eventDetails.asObservable();

  private venueDetails = new Subject();
  public venueDetailsOb = this.venueDetails.asObservable();

  private spotifyData = new Subject();
  public spotifyDataOb = this.spotifyData.asObservable();

  private albumData: Subject<unknown> = new Subject();
  public albumDataOb = this.albumData.asObservable();

  private showTable2 = new Subject();
  public showTableOb = this.showTable2.asObservable();

  private showDetailsCard = new Subject();
  public showDetailsCardOb = this.showDetailsCard.asObservable();

  venues: any;
  details: any;
  spotify: any;
  album: any;

  async getEventDetails(id: string) {
    let params = new HttpParams().set('id', id);
    const responseOb = this.http.get(this.eventDetailsAPI, { params: params });
    this.details = await lastValueFrom(responseOb);
    console.log('Here is eventDetails Data');
    console.log(this.details);

    this.eventDetails.next(this.details);
    console.log(
      this.eventDetailsOb.subscribe((data) => {
        console.log(data);
      })
    );
    this.showDetailsCard.next('card');
  }

  async getVenueDetails(id: string) {
    let params = new HttpParams().set('venueId', id);

    const tData = this.http.get(this.venueDetailsAPI, { params: params });

    this.venues = await lastValueFrom(tData);
    console.log('Here is VenueDetails Data');
    console.log(id);
    console.log(this.venues);
    this.venueDetails.next(this.venues);
  }

  async getSpotifyInfo(name: string) {
    let params = new HttpParams().set('name', name);
    const responseOb = this.http.get(this.spotifyAPI + name);
    // const tData = await lastValueFrom(responseOb);
    this.spotify = await lastValueFrom(responseOb);

    console.log(this.spotify.artists.items[0]);

    this.spotifyData.next(this.spotify.artists.items[0]);
  }

  async getAlbumInfo(artistId: string) {
    let params = new HttpParams().set('artistId', artistId);
    // const responseOb = this.http.get(this.albumAPI, { params: params });
    const responseOb = this.http.get(this.albumAPI + artistId);
    this.album = await lastValueFrom(responseOb);
    // console.log('Here is Album Data');
    // console.log(this.album);

    this.albumData.next(this.album);
  }

  loadAlbumData(artistId: string) {
    this.getAlbumInfo(artistId).then(() => {
      this.albumData.next(this.album);
    });
  }

  async showDetailsCardTable() {
    this.eventDetails.next(this.details);
    if (this.venues != undefined) {
      console.log(this.venues);
      this.venueDetails.next(this.venues);
    }
  }

  backToTable2() {
    this.showTable2.next('table');
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventDetailsService } from '../service/event-details.service';
import { EventSearchService } from '../service/event-search.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
})
export class SearchResultComponent implements OnInit, OnDestroy {
  eventsList: any = [];
  sortedEventsList: any[] = [];

  sbOfSearch: Subscription;

  constructor(
    private eventSearchService: EventSearchService,
    private eventDetailsService: EventDetailsService
  ) {
    this.sbOfSearch = this.eventSearchService.eventSearchListOb.subscribe(
      (data) => {
        console.log(data);
        // if (data === undefined) {
        //   console.log(data === undefined);
        //   this.eventsList = [];
        //   console.log(this.eventsList !== undefined);
        //   console.log(this.eventsList.length);
        // } else {
        //   this.eventsList = data;
        // }
        this.eventsList = data;
        console.log(this.eventsList);
        if (this.eventsList !== undefined && this.eventsList.length > 0) {
          this.sortedEventsList = this.eventsList.sort((a: any, b: any) => {
            if (
              a.dates.start.localDate != undefined &&
              b.dates.start.localDate != undefined &&
              a.dates.start.localTime != undefined &&
              b.dates.start.localTime != undefined &&
              a.dates.start.localDate != 'undefined' &&
              b.dates.start.localDate != 'undefined' &&
              a.dates.start.localTime != 'undefined' &&
              b.dates.start.localTime != 'undefined'
            ) {
              const aDate = new Date(
                a.dates.start.localDate + ' ' + a.dates.start.localTime
              );
              const bDate = new Date(
                b.dates.start.localDate + ' ' + b.dates.start.localTime
              );
              return aDate.getTime() - bDate.getTime();
            } else if (
              a.dates.start.localDate != undefined &&
              b.dates.start.localDate != undefined &&
              a.dates.start.localDate != 'undefined' &&
              b.dates.start.localDate != 'undefined'
            ) {
              const aDate = new Date(a.dates.start.localDate);
              const bDate = new Date(b.dates.start.localDate);
              return aDate.getTime() - bDate.getTime();
            } else {
              return;
            }
          });
        }
        console.log(this.sortedEventsList);
      }
    );
  }

  getEventDetails(id: string, keyword: string) {
    this.eventDetailsService.getEventDetails(id);
    this.eventDetailsService.getVenueDetails(keyword);
    // this.eventDetailsService.getSpotifyInfo(name);
    // this.eventDetailsService.getAlbumInfo('1KCSPY1glIKqW2TotWuXOR');
  }

  ngOnInit(): void {
    console.log(this.eventsList.length);
    this.eventSearchService.loadingTable1();

    // const t = this.getEventDetails('G5vVZ9pntZouz', 'KovZpZAdtaEA');
    // console.log(t);

    // console.log(this.eventsList.length);

    //时间拍排序
  }

  ngOnDestroy(): void {
    this.sbOfSearch.unsubscribe();
  }
}

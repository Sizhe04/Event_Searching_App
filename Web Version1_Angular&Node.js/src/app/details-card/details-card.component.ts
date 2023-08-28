/// <reference types="@types/googlemaps
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
import { response } from 'express';
import { Subscription, forkJoin } from 'rxjs';
import { EventDetailsService } from '../service/event-details.service';
import { FavoritesService } from '../service/favorites.service';

@Component({
  selector: 'app-details-card',
  templateUrl: './details-card.component.html',
  styleUrls: ['./details-card.component.css'],
})
export class DetailsCardComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked
{
  // @ViewChild('textContainer', { static: true })
  // textContainer!: ElementRef<HTMLDivElement>;

  isExpanded_openhours = false;
  isExpanded_general = false;
  isExpanded_child = false;
  isExpandable = true;

  titleName = '';
  date = '';
  artist = '';
  venue = '';
  genres = '';
  priceRanges = '';
  ticketStatus = '';
  buyTicketAtLink = '';
  shareLink = '';
  rightPhotoLink = '';
  keyId = '';

  location: any;

  isDateEnabled = true;
  isArtistEnabled = true;
  isVenueEnabled = true;
  isGenresEnabled = true;
  isPriceRangesEnabled = true;
  isTicketStatusEnabled = true;
  isBuyTicketAtEnabled = true;
  isRightPhotoEnabled = true;

  venueName = '';
  venueAddress = '';
  venuePhoneNumber = '';
  venueOpenHours = '';
  venueGeneralRule = '';
  venueChildRule = '';

  artistList: Array<string> = [];
  // spotifyDataList: Array<any> = [];
  // artistPhotoLink = '';
  // artistName = '';
  // artistPopularity = '';
  // artistFollowers = '';
  // artistSpotifyLink = '';
  // albumImage0 = '';
  // albumImage1 = '';
  // albumImage2 = '';

  public isNoMusic = true;

  googleMap = false; //showmap

  //showMore
  openHoursShowMore = false;
  generalRuleShowMore = false;
  childRuleShowMore = false;

  //favorites part
  isFavorites = false;

  sbOfDetails: Subscription;
  // sbOfFavor: Subscription;
  sbOfVenues: Subscription;

  sbOfFavorites: Subscription;

  @ViewChild('textContainerOpenhours', { static: false })
  textContainerOpenhours!: ElementRef;
  @ViewChild('textContainerGeneral', { static: false })
  textContainerGeneral!: ElementRef;
  @ViewChild('textContainerChild', { static: false })
  textContainerChild!: ElementRef;

  text = document.querySelector('.text') as HTMLParagraphElement;
  showMoreBtn = document.querySelector('.show-more') as HTMLButtonElement;
  showLessBtn = document.querySelector('.show-less') as HTMLButtonElement;

  mapOptions: google.maps.MapOptions = {
    center: { lat: 38.9987208, lng: -77.2538699 },
    zoom: 14,
  };
  marker = {
    position: { lat: 38.9987208, lng: -77.2538699 },
  };

  constructor(
    private eventDetailsService: EventDetailsService,
    private favoritesService: FavoritesService
  ) {
    //Events Section
    this.sbOfDetails = this.eventDetailsService.eventDetailsOb.subscribe(
      (data) => {
        let responseData: any = data;
        console.log('here is response');
        console.log(responseData);

        //Title
        this.titleName = responseData.name;

        //keyId
        if (responseData.id != undefined) {
          this.keyId = responseData.id;
          console.log(this.keyId);
        }

        //Date
        if (responseData.dates == undefined) {
          this.isDateEnabled = false;
        } else {
          if (responseData.dates.start.localDate == undefined) {
            this.isDateEnabled = false;
          } else {
            this.date = responseData.dates.start.localDate;
          }
        }

        //Artist
        //Details Card 第二个界面在这个操作 待添加
        if (
          responseData._embedded != undefined &&
          responseData._embedded.attractions != undefined &&
          responseData._embedded.attractions[0] != undefined &&
          responseData._embedded.attractions[0].name != undefined
        ) {
          const t = responseData._embedded.attractions;

          // if (t.length == 1) {
          //   this.artist = t[0].name;
          // } else {
          //   this.artist = t[0].name + ' | ' + t[1].name;
          // }

          let len = t.length;
          let i = 0;
          while (len > 1) {
            this.artist = this.artist + t[i].name + ' | ';

            i += 1;
            len -= 1;
          }
          this.artist = this.artist + t[i].name;

          let lenth = t.length;
          let j = 0;
          while (lenth > 0) {
            if (
              t[j].classifications != undefined &&
              t[j].classifications != 'undefined' &&
              t[j].classifications[0] != undefined &&
              t[j].classifications[0] != 'undefined' &&
              t[j].classifications[0].segment != undefined &&
              t[j].classifications[0].segment != 'undefined' &&
              t[j].classifications[0].segment.name != undefined &&
              t[j].classifications[0].segment.name != 'undefined' &&
              t[j].classifications[0].segment.name == 'Music'
            ) {
              this.artistList.push(t[j].name);
            }
            lenth -= 1;
            j += 1;
          }
        } else {
          this.isArtistEnabled = false;
        }
        console.log(this.artistList);
        if (this.artistList.length > 0) {
          this.isNoMusic = false;
          //先只弄第一个，多个后面有时间再改

          for (let i = 0; i < this.artistList.length; i++) {
            this.eventDetailsService.getSpotifyInfo(this.artistList[i]);
          }

          // console.log('循环调取');

          // this.spotifyDataList = [];
          // for (let n = 0; n < this.artistList.length; n++) {
          //   this.eventDetailsService.getSpotifyInfo(this.artistList[n]);
          //   console.log(this.artistList[n]);

          //第一种
          // this.eventDetailsService.spotifyDataOb.subscribe((data) => {
          //   let tResponse: any = data;
          //   tResponse = tResponse.artists.items[0];
          //   if (tResponse != undefined) {
          //     // let tSpotifyObject = {
          //     //   name: tResponse.name,
          //     //   popularity: tResponse.popularity,
          //     //   followers: tResponse.followers,
          //     //   spotifylink: tResponse.external_urls.spotify,
          //     //   imagelink: tResponse.images[0].url,
          //     // };
          //     this.spotifyDataList.push(tResponse);
          //   }
          //   // console.log(`This is ${n} Time`);
          //   // console.log(tResponse);
          //   // console.log(this.spotifyDataList);

          //   this.spotifyDataList = this.spotifyDataList.filter(
          //     (obj, index, arr) => {
          //       return (
          //         arr.findIndex(
          //           (t) => JSON.stringify(t) === JSON.stringify(obj)
          //         ) === index
          //       );
          //     }
          //   );
          //   console.log(Array.isArray(this.spotifyDataList));
          //   console.log(this.spotifyDataList);
          //   console.log(this.spotifyDataList.length);
          //   this.artistPhotoLink =
          //     this.spotifyDataList[0].external_urls.spotify;
          //   console.log(this.artistPhotoLink);
          // });
          // }
          // console.log('循环调取结束');
          // console.log(this.spotifyDataList);
          // console.log(this.spotifyDataList.length);
          // console.log(this.spotifyDataList.includes(this.spotifyDataList[0]));
          // console.log(this.artistPhotoLink);

          //另一种
          // this.spotifyDataList = [];
          // let requests = [];

          // for (let n = 0; n < this.artistList.length; n++) {
          //   const request = this.eventDetailsService.getSpotifyInfo(
          //     this.artistList[n]
          //   );
          //   requests.push(request);
          // }
          // // console.log(
          // //   eventDetailsService.spotifyDataOb.subscribe((data: any) => {
          // //     console.log(data.artists.items);
          // //   })
          // // );

          // let sbOfSpotify: Subscription;
          // sbOfSpotify = forkJoin(eventDetailsService.spotifyDataOb).subscribe(
          //   (responses) => {
          //     console.log(responses);
          //     for (let i = 0; i < responses.length; i++) {
          //       const data = responses[i];
          //       let tResponse: any = data;
          //       tResponse = tResponse.artists.items[0];
          //       if (tResponse != undefined) {
          //         let tSpotifyObject = {
          //           name: tResponse.name,
          //           popularity: tResponse.popularity,
          //           followers: tResponse.followers,
          //           spotifylink: tResponse.external_urls.spotify,
          //           imagelink: tResponse.images[0].url,
          //         };
          //         this.spotifyDataList.push(tSpotifyObject);
          //       }
          //     }

          //     this.spotifyDataList = this.spotifyDataList.filter(
          //       (obj, index, arr) => {
          //         return (
          //           arr.findIndex(
          //             (t) => JSON.stringify(t) === JSON.stringify(obj)
          //           ) === index
          //         );
          //       }
          //     );

          //     console.log(Array.isArray(this.spotifyDataList));
          //     console.log(this.spotifyDataList);
          //     console.log(this.spotifyDataList.length);
          //   }
          // );
        }

        //Venue
        if (
          responseData._embedded != undefined &&
          responseData._embedded.venues != undefined &&
          responseData._embedded.venues[0] != undefined &&
          responseData._embedded.venues[0].name != undefined &&
          responseData._embedded.venues[0].name != 'Undefined'
        ) {
          this.venue = responseData._embedded.venues[0].name;
        } else {
          this.isVenueEnabled = false;
        }

        //Genres
        if (
          responseData.classifications != undefined &&
          responseData.classifications[0] != undefined
        ) {
          const classifications = responseData.classifications[0];
          let a = '';
          let b = '';
          let c = '';
          if (
            classifications.genre != undefined &&
            classifications.genre.name != 'Undefined'
          ) {
            a = classifications.genre.name + ' | ';
          }

          if (
            classifications.segment != undefined &&
            classifications.segment.name != 'Undefined'
          ) {
            b = classifications.segment.name + ' | ';
          }
          if (
            classifications.subGenre != undefined &&
            classifications.subGenre.name != 'Undefined'
          ) {
            c = classifications.subGenre.name;
          }
          if (a == '' && b == '' && c == '') {
            this.isGenresEnabled = false;
          } else {
            this.genres = a + b + c;
          }
        } else {
          this.isGenresEnabled = false;
        }

        //PriceRanges
        if (
          responseData.priceRanges != undefined &&
          responseData.priceRanges[0] != undefined &&
          responseData.priceRanges[0].max != undefined &&
          responseData.priceRanges[0].min != undefined &&
          responseData.priceRanges[0].currency != undefined
        ) {
          if (
            responseData.priceRanges[0].min == responseData.priceRanges[0].max
          ) {
            this.priceRanges = responseData.priceRanges[0].max;
          } else {
            this.priceRanges =
              responseData.priceRanges[0].min +
              ' - ' +
              responseData.priceRanges[0].max;
          }
        } else {
          this.isPriceRangesEnabled = false;
        }

        //Ticket Status
        if (
          responseData.dates != undefined &&
          responseData.dates.status != undefined &&
          responseData.dates.status != 'Undefined'
        ) {
          const sellingStatus = responseData.dates.status.code;
          if (sellingStatus == 'onsale') {
            this.ticketStatus = 'On Sale';
          } else if (sellingStatus == 'offsale') {
            this.ticketStatus = 'Off Sale';
          } else if (sellingStatus == 'cancelled') {
            this.ticketStatus = 'Cancelled';
          } else if (sellingStatus == 'postponed') {
            this.ticketStatus = 'Postponed';
          } else {
            //rescheduled
            this.ticketStatus = 'Rescheduled';
          }
        } else {
          this.isTicketStatusEnabled = false;
        }

        //Buy Ticket At
        if (responseData.url != undefined) {
          this.shareLink = responseData.url;
          this.buyTicketAtLink = responseData.url;
        } else {
          this.isBuyTicketAtEnabled = false;
        }

        //Picture
        if (
          responseData.seatmap != undefined &&
          responseData.seatmap.staticUrl != undefined &&
          responseData.seatmap.staticUrl != 'Undefined'
        ) {
          this.rightPhotoLink = responseData.seatmap.staticUrl;
        } else {
          this.isRightPhotoEnabled = false;
        }
      }
    );

    //Venues Section
    this.sbOfVenues = this.eventDetailsService.venueDetailsOb.subscribe(
      (data) => {
        // console.log(this.marker);
        console.log('here is venueDetails Data');
        console.log(data);
        let responseData: any = data;

        this.googleMap = false;

        //Name
        if (
          responseData.name != undefined &&
          responseData.name != 'undefined'
        ) {
          this.venueName = responseData.name;
        }

        //Address
        if (
          responseData.address != undefined &&
          responseData.address != 'undefined' &&
          responseData.address.line1 != undefined &&
          responseData.address.line1 != 'undefined'
        ) {
          this.venueAddress = responseData.address.line1;
        }

        //Phone NUmber
        if (
          responseData.boxOfficeInfo != undefined &&
          responseData.boxOfficeInfo != 'undefined' &&
          responseData.boxOfficeInfo.phoneNumberDetail != undefined &&
          responseData.boxOfficeInfo.phoneNumberDetail != 'undefined'
        ) {
          const tDetail = responseData.boxOfficeInfo.phoneNumberDetail;
          // console.log(
          //   tDetail.slice(tDetail.indexOf(':') + 1, tDetail.length - 1)

          // );
          this.venuePhoneNumber = tDetail.slice(
            tDetail.lastIndexOf(':') + 1,
            tDetail.length - 1
          );
        }

        //Open HOurs
        if (
          responseData.boxOfficeInfo != undefined &&
          responseData.boxOfficeInfo != 'undefined' &&
          responseData.boxOfficeInfo.openHoursDetail != undefined &&
          responseData.boxOfficeInfo.openHoursDetail != 'undefined'
        ) {
          this.venueOpenHours = responseData.boxOfficeInfo.openHoursDetail;
        }

        //Genreal Rule
        if (
          responseData.generalInfo != undefined &&
          responseData.generalInfo != 'undefined' &&
          responseData.generalInfo.generalRule != undefined &&
          responseData.generalInfo.generalRule != 'undefined'
        ) {
          this.venueGeneralRule = responseData.generalInfo.generalRule;
        }

        //Child RUle
        if (
          responseData.generalInfo != undefined &&
          responseData.generalInfo != 'undefined' &&
          responseData.generalInfo.childRule != undefined &&
          responseData.generalInfo.childRule != 'undefined'
        ) {
          this.venueChildRule = responseData.generalInfo.childRule;
        }

        if (
          responseData.location != undefined &&
          responseData.location != 'undefined'
        ) {
          // this.googleMap = true;
          this.location = responseData.location;
          console.log(this.location.latitude);
          this.mapOptions.center!.lat = Number(this.location.latitude);
          this.mapOptions.center!.lng = Number(this.location.longitude);
          console.log(this.marker);
          this.marker.position.lat = Number(this.location.latitude);
          this.marker.position.lng = Number(this.location.longitude);
          console.log(this.mapOptions);
          console.log(this.marker);
        }
      }
    );

    this.sbOfFavorites = this.favoritesService.favoritesOb.subscribe((data) => {
      this.isFavorites = this.favoritesService.isFavorites(this.keyId);
      console.log(this.isFavorites);
    });
  }

  openHoursToggleShowMore() {
    this.openHoursShowMore = !this.openHoursShowMore;
  }

  generalRuleToggleShowMore() {
    this.generalRuleShowMore = !this.generalRuleShowMore;
  }

  childRuleToggleShowMore() {
    this.childRuleShowMore = !this.childRuleShowMore;
  }

  goBack() {
    this.eventDetailsService.backToTable2();
  }

  showGoogleMap() {
    console.log(this.mapOptions);
    console.log(this.marker);
    this.googleMap = true;
  }

  closeGoogleMap() {
    console.log(this.mapOptions);
    console.log(this.marker);
    this.googleMap = false;
  }

  //Favorites Part
  changeFavoritesStatus() {
    console.log(this.isFavorites);
    this.isFavorites = !this.isFavorites;
    console.log(this.isFavorites);
    if (this.isFavorites) {
      window.alert('Event Added to Favorites!');
      this.favoritesService.addToFavorites(
        this.date,
        this.titleName,
        this.genres,
        this.venue,
        this.keyId
      );
    } else {
      window.alert('Removed from favorites');
      this.favoritesService.removeFromFavorites(this.keyId);
    }
  }

  ngOnInit(): void {
    this.eventDetailsService.showDetailsCardTable();
    this.isFavorites = this.favoritesService.isFavorites(this.keyId);
    console.log(this.isFavorites);
    //one more
  }

  toggleText_open() {
    this.isExpanded_openhours = !this.isExpanded_openhours;

    this.textContainerOpenhours.nativeElement.classList.toggle(
      'text-container-openhours',
      !this.isExpanded_openhours
    );
    console.log(this.textContainerOpenhours.nativeElement.classList);
  }

  toggleText_general() {
    this.isExpanded_general = !this.isExpanded_general;

    this.textContainerGeneral.nativeElement.classList.toggle(
      'text-container-general',
      !this.isExpanded_general
    );
    console.log(this.textContainerGeneral.nativeElement.classList);
  }

  toggleText_child() {
    this.isExpanded_child = !this.isExpanded_child;
    this.textContainerChild.nativeElement.classList.toggle(
      'text-container-child',
      !this.isExpanded_child
    );
    console.log(this.textContainerChild.nativeElement.classList);
  }

  // checkExpandability() {
  //   this.isExpandable =
  //     this.textContainer.nativeElement.offsetHeight >
  //     this.textContainer.nativeElement.clientHeight;
  // }

  ngAfterViewInit(): void {}

  ngAfterViewChecked() {
    // console.log(this.textContainer.nativeElement);
    // this.checkExpandability();
    // setTimeout(() => {
    //   this.checkExpandability();
    // });
  }

  ngOnDestroy(): void {
    this.sbOfDetails.unsubscribe();
    this.sbOfVenues.unsubscribe();
    //one more
  }
}

import { Component } from '@angular/core';
import { EventDetailsService } from '../service/event-details.service';
import { Subscription, forkJoin } from 'rxjs';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-artist-details-card',
  templateUrl: './artist-details-card.component.html',
  styleUrls: ['./artist-details-card.component.css'],
})
export class ArtistDetailsCardComponent {
  sbOfAlbum: Subscription;
  sbOfSpotify: Subscription;
  spotifyInfoList: any = [];
  spotifyInfoListLength = 0;

  constructor(private eventDetailsService: EventDetailsService) {
    //Artist/Teams Section

    this.sbOfSpotify = this.eventDetailsService.spotifyDataOb.subscribe(
      (data) => {
        console.log('here is spotify Data');
        let responseData: any = data;
        console.log(responseData);

        let spotifyInfoData = {
          artistPopularity: responseData.popularity,
          artistName: responseData.name,
          artistPhotoLink: responseData.images[0].url,
          artistFollowers: responseData.followers.total.toLocaleString(),
          artistSpotifyLink: responseData.external_urls.spotify,
          artistId: responseData.id,
          albumImage0: '',
          albumImage1: '',
          albumImage2: '',
        };
        this.spotifyInfoList.push(spotifyInfoData);

        this.eventDetailsService.getAlbumInfo(responseData.id);
        console.log(this.spotifyInfoList);
        // if (
        //   responseData.artists != undefined &&
        //   responseData.artists.items != undefined
        // ) {
        //   responseData = responseData.artists.items[0];
        //   console.log(responseData);
        //   this.artistSpotifyLink = responseData.external_urls.spotify;
        //   // console.log(this.artistSpotifyLink);
        //   this.artistName = responseData.name;
        //   this.artistPopularity = responseData.popularity;
        //   this.artistFollowers = responseData.followers.total;
        //   this.artistFollowers = this.artistFollowers.toLocaleString();
        //   this.artistPhotoLink = responseData.images[0].url;
        //   //调用albumapi
        //   if (responseData.id != undefined) {
        //     this.eventDetailsService.loadAlbumData(responseData.id);
        //     console.log('已调用Album');
        //     console.log(responseData.id);
        //   }
        // }

        this.spotifyInfoListLength = this.spotifyInfoList.length;
      }
    );

    this.sbOfAlbum = this.eventDetailsService.albumDataOb.subscribe((data) => {
      this.spotifyInfoList.sort(
        (a: any, b: any) => b.artistPopularity - a.artistPopularity
      );

      console.log(this.spotifyInfoList);
      // console.log(this.spotifyInfoListLength);
      console.log('Here is Album Data');
      let responseData: any = data;
      if (responseData.items != undefined) {
        console.log(responseData);
        responseData = responseData.items;
        let id = responseData[0].artists[0].id;
        let index = this.spotifyInfoList.findIndex(
          (item: any) => item.artistId === id
        );
        console.log(index);

        if (
          responseData[0] != undefined &&
          responseData[0].images != undefined &&
          responseData[0].images[0] != undefined
        ) {
          this.spotifyInfoList[index].albumImage0 =
            responseData[0].images[0].url;
        }
        if (
          responseData[1] != undefined &&
          responseData[1].images != undefined &&
          responseData[1].images[0] != undefined
        ) {
          this.spotifyInfoList[index].albumImage1 =
            responseData[1].images[0].url;
        }
        if (
          responseData[2] != undefined &&
          responseData[2].images != undefined &&
          responseData[2].images[0] != undefined
        ) {
          this.spotifyInfoList[index].albumImage2 =
            responseData[2].images[0].url;
        }

        // this.spotifyInfoListLength = this.spotifyInfoListLength - 1;
      }

      // if (responseData.items != undefined) {
      //   responseData = responseData.items;
      //   console.log(responseData);
      //   if (
      //     responseData[0] != undefined &&
      //     responseData[0].images != undefined &&
      //     responseData[0].images[0] != undefined
      //   ) {
      //     this.albumImage0 = responseData[0].images[0].url;
      //   }
      //   if (
      //     responseData[1] != undefined &&
      //     responseData[1].images != undefined &&
      //     responseData[1].images[0] != undefined
      //   ) {
      //     this.albumImage1 = responseData[1].images[0].url;
      //   }
      //   if (
      //     responseData[2] != undefined &&
      //     responseData[2].images != undefined &&
      //     responseData[2].images[0] != undefined
      //   ) {
      //     this.albumImage2 = responseData[2].images[0].url;
      //   }
      // }
      console.log(this.spotifyInfoList);
    });
  }
}

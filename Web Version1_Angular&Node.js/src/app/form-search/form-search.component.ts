import { Component } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, ReactiveFormsModule } from '@angular/forms';
import {
  finalize,
  distinctUntilChanged,
  tap,
  filter,
  debounceTime,
  switchMap,
} from 'rxjs/operators';

import { EventSearchService } from '../service/event-search.service';

declare var Geohash: any;

@Component({
  selector: 'app-form-search',
  templateUrl: './form-search.component.html',
  styleUrls: ['./form-search.component.css'],
})
export class FormSearchComponent implements OnInit {
  @ViewChild('searchForm') searchForm!: NgForm;

  keywordInput: any = '';
  keywordInputControl = new FormControl();
  waiting = false;
  shownKeywords: any;
  category = 'Default';
  locationInput = '';
  autoDetectLocation = false;
  autoLocation = '';
  eventSearchList = [];

  constructor(private eventSearchService: EventSearchService) {}

  inputWord() {
    console.log(this.keywordInput);
    console.log(this.keywordInputControl.value);
    this.keywordInput = this.keywordInput;
  }

  ngOnInit(): void {
    console.log(this.searchForm);
    this.eventSearchService.geo_IPLocation().subscribe((data: any) => {
      // let dataPos = data.loc.split(',');
      this.autoLocation = data.loc;
      // console.log(this.autoLocation);
    });

    // this.eventSearchService
    //   .geoCoding('NewYork University')
    //   .subscribe((data: any) => {
    //     console.log(data);
    //   });
    this.keywordInputControl.valueChanges
      .pipe(
        filter((res) => {
          return res !== null && res.length >= 1;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.shownKeywords = [];
          this.waiting = true;
        }),
        switchMap((value) =>
          this.eventSearchService.ticketMasterSuggest(value).pipe(
            finalize(() => {
              this.waiting = false;
            })
          )
        )
      )
      .subscribe((data: any) => {
        this.shownKeywords = [];
        let usefulWords = data._embedded.attractions;
        // console.log(usefulWords);
        for (let word of usefulWords) {
          // console.log(word.name);
          this.shownKeywords.push(word.name);
        }
      });
  }

  async submitHandler() {
    this.eventSearchList = [];
    const inputValue = this.searchForm.value;

    //keyword
    let keyword = this.keywordInputControl.value;

    //distance
    let radius = 10;
    if (inputValue.distanceInput !== null && inputValue.distanceInput !== '') {
      radius = inputValue.distanceInput;
    }
    let distance = radius.toString();

    //category
    let category = '';
    if (inputValue.categoryInput === 'Music') {
      category = 'KZFzniwnSyZfZ7v7nJ';
    } else if (inputValue.categoryInput === 'Sports') {
      category = 'KZFzniwnSyZfZ7v7nE';
    } else if (inputValue.categoryInput === 'Arts & Theatre') {
      category = 'KZFzniwnSyZfZ7v7na';
    } else if (inputValue.categoryInput === 'Film') {
      category = 'KZFzniwnSyZfZ7v7nn';
    } else if (inputValue.categoryInput === 'Miscellaneous') {
      category = 'KZFzniwnSyZfZ7v7n1';
    } else if (inputValue.categoryInput === 'Default') {
      category = '';
    }

    //location
    let location = inputValue.locationInput || '';

    //boolean
    let isAuto = this.autoDetectLocation;

    let autoLocation = this.autoLocation;

    this.eventSearchService.submitHandler(
      keyword,
      distance,
      category,
      location,
      isAuto,
      autoLocation
    );
  }

  autoDetectLocationInput() {
    this.locationInput = '';
  }

  clearForm() {
    this.searchForm.reset({ categoryInput: this.category });
    this.keywordInputControl.reset();

    this.eventSearchService.clearButtonSetting();
  }
}

import { Component, OnInit } from '@angular/core';
import { EventDetailsService } from '../service/event-details.service';
import { EventSearchService } from '../service/event-search.service';

@Component({
  selector: 'app-tosearch',
  templateUrl: './tosearch.component.html',
  styleUrls: ['./tosearch.component.css'],
})
export class TosearchComponent implements OnInit {
  isDirty: any;
  showContent: any;
  constructor(
    private eventSearchService: EventSearchService,
    private eventDetailsService: EventDetailsService
  ) {
    this.eventSearchService.dirtyOrNotOb.subscribe((data) => {
      this.isDirty = data;
    });
    this.eventSearchService.showTable1Ob.subscribe((data) => {
      this.showContent = data;
    });
    this.eventDetailsService.showDetailsCardOb.subscribe((data) => {
      this.showContent = data;
    });
    this.eventDetailsService.showTableOb.subscribe((data) => {
      this.showContent = data;
    });
  }

  ngOnInit(): void {}
}

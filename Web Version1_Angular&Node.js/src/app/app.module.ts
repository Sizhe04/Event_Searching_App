import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FormSearchComponent } from './form-search/form-search.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { TosearchComponent } from './tosearch/tosearch.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { DetailsCardComponent } from './details-card/details-card.component';
import { MatTabsModule } from '@angular/material/tabs';
import { GoogleMapsModule } from '@angular/google-maps';
import { FavoritesFormComponent } from './favorites-form/favorites-form.component';
// import { TestComponent } from './test/test.component';
// import { DebugComponent } from './debug/debug.component';
import { AppRoutingModule } from './app-routing.module';
import { ArtistDetailsCardComponent } from './artist-details-card/artist-details-card.component';

@NgModule({
  declarations: [
    AppComponent,
    FormSearchComponent,
    NavBarComponent,
    TosearchComponent,
    SearchResultComponent,
    DetailsCardComponent,
    FavoritesFormComponent,
    ArtistDetailsCardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatTabsModule,
    GoogleMapsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

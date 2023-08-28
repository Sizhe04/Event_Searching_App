import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FavoritesService } from '../service/favorites.service';

@Component({
  selector: 'app-favorites-form',
  templateUrl: './favorites-form.component.html',
  styleUrls: ['./favorites-form.component.css'],
})
export class FavoritesFormComponent implements OnInit {
  favoritesList: any = [];
  sbOfFavorites: Subscription;

  constructor(private favoritesService: FavoritesService) {
    this.sbOfFavorites = this.favoritesService.favoritesOb.subscribe((data) => {
      this.favoritesList = data;

      console.log('Favorites LIst:', this.favoritesList);
    });
  }

  ngOnInit(): void {
    this.favoritesService.refreshFavorites();
  }

  removeFavorites(keyId: string): void {
    console.log(keyId);
    window.alert('Removed from favorites');
    this.favoritesService.removeFromFavorites(keyId);
    console.log(this.favoritesList);
  }
}

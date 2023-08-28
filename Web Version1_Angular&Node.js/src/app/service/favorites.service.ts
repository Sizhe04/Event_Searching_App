import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favorites = new Subject();
  public favoritesOb = this.favorites.asObservable();

  ls = localStorage;
  constructor() {}
  addToFavorites(
    date: string,
    event: string,
    category: string,
    venue: string,
    keyId: string
  ) {
    let newFavorites = {
      date: date,
      event: event,
      category: category,
      venue: venue,
      keyId: keyId,
    };
    this.ls.setItem(keyId, JSON.stringify(newFavorites));
    this.refreshFavorites();
  }

  removeFromFavorites(keyId: string) {
    console.log(this.ls);
    this.ls.removeItem(keyId);
    console.log(this.ls);
    this.refreshFavorites();
  }

  refreshFavorites() {
    var list = [],
      keyIds = Object.keys(localStorage),
      len = keyIds.length;

    while (len--) {
      list.push(JSON.parse(localStorage.getItem(keyIds[len])!));
    }
    console.log(list);
    this.favorites.next(list);
  }

  isFavorites(keyId: string) {
    return this.ls.getItem(keyId) != null;
  }
}

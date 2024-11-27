import {inject, Injectable, signal} from '@angular/core';

import { Place } from './place.model';
import {catchError, map, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  httpClient = inject(HttpClient);
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places', "Something went wrong when fetching available places!")
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places', "Something went wrong when fetching your favorite places!")
      .pipe(tap({
        next: (userPlaces) => this.userPlaces.set(userPlaces),
      }))
  }

  addPlaceToUserPlaces(place: Place) {
    this.userPlaces.update(prevPlaces => [...prevPlaces, place]);//update automatically user places

    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId: place.id,
    });
  }

  removeUserPlace(place: Place) {}
  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{ places: Place[] }>(url)
      .pipe(
        map(data => data.places),
        catchError((error) => {
            console.log(error);
            return throwError(
              () =>
                new Error(errorMessage)
            )
          }
        )
      )
  }
}

import {inject, Injectable, signal} from '@angular/core';

import { Place } from './place.model';
import {catchError, map, throwError} from "rxjs";
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
  }

  addPlaceToUserPlaces(placeId: string) {
    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId
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

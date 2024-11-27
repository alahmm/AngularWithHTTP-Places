import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import {Place} from "../place.model";
import {catchError, map, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.isFetching.set(true);
    const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/user-places')
      .pipe(
        map(data => data.places),
        catchError((error) => {
            console.log(error);
            return throwError(
              () =>
                new Error("Something went wrong when fetching your favorite places!")
            )
          }
        )
      )
      .subscribe({
        next: (places) => {
          this.places.set(places);
        },
        error: (error: Error) => {
          this.error.set(error.message);
        },
        complete: () => {//the complete is important to guarantee that the request is done
          this.isFetching.set(false);
        }
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }
}

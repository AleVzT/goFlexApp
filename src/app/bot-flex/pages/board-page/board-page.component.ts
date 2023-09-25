import { Component, OnInit } from '@angular/core';
import { FlexServices } from '../../services/flex.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, interval, catchError, throwError } from 'rxjs';
import { concatMap, finalize } from 'rxjs/operators';
import { Offers } from '../../interfaces/block.interface';

@Component({
  selector: 'app-board-page',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.css']
})
export class BoardPageComponent implements OnInit  {

  public offersList: Offers[] = [];
  public loading = true;
  private intervalSubscription: Subscription;
  private offerIdsSet = new Set<string>();
  
  constructor(
    private flexServices: FlexServices,
    private snackbar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.intervalSubscription = interval(3000)
    .pipe(
      concatMap(() => this.flexServices.getOffersAll().pipe(
        catchError((error) => {
          this.loading = false;
          this.showSnackBar( error.error.error )
          return throwError('Hubo un error al obtener ofertas'); 
        })
      ))
    )
    .subscribe(filteredServiceArray => {
      filteredServiceArray.forEach((newOffer: Offers) => {
        if (!this.offerIdsSet.has(newOffer.offerId)) {
          this.offerIdsSet.add(newOffer.offerId);
          this.offersList.push(newOffer);
        }
        this.loading = false;
      });
    });
  }

  showSnackBar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }

  ngOnDestroy() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }
}

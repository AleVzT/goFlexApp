import { Component, OnInit, computed } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FlexServices } from '../../services/flex.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseOn } from '../../interfaces/user.interface';
import { WareHouse } from '../../interfaces/block.interface';
import { catchError, Subscription, interval, switchMap } from 'rxjs';


@Component({
  selector: 'app-controller-page',
  templateUrl: './controller-page.component.html',
  styles: [
  ]
})
export class ControllerPageComponent implements OnInit  {
  ofertas: any[] = [];
  private subscription: Subscription;
  private serviceCalled = false;

  public filterForm = new FormGroup({
    minHourPrice: new FormControl<number>(0),
    baseOn: new FormControl<BaseOn>( BaseOn.HOURS ),
    startDate: new FormControl(new Date()),
    fromTime: new FormControl<string>(''),
    maxHoursBlock: new FormControl<number>(0),
    delay: new FormControl<number>(0),
    startRunningAt: new FormControl<string>(''), 
    depositos: new FormControl<string[]>([]), 
  });

  public warehouses: WareHouse[] = [];

  public baseOn = [
    { id: 'HOURS', desc: 'Hour' },
    { id: 'BLOCK', desc: 'Block' }
  ]

  constructor(
    private flexServices: FlexServices,
    private snackbar: MatSnackBar,
  ) { }


  get currentFilter (): any {
    const filters = this.filterForm.value as any;
    return filters;
  }

  ngOnInit(): void {
    this.getService();
    const wasServiceCalled = localStorage.getItem('serviceCalled');
    if (wasServiceCalled === 'true') {
      this.serviceCalled = true;
      this.getOffersList();
    }
  }

  getService(): void {
    this.flexServices.getServiceAll()
      .pipe(
        catchError( error => {
        /*   this.showSnackBar(error.error.error); */
          return [];
        })
      )
      .subscribe( warehouse => this.warehouses = warehouse );
  }

  showSnackBar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 15000,
    })
  }

  getStatusStyle(data: any): any {
    if (data.status === 'accepted') {
      return {
        color: '#28a745',
        padding: '5px 10px',
        'border-radius': '5px'
      };
    } else if (data.status === 'refused') {
      return {
        color: '#dc3545',
        padding: '5px 10px',
        'border-radius': '5px'
      };
    }
    return {
      // Estilo predeterminado
      padding: '5px 10px',
      'border-radius': '5px'
    };
  }

  onSubmit(): void {
    this.flexServices.getOffersWithFilters(this.currentFilter)
      .subscribe((response: any) => {
        this.showSnackBar(response.msj);
        this.serviceCalled = true;
        localStorage.setItem('serviceCalled', 'true');
        this.getOffersList();
      }, (err) => {
        this.showSnackBar(err.error.msj);
    });
  }

  getOffersList() {
    this.subscription = interval(4000) // 4000ms = 4 segundos
      .pipe(
        switchMap(() => this.flexServices.getOffersList())
      )
      .subscribe(
        (response: any) => {
          this.ofertas = response;
        },
        (err) => {
          this.showSnackBar(err.error.msj);
        }
      );
  }

  ngOnDestroy() {
     // Verifica si la suscripción existe antes de intentar desuscribirte
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  resetForm() {
    this.flexServices.getStopSearchOffers()
      .subscribe((response: any) => {
        this.showSnackBar(response.msj);
        localStorage.removeItem('serviceCalled');
        this.ngOnDestroy();
      },
      (err) => {
        this.showSnackBar(err.error.msj);
        localStorage.removeItem('serviceCalled');
      }
    );
  }

}

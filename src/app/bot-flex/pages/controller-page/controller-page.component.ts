import { Component, OnInit, computed } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FlexServices } from '../../services/flex.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseOn } from '../../interfaces/user.interface';
import { WareHouse } from '../../interfaces/block.interface';
import { catchError } from 'rxjs';


@Component({
  selector: 'app-controller-page',
  templateUrl: './controller-page.component.html',
  styles: [
  ]
})
export class ControllerPageComponent implements OnInit  {
  ofertas: any[] = [];
  ofertasAceptadas: any[] = [];

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
/*     const loading = this.flexServices.llamadasEnProgreso;
    if(loading) {
      this.showSnackBar('You already have a search in progress, if you configure a new one the previous one is deleted!');
    } */
  }

  getService(): void {
    this.flexServices.getServiceAll()
      .pipe(
        catchError( error => {
          this.showSnackBar(error.error.error);
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

  getStatusStyle(oferta: any): any {
    if (this.ofertasAceptadas !== undefined) {
      const ofertaAceptada = this.ofertasAceptadas.find(
        aceptada => aceptada.id === oferta.offerId
      );
      if (ofertaAceptada) {
        return {
          color: '#28a745',
          padding: '5px 10px',
          'border-radius': '5px'
        };
      }
    }
    return {
      color: '#dc3545',
      padding: '5px 10px',
      'border-radius': '5px'
    };
  }

  getStatusText(oferta: any): string[] {
    const resultados: string[] = [];
  
    if (this.ofertasAceptadas !== undefined && Array.isArray(this.ofertasAceptadas)) {
      this.ofertasAceptadas.forEach(aceptada => {
        if (aceptada.id === oferta.offerId) {
          resultados.push('Accepted');
        }
      });
    }
  
    if (resultados.length === 0) {
      resultados.push('Rejected');
    }
  
    return resultados;
  }

  onSubmit(): void {
    this.flexServices.realizarLlamadasHastaResultadoDeseado(this.currentFilter)
      .subscribe((response) => {
       // Verifica si hay ofertas en la respuesta y las almacena
       if (response.offersList) {
        // Filtra duplicados y actualiza el listado de ofertas
        const nuevasOfertas = response.offersList.filter((oferta: { offerId: any; }) => 
          !this.ofertas.find(o => o.offerId === oferta.offerId)
        );
        this.ofertas = this.ofertas.concat(nuevasOfertas);
      }

      // Verifica si hay ofertas aceptadas en la respuesta y las almacena
      if (response.offersAccept && Array.isArray(response.offersAccept.offer)) {
        this.ofertasAceptadas =  this.ofertasAceptadas.concat(response.offersAccept.offer);
      }
    });
  }

  resetForm() {
    this.flexServices.detenerLlamadasRepetidas();
  }

}

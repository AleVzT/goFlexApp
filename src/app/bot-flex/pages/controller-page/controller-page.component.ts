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
    const loading = this.flexServices.llamadasEnProgreso;
    if(loading) {
      this.showSnackBar('You already have a search in progress, if you configure a new one the previous one is deleted!');
    }
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

  onSubmit(): void {
    this.flexServices.realizarLlamadasHastaResultadoDeseado(this.currentFilter)
      .subscribe(() => console.log(),
      (error) => this.showSnackBar('You already have a search in progress, if you configure a new one the previous one is deleted!'));
  }

  resetForm() {
    this.filterForm.reset(); // Esto limpiará todos los campos del formulario
    this.flexServices.detenerLlamadasRepetidas();
  }

}

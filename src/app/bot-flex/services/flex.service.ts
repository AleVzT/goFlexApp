import { Injectable, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environments } from '../../../environments/environments';
import { Observable, Subject, interval, catchError, throwError } from 'rxjs';
import { takeUntil, mergeMap, takeWhile, finalize } from 'rxjs/operators';
import { WareHouse, Offers } from '../interfaces/block.interface';
import { AuthServices } from '../../auth/services/auth.service';

@Injectable({providedIn: 'root'})
export class FlexServices {
  private unsubscribe$ = new Subject<void>();
  private baseUrl: string = environments.baseUrl;
  public llamadasEnProgreso = false;
  


  constructor(
    private http: HttpClient,
    private AuthServices: AuthServices,
  ) { }
  public user = computed( () => this.AuthServices.currentUser() );
  getServiceAll(): Observable<WareHouse[]> {
    const url = `${ this.baseUrl}/fish/getAllServiceAreas`;
    const token = localStorage.getItem('token');
  
    const headers = new HttpHeaders()
      .set('x-token', `${ token }`);

    return this.http.get<WareHouse[]>( url, { headers })
  }

  getOffersAll(): Observable<Offers[]> {
    const url = `${ this.baseUrl}/fish/getAllOffers`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('x-token', `${ token }`);

    return this.http.get<Offers[]>( url, { headers })
  }

  realizarLlamadasHastaResultadoDeseado(filters: any): Observable<any> {
    if( this.llamadasEnProgreso) {
      this.detenerLlamadasRepetidas();
    }
    this.llamadasEnProgreso = true;

    // return this.getOffersWithFilters(filters);

    return interval(2000).pipe(
      takeUntil(this.unsubscribe$),
      mergeMap(() => this.getOffersWithFilters(filters))
    ).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.llamadasEnProgreso = false;
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
      })
    );
  }



  getOffersWithFilters(filters: any): Observable<{ ok: boolean; msj: string }> {
    const url = `${ this.baseUrl}/fish/processOffer`;
    const token = localStorage.getItem('token');
    const bodyRequest = {
      "minBlockRate": filters.baseOn === 'BLOCK' ? filters.minHourPrice : null,
      "minPayRatePerHour": filters.baseOn === 'HOURS' ? filters.minHourPrice : null,
      "arrivalBuffer": filters.delay,
      "desiredWareHouses": filters.depositos || [],
      "startDate": filters.startDate,
      "startRunningAt": filters.startRunningAt,
      "maxHoursBlock": filters.maxHoursBlock,
      "fromTime": filters.fromTime
    }
    const headers = new HttpHeaders()
      .set('x-token', `${ token }`);
    
    // return this.http.post<{ ok: boolean; msj: string }>(url, bodyRequest, { headers })
    return this.http.post<{ ok: boolean; msj: string }>(url, bodyRequest, { headers }).pipe(
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        return throwError(error);
      })
    );
  }

  detenerLlamadasRepetidas() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.llamadasEnProgreso = false;
  }

}
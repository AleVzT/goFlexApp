import { Injectable, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environments } from '../../../environments/environments';
import { Observable, Subject, interval, catchError, throwError, BehaviorSubject } from 'rxjs';
import { takeUntil, mergeMap, takeWhile, finalize } from 'rxjs/operators';
import { WareHouse, Offers } from '../interfaces/block.interface';
import { AuthServices } from '../../auth/services/auth.service';

@Injectable({providedIn: 'root'})
export class FlexServices {
  private baseUrl: string = environments.baseUrl;
  private llamadasEnProgresoSubject = new BehaviorSubject<boolean>(false);
  private unsubscribe$ = new Subject<void>();
  llamadasEnProgreso$ = this.llamadasEnProgresoSubject.asObservable();

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
    const unsubscribe$ = new Subject<void>();
    this.llamadasEnProgresoSubject.next(true);

    return interval(2000).pipe(
      takeUntil(this.unsubscribe$),
      mergeMap(() => this.getOffersWithFilters(filters)),
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        return throwError(error);
      }),
      finalize(() => {
        this.llamadasEnProgresoSubject.next(false);
        unsubscribe$.next();
        unsubscribe$.complete(); // Completa el unsubscribe$ actual
      })
    );
  }

  detenerLlamadasRepetidas() {
    this.unsubscribe$.next();
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

}
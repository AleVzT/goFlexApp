import { Injectable, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environments } from '../../../environments/environments';
import { Observable, Subject, catchError, throwError, BehaviorSubject } from 'rxjs';
import { take, finalize } from 'rxjs/operators';
import { WareHouse, Offers } from '../interfaces/block.interface';
import { AuthServices } from '../../auth/services/auth.service';

@Injectable({providedIn: 'root'})
export class FlexServices {
  private baseUrl: string = environments.baseUrl;
  
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

  getOffersWithFilters(filters: any) {
    const url = `${this.baseUrl}/fish/processOffer`;
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
    };
    const headers = new HttpHeaders().set('x-token', `${token}`);

    return this.http.post(url, bodyRequest, { headers });
  }

 
  getStopSearchOffers() {
    const url = `${this.baseUrl}/fish/stopProcess`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('x-token', `${token}`);
    
    return this.http.get(url, { headers })
  }

  getOffersList() {
    const url = `${this.baseUrl}/fish/getOffersList`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('x-token', `${token}`);
    
    return this.http.get(url, { headers })
  }

}
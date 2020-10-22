import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { switchMap, tap, } from 'rxjs/operators';
import { ValCurs, Valute } from '../models/data.interface';
declare const require: any;

const xml2js = require('xml2js');

@Injectable({
  providedIn: 'root'
})
export class ExchargeService {

  private requests = [
    { url: 'https://www.cbr-xml-daily.ru/daily_json.js', responseType: 'json' },
    { url: 'https://www.cbr-xml-daily.ru/daily_utf8.xml', responseType: 'text' }
  ];

  private index = 0;
  private testRequest$ = new Subject();

  constructor(private http: HttpClient) {}

  public testData() {
    try {
      return this.getData(this.requests[0]);
    } catch(error) {
      console.log(error)
      try {
        return this.getData(this.requests[1]);
      } catch(error) {
        console.log(error);
      }
    }
  }

  // ALTERNATIVE METHOD WITH SUBJECT

  // public testData() {
  //   return this.testRequest$.pipe(
  //     switchMap(() => this.getData(this.requests[this.index])),
  //     tap(({error}) => {
  //       if (error) {
  //         if (this.index < this.requests.length) {
  //           this.index++;
  //         } else {
  //           this.index = 0;
  //         }
  //       }

  //       this.testRequest$.next();
  //     })
  //   );
  // }

  private getData({url, responseType}): Observable<any> {
    switch (responseType) {
      case 'json':
        return this.getDataJson(url);
      case 'text':
        return this.getDataXml(url);
    }
  }

  private getDataJson(url: string): Observable<Valute> {
    return this.http.get<Valute>(url);
  }

  private getDataXml(url: string): Observable<ValCurs> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      switchMap(async xml => await this.parseXmlToJson(xml))
    );
  }

  private async parseXmlToJson(xml): Promise<ValCurs> {
    return await xml2js
      .parseStringPromise(xml, { explicitArray: false })
      .then(response => response);
  }

}

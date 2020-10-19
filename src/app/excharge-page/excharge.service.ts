import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, } from 'rxjs/operators';
import { ValCurs, Valute } from '../models/data.interface';
declare const require: any

const xml2js = require('xml2js');

@Injectable({
  providedIn: 'root'
})
export class ExchargeService {

  private jsonUrl =  'https://www.cbr-xml-daily.ru/daily_json.js';
  private xmlUrl = 'https://www.cbr-xml-daily.ru/daily_utf8.xml';

  constructor(private http: HttpClient) {}

  public getData() {
    try {
      return this.getDataJson();
    } catch(error) {
      console.log(error)
      try {
        return this.getDataXml();
      } catch(error) {
        console.log(error);
      }
    }
  }

  public getDataJson(): Observable<Valute> {
    return this.http.get<Valute>(this.jsonUrl);
  }

  public getDataXml(): Observable<ValCurs> {
    return this.http.get(this.xmlUrl, { responseType: 'text' }).pipe(
      switchMap(async xml => await this.parseXmlToJson(xml))
    );
  }

  private async parseXmlToJson(xml): Promise<ValCurs> {
    return await xml2js
      .parseStringPromise(xml, { explicitArray: false })
      .then(response => response);
  }

}

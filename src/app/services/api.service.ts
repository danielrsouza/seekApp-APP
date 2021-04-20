import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }
      /**
     * Realiza um post para o endereco da api
     * @param endpoint
     * @param data
     * @param formData
     */
       public post(endpoint: string, data: any, formData = false): Observable<any> {

        let headerRequest = {'Content-Type': 'application/json; charset=utf-8'};
        if (formData) {
            headerRequest['Content-Type'] = 'x';
        }
        return this.httpClient.post(`${environment.api_url}${endpoint}`, data, {headers: headerRequest});
    }

    /**
     * Realiza um get para o endereco da api
     * @param endpoint
     */
    public get(endpoint: string): Observable<any> {
        
        return this.httpClient.get(`${environment.api_url}${endpoint}`);

    }

    public put(endpoint: string, data): Observable<any> {
        return this.httpClient.put(`${environment.api_url}${endpoint}`, data);
    }

    public delete(endpoint: string): Observable<any> {
        return this.httpClient.delete(`${environment.api_url}${endpoint}`);
    }
}

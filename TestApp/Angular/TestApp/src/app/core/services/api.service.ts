import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {Person} from '../models/person';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://localhost:56224/api/people';

  constructor(private http: HttpClient) { }

  getPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(this.baseUrl);
  }
  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.baseUrl}/${id}`);
  }
  deletePerson(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);

  }
  updatePerson(id: number, person: Person): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, person);

  }
  createPerson(person: Person): Observable<any> {
    return this.http.post(this.baseUrl, person);
  }

  postFile(fileToUpload: File): Observable<any> {
    const endpoint = this.baseUrl+'/import';
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post(endpoint, formData);
  }
}

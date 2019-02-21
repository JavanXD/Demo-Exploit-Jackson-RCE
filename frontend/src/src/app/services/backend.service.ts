import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  private static convertToByteArray(base64String: string): ArrayBufferLike {
    const binary_string =  window.atob(base64String);
    const len = binary_string.length;
    const bytes = new Uint8Array( len );
    for (let i = 0; i < len; i++)        {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  public saveUser(newUser: any): Observable<Object> {
    return this.http.post(environment.apiURL + '/users', newUser);
  }

  public getBook(bookId: number): Observable<Object> {
    return this.http.get(environment.apiURL + '/book/' + bookId, {responseType: 'text'});
    // responseType?: "arraybuffer" | "blob" | "text" | "json"
  }

  public saveBook(newBook: string): Observable<Object> {
    const blob = new Blob([BackendService.convertToByteArray(newBook)], { type: 'application/octet-stream' });
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/octet-stream'
      })
    };
    return this.http.put(environment.apiURL + '/book/', blob, httpOptions);
  }

  public upload(files: Set<File>): {[key: string]: Observable<number>} {
    // this will be the our resulting map
    const status = {};

    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', environment.apiURL + '/files/upload', formData, {
        reportProgress: true
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {

          // calculate the progress percentage
          const percentDone = Math.round(100 * event.loaded / event.total);

          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {

          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
        }
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    // return the map of progress.observables
    return status;
  }

}

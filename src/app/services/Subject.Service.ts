import { Component, OnInit,Input,Injectable } from '@angular/core';
import { environment } from '../../environments/environment.js';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AnimationKeyframesSequenceMetadata } from '@angular/animations';
@Injectable({
providedIn: 'root'
})
export class Subject_Service {
constructor(private http: HttpClient)
{
const httpOptions = {
headers: new HttpHeaders({
'Content-Type':  'application/json'
})
};
}
Save_Subject(Subject_)
{
return this.http.post(environment.BasePath +'Subject/Save_Subject/',Subject_);}
private extractData(res: Response)
{
let body = res;
return body || { };
}
Search_Subject(Subject_Name):Observable<any>
{
var Search_Data={'Subject_Name':Subject_Name}
 return this.http.get(environment.BasePath +'Subject/Search_Subject/',{params:Search_Data});}
Delete_Subject(Subject_Id)
{
 return this.http.get(environment.BasePath +'Subject/Delete_Subject/'+Subject_Id);}
Get_Subject(Subject_Id)
{
 return this.http.get(environment.BasePath +'Subject/Get_Subject/'+Subject_Id);}

qr(accountId: string) {
  return this.http.get<{ qr: string }>(`${environment.BasePath}qr/${accountId}`);
}

getWhatsappStatus(accountId: string) {
  return this.http.get<{ ready: boolean }>(`${environment.BasePath}status/${accountId}`);
}

sendMessage(accountId: string, payload: { number: string; message: string }) {
  return this.http.post(`${environment.BasePath}send-message/${accountId}`, {
    number: payload.number,
    message: payload.message,
  });
}

initAccount(accountId: string) {
  return this.http.post(`${environment.BasePath}init`, { accountId });
}


}


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UsuarioModel } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url ='https://identitytoolkit.googleapis.com/v1/accounts'
  private api = 'AIzaSyAQjTa3CF3vjL9xE_9c05HxYd6rtW-tYV8 '

  userToken: string

  //crear usuario
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //login
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor(private http: HttpClient) {
    this.leerToke()
   }


  logout(){
    localStorage.removeItem('token');
  }

  login(usuario: UsuarioModel){
    const autData ={
      ...usuario,
      returnSecureToken: true
    }

    return this.http.post(
      `${this.url}:signInWithPassword?key=${this.api}`,
      autData
    ).pipe(
      map(
        resp =>{
          this.guardarToken(resp['idToken'])
          return resp
        }
      )
    )
  }

  nuevoUsuario(usuario: UsuarioModel){
    const autData ={
      ...usuario,
      returnSecureToken: true
    }

    return this.http.post(
      `${this.url}:signUp?key=${this.api}`,
      autData
    ).pipe(
      map(
        resp =>{
          this.guardarToken(resp['idToken'])
          return resp
        }
      )
    )
  }


  private guardarToken(idToken: string){
    this.userToken= idToken;
    localStorage.setItem('token',idToken)

    let hoy= new Date()
    hoy.setSeconds(3600)

    localStorage.setItem('expira', hoy.getTime().toString())
  }


  leerToke(){
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token')
    }else{
      this.userToken= ''
    }

    return this.userToken;
  }

  autenticado(): boolean{

    if(this.userToken.length < 2){
      return false;
      
    }

    const expira = Number (localStorage.getItem('expira'));
    const ExpiraDate = new Date();
    ExpiraDate.setTime(expira)

    if(ExpiraDate > new Date()){
      return true
    }else{
      return false
    }

    return this.userToken.length>2
  }
}

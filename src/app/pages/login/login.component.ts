import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel = new UsuarioModel();

  recordar = false;

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    if(localStorage.getItem('email')){
     this.usuario.email = localStorage.getItem('email')
     this.recordar = true
    }

  }

  login(form: NgForm){
    if(form.invalid){return}

    Swal.fire({
      allowOutsideClick: false,
      icon:'info',
      text:'Espere porfavor'
    })
    Swal.showLoading();

    this.auth.login(this.usuario)
      .subscribe(resp=>{
        console.log(resp)
        Swal.close()

        if(this.recordar){
          localStorage.setItem('email', this.usuario.email);
        }


        this.router.navigateByUrl('/home')
      }, (err)=>{
        console.log(err.error.error.message)
        Swal.fire({
          allowOutsideClick: false,
          icon:'error',
          title:'error al autenticar',
          text:err.error.error.message
        })
      })
  }

}

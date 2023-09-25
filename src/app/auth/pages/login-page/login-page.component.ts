import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { AuthServices } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: [
  ]
})
export class LoginPageComponent {

  constructor( 
    private authService: AuthServices,
    private router: Router,
    private fb: FormBuilder
  ){}

  public myForm: FormGroup = this.fb.group({
    email: ['', [ Validators.required, Validators.email ]],
    password: ['', [ Validators.required, Validators.minLength(6) ]],
  });

  onLogin(): void {

    if ( this.myForm.invalid ) return;

    const { email, password } = this.myForm.value;
    this.authService.login( email, password )
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (msg) => {
          Swal.fire('Error', msg, 'error');
        }
      })

  }
  
  // 
}

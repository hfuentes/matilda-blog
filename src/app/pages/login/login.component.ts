import { Component, OnInit } from '@angular/core'
import { AuthService } from 'src/app/services/auth.service'
import { Router } from '@angular/router'
import { Error, ErrorType } from 'src/app/components/error-handler/error-handler.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  state: {
    loading: boolean
    error: Error
  } = {
      loading: false,
      error: null
    }

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login() {
    this.state.loading = true
    this.state.error = null
    this.authService.doGoogleLogin().then(() => {
      this.router.navigate(['/home']).then(() => this.state.loading = false)
    }).catch(err => {
      this.state.loading = false
      this.state.error = err.code === 'not-found' ?
        new Error("Antes de entrar debes pedir que te agreguen a la lista de correos autorizados.", ErrorType.info) :
        new Error("Oops! Ha ocurrido un error, por favor intenta más tarde.")
    })
  }

}

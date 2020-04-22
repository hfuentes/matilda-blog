import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { environment } from '../environments/environment'

// firebase
import { AngularFireModule } from '@angular/fire'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFireAuthGuard } from '@angular/fire/auth-guard'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireStorageModule } from '@angular/fire/storage'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoginComponent } from './pages/login/login.component'
import { NavbarComponent } from './components/navbar/navbar.component'
import { HomeComponent } from './pages/home/home.component'
import { AdminComponent } from './pages/admin/admin.component'
import { ErrorHandlerModule } from './components/error-handler/error-handler.module';
import { PregnancyCalculatorComponent } from './components/pregnancy-calculator/pregnancy-calculator.component';
import { ArchiveComponent } from './components/archive/archive.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    AdminComponent,
    PregnancyCalculatorComponent,
    ArchiveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ErrorHandlerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    AngularFireAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

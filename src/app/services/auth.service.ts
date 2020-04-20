import { Injectable, ɵSWITCH_COMPILE_INJECTABLE__POST_R3__ } from '@angular/core'
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators'
import { Router } from '@angular/router';
import { User } from '../domains/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<any>

  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afStore.doc<User>('users/' + user.uid).valueChanges()
        } else {
          return of(null)
        }
      })
    )
  }

  doGoogleLogin() {
    return new Promise(async (resolve, reject) => {
      try {
        const credential = await this.afAuth.signInWithPopup(new auth.GoogleAuthProvider())
        const userRef: AngularFirestoreDocument<User> = this.afStore.doc('users/' + credential.user.uid)
        await userRef.update({
          uid: credential.user.uid,
          email: credential.user.email,
          photoURL: credential.user.photoURL,
          displayName: credential.user.displayName
        })
        return resolve()
      } catch (err) {
        await this.afAuth.signOut()
        return reject(err)
      }
    })
  }

  async doLogout() {
    await this.afAuth.signOut()
    return this.router.navigate(['/'])
  }

  async updateUserData({ uid, email, photoURL, displayName }: User) {
    const userRef: AngularFirestoreDocument<User> = this.afStore.doc('users/' + uid)
    return await userRef.update({
      uid,
      email,
      photoURL,
      displayName
    })
  }
}

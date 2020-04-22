import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root'
})
export class ParamsService {

  constructor(
    private afStore: AngularFirestore
  ) { }

  async getLastPeriod() {
    return new Promise<Date>((resolve, reject) => {
      return this.afStore.collection('params').doc('lastperiod').get().toPromise().then(doc => {
        resolve((new firebase.firestore.Timestamp(doc.data().date.seconds, doc.data().date.nanoseconds)).toDate())
      }).catch(reject)
    })
  }
}

import { Component, OnInit } from '@angular/core'
import { Error } from '../error-handler/error-handler.component'
import { AngularFireStorage } from '@angular/fire/storage'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { RxwebValidators } from '@rxweb/reactive-form-validators'
import * as uuid from 'uuid'

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {

  state: {
    upload: {
      show: boolean
      loading: boolean
      error: Error
      success: boolean
      form: FormGroup
      allowedExtensions: Array<string>
    },
    images: {
      loading: boolean,
      error: Error,
      folder: Array<{
        week: number,
        images: Array<{
          url: string,
          isCollapsed: boolean
        }>
      }>
    }
  } = {
      upload: {
        show: false,
        loading: false,
        error: null,
        success: false,
        form: new FormGroup({}),
        allowedExtensions: ['jpg', 'png', 'jpeg']
      },
      images: {
        loading: false,
        error: null,
        folder: []
      }
    }

  constructor(
    private storage: AngularFireStorage,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.state.upload.form = this.formBuilder.group({
      week: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(45)
      ]),
      image: new FormControl(null, [
        Validators.required,
        RxwebValidators.image({ maxHeight: 5000, maxWidth: 5000 }),
        RxwebValidators.extension({ extensions: this.state.upload.allowedExtensions })
      ])
    })
    this.getEcosFolder()
  }

  uploadCancel() {
    this.state.upload.show = false
    this.state.upload.form.controls.week.reset()
    this.state.upload.form.controls.image.reset()
  }

  onSubmitUpload() {
    if (this.state.upload.form.valid) {
      this.state.upload.loading = true
      this.state.upload.error = null
      this.state.upload.success = false
      const ref = this.storage.ref('ecos/' + this.getStrWeekDir() + '/' + this.getImageFileName())
      ref.put(this.state.upload.form.value.image[0]).then(data => {
        this.state.upload.loading = false
        this.state.upload.success = true
        console.log(data)
      }).catch(err => {
        this.state.upload.loading = false
        this.state.upload.error = new Error()
        console.error(err)
      })
    }
  }

  private getStrWeekDir(): string {
    var s = "00" + this.state.upload.form.value.week
    return s.substr(s.length - 2)
  }

  private getImageFileName(): string {
    var s = this.state.upload.form.value.image[0].name.split('.')
    return uuid.v4() + '.' + s[s.length - 1]
  }

  async getEcosFolder() {
    try {
      this.state.images.loading = true
      this.state.images.error = null
      const ref = this.storage.ref('ecos')
      const folders = await ref.listAll().toPromise()
      for (let i = 0; i < folders.prefixes.length; i++) {
        const folderRef = folders.prefixes[i];
        const images = await folderRef.listAll()
        let imageUrlList: Array<any> = []
        for (let i = 0; i < images.items.length; i++) {
          const imageItem = images.items[i];
          const imageUrl = await imageItem.getDownloadURL()
          imageUrlList.push({ url: imageUrl, isCollapsed: true })
        }
        this.state.images.folder.push({
          week: parseInt(folderRef.name),
          images: imageUrlList
        })
      }
      this.state.images.loading = false
    } catch (err) {
      this.state.images.loading = false
      this.state.images.error = new Error()
      console.error(err)
    }
  }

}

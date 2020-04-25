import { Component, OnInit } from '@angular/core'
import { Error } from '../error-handler/error-handler.component'
import { AngularFireStorage } from '@angular/fire/storage'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { RxwebValidators } from '@rxweb/reactive-form-validators'
import * as uuid from 'uuid'
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service'
import { splitAtColon } from '@angular/compiler/src/util'
import { ImageCroppedEvent } from 'ngx-image-cropper'

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
      allowedExtensions: Array<string>,
      event: any
    },
    images: {
      loading: boolean,
      error: Error,
      folder: Array<{
        week: number,
        images: Array<{
          url: string,
          isCollapsed: boolean,
          path: string,
          loading: boolean,
          error: Error
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
        allowedExtensions: ['jpg', 'png', 'jpeg'],
        event: ''
      },
      images: {
        loading: false,
        error: null,
        folder: []
      }
    }

  constructor(
    private storage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private confirmService: ConfirmationDialogService
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
      ]),
      imageCrop: new FormControl('', [Validators.required])
    })
    this.getEcosFolder()
  }

  uploadCancel() {
    this.state.upload.show = false
    this.state.upload.form.controls.week.reset()
    this.state.upload.form.controls.image.reset()
    this.state.upload.form.controls.imageCrop.setValue('')
    this.state.upload.event = ''
  }

  onSubmitUpload() {
    if (this.state.upload.form.valid) {
      this.state.upload.loading = true
      this.state.upload.error = null
      this.state.upload.success = false
      const path = 'ecos/' + this.getStrWeekDir() + '/' + this.getImageFileName()
      const ref = this.storage.ref(path)
      // upload from base64 image crop
      ref.putString(this.state.upload.form.value.imageCrop, 'data_url').then(() => {
        // get url to add image on forlder array
        return ref.getDownloadURL().toPromise()
      }).then(url => {
        const week = this.state.upload.form.value.week
        const item = this.state.images.folder.find(x => x.week == week)
        const image = { url, path, isCollapsed: true, loading: false, error: null }
        item ? item.images.push(image) : this.state.images.folder.push({ week, images: [image] })
        this.uploadCancel()
        this.state.upload.loading = false
        this.state.upload.success = true
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
    //var s = this.state.upload.form.value.image[0].name.split('.')
    return uuid.v4() + '.png'// + s[s.length - 1]
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
          imageUrlList.push({
            url: imageUrl,
            isCollapsed: true,
            path: imageItem.fullPath
          })
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

  removeImageFile(image, item) {
    image.loading = true
    image.error = null
    this.storage.ref(image.path).delete().toPromise().then(() => {
      const folderIndex = this.state.images.folder.indexOf(item)
      const imageIndex = this.state.images.folder[folderIndex].images.indexOf(image)
      this.state.images.folder[folderIndex].images.splice(imageIndex, 1)
      if (this.state.images.folder[folderIndex].images.length == 0) this.state.images.folder.splice(folderIndex, 1)
      image.loading = false
    }).catch(err => {
      image.error = new Error()
      image.loading = false
      console.error(err)
    })
  }

  removeImage(image, item) {
    this.confirmService.confirm('Oops!', '¿Estás seguro de eliminar esta foto de Matilda?').then(confirmed => {
      image.isCollapsed = true
      if (!confirmed) return
      this.removeImageFile(image, item)
    }).catch(() => {
      image.isCollapsed = true
    })
  }

  imageCropped(event: ImageCroppedEvent) {
    this.state.upload.form.controls.imageCrop.setValue(event.base64)
  }

}

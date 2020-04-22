import { Component, OnInit } from '@angular/core'
import { Error } from '../error-handler/error-handler.component'
import { AngularFireStorage } from '@angular/fire/storage'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { FileValidatorsService } from 'src/app/services/file-validators.service'


@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {

  state: {
    upload: {
      show: boolean,
      loading: boolean
      error: Error,
      form: FormGroup
      allowedExtensions: Array<string>
      data: FormData
    }
  } = {
      upload: {
        show: false,
        loading: false,
        error: null,
        form: new FormGroup({}),
        allowedExtensions: ['jpg', 'png'],
        data: new FormData()
      }
    }

  constructor(
    private storage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private fileValidators: FileValidatorsService
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
        this.fileValidators.fileExtensions(this.state.upload.allowedExtensions)
      ])
    })
  }

  uploadFile(event) {
    const file = event.target.files[0]
    const filePath = '01'
    const ref = this.storage.ref(filePath)
    const task = ref.put(file)
  }

  uploadCancel() {
    this.state.upload.show = false
    this.state.upload.form.controls.week.reset()
    this.state.upload.form.controls.image.reset()
  }

  onSubmitUpload() {
    if (this.state.upload.form.valid) {
      let image = this.state.upload.data.get('image')
      console.log(image['name'])
      // const ref = this.storage.ref(this.state.upload.form.value.week)
      // const task = ref.put(this.state.upload.form.value.image)
    }
  }

  imageChange(event) {
    if (event.target.files.length > 0) {
      this.state.upload.data.delete('image');
      this.state.upload.data.append('image', event.target.files[0], event.target.files[0].name)
    }
  }

}

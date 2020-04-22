import { Component, OnInit } from '@angular/core';
import { Error } from '../error-handler/error-handler.component';

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
      error: Error
    }
  } = {
    upload: {
      show: false,
      loading: false,
      error: null
    }
  }

  constructor() { }

  ngOnInit() { }

}

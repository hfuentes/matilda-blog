import { Component, OnInit, Injectable } from '@angular/core';
import { ParamsService } from 'src/app/services/params.service';
import { Error } from '../error-handler/error-handler.component';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';
import { I18n, CustomDatepickerI18n } from 'src/app/app.component';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pregnancy-calculator',
  templateUrl: './pregnancy-calculator.component.html',
  styleUrls: ['./pregnancy-calculator.component.scss'],
  providers: [
    DatePipe,
    I18n,
    {
      provide: NgbDatepickerI18n,
      useClass: CustomDatepickerI18n
    }
  ]
})
export class PregnancyCalculatorComponent implements OnInit {

  lastPeriod: Date = new Date(2019, 10, 9)
  dueDate: Date = new Date()
  dueDays: number = 0
  percentage: number = 0
  weeks: number = 0
  days: number = 0

  state: {
    loading: boolean
    error: Error
    date: {
      loading: boolean
      error: Error
      form: FormGroup
      show: boolean
    }
  } = {
      loading: false,
      error: null,
      date: {
        loading: false,
        error: null,
        form: new FormGroup({}),
        show: false
      }
    }

  constructor(
    private paramsService: ParamsService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private confirmService: ConfirmationDialogService
  ) { }

  ngOnInit() {
    this.state.loading = true
    this.state.error = null
    this.paramsService.getLastPeriod().then(date => {
      this.lastPeriod = date
      this.setForm()
      this.calculate()
      this.state.loading = false
    }).catch(() => {
      this.state.error = new Error()
      this.state.loading = false
    })
  }

  private setForm() {
    this.state.date.form = this.formBuilder.group({
      date: new FormControl({
        year: Number(this.datePipe.transform(this.lastPeriod, 'yyyy')),
        month: Number(this.datePipe.transform(this.lastPeriod, 'MM')),
        day: Number(this.datePipe.transform(this.lastPeriod, 'dd'))
      }, [Validators.required])
    })
  }

  private calculate() {
    this.calcDueDate()
    this.calcDueDays()
    this.calcPercentage()
    this.calcWeeks()
  }

  private calcDueDate() {
    let newDate = new Date(this.lastPeriod.getTime())
    newDate.setDate(newDate.getDate() + 280)
    this.dueDate = newDate
  }

  private calcDueDays() {
    this.dueDays = (this.dueDate.getTime() - (new Date()).getTime()) / (1000 * 3600 * 24)
  }

  private calcPercentage() {
    this.percentage = (280 - this.dueDays) / 280
  }

  private calcWeeks() {
    this.weeks = (280 - this.dueDays) / 7
  }

  getDateForm(): Date {
    return new Date(this.state.date.form.controls.date.value.year,
      this.state.date.form.controls.date.value.month - 1,
      this.state.date.form.controls.date.value.day)
  }

  onSubmitDate() {
    if (this.state.date.form.valid) {
      this.confirmService.confirm("Cambio de fecha!", "La fecha de última regla se cambiará de " +
        this.datePipe.transform(this.lastPeriod, 'dd/MM/yyyy') + ' a ' +
        this.datePipe.transform(this.getDateForm(), 'dd/MM/yyyy') + '. Estás seguro de hacer este cambio?',
        'Si, cambiar', 'Volver').then(confirmed => {
          if (confirmed) {
            this.state.date.loading = true
            this.state.date.error = null
            this.paramsService.setLastPeriod(this.getDateForm()).then(() => {
              this.state.date.show = false
              this.state.date.loading = false
              this.ngOnInit()
            }).catch(err => {
              this.state.date.loading = false
              this.state.date.error = new Error()
              console.error(err)
            })
          }
        })
    }
  }

  formDateCancel() {
    this.state.date.form.controls.date.setValue({
      year: Number(this.datePipe.transform(this.lastPeriod, 'yyyy')),
      month: Number(this.datePipe.transform(this.lastPeriod, 'MM')),
      day: Number(this.datePipe.transform(this.lastPeriod, 'dd'))
    })
    this.state.date.show = false
  }
}

import { Component, OnInit } from '@angular/core';
import { ParamsService } from 'src/app/services/params.service';
import { Error } from '../error-handler/error-handler.component';

@Component({
  selector: 'app-pregnancy-calculator',
  templateUrl: './pregnancy-calculator.component.html',
  styleUrls: ['./pregnancy-calculator.component.scss']
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
      show: boolean
    }
  } = {
    loading: false,
    error: null,
    date: {
      show: false
    }
  }

  constructor(
    private paramsService: ParamsService
  ) { }

  ngOnInit() {
    this.state.loading = true
    this.state.error = null
    this.paramsService.getLastPeriod().then(date => {
      this.lastPeriod = date
      this.calculate()
      this.state.loading = false
    }).catch(() => {
      this.state.error = new Error()
      this.state.loading = false
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
}

import { Component, OnInit, Inject } from '@angular/core';
import { Calendar } from 'app/shared/models/calendar';
import { CalendarService } from '../calendar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { WeekendUpdated } from 'app/shared/models/weekendUpdated';
import { Holiday } from 'app/shared/models/holiday';
import { DayOfWeek } from 'app/shared/models/weekend';
import { CalendarMonth } from 'app/shared/models/calendarMonth';

@Component({
  selector: 'app-view-calendar',
  templateUrl: './view-calendar.component.html',
  styleUrls: ['./view-calendar.component.scss']
})
export class ViewCalendarComponent implements OnInit {
 
  public calendar : Calendar;
  public id : number;

  public displayedColumnsWeekends: any;
  public displayedColumnsHolidays: any;
  public displayedColumnsMonths: any;

  public dataSourceWeekends: MatTableDataSource<WeekendUpdated>;
  public dataSourceHolidays: MatTableDataSource<Holiday>;
  public dataSourceMonths: MatTableDataSource<Holiday>;


  public weekends : WeekendUpdated[];
  public holidays : Holiday[];     
  public months : CalendarMonth[];     

  constructor(
    private calendarService : CalendarService,
    private route : ActivatedRoute,
    ) { 
      this.dataSourceWeekends = new MatTableDataSource<WeekendUpdated>([]);
      this.dataSourceHolidays = new MatTableDataSource<Holiday>([]);
      this.dataSourceMonths = new MatTableDataSource<CalendarMonth>([]);

    }


  
    getDisplayedColumnsHolidays() {
      return ['number','name','startDate','endDate','duration'];
    }

    getDisplayedColumnsWeekends() {
      return ['number','name','startDay','endDay','activationStartDate', 'activationEndDate'];
    }

    getDisplayedColumnsMonths() {
      return ['number','ordre','name','duration'];
    }

   
    ngOnInit(): void {
      this.id = this.route.snapshot.params['iiid'];   
      this.getCalendar();
      this.getMonths();
      this.getWeekend();
      this.getHolidays();

      this.displayedColumnsMonths=this.getDisplayedColumnsMonths();
      this.displayedColumnsWeekends=this.getDisplayedColumnsWeekends();
      this.displayedColumnsHolidays=this.getDisplayedColumnsHolidays();

      this.getCalendarById();
    }

    getCalendarById(): void {
      this.calendarService.getItem(this.id).subscribe((dataView: any) => {
        this.calendar = dataView;
        console.log("calendar", this.calendar);
        
      });
    }   

    getCalendar() {
      this.calendarService.getItem(this.id).subscribe((data: any) => {
        this.calendar = data;
      });
    }

    getHolidays() {
      this.calendarService.getItemHolidays(this.id).subscribe((data: any) => {
        this.dataSourceHolidays = data;
      });
    }
    getWeekend() {
      this.calendarService.getItemWeekends(this.id).subscribe((data: any) => {
        this.dataSourceWeekends = data;
      });
    }
    getMonths() {
      this.calendarService.getItemCalendarMonths(this.id).subscribe((data: any) => {
        this.dataSourceMonths= data;
      });
    }

    dayOfWeekMap = {
      [DayOfWeek.MONDAY]:'Lundi',
      [DayOfWeek.TUESDAY]:'Mardi',
      [DayOfWeek.WEDNESDAY]:'Mercredi',
      [DayOfWeek.THURSDAY]:'Jeudi',
      [DayOfWeek.FRIDAY]:'Vendredi',
      [DayOfWeek.SATURDAY]:'Samedi',
      [DayOfWeek.SUNDAY]:'Dimanche'
      
    };
  
}

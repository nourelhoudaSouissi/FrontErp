import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { isSameDay, isSameMonth } from 'date-fns';
import { TimeOffCalendarService } from './app-calendar.service';
import { CalendarFormDialogComponent } from './calendar-form-dialog/calendar-form-dialog.component';
import { EgretCalendarEvent } from 'app/shared/models/event.model';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';


@Component({
  selector: 'app-calendar',
  templateUrl: './app-calendar.component.html',
  styleUrls: ['./app-calendar.component.css'],
  animations: egretAnimations,
})
export class TimeOffCalendarComponent implements OnInit {
  public view = 'month';
  public viewDate = new Date();
  private dialogRef: MatDialogRef<CalendarFormDialogComponent>;
  public activeDayIsOpen: boolean = true;
  public refresh: Subject<any> = new Subject();
  public events: EgretCalendarEvent[];
  private actions: CalendarEventAction[];

  constructor(
    public dialog: MatDialog,
    private timeOffCalendarService: TimeOffCalendarService,
    private confirmService: AppConfirmService
  ) {
    this.actions = [
      {
        label: '<i class="material-icons icon-sm">edit</i>',
        onClick: ({ event }: { event: CalendarEvent }): void => {
          this.handleEvent('edit', event);
        },
      },
      {
        label: '<i class="material-icons icon-sm">close</i>',
        onClick: ({ event }: { event: CalendarEvent }): void => {
          this.removeEvent(event);
        },
      },
    ];
  }

  ngOnInit() {
    this.loadEvents();
  }

  private initEvents(events): EgretCalendarEvent[] {
    return events.map((event) => {
      event.actions = this.actions;
      return new EgretCalendarEvent(event);
    });
  }

  public loadEvents() {
    this.timeOffCalendarService.getEvents().subscribe((events: CalendarEvent[]) => {
      this.events = this.initEvents(events);
    });
  }

  public removeEvent(event) {
    this.confirmService
      .confirm({
        title: 'Delete Event?',
      })
      .subscribe((res) => {
        if (!res) {
          return;
        }

        this.timeOffCalendarService.deleteEvent(event._id).subscribe((events) => {
          this.events = this.initEvents(events);
          this.refresh.next(1);
        });
      });
  }

  public addEvent() {
    this.dialogRef = this.dialog.open(CalendarFormDialogComponent, {
      panelClass: 'calendar-form-dialog',
      data: {
        action: 'add',
        date: new Date(),
      },
      width: '1000px',
    });
    this.dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      let dialogAction = res.action;
      let responseEvent = res.event;
      this.timeOffCalendarService.addEvent(responseEvent).subscribe((events) => {
        this.events = this.initEvents(events);
        this.refresh.next(true);
      });
    });
  }

  public handleEvent(action: string, event: EgretCalendarEvent): void {
    // console.log(event)
    this.dialogRef = this.dialog.open(CalendarFormDialogComponent, {
      panelClass: 'calendar-form-dialog',
      data: { event, action },
      width: '450px',
    });

    this.dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      let dialogAction = res.action;
      let responseEvent = res.event;

      if (dialogAction === 'save') {
        this.timeOffCalendarService.updateEvent(responseEvent).subscribe((events) => {
          this.events = this.initEvents(events);
          this.refresh.next(1);
        });
      } else if (dialogAction === 'delete') {
        this.removeEvent(event);
      }
    });
  }

  public dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  public eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;

    this.timeOffCalendarService.updateEvent(event).subscribe((events) => {
      this.events = this.initEvents(events);
      this.refresh.next(1);
    });
  }
}

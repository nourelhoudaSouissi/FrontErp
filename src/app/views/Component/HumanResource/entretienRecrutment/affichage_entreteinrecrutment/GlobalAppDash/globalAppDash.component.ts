import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-half-circle-dashboard',
  templateUrl: './globalAppDash.component.html',
  styleUrls: ['./globalAppDash.component.scss']
})
export class HalfCircleDashboardComponent {
  @Input() globalAppreciation: number = 0; // The percentage of progress


  getStrokeColor(): string {
    if (this.globalAppreciation === 0 || this.globalAppreciation === null) {
      return 'grey';
    } else if (this.globalAppreciation <= 1.25) {
      return 'red';
    } else if (this.globalAppreciation <= 2.5) {
      return 'orange';
    } else {
      return 'green';
    }
  }

  
getProgressOffset(): number {
    const circumference = 2 * Math.PI * 90; // Circumference of the circle with radius 90
    return (circumference * (5 - this.globalAppreciation)) / 5;
}
  
  
}

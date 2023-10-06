import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrintSharedService {
  private printSubject = new Subject<any>();

  // Observable stream to subscribe to print requests
  print$ = this.printSubject.asObservable();

  // Method to trigger the print request
  printCV(employee) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const content = document.getElementById('resume')?.outerHTML;

    const doc = iframe.contentWindow?.document;
    const head = doc?.getElementsByTagName('head')[0];
    const style = doc?.createElement('style');
    style.innerHTML = `
      @media print {
        .resume {
          width: 210mm;
          height: 297mm;
          margin: 0;
          padding: 0;
        }
        
        .cv-container {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          background-color: #fff !important;
          margin: 0;
          padding: 0;
        }
        /* Add your custom styles for printing here */
      }
    `;
    head?.appendChild(style);

    doc?.open();
    doc?.write(content);
    doc?.close();

    setTimeout(() => {
      iframe.contentWindow?.print();
      document.body.removeChild(iframe);
    }, 1000);
  }
}
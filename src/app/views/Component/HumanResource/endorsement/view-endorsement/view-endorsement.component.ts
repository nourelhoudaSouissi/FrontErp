import * as html2pdf from 'html2pdf.js';
import { contract } from './../../../../../shared/models/contract';
import { DOCUMENT } from '@angular/common';

import { Endorsement } from './../../../../../shared/models/Endorsement';
import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { EndorsementService } from '../endorsement.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ContractEmployeeService } from '../../contracts/contractEmployee/contract-employee.service';

@Component({
  selector: 'app-view-endorsement',
  templateUrl: './view-endorsement.component.html',
  styleUrls: ['./view-endorsement.component.scss']
})
export class ViewEndorsementComponent implements OnInit {

  id: number;
  endorsement : Endorsement;
  contract : contract;

    
  public displayedColumnsE: any;
    
  public displayedColumnsB: any;
 


 
    constructor(private route: ActivatedRoute,
      private endorsementService: EndorsementService,
      private contractService : ContractEmployeeService,
      private dialog: MatDialog,
      private snack: MatSnackBar,
      private loader: AppLoaderService,
      @Inject(DOCUMENT) private document: Document) {

       
       }
      
  
    ngOnInit(): void {
      this.id = this.route.snapshot.params['id'];
      this.getEndorsement();
     
      this.id = this.route.snapshot.params['id'];
      this.getContract();
   
      console.log(this.id)
      
   //   this.document.body.classList.add('print-body-content');
  
    }

    ngOnDestroy() {
//this.document.body.classList.remove('print-body-content');
    }
    getEndorsement() {
      this.endorsementService.getItem(this.id).subscribe((data: any) => {
        this.endorsement = data;
  
      });
    }
     getContract() {
      this.contractService.getItem(this.id).subscribe((data: any) =>{
        this.contract = data; });
      }

    
   /******************************************  téléchargement du PDF   ****************************************/
   downloadEndorsement() {
    const element = document.getElementById('formImprime');
    html2pdf().from(element).save('MonAvenant.pdf');
  }
  
  
  
    /********************************************  imprimer contrat     ******************************************/
 

    print(){
      const printableArea = document.getElementById('formImprime');
      var originalContents = document.body.innerHTML;
      var printContents = document.getElementById('formImprime').innerHTML;
      document.body.innerHTML = printContents ;
      window.print();
      document.body.innerHTML = originalContents;
    }


    //////print remove unwated thing ///////
    /*print() {
      const printableArea = document.getElementById('formImprime');
      var originalContents = document.body.innerHTML;
      var printContents = document.getElementById('formImprime').innerHTML;
      document.body.innerHTML = printContents;
    
      // Remove the local host link
      var links = document.getElementsByTagName('a');
      for (var i = 0; i < links.length; i++) {
        links[i].href = '';
      }
    
      // Remove the template name
      var formImprime = document.getElementById('formImprime');
      if (formImprime) {
        formImprime.style.display = 'none';
      }
    
      window.print();
      document.body.innerHTML = originalContents;
    }*/

}




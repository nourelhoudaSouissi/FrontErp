import * as html2pdf from 'html2pdf.js';
import { benefit, exceptionalFee } from './../../../../../../shared/models/avantagesContrat';
import { ActivatedRoute } from '@angular/router';
import { ContractEmployeeService } from '../contract-employee.service';
import { ContractTitle, contract } from './../../../../../../shared/models/contract';
import { Component, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Endorsement } from 'app/shared/models/Endorsement';
import { EndorsementService } from '../../../endorsement/endorsement.service';



@Component({
  selector: 'app-view-contract',
  templateUrl: './view-contract.component.html',
  styleUrls: ['./view-contract.component.scss']
})
export class ViewContractComponent implements OnInit {
  id: number;
  contract : contract;
  

    
  public displayedColumnsE: any;
  public displayedColumnsEn: any;
  public displayedColumnsB: any;
 public dataSourceEn: MatTableDataSource<Endorsement>;
  public dataSourceB: MatTableDataSource<benefit>;
  public dataSourceE: MatTableDataSource<exceptionalFee>;
  public exceptionalFees : exceptionalFee[]
  public benefits : benefit[]
  public endorsement : Endorsement[]


 
    constructor(private route: ActivatedRoute,
      private crudService: ContractEmployeeService,
      private endorsementService : EndorsementService,
      private dialog: MatDialog,
      private snack: MatSnackBar,
      private loader: AppLoaderService,
      @Inject(DOCUMENT) private document: Document) {

      this.dataSourceEn = new MatTableDataSource<Endorsement>([]);

        this.dataSourceB = new MatTableDataSource<benefit>([]);
        
        this.dataSourceE = new MatTableDataSource<exceptionalFee>([]);
       }

       getDisplayedColumnsEn() {
        return ['number','reference','object' ];
      }
      getDisplayedColumnsB() {
        return ['number' ,'shortDescription','description'];
      }
      getDisplayedColumnsE() {
        return ['number','name','description'];
      }
  
    ngOnInit(): void {
      this.id = this.route.snapshot.params['id'];
      this.getContract();
      this.getExceptionalFee();
      this.getBenefit();
      this.getEndorsement();

     this.displayedColumnsEn=this.getDisplayedColumnsEn();
      this.displayedColumnsE=this.getDisplayedColumnsE();
      this.displayedColumnsB=this.getDisplayedColumnsB();
      console.log(this.id)
      
   //   this.document.body.classList.add('print-body-content');
  
    }

    ngOnDestroy() {
//this.document.body.classList.remove('print-body-content');
    }
    getContract() {
      this.crudService.getItem(this.id).subscribe((data: any) => {
        this.contract = data;
  
      });
    }

   /* getEndorsements() {
      this.dataSourceEn = this.contract.endorsementList;
    }*/
    
    
    getSortedArticles(): any[] {
      return this.contract.articles.sort((a, b) => a.articleNumber - b.articleNumber);
    }
    
    
  /************************************ get exceptionnal fee by contractId *********************************************************/
    getExceptionalFee() {
      this.crudService.getItemFee(this.id).subscribe((data: any) => {
        this.dataSourceE = data;
        
      });
    }
    
    /********************************* get benefit by idContract *******************************/
    getBenefit() {
      this.crudService.getItemBenefit(this.id).subscribe((data: any) => {
        this.dataSourceB = data;
        
      });
    }

       /********************************* get endorsement  by idContract *******************************/
    getEndorsement() {
        this.crudService.getItemEnd(this.id).subscribe((data: any) => {
          this.dataSourceEn = data;
          
        });
      }

    /******************************************  téléchargement du PDF   ****************************************/
    downloadContract() {
      const element = document.getElementById('formImprime');
      html2pdf().from(element).save('MonContrat.pdf');
    }
    
  
  
    /********************************************  imprimer contrat     ******************************************/
 /*

    print(){
      const printableArea = document.getElementById('formImprime');
      var originalContents = document.body.innerHTML;
      var printContents = document.getElementById('formImprime').innerHTML;
      document.body.innerHTML = printContents ;
      window.print();
      document.body.innerHTML = originalContents;
    }
*/

    //////print remove unwated thing ///////
    print() {
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
    }

    ContractTitleMap = {
      [ContractTitle.PERMANENT_EMPLOYMENT_CONTRACT]: 'Contrat de travail à durée indéterminée',
      [ContractTitle.FIXED_TERM_EMPLOYMENT_CONTRACT]: 'Contrat de travail à durée déterminée',
      [ContractTitle.PROFESSIONALIZATION_CONTRACT]: 'Contrat de professionnalisation',
      [ContractTitle.SEASONAL_WORK_CONTRACT]: 'Contrat de travail saisonnier',
      [ContractTitle.PART_TIME_WORK_CONTRACT]: 'Contrat de travail à temps partiel',
      [ContractTitle.STUDY_CONTRACT]: 'Contrat d\'alternance',
      [ContractTitle.TEMPORARY_WORK_CONTRACT]: 'Contrat de travail intérimaire'
    };
}



  
    
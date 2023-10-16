import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Availability, BudgetingType, PaymentType, RequirementStatus, RequirementType, WorkField, req } from 'app/shared/models/req';
import { ReqService } from '../req.service';
import { CompanyStatus, Partner } from 'app/shared/models/Partner';
import { CrudPartnerService } from '../../partner/crudPartner.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ProfilePopComponent } from '../profile-pop/profile-pop.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-req-detail',
  templateUrl: './req-detail.component.html'
})
export class ReqDetailComponent implements OnInit {
  id: number
  req: req
  partner: Partner
  

  public displayedColumns: any;

  getDisplayedColumns() {
    return ['candidateNumber','function','experienceYears' , 'period' , 'actions'];
  }

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private route: ActivatedRoute,
    private reqService: ReqService,
    private partnerService: CrudPartnerService,
    private loader: AppLoaderService
    //private datePipe : DatePipe
    ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id)
    this.getReq()
    this.displayedColumns = this.getDisplayedColumns();
    
  }

  getReq(){
    this.reqService.getItem(this.id).subscribe((data: any) => {
      this.req = data
      //this.partnerReq();
      this.getPartner()
    })
  }

  getPartner() {
    if (this.req && this.req.partnerId) {
      this.partnerService.getItem(this.req.partnerId).subscribe((data: any) => {
        this.partner = data;
        console.log(this.partner);
        console.log(this.partner.name)
        this.partnershipType()
      });
    }
  }

  partnershipType() {
    const refs = this.partner.refs

    if(this.partner.companyStatus == CompanyStatus.SUPPLIER){
      for(let i=0 ; i<this.partner.refs.length ; i++){
        if (refs[i].startsWith('PR')){
          this.partner.companyStatus = CompanyStatus.PROSPECT
          break
        }
        else if(refs[i].startsWith('CL')){
          this.partner.companyStatus = CompanyStatus.CLIENT
          break
        }
      }
    }
  }

  /*partnerReq():boolean{
    if(this.req.company!=null)
    return true
    else return false
  }*/

  /*formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy');
  }*/

  workFieldMap = {
    [WorkField.IT]:'IT',
    [WorkField.INDUSTRY]:'Industrie',
    [WorkField.SALES]:'Ventes',
    [WorkField.AGRICULTURE] :'Agriculture',
    [WorkField.BANKING] :'Banking',
    [WorkField.E_COM] :'E-Commerce',
    [WorkField.ASSURANCE] :'Assurance',
    [WorkField.FINANCE] :'Finance'
  };

  paymentTypeMap = {
    [PaymentType.FOR_SETTLEMENT]:'En régie',
    [PaymentType.IN_PACKAGE]:'En forfait'
  }

  reqTypeMap = {
    [RequirementType.RESOURCE]:'Ressource',
    [RequirementType.PROJECT]:'Projet'
  }

  budgetingTypeMap = {
    [BudgetingType.PROPOSED_BUDGET]:'Budget proposé (client)',
    [BudgetingType.ESTIMATED_BUDGET]:'Budget estimé'
  }

  reqStatusMap = {
    [RequirementStatus.OPEN] :'Ouvert',
    [RequirementStatus.IN_PROGRESS] :'En progrès',
    [RequirementStatus.CLOSED]:'Clôturé',
    [RequirementStatus.PARTIALLY_WON]:'Partiellement gagné',
    [RequirementStatus.TOTALLY_WON]:'Totalement gagné',
    [RequirementStatus.PARTIALLY_LOST]:'Partiellement perdu',
    [RequirementStatus.TOTALLY_LOST] :'Totalement perdu',
    [RequirementStatus.ABANDONED] :'Abandonné',
  }

  availabilityMap = {
    [Availability.ASAP]: "ASAP",
    [Availability.FROM]: "A partir de",
    [Availability.IMMEDIATELY]: "Immédiatement"
  }

  companyStatusMap = {
    [CompanyStatus.PROSPECT]:'Prospect',
    [CompanyStatus.SUPPLIER]:'Fournisseur',
    [CompanyStatus.CLIENT]:'Client',
    [CompanyStatus.CLIENT_SUPPLIER]:'Client / Fournisseur'
  }
  
}

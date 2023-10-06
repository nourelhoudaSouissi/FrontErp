import { CrudPartnerService } from './../../crudPartner.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  Validators,  FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Partner,CompanyStatus,WorkField,LegalStatus,Provenance ,Country} from 'app/shared/models/Partner';
import { Civility, Privilege, Service } from 'app/shared/models/contact';
import { Availability, RequirementStatus, RequirementType } from 'app/shared/models/req';


@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './ngx-table-popup.component.html'
})
export class NgxTablePopupComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;


  public itemForm: FormGroup;;
  CompanyStatus = Object.values(CompanyStatus);
  WorkField :string []= Object.values(WorkField);
  LegalStatus = Object.values(LegalStatus);
  Provenance = Object.values(Provenance);
  countries: Country[];
  states: string[];
  selectedFile: File;
  Privilege :string []= Object.values(Privilege);
  Civility :string []= Object.values(Civility);
  Service :string []= Object.values(Service);
  formWidth = 200; //declare and initialize formWidth property
  formHeight = 700; //declare and initialize formHeight property
  Availability : string [] = Object.values(Availability);
  repeatForm : FormGroup;
  
  RequirementStatus  :string []= Object.values(RequirementStatus);
  RequirementType : string[] = Object.values(RequirementType);

  constructor(
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NgxTablePopupComponent>,
    private fb: FormBuilder,
    private crudService: CrudPartnerService,  
  ) {     this.countries = this.crudService.getCountries();

  }



  buildItemForm(item){
    this.itemForm = this.fb.group({
      name : [item.name || '', Validators.required],
      staffNumber : [item.staffNumber || '', Validators.required], 
      parentCompany : [item.parentCompany || '', Validators.required],
      ceoName : [item.ceoName || '', Validators.required],
      phoneNumber : [item.phoneNumber || '', Validators.required ,],
      phoneNumberTwo: [item.phoneNumberTwo ||'', Validators.required, ],
      postCode : [item.postCode || '', Validators.required],
      city : [item.city || '', Validators.required],
      description : [item.description || '', Validators.required],
      logo : [item.logo || '', Validators.required],
      activityStartDate : [item.activityStartDate || '', Validators.required],
      partnerShipDate : [item.partnerShipDate || '', Validators.required],
      companyStatus : [item.companyStatus || '', Validators.required],
      refPhoneNumber : [item.refPhoneNumber || '', Validators.required ,],
      country : [item.country || '', Validators.required],
      workField : [item.workField || '', Validators.required],
      legalStatus : [item.legalStatus || '', Validators.required],
      provenance : [item.provenance || '', Validators.required],
      firstName : [item.firstName || '', Validators.required],
      lastName : [item.lastName || '', Validators.required],
      function : [item.function || '', Validators.required],
      emailOne : [item.emailOne || '', Validators.required],
      emailTwo : [item.emailTwo || '', Validators.required],
      phoneNumberOne : [item.phoneNumberOne || '', Validators.required],
      
      comment : [item.comment || '', Validators.required],
      privilege : [item.privilege || '', Validators.required],
      civility : [item.civility || '', Validators.required],
      service : [item.service || '', Validators.required],
      title : [item.title || '', Validators.required],
     
      criteria : [item.criteria || '', Validators.required],
      plannedBudget : [item.plannedBudget || '', Validators.required],
      plannedIncome : [item.plannedIncome || '', Validators.required ,],
      startDate: [item.startDate ||'', Validators.required, ],
      expectedEndDate : [item.expectedEndDate || '', Validators.required],
      responseDate : [item.responseDate || '', Validators.required],
      totalCandidateNumber : [item.totalCandidateNumber || '', Validators.required],
      requirementType : [item.requirementType || '', Validators.required],
      requirementStatus : [item.requirementStatus || '', Validators.required ,],
      
      availability : [item.availability || '', Validators.required],
      
  
      
    });

  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }
  ngOnInit() {
    this.buildItemForm(this.data.payload)
    
    this.itemForm.get("country").valueChanges.subscribe((country) => {
      this.itemForm.get("city").reset();
      if (country) {
        this.states = this.crudService.getStatesByCountry(country);
   
      }
    });


    this.repeatForm = this._formBuilder.group({
      repeatArray: this._formBuilder.array([this.createRepeatForm()])
    });

  }

  submit() {
    this.dialogRef.close(this.itemForm.value)
  }

  onCountryChange(countryShotName: string) {
    this.states = this.crudService.getStatesByCountry(countryShotName);
  }


  createRepeatForm(): FormGroup {
    return this._formBuilder.group({
    });
  }
  get repeatFormGroup() {
    return this.repeatForm.get('repeatArray') as FormArray;
  }
  handleAddRepeatForm() {
    this.repeatFormGroup.push(this.createRepeatForm());
  }
  handleRemoveRepeatForm(index: number) {
    this.repeatFormGroup.removeAt(index);
    if (index > 0) { // check if the index is greater than 0
      const repeatArray = this.repeatForm.get('repeatArray') as FormArray;
      repeatArray.removeAt(index);
  }
  }
  


}
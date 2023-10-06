import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { Civility, Departement, Employee, MaritalSituation, ResourceType, Title, WorkLocation } from 'app/shared/models/Employee';
import { updateCandidatService } from '../../candidate/updateCandidat/updateCandidat.service';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../resource.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Country } from 'app/shared/models/Partner';

@Component({
  selector: 'app-update-resource',
  templateUrl: './update-resource.component.html',
  styleUrls: ['./update-resource.component.scss']
})
export class UpdateResourceComponent implements OnInit {

  showLocationName = false;
  showBackofficeFields = false;
  showExternalFields = false;
  showInternalFields = false;
  data:any;
  employeeId : number
  updateEmployee: FormGroup;
  id:number;
  employee : Employee;
  Civility :string []= Object.values(Civility);
  countries: Country[];
  states: string[];
  MaritalSituation :string []= Object.values(MaritalSituation);
 // Provenance:string []= Object.values(Provenance);
  workLocation :string []= Object.values(WorkLocation);
  departement:string []= Object.values(Departement);
  title :string[]= Object.values(Title);
 // LanguageLevel : string[] = Object.values(LanguageLevel);
 // EmployeeStatus :string[] = Object.values(EmployeeStatus);
  resourceTypes : string[] = Object.values(ResourceType); 
  submitted = false;
  selectedFile: File;
  constructor(
    private _formBuilder: FormBuilder,
  //  @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateResourceComponent>,
    private fb: FormBuilder,
    private update: updateCandidatService,  
    private updateRessource: ResourceService,  
    private http: HttpClient,
    private route:ActivatedRoute 
  ) { this.countries = this.update.getCountries(); console.log("test");
  }




  onFileSelected(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log(reader.result)
        this.updateEmployee.patchValue({
          photo: reader.result
        });
        console.log(this.updateEmployee.value)
      };
    }
  }

  ngOnInit() {
    console.log('popup')
    const educationData = this.data.payload;
    console.log(this.data);
    
   // this.getemployee();
   
    this.updateEmployee = new UntypedFormGroup({
      firstName: new UntypedFormControl(this.data.payload.firstName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15),
      ]),
      lastName: new UntypedFormControl(this.data.payload.lastName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ]),
      birthDate: new UntypedFormControl(this.data.payload.birthDate, ),
      title: new UntypedFormControl(this.data.payload.title, ),
      address: new UntypedFormControl(this.data.payload.address),
      emailOne: new UntypedFormControl(this.data.payload.emailOne, ),
      phoneNumberOne: new UntypedFormControl(this.data.payload.phoneNumberOne, ),
      civility: new UntypedFormControl(this.data.payload.civility, []),
      employeeStatus: new UntypedFormControl(this.data.payload.EmployeeStatus, []),
      resourceType: new UntypedFormControl(this.data.payload.resourceType, []),
      maritalSituation: new UntypedFormControl(this.data.payload.maritalSituation, []),
      country: new UntypedFormControl(this.data.payload.country, []),
      city: new UntypedFormControl(this.data.payload.city, []),
      postCode: new UntypedFormControl(this.data.payload.postCode, ),
      emailTwo: new UntypedFormControl(this.data.payload.emailTwo, ),
      phoneNumberTwo: new UntypedFormControl(this.data.payload.phoneNumberTwo, ),
      id: new UntypedFormControl(this.data.technichalFile, []),
      workLocation: new UntypedFormControl(this.data.payload.workLocation, ),
      departement: new UntypedFormControl(this.data.payload.departement, ),
      photo: new UntypedFormControl(this.data.payload.photo, ),
      recruitmentDate: new  UntypedFormControl('', ),
      nationalIdentity: new  UntypedFormControl('', ),
      socialSecurityNumber: new UntypedFormControl('', )



    })

  }

  submit() {
    console.log('submit method',this.updateEmployee.valid)
    this.dialogRef.close(this.updateEmployee.value)
   
  }
 
 
  ///// Form Submit///// 
 

  getemployee() {
    this.update.getItemById(this.id).subscribe((data: any) => {
      this.employee = data;

    });
  }
  onCountryChange(countryShotName: string) {
    this.states = this.update.getStatesByCountry(countryShotName);
  }

maritalSituationMap = {
  [MaritalSituation.SINGLE]:'Célibataire',
  [MaritalSituation.MARRIED]:'Marrié',
 [MaritalSituation.DIVORCED]:'Divorcé',
 [MaritalSituation.WIDOWED] :'Veuf/Veuve',
 [MaritalSituation.COMPLICATED] :'Compliqué'
};
resourceTypeMap = {
  [ResourceType.BACKOFFICE_RESOURCE]:'Ressource_BackOffice',
  [ResourceType.EXTERNAL_RESOURCE]:'Ressource_Externe',
 [ResourceType.INTERNAL_RESOURCE]:'Ressource_Interne'
};

  civilityMap = {
    [Civility.MS]:'Mlle',
    [Civility.MRS]:'Mme',
    [Civility.MR]:'Mr'
  };


  workLocationMap= {
    [WorkLocation.MAIN]:'Principale',
    [WorkLocation.OTHER_LOCATION]:'Autre_Location'
  };

  employeeTitleMap = {
    [Title.FRONT_END_DEVELOPER]: 'Développeur Front-End',
    [Title.BACK_END_DEVELOPER]: 'Développeur Back-End',
    [Title.FULLSTACK_DEVELOPER]: 'Développeur Full-Stack',
    [Title.CRM]: 'CRM',
    [Title.HUMAN_RESOURCE_MANAGER]: 'Responsable des Ressources Humaines',
    [Title.HUMAN_RESOURCE]: 'Ressources Humaines',
    [Title.PROJECT_MANAGER]: 'Chef de Projet',
    [Title.TECH_LEAD]: 'Responsable Technique',
    [Title.UI_UX_DESIGNER]: 'Concepteur UI/UX',
    [Title.QA_ENGINEER]: 'Ingénieur QA',
    [Title.DEVOPS_ENGINEER]: 'Ingénieur DevOps',
    [Title.WEB_DEVELOPER]: 'Développeur Web',
    [Title.OFFICE_MANAGER]: 'Responsable d Agence',
    [Title.ACCOUNTANT]: 'Comptable',
    [Title.SALES_REPRESENTATIVE]: 'Représentant Commercial',
    [Title.CUSTOMER_SUPPORT_SPECIALIST]: 'Spécialiste du Support Client',
    [Title.MARKETING_COORDINATOR]: 'Coordinateur Marketing'
    
  };

 departementMap = {
    [Departement.ARCHITECTURE]: 'Architecture',
    [Departement.COMPTABILITE]: 'Comptabilité',
    [Departement.DESIGN]: 'Design',
    [Departement.DEVELOPPEMENT]: 'Développement',
    [Departement.FINANCES]: 'Finance',
    [Departement.JURIDIQUE]: 'Juridique',
    [Departement.MARKETING]: 'Marketing',
    [Departement.QUALITE]: 'Qualité',
    [Departement.RESSOURCES_HUMAINES]: 'Ressources_Humaines',
    [Departement.SUPPORT]: 'Support',
    [Departement.TESTS]: 'Tests',
    [Departement.VENTE]: 'Vente'
  };
  nextTab(tabGroup: MatTabGroup) {
    const nextIndex = (tabGroup.selectedIndex + 1) % tabGroup._tabs.length;
    tabGroup.selectedIndex = nextIndex;
  };
  previousTab(tabGroup: MatTabGroup) {
    const previousIndex = (tabGroup.selectedIndex + tabGroup._tabs.length - 1) % tabGroup._tabs.length;
    tabGroup.selectedIndex = previousIndex;
  };
  onFraisTypeSelectionChange(event: any) {
    const selectedFraisType = event.value;
    this.showLocationName = selectedFraisType === 'OTHER_LOCATION';
  };

  onTypeChanges(event: any) {
    const selectedResourceType = event.value;

  
    // Reset the visibility of all specific resource type fields
    this.showBackofficeFields = false;
    this.showExternalFields = false;
    this.showInternalFields = false;
  
    // Set the visibility of specific resource type fields based on the selected type
    if (selectedResourceType === 'BACKOFFICE_RESOURCE') {
      this.showBackofficeFields = true;
    } 
    else if (selectedResourceType === 'EXTERNAL_RESOURCE') {
      this.showExternalFields = true;


    } 
    else if (selectedResourceType === 'INTERNAL_RESOURCE') {
      this.showInternalFields = true;

    }
  }
  
 
  /****************** popUp de modification de ressource ************************/
}



import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {  Employee, MaritalSituation } from '../../../../../shared/models/Employee';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, FormArray } from '@angular/forms'; 
import {FormControl} from '@angular/forms';
import {FormBuilder, FormGroup} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Privilege, Civility, Service } from 'app/shared/models/contact';
import { Title } from 'app/shared/models/Employee';

import { LanguageLevel, Languages } from 'app/shared/models/Language';
import { Subscription, catchError, of } from 'rxjs';
import { updateCandidatService } from './updateCandidat.service';
import { Skills } from 'app/shared/models/Skills';
import { Offer } from 'app/shared/models/Offer';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Language } from 'highlight.js';
import { TechnicalFile } from 'app/shared/models/TechnicalFile';
import { Certification } from 'app/shared/models/Certification';
import { Experience } from 'app/shared/models/Experience';
import { AssOfferCandidate } from 'app/shared/models/AssOfferCandidate';
import { Education } from 'app/shared/models/Education';
import { employeePopupComponent } from './updateEmployeePopup/employee-popup.component';
import { educationPopupComponent } from './updateEducation/education-popup.component';
import { experiencePopupComponent } from './updateExperience/experience-popup.component';
import { certificationPopupComponent } from './updateCertification/certificaton-popup.component';
import { languagePopupComponent } from './updateLanguage/language-popup.component';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { techFilePopupComponent } from './updateTechFile/techFile-popup.component';
import { skillsPopupComponent } from './updateSkills/skills-popup.component';


@Component({
  selector: 'update-form',
  templateUrl: './updateCandidat.component.html',
  styleUrls: ['./updateCandidat.component.css'],
  
})
 
export class updatecandidatComponent implements OnInit {
  
  popup: MatDialogRef<any>;
  formData = {}
  console = console;
  repeatForm: FormGroup;
  myForm: FormGroup;
  techFileForm: FormGroup;
  cvForm: FormGroup;
  step1:FormGroup;
  step2:FormGroup;
  step3:FormGroup;
  step4:FormGroup;
  stepIG:FormGroup;
  stepTechFile:FormGroup;
  stepOffres:FormGroup;
  lastEmployee: Employee;
  selectedEmplyee= {firstName :'', id:null};
  selectedTechFile= { id:null};
//////////////Ajout Candidat///////////////
loader: any;
snack: any;
  employee: Employee;
  submitted = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  skills: Skills;
  offers: Offer[];
  isPageReloaded = false;
  public emplyeeDataSource: any;
  public dataSourceEducation: MatTableDataSource<Education>;
  public dataSourceExperience: MatTableDataSource<Experience>;
  public dataSourceCertification: MatTableDataSource<Certification>;
  public dataSourceLanguage: MatTableDataSource<Language>;
  public dataSourceSkills: MatTableDataSource<Skills>;


  
  public dataSource: any;

  public displayedColumnsEducation: any;
  public displayedColumnsExperience: any;
  public displayedColumnsCertification: any;
  public displayedColumnsLanguage: any;
  public displayedColumnsSkills: any;




  public getItemSub: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  formWidth = 200; //declare and initialize formWidth property
  formHeight = 700; //declare and initialize formHeight property
  cvHtml = '';
  EmployeeId: number
  idTechnicalFile:number
  experience : Experience 
  language: Language
  technicalFile: TechnicalFile
  certification : Certification
  public education : Education[]
  candidature : AssOfferCandidate
  private router: Router
  itemForm: any;
  states: any;



 constructor(private _formBuilder: FormBuilder,
  private route:ActivatedRoute,
  private updateCandidatService: updateCandidatService,
  private formBuilder: FormBuilder,
  private http:HttpClient,
  private confirmService: AppConfirmService,
  //public dialogRef: MatDialogRef<employeePopupComponent>,
  private dialog: MatDialog
   ) 
   {  

    this.emplyeeDataSource = new MatTableDataSource<Employee>([]);
    this.dataSourceEducation = new MatTableDataSource<Education>([]);
    this.dataSourceExperience = new MatTableDataSource<Experience>([]);
    this.dataSourceCertification = new MatTableDataSource<Certification>([]);
    this.dataSourceLanguage = new MatTableDataSource<Language>([]);
    this.dataSourceSkills = new MatTableDataSource<Skills>([]);




  }


  ////////////////////Ajout Candidat///////////////
  
  
  

  ngOnInit() {
    this.EmployeeId = this.route.snapshot.params['id'];
    this.getemployee();
    console.log(this.EmployeeId);
    this.getTechnicalFile();
    this.getEducation();
    this.displayedColumnsEducation = this.getEducationDisplayedColumns();
    this.getExperience();
    this.displayedColumnsExperience = this.getExperienceDisplayedColumns();
   this.getCertification();
   this.displayedColumnsCertification = this.getCertificationDisplayedColumns();
    this.getLanguage();
    this.displayedColumnsLanguage = this.getLanguageDisplayedColumns();
   this.getSkills();
   this.displayedColumnsSkills = this.getSkillsDisplayedColumns();

   //this.getCandidature();
  
   /*const cv = document.getElementById('CV');
    if (cv) {
      this.cvHtml = cv.innerHTML;
    }*/
    
    this.updateCandidatService.getOfferItems().subscribe(
      offers => this.offers = offers,
      error => console.log(error)
    );

    
    this.displayedColumnsEducation = this.getEducationDisplayedColumns();
   
    this.repeatForm= new FormGroup({
      repeatArray: new FormArray([])
    });
   this.updateCandidatService.getLastEmployee().subscribe(employee => {
      this.lastEmployee = employee;
    });

  
    /////Countries////
    this.itemForm.get("country").valueChanges.subscribe((country) => {
      this.itemForm.get("city").reset();
      if (country) {
        this.states = this.updateCandidatService.getStatesByCountry(country);
      }
    });
  }

  /////Make first letter capital//////
  capitalLetterValidator(control: FormControl): { [key: string]: boolean } | null {
    const firstLetter = control.value.charAt(0);
    if (firstLetter && firstLetter !== firstLetter.toUpperCase()) {
      return { 'capitalLetter': true };
    }
    return null;
  }
  getEducationDisplayedColumns() {
    return ['diploma', 'institution', 'actions'];
  }
  getExperienceDisplayedColumns() {
    return ['experienceCompany', 'experiencePost','technology', 'actions'];
  }
  getCertificationDisplayedColumns() {
    return ['certificationTitle', 'certificationObtainedDate', 'actions'];
  }
  getLanguageDisplayedColumns() {
    return ['language', 'languageLevel', 'actions'];
  }
  getSkillsDisplayedColumns() {
    return ['skillsTitle',  'actions'];
  }
  /*ngAfterViewInit() {
    if (!this.isPageReloaded) {
      this.isPageReloaded = true;
      window.location.reload();
    }
  }*/
/*
  updateCandidate(): void {
    console.log('Submitting form...');
  //  if (this.myForm.valid) {
      console.log('Form is valid, submitting...');
      this.updateCandidatService.updateEmployee(this.myForm.value,this.employee).subscribe({
        next: (res) => {
          console.log('Item added successfully', res);
          
          console.log('Form value', this.myForm.value);
          this.submitted = true;

        },
        error: (e) => console.error('Error adding item', e)
      });

    }
*/
 updateCandidate(): void {
    console.log('Submitting form...');
  //  if (this.myForm.valid) {
      console.log('Form is valid, submitting...');
      this.updateCandidatService.updateEmployee(this.employee,this.myForm.value).subscribe({
        next: (res) => {
          console.log('Item added successfully', res);
          
          console.log('Form value', this.myForm.value);
          this.submitted = true;
        },
        error: (e) => console.error('Error adding item', e)
      });
    }

  //Section Supplimentaire button
  showInput = false;
createRepeatForm(): FormGroup {
  return this._formBuilder.group({
  });
}


get repeatFormGroup() : FormArray {
  return this.repeatForm.get('repeatArray') as FormArray;
}

handleAddRepeatForm() {
  this.repeatFormGroup.push(this.createRepeatForm());
}

handleRemoveRepeatForm(index: number) {
  this.repeatFormGroup.removeAt(index);
 /* if (index > 0) { // check if the index is greater than 0
    const repeatArray = this.repeatForm.get('repeatArray') as FormArray;
    repeatArray.removeAt(index);
}*/
}

  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }


  onCountryChange(countryShotName: string) {
    this.states = this.updateCandidatService.getStatesByCountry(countryShotName);
   
  }
  
  getOfferItems() {    
    this.getItemSub = this.updateCandidatService.getOfferItems()
      .subscribe((data:any)  => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

  }
/*  getDisplayedColumns() {
    return ['reference','title','actions' ];
  }*/

  ///------------partiedetails-----------/////////////////////

  getemployee() {
    this.updateCandidatService.getItemById(this.EmployeeId).subscribe((data: any) => {
      this.employee = data;

    });
  }
  getTechnicalFile() {
    this.updateCandidatService.getTechnicalFileById(this.EmployeeId).subscribe((data: any) => {
      this.technicalFile = data;
      console.log(this.technicalFile);

    });
  }
  getEducation() {
    this.updateCandidatService.getEducationById(this.EmployeeId).subscribe((data: any) => {
      {
        this.dataSourceEducation = new MatTableDataSource(data);
      }
      
    });
  }

  getExperience() {
    this.updateCandidatService.getExperienceById(this.EmployeeId).subscribe((data: any) => {
      {
        this.dataSourceExperience = new MatTableDataSource(data);
      }
      
    });
  }

  getCertification() {
    this.updateCandidatService.getCertificationById(this.EmployeeId).subscribe((data: any) => {
      {
        this.dataSourceCertification = new MatTableDataSource(data);
      }
      
    });
  }
  getLanguage() {
    this.updateCandidatService.getLanguageById(this.EmployeeId).subscribe((data: any) => {
      {
        this.dataSourceLanguage = new MatTableDataSource(data);
      }
      
    });
  }


 
  getSkills(){
    this.updateCandidatService.getSkillsById(this.EmployeeId).subscribe((data : any)=>{
      {
        this.dataSourceSkills = new MatTableDataSource(data);
      }
    })
  }
  getCandidature(){
    this.updateCandidatService.getCandiatureById(this.EmployeeId).subscribe((data : any)=>{
      this.candidature =data;
      console.log(this.candidature);
    })
  }
  //--------delete-----------
  deleteEducation(id :number) {
  
    this.updateCandidatService.deleteEducation(id)
    .subscribe(
      response => {
        console.log(response);
        // Reload the addresses list after deletion
        this.getEducation();
      },
      error => {
        console.log(error);
      }
    );
    }
    deleteExperience(id: number) {
      this.updateCandidatService.deleteExperience(id)
        .subscribe(
          response => {
            console.log(response);
            // Reload the addresses list after deletion
            this.getExperience();
          },
          error => {
            console.log(error);
          }
        );
      }
      deleteCertification(id: number) {
        this.updateCandidatService.deleteCertificaion(id)
          .subscribe(
            response => {
              console.log(response);
              // Reload the addresses list after deletion
              this.getCertification();
            },
            error => {
              console.log(error);
            }
          );
        }    
        deleteLanguage(id: number) {
          this.updateCandidatService.deleteCertificaion(id)
            .subscribe(
              response => {
                console.log(response);
                // Reload the addresses list after deletion
                this.getCertification();
              },
              error => {
                console.log(error);
              }
            );
          }   
          deleteSkills(id :number) {
  
            this.updateCandidatService.deleteSkills(id)
            .subscribe(
              response => {
                console.log(response);
                // Reload the addresses list after deletion
                this.getEducation();
              },
              error => {
                console.log(error);
              }
            );
            }
            
//-------------------------
  employeeTitleMap = {
    [Title.FRONT_END_DEVELOPER]: 'Développeur Front-End',
    [Title.BACK_END_DEVELOPER]: 'Développeur Back-End',
    [Title.FULLSTACK_DEVELOPER]: 'Développeur Full-Stack',
    [Title.CRM]: 'CRM',
    [Title.HUMAN_RESOURCE_MANAGER]: 'Responsable des Ressources Humaines',
    [Title.HUMAN_RESOURCE]: 'Ressources Humaines',
    [Title.PROJECT_MANAGER]: 'Chef de Projet',
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

  maritalSituationMap = {
    [MaritalSituation.SINGLE]:'Célibatire',
    [MaritalSituation.MARRIED]:'Marrié',
   [MaritalSituation.DIVORCED]:'Divorvé',
   [MaritalSituation.WIDOWED] :'Veuf/Veuve',
   [MaritalSituation.COMPLICATED] :'Compliqué'
  };
  
  civilityMap = {
    [Civility.MRS]:'Mme',
    [Civility.MS]:'Mlle',
   [Civility.MR]:'Mr'
  };

  LanguageLevelMap = {
    [LanguageLevel.BEGINNER_A1]: 'Niveau Débutant A1',
    [LanguageLevel.BEGINNER]: 'Niveau Débutant',
    [LanguageLevel.ELEMENTARY_A2]: 'Niveau Elémentaire A2',
    [LanguageLevel.BASIC]: 'Niveau de Base',
    [LanguageLevel.INTERMEDIATE_B1]: 'Niveau Intermédiaire B1',
    [LanguageLevel.INTERMEDIATE]: 'Niveau Intermédiaire',
    [LanguageLevel.UPPER_INTERMEDIATE_B2]: 'Niveau Intermédiaire Supérieur B2',
    [LanguageLevel.PROFESSIONAL]: 'Niveau Professionnel',
    [LanguageLevel.ADVANCED_C1]: 'Niveau Avancé C1',
    [LanguageLevel.FLUENT]: 'Courant',
    [LanguageLevel.PROFICIENT_C2]: 'Niveau Expert C2',
    [LanguageLevel.NATIVE_LANGUAGE]: 'Langue Maternelle',
    [LanguageLevel.BILINGUAL]: 'Bilingue'
  };

///////////-------updatePopup------------///////////////


getItems() {    
  this.getItemSub = this.updateCandidatService.getItems()
    .subscribe((data:any)  => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

}

openPopUpEmployee(data: any = {}) {
  const title = 'Modifier Employee';
  const dialogRef: MatDialogRef<any> = this.dialog.open(employeePopupComponent, {
    width: '1000px',
    disableClose: true,
    data: { title: title, payload: data }
  });

  dialogRef.afterClosed().subscribe(res => {
    if (res) {
      const updatedData = { ...data, ...res };
      this.updateCandidatService.updateEmployee(data.id, res).subscribe(
        (response) => {
          console.log('candidat updated successfully', response);
         


        },
        (error) => {
          console.error('Error updating item', error);
          this.snack.open('Une erreur est survenue lors de la modification du candidat.', 'OK', { duration: 2000 });
        }
      );
    }
  });
}


openPopUpEducation(data: any, isNew?: boolean) {

  const title = isNew ? 'Nouvelle education' : 'Modifier education';
  const dialogRef: MatDialogRef<any> = this.dialog.open(educationPopupComponent, {
    width: '1000px',
    disableClose: true,
    data: { title: title, payload: data, technicalFileId: this.technicalFile.id }
  });

  dialogRef.afterClosed()
    .subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      if (isNew) {
        this.loader.open('Ajout en cours');
        this.updateCandidatService.addEducation(res)
          .subscribe((data: any) => {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('Education ajoutée avec succès!', 'OK', { duration: 2000 });
            this.getItems();
          })
      } else {
        const updatedData = { ...data, ...res };
        this.updateCandidatService.updateEducation(data.id, updatedData).subscribe(
          (response) => {
            console.log('Education updated successfully', response);
            this.snack.open('Education modifié avec succès!', 'OK', { duration: 2000 });
            this.getItems();
          },
          (error) => {
            console.error('Error updating Education', error);
            this.snack.open('Une erreur est survenue lors de la modification de l education', 'OK', { duration: 2000 });
          }
        );
      }
    });
}


openPopUpExperience(data: any, isNew?: boolean) {
  const title = isNew ? 'Nouvelle experience' : 'Modifier experience';
  const dialogRef: MatDialogRef<any> = this.dialog.open(experiencePopupComponent, {
    width: '1000px',
    disableClose: true,
    data: { title: title, payload: data, technicalFileId: this.technicalFile.id }
  });

  dialogRef.afterClosed()
    .subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      if (isNew) {
        this.loader.open('Ajout en cours');
        this.updateCandidatService.addExperience(res)
          .subscribe((data: any) => {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('Education ajoutée avec succès!', 'OK', { duration: 2000 });
            this.getExperience();
          })
      } else {
        const updatedData = { ...data, ...res };
        this.updateCandidatService.updateExperience(data.id, updatedData).subscribe(
          (response) => {
            console.log('Experience updated successfully', response);
            this.snack.open('Experience modifié avec succès!', 'OK', { duration: 2000 });
            this.getItems();
          },
          (error) => {
            console.error('Error updating item', error);
            this.snack.open('Une erreur est survenue lors de la modification d experience.', 'OK', { duration: 2000 });
          }
        );
      }
    });
}


openPopUpCertification(data: any, isNew?: boolean) {
  const title = isNew ? 'Nouvelle certification' : 'Modifier certification';
  const dialogRef: MatDialogRef<any> = this.dialog.open(certificationPopupComponent, {
    width: '1000px',
    disableClose: true,
    data: { title: title, payload: data, technicalFileId: this.technicalFile.id }
  });

  dialogRef.afterClosed()
    .subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      if (isNew) {
        this.loader.open('Ajout en cours');
        this.updateCandidatService.addCertif(res)
          .subscribe((data: any) => {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('Education ajoutée avec succès!', 'OK', { duration: 2000 });
            this.getItems();
          })
      } else {
        const updatedData = { ...data, ...res };
        this.updateCandidatService.updateCertification(data.id, updatedData).subscribe(
          (response) => {
            console.log('certification updated successfully', response);
            this.snack.open('certification modifié avec succès!', 'OK', { duration: 2000 });
            this.getItems();
          },
          (error) => {
            console.error('Error updating item', error);
            this.snack.open('Une erreur est survenue lors de la modification d certification.', 'OK', { duration: 2000 });
          }
        );
      }
    });
}

openPopUpLanguage(data: any, isNew?: boolean) {
  const title = isNew ? 'Nouvelle certification' : 'Modifier certification';
  const dialogRef: MatDialogRef<any> = this.dialog.open(languagePopupComponent, {
    width: '1000px',
    disableClose: true,
    data: { title: title, payload: data, technicalFileId: this.technicalFile.id }
  });

  dialogRef.afterClosed()
    .subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      if (isNew) {
        this.loader.open('Ajout en cours');
        this.updateCandidatService.addLanguage(res)
          .subscribe((data: any) => {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('Education ajoutée avec succès!', 'OK', { duration: 2000 });
            this.getExperience();
          })
      } else {
        const updatedData = { ...data, ...res };
        this.updateCandidatService.updateLanguage(data.id, updatedData).subscribe(
          (response) => {
            console.log('language updated successfully', response);
            this.snack.open('certification modifié avec succès!', 'OK', { duration: 2000 });
            this.getItems();
          },
          (error) => {
            console.error('Error updating item', error);
            this.snack.open('Une erreur est survenue lors de la modification d certification.', 'OK', { duration: 2000 });
          }
        );
      }
    });
}
openPopUpSkills(data: any, isNew?: boolean) {
  const title = isNew ? 'Nouvelle certification' : 'Modifier certification';
  const dialogRef: MatDialogRef<any> = this.dialog.open(skillsPopupComponent, {
    width: '1000px',
    disableClose: true,
    data: { title: title, payload: data, technicalFileId: this.technicalFile.id }
  });

  dialogRef.afterClosed()
    .subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      if (isNew) {
        this.loader.open('Ajout en cours');
        this.updateCandidatService.addSkill(res)
          .subscribe((data: any) => {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('Education ajoutée avec succès!', 'OK', { duration: 2000 });
            this.getExperience();
          })
      } else {
        const updatedData = { ...data, ...res };
        this.updateCandidatService.updateSkills(data.id, updatedData).subscribe(
          (response) => {
            console.log('certification updated successfully', response);
            this.snack.open('certification modifié avec succès!', 'OK', { duration: 2000 });
            this.getItems();
          },
          (error) => {
            console.error('Error updating item', error);
            this.snack.open('Une erreur est survenue lors de la modification d certification.', 'OK', { duration: 2000 });
          }
        );
      }
    });
}
openPopUpTechFile(data: any, isNew?: boolean) {
  const title = isNew ? 'Nouvelle certification' : 'Modifier certification';
  const dialogRef: MatDialogRef<any> = this.dialog.open(techFilePopupComponent, {
    width: '1000px',
    disableClose: true,
    data: { title: title, payload: data, employeeId: this.EmployeeId }
  });

  dialogRef.afterClosed()
    .subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      if (isNew) {
        this.loader.open('Ajout en cours');
        this.updateCandidatService.addTechFile(res)
          .subscribe((data: any) => {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('Education ajoutée avec succès!', 'OK', { duration: 2000 });
            this.getExperience();
          })
      } else {
        const updatedData = { ...data, ...res };
        this.updateCandidatService.updateTechFile(data.id, updatedData).subscribe(
          (response) => {
            console.log('certification updated successfully', response);
            this.snack.open('certification modifié avec succès!', 'OK', { duration: 2000 });
            this.getItems();
          },
          (error) => {
            console.error('Error updating item', error);
            this.snack.open('Une erreur est survenue lors de la modification d certification.', 'OK', { duration: 2000 });
          }
        );
      }
    });
}

}



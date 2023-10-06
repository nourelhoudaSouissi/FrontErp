import { Offer } from './../../../../../shared/models/Offer';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Employee, MaritalSituation} from '../../../../../shared/models/Employee';
import {  Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, FormArray, AbstractControl, UntypedFormArray } from '@angular/forms';
import {FormControl} from '@angular/forms';
import {FormBuilder, FormGroup} from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { CompanyStatus, LegalStatus, Provenance, Country } from 'app/shared/models/Partner';
import {  Civility, Service } from 'app/shared/models/contact';
import { WorkField, Availability, RequirementStatus, RequirementType } from 'app/shared/models/req';
import { Title } from 'app/shared/models/Employee';
import { CvCandidatService } from './cv-candidat.service';
import { LanguageLevel, Languages } from 'app/shared/models/Language';
import { Subscription, catchError, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Skills } from 'app/shared/models/Skills';
import { OfferPopupComponent } from './cv-popups/offerPopup.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';



@Component({
  selector: 'app-basic-form',
  templateUrl: './cv-candidat.component.html',
  styleUrls: ['./cv-candidat.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
})



export class cvcandidatComponent implements OnInit {
  formData = {}
  console = console;
  repeatForm: FormGroup;
  myForm: FormGroup;
  formEducation:FormGroup;
  formCertif: FormGroup;
  formExperience:FormGroup;
  formLanguage:FormGroup;
  formSkills:FormGroup;
  techFileForm: FormGroup;
  languageForm: FormGroup;
  cvForm: FormGroup;
  step2:FormGroup;
  step3:FormGroup;
  step4:FormGroup;
  stepIG:FormGroup;
  stepTechFile:FormGroup;
  stepOffres:FormGroup;
  lastEmployee: Employee;
  selectedEmplyee= {firstName :'', id:null};
  selectedTechFile= { id:null};
  submitted = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  isPageReloaded = false;
  isButtonDisabled= false;
  public dataSource: any;
  public displayedColumns: any;
  public getItemSub: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  formWidth = 200; //declare and initialize formWidth property
  formHeight = 700; //declare and initialize formHeight property
  certificationId:number;
  languageId:number;
  skillsId:number;
  experienceId:number;
  educationId:number;


//////////////Form Candidate///////////////
  public itemForm: FormGroup;technicalFile: any;
  loader: any;
  snack: any;
  updateCandidatService: any;

  CompanyStatus = Object.values(CompanyStatus);
  WorkField :string []= Object.values(WorkField);
  LegalStatus = Object.values(LegalStatus);
  Provenance = Object.values(Provenance);
  maritalSituation = Object.values(MaritalSituation);
  countries: Country[];
  states: string[];
  selectedFile: File;
  title :string[]= Object.values(Title);
  Civility :string []= Object.values(Civility);
  Service :string []= Object.values(Service);
  Availability : string [] = Object.values(Availability);
  RequirementStatus  :string []= Object.values(RequirementStatus);
  RequirementType : string[] = Object.values(RequirementType);
  Languages : string[] = Object.values(Languages);
  LanguageLevel : string[] = Object.values(LanguageLevel);
  skills: Skills[] = [];
  employee: Employee;
  offers: Offer[];
  isLinear = false;

 
  step1 = this._formBuilder.group({
   // firstCtrl: ['', Validators.required],
  });

 constructor(
 
 

    private confirmService: AppConfirmService,
  private snackBar: MatSnackBar,
  private _formBuilder: FormBuilder,
  private cvCandidatService: CvCandidatService,
  private formBuilder: FormBuilder,
  private fb: FormBuilder,
  private router:Router,
   private http: HttpClient,
   public dialog: MatDialog,)
   {  this.countries = this.cvCandidatService.getCountries();}
   

  ngOnInit() {

    
    this.step2 = this._formBuilder.group({
     // secondCtrl: ['', Validators.required],
    });

    this.step3 = this._formBuilder.group({
     // firstCtrl: ['', Validators.required],
    });
    this.step4 = this._formBuilder.group({
     // secondCtrl: ['', Validators.required],
    });

    this.stepTechFile= this._formBuilder.group({
     // secondCtrl: ['', Validators.required],
    });

    this.formCertif = this.fb.group({
      value : new FormArray([])
     });
     (this.formCertif.get('value') as FormArray).push(this.fb.group({
      certificationTitle: new UntypedFormControl('', []),
      certificationObtainedDate: new UntypedFormControl('', [])
    }));

    
    this.formExperience = this.fb.group({
      value : new FormArray([])
     });
     (this.formExperience.get('value') as FormArray).push(this.fb.group({
      actualEmployment :new UntypedFormControl(false),
      experienceCompany: new UntypedFormControl('', []),
      experiencePost: new UntypedFormControl('', []),
      experienceTitle: new UntypedFormControl('', []),
      experienceRole : new UntypedFormControl('', []),
      experienceStartDate: new UntypedFormControl('', []),
      experienceEndDate: new UntypedFormControl('', []),
      technology: new UntypedFormControl('', []),
    },{ validator: this.dateRangeValidatorExperience }));


    this.formLanguage = this.fb.group({
      value : new FormArray([])
     });
     (this.formLanguage.get('value') as FormArray).push(this.fb.group({
      language: new UntypedFormControl('', []),
      languageLevel: new UntypedFormControl('', []),
      additionalInformation: new UntypedFormControl('', []),
    }));


    this.formSkills = this.fb.group({
      // contractId:new FormControl({value:'' , disabled:true}),
      value : new FormArray([])
     });
     (this.formSkills.get('value') as FormArray).push(this.fb.group({
      skillsTitle : new UntypedFormControl('', [])
    }));


    this.formEducation = this.fb.group({
      value : new FormArray([])
     });
     (this.formEducation.get('value') as FormArray).push(this.fb.group({
      institution: new UntypedFormControl('', [Validators.required]),
      diploma: new UntypedFormControl('', [Validators.required]),
      score: new UntypedFormControl('', []),
      startYear: new UntypedFormControl('', []),
      obtainedDate: new UntypedFormControl('', []),
      actual: new UntypedFormControl(false)
    },{ validator: this.dateRangeValidator })
    );


   
    this.cvCandidatService.getOfferItems().subscribe(
      offers => this.offers = offers,
      error => console.log(error)
    );

    
    this.displayedColumns = this.getDisplayedColumns();
    this.getOfferItems()
    this.repeatForm= new FormGroup({
      repeatArray: new FormArray([])
    });

   this.cvCandidatService.getLastEmployee().subscribe(employee => {
      this.lastEmployee = employee;
    });

  
    this.myForm = new UntypedFormGroup({
      firstName: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15),
        this.capitalLetterValidator
      ]),
      lastName: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        this.capitalLetterValidator
      ]),
      birthDate: new UntypedFormControl('', [Validators.required]),
      title: new UntypedFormControl('',[Validators.required] ),
      address: new UntypedFormControl(''),
      emailOne: new UntypedFormControl('',[Validators.required,Validators.email] ),
      phoneNumberOne: new UntypedFormControl('', [Validators.required,Validators.pattern(/^[\d\s\-+]*$/)]),
      civility: new UntypedFormControl('', []),
      country: new UntypedFormControl('', [Validators.required]),
      city: new UntypedFormControl('', []),
      postCode: new UntypedFormControl('', [ Validators.pattern(/^[0-9]*$/)]),
      emailTwo: new UntypedFormControl('', [Validators.email]),
      phoneNumberTwo: new UntypedFormControl('', [Validators.pattern(/^[\d\s\-+]*$/)]),
      experience:new UntypedFormControl('', [Validators.required])
    })

    
      this.techFileForm = new UntypedFormGroup({
      reference: new UntypedFormControl('', []),
      description: new UntypedFormControl('', []),
      objective: new UntypedFormControl('', []),
      driverLicense: new UntypedFormControl('', []),
    })



    /////FormDuplicate///
    this.repeatForm = this._formBuilder.group({
      repeatArray: this._formBuilder.array([this.createRepeatForm()])
    });



    /////Countries////
    this.myForm.get("country").valueChanges.subscribe((country) => {
      this.myForm.get("city").reset();
      if (country) {
        this.states = this.cvCandidatService.getStatesByCountry(country);
      }
    })
  }






  get getCert() {
    return (this.formCertif.get('value') as FormArray).controls;
  }

  get getExperience() {
    return (this.formExperience.get('value') as FormArray).controls;
  }

  get getLanguage() {
    return (this.formLanguage.get('value') as FormArray).controls;
  }

  get getSkills() {
    return (this.formSkills.get('value') as FormArray).controls;
  }

  
  get getEducation() {
    return (this.formEducation.get('value') as FormArray).controls;
  }

  



  /////Make first letter capital//////
  capitalLetterValidator(control: FormControl): { [key: string]: boolean } | null {
    const firstLetter = control.value.charAt(0);
    if (firstLetter && firstLetter !== firstLetter.toUpperCase()) {
      return { 'capitalLetter': true };
    }
    return null;
  }


//////////Date Control////////////////
dateRangeValidator(formGroup: FormGroup) {
  const startYear = formGroup.get('startYear').value;
  const obtainedDate = formGroup.get('obtainedDate').value;

  console.log('Start Year:', startYear);
  console.log('Obtained Date:', obtainedDate);

  if (startYear && obtainedDate && startYear > obtainedDate) {
    formGroup.get('obtainedDate').setErrors({ rangeError: true });
    console.log('Validation Error: Invalid date range');
  } else {
    formGroup.get('obtainedDate').setErrors(null);
    console.log('Validation Passed: Date range is valid');
  }
}

dateRangeValidatorExperience(formGroup: FormGroup) {
  const experienceStartDate = formGroup.get('experienceStartDate').value;
  const experienceEndDate = formGroup.get('experienceEndDate').value;

  console.log('Experience Start Date:', experienceStartDate);
  console.log('Experience End Date:', experienceEndDate);

  if (experienceStartDate && experienceEndDate && experienceStartDate > experienceEndDate) {
    formGroup.get('experienceEndDate').setErrors({ rangeError: true });
    console.log('Validation Error: Invalid date range');
  } else {
    formGroup.get('experienceEndDate').setErrors(null);
    console.log('Validation Passed: Date range is valid');
  }
}



saveCandidate(): void {
  console.log('Submitting form...');
  if (this.myForm.valid) {
    console.log('Form is valid, submitting...');
    this.cvCandidatService.addItem(this.myForm.value).subscribe({
      next: (res) => {
        console.log('Item added successfully', res);
        this.selectedEmplyee = res;
        console.log('Selected candidat ID:', this.selectedEmplyee.id);
        console.log('Form value', this.myForm.value);
        this.submitted = true;
        this.openSnackBar('Candidat ajouté avec succés');
      }
    });
  } else {
    console.log('Form is invalid. Please check the fields.');
    this.openSnackBar('Une erreur s\'est produite lors de l\'ajout du candidat')
  }
}


    
    
    
    
saveTechFile(): void {
  console.log('Submitting form...');
  if (this.techFileForm.valid) {
    console.log('Form is valid, submitting...');
    this.cvCandidatService.addTechFile({...this.techFileForm.value, employeeNum: this.selectedEmplyee.id}).subscribe({
      next: (res) => {
        console.log('Item added successfully', res);
        this.selectedTechFile = res;
        console.log('Selected technical file ID:', this.selectedTechFile.id);
        console.log('Form value', this.techFileForm.value);
        this.submitted = true;
        this.openSnackBar('Informations complémentaires ajoutées avec succès');
      },
      error: (e) => {
        console.error('Error adding item', e);
        console.log(this.techFileForm.errors);
        
      }
    });
  } else {
    console.log('Form is invalid. Please check the fields.');
    this.openSnackBar('Une erreur s\'est produite lors de l\'ajout des informations complémentaires');
  }
}

    

    ///////////ajoutCandidature////////////////////////
    saveOfferCandidat(id :number): void {
      console.log('ajout...');
      this.cvCandidatService.addOfferCandidate({employeeNum:this.selectedEmplyee.id ,offerNum:id}).subscribe({
        next: (res) => {
          console.log('Item added successfully', res);
          this.selectedTechFile = res;
          console.log('Selected technical file ID:', this.selectedTechFile.id);
         console.log('Form value', this.techFileForm.value);
          this.submitted = true;
        },
        error: (e) => {
          console.error('Error adding item', e);
          console.log('Form is invalid');
          console.log(this.techFileForm.errors);
        }
      });
    }
  

    // Save Expérience 
    saveExperience(): void {
      (this.formExperience.get('value') as FormArray).push(this.fb.group({
        actualEmployment: new UntypedFormControl(false),
        experienceCompany: new UntypedFormControl('', []),
        experiencePost: new UntypedFormControl('', []),
        experienceTitle: new UntypedFormControl('', []),
        experienceRole: new UntypedFormControl('', []),
        experienceStartDate: new UntypedFormControl('', []),
        experienceEndDate: new UntypedFormControl('', []),
        technology: new UntypedFormControl('', []),
      },{ validator: this.dateRangeValidatorExperience }));
    }
  
    saveAllExperiences(): void {
      if (this.formExperience.invalid) {
        console.log('Form has validation errors. Cannot submit.');
        this.openSnackBar('Erreur lors de l\'ajout de l\'expérience');
        return;
      }
    
      const experiences = this.formExperience.get('value').value;
      const experiencesWithTechFileNum = experiences.map((experience: any) => ({
        ...experience,
        technicalFileNum: this.selectedTechFile.id
      }));
    
      this.cvCandidatService.addExperiences(experiencesWithTechFileNum).subscribe({
        next: (res) => {
          console.log('Experiences added successfully', res);
          console.log('Form value', this.formExperience.value);
          this.submitted = true;
          this.openSnackBar('Expérience ajoutée avec succès');
        },
        error: (e) => {
          console.error('Error adding experiences', e);
          console.log(this.formExperience.errors);
        }
      });
    }
    
    

    // Delete experience
  deleteExperience(index: number): void {
    if (index > 0) {
      const edArray = this.formExperience.get('value') as FormArray;
      edArray.removeAt(index);
    }
  }


     // Save language
  

  saveLanguage(): void {
    (this.formLanguage.get('value') as FormArray).push(this.fb.group({
      language: new UntypedFormControl('', []),
      languageLevel: new UntypedFormControl('', []),
      additionalInformation: new UntypedFormControl('', []),
    }));
  }

  /*saveAllLanguages(): void {
    const langauges = this.formLanguage.get('value').value;
    const languagesWithTechFileNum = langauges.map((language: any) => ({
      ...language,
      technicalFileNum: this.selectedTechFile.id
    }));
  
    this.cvCandidatService.addLanguages(languagesWithTechFileNum).subscribe({
      next: (res) => {
        console.log('Languages added successfully', res);
        console.log('Form value', this.formLanguage.value);
        this.submitted = true;
        this.openSnackBar('Langue ajouté avec succés');
      },
      error: (e) => {
        console.error('Error adding languages', e);
        console.log('cv Form is invalid');
        console.log(this.formLanguage.errors);
      }
    });
  }*/
  

  // Delete language
deleteLanguage(index: number): void {
  if (index > 0) {
    const edArray = this.formLanguage.get('value') as FormArray;
    edArray.removeAt(index);
  }
}


  saveSkills(): void {
    (this.formSkills.get('value') as FormArray).push(this.fb.group({
      skillsTitle : new UntypedFormControl('', [])
    }));
  }

 /* saveAllSkills(): void {
    const skills = this.formSkills.get('value').value;
    const skillsWithTechFileNum = skills.map((skill: any) => ({
      ...skill,
      technicalFileNum: this.selectedTechFile.id
    }));
  
    this.cvCandidatService.addSkills(skillsWithTechFileNum).subscribe({
      next: (res) => {
        console.log('Skills added successfully', res);
        console.log('Form value', this.formSkills.value);
        this.submitted = true;
        this.openSnackBar('Compétence ajouté avec succés');
      },
      error: (e) => {
        console.error('Error adding skills', e);
        console.log('cv Form is invalid');
        console.log(this.formSkills.errors);
      }
    });
  }*/
  

  // Delete skills
deleteSkills(index: number): void {
  if (index > 0) {
    const edArray = this.formSkills.get('value') as FormArray;
    edArray.removeAt(index);
  }
}


// Save certif
saveCertification(): void {
  (this.formCertif.get('value') as FormArray).push(this.fb.group({
    certificationTitle: new UntypedFormControl('', []),
      certificationObtainedDate: new UntypedFormControl('', [])
  }));
}

/*saveAllCertifications(): void {
  const certifications = this.formCertif.get('value').value;
  const certificationsWithTechFileNum = certifications.map((certification: any) => ({
    ...certification,
    technicalFileNum: this.selectedTechFile.id
  }));

  this.cvCandidatService.addCertifs(certificationsWithTechFileNum).subscribe({
    next: (res) => {
      console.log('certifications added successfully', res);
      console.log('Form value', this.formCertif.value);
      this.submitted = true;
    },
    error: (e) => {
      console.error('Error adding certifications', e);
      console.log('cv Form is invalid');
      console.log(this.formCertif.errors);
    }
  });
}*/

// Delete certif
deleteCertification(index: number): void {
if (index > 0) {
  const edArray = this.formCertif.get('value') as FormArray;
  edArray.removeAt(index);
}
}



  ///////Snack Bar////
  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'bottom' 
    });
  }
    

    // Save Education
  /*saveEducation(i:any): void {
    this.cvCandidatService.addEducation({...this.formEducation.get('value.'+i).value, technicalFileNum:this.selectedTechFile.id}).subscribe({
      next: (res) => {
        console.log('Item added successfully', res);
       console.log('Form value', this.formEducation.value);
        this.submitted = true;
        (this.formEducation.get('value') as FormArray).push(this.fb.group({

          institution: new UntypedFormControl('', [Validators.required]),
          diploma: new UntypedFormControl('', [Validators.required]),
          score: new UntypedFormControl('', []),
          startYear: new UntypedFormControl('', []),
          obtainedDate: new UntypedFormControl('', []),
          actual: new UntypedFormControl(false)},
          { validator: this.dateRangeValidator }));
        
        this.educationId=res.id
      },
      error: (e) => {
        console.error('Error adding item', e);
        console.log('cv Form is invalid');
        console.log(this.formEducation.errors);
      }
    });

  }*/

  saveEducation(): void {
    (this.formEducation.get('value') as FormArray).push(this.fb.group({
      institution: new UntypedFormControl('', [Validators.required]),
      diploma: new UntypedFormControl('', [Validators.required]),
      score: new UntypedFormControl('', []),
      startYear: new UntypedFormControl('', []),
      obtainedDate: new UntypedFormControl('', []),
      actual: new UntypedFormControl(false)
    }, { validator: this.dateRangeValidator }));
  }

  saveAllEducations(): void {
    if (this.formEducation.invalid) {
      console.log('Form has validation errors. Cannot submit.');
      this.openSnackBar('Erreur lors de l\'ajout de l\'éducation');
      return;
    }
  
    const educations = this.formEducation.get('value').value;
    const educationsWithTechFileNum = educations.map((education: any) => ({
      ...education,
      technicalFileNum: this.selectedTechFile.id
    }));
  
    this.cvCandidatService.addEducations(educationsWithTechFileNum).subscribe({
      next: (res) => {
        console.log('Educations added successfully', res);
        console.log('Form value', this.formEducation.value);
        this.submitted = true;
        this.openSnackBar('Education ajouté avec succés');
      },
      error: (e) => {
       
        console.error('Error adding educations', e);
        console.log(this.formEducation.errors);
        
      }
    });
  }
  
  

  // Delete education
deleteEducation(index: number): void {
  if (index > 0) {
    const edArray = this.formEducation.get('value') as FormArray;
    edArray.removeAt(index);
  }
}


////SAve Skills , Languages , Certiffication 
saveAllData(): void {
  // Save Languages
  const languages = this.formLanguage.get('value').value;
  const languagesWithTechFileNum = languages.map((language: any) => ({
    ...language,
    technicalFileNum: this.selectedTechFile.id
  }));

  this.cvCandidatService.addLanguages(languagesWithTechFileNum).subscribe({
    next: (res) => {
      console.log('Languages added successfully', res);
      console.log('Form value', this.formLanguage.value);
      this.submitted = true;
      this.openSnackBar('Langue ajoutée avec succès');

      // Save Skills
      const skills = this.formSkills.get('value').value;
      const skillsWithTechFileNum = skills.map((skill: any) => ({
        ...skill,
        technicalFileNum: this.selectedTechFile.id
      }));

      this.cvCandidatService.addSkills(skillsWithTechFileNum).subscribe({
        next: (res) => {
          console.log('Skills added successfully', res);
          console.log('Form value', this.formSkills.value);
          this.submitted = true;
          this.openSnackBar('Compétence ajoutée avec succès');

          // Save Certifications
          const certifications = this.formCertif.get('value').value;
          const certificationsWithTechFileNum = certifications.map((certification: any) => ({
            ...certification,
            technicalFileNum: this.selectedTechFile.id
          }));

          this.cvCandidatService.addCertifs(certificationsWithTechFileNum).subscribe({
            next: (res) => {
              console.log('Certifications added successfully', res);
              console.log('Form value', this.formCertif.value);
              this.submitted = true;
            },
            error: (e) => {
              console.error('Error adding certifications', e);
              console.log('cv Form is invalid');
              console.log(this.formCertif.errors);
            }
          });
        },
        error: (e) => {
          console.error('Error adding skills', e);
          console.log('cv Form is invalid');
          console.log(this.formSkills.errors);
        }
      });
    },
    error: (e) => {
      console.error('Error adding languages', e);
      console.log('cv Form is invalid');
      console.log(this.formLanguage.errors);
    }
  });
}


  ///// Form Submit/////
  onSubmit() {
    // Get the values of each form
    const formData = this.myForm.value;
    this.http.post('http://localhost:8080/rh/employee', formData)
  .pipe(
    catchError(error => {
      console.log(error);
      return of(error);
    })
  )
  .subscribe(response => {
    console.log(response);
    // Handle the response, such as displaying a success message
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
  if (index > 0) { // check if the index is greater than 0
    const repeatArray = this.repeatForm.get('repeatArray') as FormArray;
    repeatArray.removeAt(index);
}
}

  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }


  onCountryChange(countryShotName: string) {
    this.states = this.cvCandidatService.getStatesByCountry(countryShotName);
  }
  
  getOfferItems() {    
    this.getItemSub = this.cvCandidatService.getOfferItems()
      .subscribe((data:any)  => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  getDisplayedColumns() {
    return ['reference','title','actions' ];
  }



  civilityMap = {
    [Civility.MRS]:'Mme',
    [Civility.MS]:'Mlle',
   [Civility.MR]:'Mr'
  };



  employeeTitleMap = {
    [Title.FRONT_END_DEVELOPER]: 'Développeur Front-End',
    [Title.BACK_END_DEVELOPER]: 'Développeur Back-End',
    [Title.FULLSTACK_DEVELOPER]: 'Développeur Full-Stack',
    [Title.CRM]: 'CRM',
    [Title.HUMAN_RESOURCE_MANAGER]: 'Responsable des Ressources Humaines',
    [Title.HUMAN_RESOURCE]: 'Ressources Humaines',
    [Title.PROJECT_MANAGER]: 'Chef de Projet',
    [Title.TECH_LEAD]: 'Chef de Projet',
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

  
  openDialogOffer() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px'; // set the width
    dialogConfig.height = '350px'; // set the height

    const dialogRef = this.dialog.open(OfferPopupComponent, dialogConfig);

  }
  
  openPopUpCandidature(offerId: number) {
    const title = 'Nouvelle candidature';
    const dialogRef: MatDialogRef<any> = this.dialog.open(OfferPopupComponent, {
      width: '500px',
      disableClose: true,
      data: { title: title, isNew: true, offerNum: offerId }
    });
  
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If the user presses cancel or closes the dialog
        console.log('Dialog closed without submitting.');
        return;
      }
  
      console.log('Dialog submitted:', res);
  
      const employeeNum = this.selectedEmplyee.id; // Assuming you have stored the employee number in the 'selectedEmployeeNum' variable
      console.log('Employee Number:', employeeNum);
      console.log('Offer Number:', offerId);
  
      // Create the request payload based on the form values
      const payload = {
        applicationDate: res.applicationDate,
        experienceLevel: res.experienceLevel,
        employeeNum: employeeNum,
        offerNum: offerId
        // Add other attributes as needed
      };
  
      // Assuming you have a service called 'cvCandidatService' to handle the API requests
      this.cvCandidatService.addOfferCandidate(payload).subscribe(
        (data: any) => {
          console.log('Add offer candidate success:', data);
          this.dataSource = data;
          this.isButtonDisabled = true; // Disable the button
        },
        (error) => {
          console.log('Add offer candidate error:', error);
          this.loader.close();
          this.snack.open('Erreur lors de l\'ajout de la candidature', 'OK', { duration: 2000 });
        }
      );
    });
  }

 
  
}
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CompanyStatus, ControlType, Currency, LegalStatus, Partner, PaymentCondition, PaymentMode, WorkField } from 'app/shared/models/Partner';
import { Civility, Privilege } from 'app/shared/models/contact';
import { CrudPartnerService } from '../crudPartner.service';
import { Observable, Subscription, catchError, of } from 'rxjs';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Employee } from 'app/shared/models/Employee';
import { AddAddressService } from '../../add-address/add-address.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ValidatorService } from 'angular-iban';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
}
@Component({
  selector: 'app-partner-stepper',
  templateUrl: './partner-stepper.component.html',
  styleUrls: ['./partner-stepper.component.scss'],
  providers: [
    // Provide custom date format
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class PartnerStepperComponent implements OnInit {

  currentStepIndex = 0
  formData = {}
  console = console;
  partnerForm: FormGroup;
  partnerAddressForm: FormGroup;
  coordonneesForm: FormGroup;
  contactForm: FormGroup;
  financialInfoForm:FormGroup;
  complInfoForm:FormGroup;
  bankAccountForm: FormGroup
  ibanReactive: FormControl

  step1:FormGroup;
  step2:FormGroup;
  step3:FormGroup;
  step4:FormGroup;
  step5:FormGroup;
  step6:FormGroup;
  lastEmployee: Employee;
  selectedEmployee= {firstName :'', id:null};
  selectedPartner= {id:null, name:'', ref:'', currency:''};
  submitted = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  isPageReloaded = false;
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
  addressId:number;
  bankAccountId:number;
  contactId: number;

  i: number;
  j: number;
  k: number;

  companyStatus = Object.values(CompanyStatus).filter(status => status !== CompanyStatus.ARCHIVED);
  legalStatus = Object.values(LegalStatus)
  paymentMode = Object.values(PaymentMode)
  paymentCondition = Object.values(PaymentCondition)
  civilities = Object.values(Civility)
  privileges = Object.values(Privilege)
  controlTypes = Object.values(ControlType)
  // Get the sorted currency values
  sortedCurrencies = Object.values(Currency).sort();

  constructor(
    private _formBuilder: FormBuilder,
    private partnerService: CrudPartnerService,
    private addressService: AddAddressService,
    private formBuilder: FormBuilder,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private datePipe: DatePipe,
  ) {}

// Validator pour vérifier si le nom commence par une majuscule
 capitalLetterValidator2: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const name = control.value;
  if (name && name.trim() !== '' && name.charAt(0) !== name.charAt(0).toUpperCase()) {
    return { capitalLetter: true }; // Le nom ne commence pas par une majuscule
  }
  return null; // Le nom commence par une majuscule ou est vide
};

// Validator pour vérifier l'unicité du nom
 uniqueNameValidator: AsyncValidatorFn = (control: AbstractControl): Observable<ValidationErrors | null> => {
  return new Observable<ValidationErrors | null>((observer) => {
    const name = control.value;

    this.partnerService.getItems().subscribe((partners: Partner[]) => {
      const nameExists = partners.some(partner => partner.name === name);

      if (nameExists) {
        observer.next({ nameExists: true }); // Le nom existe déjà
      } else {
        observer.next(null); // Le nom est unique
      }
      observer.complete();
    }, (error) => {
      observer.error('Une erreur est survenue lors de la récupération des partenaires.');
      observer.complete();
    });
  });
};


  ngOnInit(): void {
    this.partnerForm = new UntypedFormGroup({
      name: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        this.capitalLetterValidator
      ]),
      companyStatus: new UntypedFormControl('', [Validators.required]),
      legalStatus: new UntypedFormControl('', []),
      externalReference :  new UntypedFormControl('', []),
      legalIdentifier: new UntypedFormControl('', []),
      tvaIdentifier: new UntypedFormControl('',[] ),
      nafCode: new UntypedFormControl('',[] ),
      logo: new UntypedFormControl('',[Validators.required] ),
      ref: new UntypedFormControl('',[Validators.required, 
        Validators.pattern(/^[a-zA-Z0-9]{10}$/)] ),
      partnershipDate: new UntypedFormControl('',[Validators.required])
    })
    
    this.initializeAddressForm()
    this.initializeAccountForm()
    this.initializeContactForm()

    
    this.coordonneesForm = this.fb.group({
      phoneNumber: new UntypedFormControl('', []),
      mobilePhoneNumber: new UntypedFormControl('', []),
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50)
      ]),
      webSite: new UntypedFormControl('', []),
    });

    this.financialInfoForm = this.fb.group({
      currency: new UntypedFormControl('', []),
      paymentMode: new UntypedFormControl('', []),
      paymentCondition : new UntypedFormControl('', [])
    });

    this.complInfoForm = this.fb.group({
      partnerShipDate: new UntypedFormControl('', []),
      activityStartDate: new UntypedFormControl('', []),
      activityEndDate: new UntypedFormControl('', []),
      foundedSince: new UntypedFormControl('', []),
      inProgressAuthorized: new UntypedFormControl('', []),
      classification: new UntypedFormControl('', []),
      controlType: new UntypedFormControl('', []),
      insurancePolicy: new UntypedFormControl('', []),
      insuranceCompany: new UntypedFormControl('', []),
      
      capital: new UntypedFormControl('', []),
      comment: new UntypedFormControl('', []),
      toleranceRate: new UntypedFormControl('', [])
    });

    const nameControl = this.partnerForm.get('name');


    if (nameControl) {
      nameControl.setAsyncValidators(this.uniqueNameValidator);
      nameControl.setValidators([Validators.required, this.capitalLetterValidator]);
    }

    

    /*********************************** Controle General Info Fields *******************************************/
    const companyStatusControl = this.partnerForm.get('companyStatus');
    
    /*********************************** Controle externalReference Field *******************************************/
   
    const externalReferenceControl = this.partnerForm.get('externalReference');
    if (companyStatusControl && externalReferenceControl) {
      companyStatusControl.valueChanges.subscribe((status: string) => {
        if (status === 'PROSPECT') {
          externalReferenceControl.clearValidators(); // Remove required validator
          externalReferenceControl.setValue(null);
          externalReferenceControl.updateValueAndValidity();
        } else {
          externalReferenceControl.setValidators([Validators.required]); // Set as required
          externalReferenceControl.updateValueAndValidity();
        }
      });
    }
      /*********************************** Controle legalIdentifier Field *******************************************/

    const legalIdentifierControl = this.partnerForm.get('legalIdentifier');
    if (companyStatusControl && legalIdentifierControl){
      companyStatusControl.valueChanges.subscribe((status: string) => {
        const legalIdentifierControl = this.partnerForm.get('legalIdentifier');
  
        if (legalIdentifierControl) {
          if (status === 'PROSPECT') {
            legalIdentifierControl.clearValidators(); // Remove required validator
            legalIdentifierControl.setValue(null);
          //  legalIdentifierControl.disable();
            legalIdentifierControl.updateValueAndValidity();
          } else {
            legalIdentifierControl.setValidators([Validators.required, Validators.maxLength(30)]); // Set as required
        //    legalIdentifierControl.enable();
            legalIdentifierControl.updateValueAndValidity();
          }
        }
      });
    }

          /*********************************** Controle legalStatus Field *******************************************/
          const legalStatusControl = this.partnerForm.get('legalStatus');
          if (companyStatusControl && legalStatusControl){
            companyStatusControl.valueChanges.subscribe((status: string) => {
              const legalStatusControl = this.partnerForm.get('legalStatus');
        
              if (legalStatusControl) {
                if (status === 'PROSPECT') {
                  legalStatusControl.clearValidators(); // Remove required validator
                  legalStatusControl.setValue(null);
                 // legalStatusControl.disable();
                  legalStatusControl.updateValueAndValidity();
                } else {
                  legalStatusControl.setValidators([Validators.required, Validators.maxLength(30)]); // Set as required
                //  legalStatusControl.enable();
                  legalStatusControl.updateValueAndValidity();
                }
              }
            });
          }


          /*********************************** Controle tvaIdentifier Field *******************************************/

    const tvaIdentifierControl = this.partnerForm.get('tvaIdentifier');
    if (companyStatusControl && tvaIdentifierControl){
      companyStatusControl.valueChanges.subscribe((status: string) => {
        const tvaIdentifierControl = this.partnerForm.get('tvaIdentifier');
  
        if (tvaIdentifierControl) {
          if (status === 'PROSPECT') {
            tvaIdentifierControl.clearValidators(); // Remove required validator
            tvaIdentifierControl.setValue(null);
            // tvaIdentifierControl.disable();
            tvaIdentifierControl.updateValueAndValidity();
          } else {
            tvaIdentifierControl.setValidators([Validators.required]); // Set as required
           // tvaIdentifierControl.enable();
            tvaIdentifierControl.updateValueAndValidity();
          }
        }
      });
    }

     /*********************************** Controle nafCode Field *******************************************/

     const nafCodeControl = this.partnerForm.get('nafCode');
     if (companyStatusControl && nafCodeControl){
      companyStatusControl.valueChanges.subscribe((status: string) => {
         const nafCodeControl = this.partnerForm.get('nafCode');
   
         if (nafCodeControl) {
           if (status === 'PROSPECT') {
            nafCodeControl.clearValidators(); // Remove required validator
            nafCodeControl.setValue(null);
           // nafCodeControl.disable();
            nafCodeControl.updateValueAndValidity();
           } else {
            nafCodeControl.setValidators([Validators.required]); // Set as required
          //  nafCodeControl.enable();
            nafCodeControl.updateValueAndValidity();
           }
         }
       });
     }
     /*********************************** Controle "Coordonnées" Fields *******************************************/
    
     /*********************************** Controle phoneNumber Field *******************************************/
    
     const phoneNumberControl = this.coordonneesForm.get('phoneNumber');
     if (companyStatusControl && phoneNumberControl) {
       companyStatusControl.valueChanges.subscribe((status: string) => {
         if (status === 'PROSPECT') {
          phoneNumberControl.clearValidators(); // Remove required validator
          phoneNumberControl.setValue(null);
          phoneNumberControl.updateValueAndValidity();
         } else {
          phoneNumberControl.setValidators([  Validators.required, Validators.pattern(/^[\d\s\-+]*$/)]); 
          phoneNumberControl.updateValueAndValidity();
         }
       });
     }
     /*********************************** Controle phoneNumber Field *******************************************/
    
     const mobilePhoneNumberControl = this.coordonneesForm.get('mobilePhoneNumber');
     if (companyStatusControl && mobilePhoneNumberControl) {
       companyStatusControl.valueChanges.subscribe((status: string) => {
         if (status === 'PROSPECT') {
          mobilePhoneNumberControl.clearValidators(); // Remove required validator
          mobilePhoneNumberControl.setValue(null);
          mobilePhoneNumberControl.updateValueAndValidity();
         } else {
          mobilePhoneNumberControl.setValidators([  
            Validators.required,
            Validators.pattern(/^[\d\s\-+]*$/)]); 
            mobilePhoneNumberControl.updateValueAndValidity();
         }
       });
     }

     

      /*********************************** Controle webSite Field *******************************************/
  
      const webSiteControl = this.coordonneesForm.get('webSite');
      if (companyStatusControl && webSiteControl) {
        companyStatusControl.valueChanges.subscribe((status: string) => {
          if (status === 'PROSPECT') {
            webSiteControl.clearValidators(); // Remove required validator
            webSiteControl.setValue(null);
            webSiteControl.updateValueAndValidity();
          } else {
            webSiteControl.setValidators([  
             Validators.required]); 
             webSiteControl.updateValueAndValidity();
          }
        });
      }

      
      /*********************************** Controle email Field *******************************************/
 
      const emailControl = this.coordonneesForm.get('email');
      if (companyStatusControl && emailControl) {
        companyStatusControl.valueChanges.subscribe((status: string) => {
          if (status === 'PROSPECT') {
            emailControl.clearValidators(); // Remove required validator
            emailControl.setValue(null);
            emailControl.updateValueAndValidity();
          } else {
            emailControl.setValidators([  
              Validators.required,
              Validators.email,
              Validators.maxLength(50)]); 
             emailControl.updateValueAndValidity();
          }
        });
      }

        /*********************************** Controle "Infos financières" Fields *******************************************/
    
     /*********************************** Controle currency Field *******************************************/
    
     
     const currencyControl = this.financialInfoForm.get('currency');
     if (companyStatusControl && currencyControl) {
       companyStatusControl.valueChanges.subscribe((status: string) => {
         if (status === 'PROSPECT') {
          currencyControl.clearValidators(); // Remove required validator
          currencyControl.setValue(null);
          currencyControl.updateValueAndValidity();
         } else {
          currencyControl.setValidators([  Validators.required]); 
          currencyControl.updateValueAndValidity();
         }
       });
     }

       /*********************************** Controle paymentMode Field *******************************************/
    
       const paymentModeControl = this.financialInfoForm.get('paymentMode');
       if (companyStatusControl && paymentModeControl) {
         companyStatusControl.valueChanges.subscribe((status: string) => {
           if (status === 'PROSPECT') {
            paymentModeControl.clearValidators(); // Remove required validator
            paymentModeControl.setValue(null);
            paymentModeControl.updateValueAndValidity();
           } else {
            paymentModeControl.setValidators([  Validators.required]); 
            paymentModeControl.updateValueAndValidity();
           }
         });
       }

      
         /*********************************** Controle paymentMode Field *******************************************/
    
         const paymentConditionControl = this.financialInfoForm.get('paymentCondition');
         if (companyStatusControl && paymentConditionControl) {
           companyStatusControl.valueChanges.subscribe((status: string) => {
             if (status === 'PROSPECT') {
              paymentConditionControl.clearValidators(); // Remove required validator
              paymentConditionControl.setValue(null);
              paymentConditionControl.updateValueAndValidity();
             } else {
              paymentConditionControl.setValidators([  Validators.required]); 
              paymentConditionControl.updateValueAndValidity();
             }
           });
         }

          /*********************************** Controle "Infos complémentaires" Fields *******************************************/
      
     /*********************************** Controle complInfoForm Field *******************************************/
    
     const partnerShipDateControl = this.complInfoForm.get('partnerShipDate');
     if (companyStatusControl && partnerShipDateControl) {
       companyStatusControl.valueChanges.subscribe((status: string) => {
         if (status === 'PROSPECT') {
          partnerShipDateControl.clearValidators(); // Remove required validator
          partnerShipDateControl.setValue(null);
          partnerShipDateControl.updateValueAndValidity();
         } else {
          partnerShipDateControl.setValidators([  Validators.required]); 
          partnerShipDateControl.updateValueAndValidity();
         }
       });
     }


     /*********************************** Controle activityStartDate Field *******************************************/
    
     const activityStartDateControl = this.complInfoForm.get('activityStartDate');
     if (companyStatusControl && activityStartDateControl) {
       companyStatusControl.valueChanges.subscribe((status: string) => {
         if (status === 'PROSPECT') {
          activityStartDateControl.clearValidators(); // Remove required validator
          activityStartDateControl.setValue(null);
          activityStartDateControl.updateValueAndValidity();
         } else {
          activityStartDateControl.setValidators([  Validators.required]); 
          activityStartDateControl.updateValueAndValidity();
         }
       });
     }



       /*********************************** Controle activityEndDate Field *******************************************/
    
       const activityEndDateControl = this.complInfoForm.get('activityEndDate');
       if (companyStatusControl && activityEndDateControl) {
         companyStatusControl.valueChanges.subscribe((status: string) => {
           if (status === 'PROSPECT') {
            activityEndDateControl.clearValidators(); // Remove required validator
            activityEndDateControl.setValue(null);
            activityEndDateControl.updateValueAndValidity();
           } else {
            activityEndDateControl.setValidators([  Validators.required]); 
            activityEndDateControl.updateValueAndValidity();
           }
         });
       }

        /*********************************** Controle foundedSince Field *******************************************/
    
        const foundedSinceControl = this.complInfoForm.get('foundedSince');
        if (companyStatusControl && foundedSinceControl) {
          companyStatusControl.valueChanges.subscribe((status: string) => {
            if (status === 'PROSPECT') {
              foundedSinceControl.clearValidators(); // Remove required validator
              foundedSinceControl.setValue(null);
              foundedSinceControl.updateValueAndValidity();
            } else {
              foundedSinceControl.setValidators([  Validators.required]); 
              foundedSinceControl.updateValueAndValidity();
            }
          });
        }

            /*********************************** Controle inProgressAuthorized Field *******************************************/
    
            const inProgressAuthorizedControl = this.complInfoForm.get('inProgressAuthorized');
            if (companyStatusControl && inProgressAuthorizedControl) {
              companyStatusControl.valueChanges.subscribe((status: string) => {
                if (status === 'PROSPECT') {
                  inProgressAuthorizedControl.clearValidators(); // Remove required validator
                  inProgressAuthorizedControl.setValue(null);
                  inProgressAuthorizedControl.updateValueAndValidity();
                } else {
                  inProgressAuthorizedControl.setValidators([  Validators.required]); 
                  inProgressAuthorizedControl.updateValueAndValidity();
                }
              });
            }

            
            /*********************************** Controle classification Field *******************************************/
    
            const classificationControl = this.complInfoForm.get('classification');
            if (companyStatusControl && classificationControl) {
              companyStatusControl.valueChanges.subscribe((status: string) => {
                if (status === 'PROSPECT') {
                  classificationControl.clearValidators(); // Remove required validator
                  classificationControl.setValue(null);
                  classificationControl.updateValueAndValidity();
                } else {
                  classificationControl.setValidators([  Validators.required]); 
                  classificationControl.updateValueAndValidity();
                }
              });
            }

             
            /*********************************** Controle controlType Field *******************************************/
    
            const controlTypeControl = this.complInfoForm.get('controlType');
            if (companyStatusControl && controlTypeControl) {
              companyStatusControl.valueChanges.subscribe((status: string) => {
                if (status === 'PROSPECT') {
                  controlTypeControl.clearValidators(); // Remove required validator
                  controlTypeControl.setValue(null);
                  controlTypeControl.updateValueAndValidity();
                } else {
                  controlTypeControl.setValidators([  Validators.required]); 
                  controlTypeControl.updateValueAndValidity();
                }
              });
            }


            /*********************************** Controle insurancePolicy Field *******************************************/
    
            const insurancePolicyControl = this.complInfoForm.get('insurancePolicy');
            if (companyStatusControl && insurancePolicyControl) {
              companyStatusControl.valueChanges.subscribe((status: string) => {
                if (status === 'PROSPECT') {
                  insurancePolicyControl.clearValidators(); // Remove required validator
                  insurancePolicyControl.setValue(null);
                  insurancePolicyControl.updateValueAndValidity();
                } else {
                  insurancePolicyControl.setValidators([  Validators.required]); 
                  insurancePolicyControl.updateValueAndValidity();
                }
              });
            }

             /*********************************** Controle insuranceCompany Field *******************************************/
    
             const insuranceCompanyControl = this.complInfoForm.get('insuranceCompany');
             if (companyStatusControl && insuranceCompanyControl) {
               companyStatusControl.valueChanges.subscribe((status: string) => {
                 if (status === 'PROSPECT') {
                  insuranceCompanyControl.clearValidators(); // Remove required validator
                  insuranceCompanyControl.setValue(null);
                  insuranceCompanyControl.updateValueAndValidity();
                 } else {
                  insuranceCompanyControl.setValidators([  Validators.required]); 
                  insuranceCompanyControl.updateValueAndValidity();
                 }
               });
             }

             /*********************************** Controle capital Field *******************************************/
    
             const capitalControl = this.complInfoForm.get('capital');
             if (companyStatusControl && capitalControl) {
               companyStatusControl.valueChanges.subscribe((status: string) => {
                 if (status === 'PROSPECT') {
                  capitalControl.clearValidators(); // Remove required validator
                  capitalControl.setValue(null);
                  capitalControl.updateValueAndValidity();
                 } else {
                  capitalControl.setValidators([  Validators.required]); 
                  capitalControl.updateValueAndValidity();
                 }
               });
             }

               /*********************************** Controle comment Field *******************************************/
    
               const commentControl = this.complInfoForm.get('comment');
               if (companyStatusControl && commentControl) {
                 companyStatusControl.valueChanges.subscribe((status: string) => {
                   if (status === 'PROSPECT') {
                    commentControl.clearValidators(); // Remove required validator
                    commentControl.setValue(null);
                    commentControl.updateValueAndValidity();
                   } else {
                    commentControl.setValidators([  Validators.required]); 
                    commentControl.updateValueAndValidity();
                   }
                 });
               }

                 /*********************************** Controle toleranceRate Field *******************************************/
              
                 const toleranceRateControl = this.complInfoForm.get('toleranceRate');
                 if (companyStatusControl && toleranceRateControl) {
                   companyStatusControl.valueChanges.subscribe((status: string) => {
                     if (status === 'PROSPECT') {
                      toleranceRateControl.clearValidators(); // Remove required validator
                      toleranceRateControl.setValue(null);
                      toleranceRateControl.updateValueAndValidity();
                     } else {
                      toleranceRateControl.setValidators([   
                        Validators.required,
                        Validators.max(5)]); 
                      toleranceRateControl.updateValueAndValidity();
                     }
                   });
                 }
  
  
  }

  initializeAddressForm(): void {
    this.partnerAddressForm = this.fb.group({
      value: this.fb.array([]),
    });
  
    const initialFormGroup = this.fb.group({
      type: new UntypedFormControl('', [Validators.required]),
      num: new UntypedFormControl('', [Validators.required]),
      street: new UntypedFormControl('', [Validators.required]),
      postalCode: new UntypedFormControl('', [Validators.required]),
      city: new UntypedFormControl('', [Validators.required]),
      region: new UntypedFormControl('', [Validators.required]),
      country: new UntypedFormControl('', [Validators.required]),
      isSubmitted: new FormControl(false), // Add the isSubmitted property to the initial FormGroup
    });
  
    (this.partnerAddressForm.get('value') as FormArray).push(initialFormGroup);
  }
  
  initializeAccountForm(): void {
    this.bankAccountForm = this.fb.group({
      value: this.fb.array([]),
    });

    const initialFormGroup = this.fb.group({
      bankName :new UntypedFormControl('',[Validators.required]),
      rib: new UntypedFormControl('', [
        Validators.required,
        //Validators.pattern(/^(0[1-9]|[1-8]\d|9[0-7])$/)
      ]),
      bic: new UntypedFormControl('', [Validators.required,
        Validators.pattern(/^[A-Z]{4}[-]{0,1}[A-Z]{2}[-]{0,1}[A-Z0-9]{2}[-]{0,1}[0-9]{3}$/)]),
      iban: new UntypedFormControl('', [Validators.required, ValidatorService.validateIban]),
      bankAddress: new UntypedFormControl('', [Validators.required]),
      isSubmitted: new FormControl(false), // Add the isSubmitted property to the initial FormGroup
    });
    (this.bankAccountForm.get('value') as FormArray).push(initialFormGroup);
  }

  initializeContactForm(): void {
    this.contactForm = this.fb.group({
      value: this.fb.array([]),
    })

    const initialFormGroup = this.fb.group({
      civility :new UntypedFormControl('',[Validators.required]),
      firstName: new UntypedFormControl('', [
        Validators.required,
        this.capitalLetterValidator
      ]),
      lastName: new UntypedFormControl('', [
        Validators.required,
        this.capitalLetterValidator
      ]),
      privilege: new UntypedFormControl('', [Validators.required]),
      privilegedContact: new UntypedFormControl(false),
      appointmentMaking: new UntypedFormControl(false),
      service: new UntypedFormControl('', [Validators.required]),
      function: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', []),
      mobilePhoneNumber: new UntypedFormControl('', [Validators.required]),
      phoneNumber: new UntypedFormControl('', []),
      comment: new UntypedFormControl('', []),
      isSubmitted: new FormControl(false), // Add the isSubmitted property to the initial FormGroup
    });
    (this.contactForm.get('value') as FormArray).push(initialFormGroup);
  }

  /////Make first letter capital//////
  capitalLetterValidator(control: FormControl): { [key: string]: boolean } | null {
    const firstLetter = control.value.charAt(0);
    if (firstLetter && firstLetter !== firstLetter.toUpperCase()) {
      return { 'capitalLetter': true };
    }
    return null;
  }

  onStepChange(index: number): void {
    if (index >= this.currentStepIndex) {
      // Allow navigation to the next step
      this.currentStepIndex = index;
    } else {
      // Block navigation to previous steps
      // You can show an error message or handle it as desired
    }
  }

  onFileSelected(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        console.log(reader.result)
        this.partnerForm.patchValue({
          logo: reader.result
        });
  
        console.log(this.partnerForm.value)
      };
    }
  }

  savePartner(): void {
    console.log('Submitting form...');
  //  if (this.myForm.valid) {
      console.log('Form is valid, submitting...');
      this.partnerService.addItem(this.partnerForm.value).subscribe({
        next: (res) => {
          console.log('Item added successfully', res);
          this.selectedPartner = res;
          console.log('Selected partner ID:', this.selectedPartner.id);
          console.log('Form value', this.partnerForm.value);
          this.submitted = true;
         // this.openPopUp();
        },
        error: (e) => console.error('Error adding item', e)
      });
      //this.dialog.open(cvDialog1Component);
    }

  savePartnerCoordonnees(): void {
    console.log('Submitting form...');
  //  if (this.myForm.valid) {
      console.log('Form is valid, submitting...');
      console.log('Selected partner ID:', this.selectedPartner.id);
      console.log('Form value', this.coordonneesForm.value);
      this.partnerService.addPartnerCoordonnees({...this.coordonneesForm.value , id:this.selectedPartner.id}).subscribe({
        next: (res) => {
          console.log('Item added successfully', res);
          this.selectedPartner = res;
          console.log('Selected partner ID:', this.selectedPartner.id);
          console.log('Form value', this.coordonneesForm.value);
          this.submitted = true;
         // this.openPopUp();
        },
        error: (e) => console.error('Error adding item', e)
      });
    }

    saveFinancial(): void {
      console.log('Submitting form...');
    //  if (this.myForm.valid) {
        console.log('Form is valid, submitting...');
        console.log('Selected partner ID:', this.selectedPartner.id);
        console.log('Form value', this.financialInfoForm.value);
        this.partnerService.addPartnerFinancial({...this.financialInfoForm.value , id:this.selectedPartner.id}).subscribe({
          next: (res) => {
            console.log('Item added successfully', res);
            this.selectedPartner = res;
            console.log('Selected partner ID:', this.selectedPartner.id);
            console.log('Form value', this.financialInfoForm.value);
            this.submitted = true;
           // this.openPopUp();
          },
          error: (e) => console.error('Error adding item', e)
        });
      }

  savePartnerCompleted(): void {
    console.log('Submitting form...');
    //  if (this.myForm.valid) {
    console.log('Form is valid, submitting...');
    console.log('Selected partner ID:', this.selectedPartner.id);
    console.log('Form value', this.complInfoForm.value);
    this.partnerService.finishPartnerInfos({...this.complInfoForm.value , id:this.selectedPartner.id}).subscribe({
      next: (res) => {
        console.log('Item added successfully', res);
        this.selectedPartner = res;
        console.log('Selected partner ID:', this.selectedPartner.id);
        console.log('Form value', this.complInfoForm.value);
        this.submitted = true;
        // this.openPopUp();
        },
          error: (e) => console.error('Error adding item', e)
      });
    }

  // Save previous address and open a new address form
  saveAddAddress(i: number): void {
    const addressArray = this.partnerAddressForm.get('value') as FormArray;
    const addressFormGroup = addressArray.at(i) as FormGroup;
  
    addressFormGroup.get('isSubmitted')?.setValue(true);

    this.addressService.addAddress({...addressFormGroup.value, partnerNum: this.selectedPartner.id}).subscribe({
      next: (res) => {
       console.log('Item added successfully', res);
       console.log('Form value', this.partnerAddressForm.value.value[i]);
        this.submitted = true;
        this.addressId=res.id
      },
      error: (e) => {
        console.error('Error adding item', e);
        console.log('partner details is invalid');
        console.log(this.partnerAddressForm.errors);
      }
    })
  
    // Add a new form group to the FormArray and reset the fields
    const newFormGroup = this.fb.group({
      type: new UntypedFormControl('', [Validators.required]),
      num: new UntypedFormControl('', [Validators.required]),
      street: new UntypedFormControl('', [Validators.required]),
      postalCode: new UntypedFormControl('', [Validators.required]),
      city: new UntypedFormControl('', [Validators.required]),
      region: new UntypedFormControl('', [Validators.required]),
      country: new UntypedFormControl('', [Validators.required]),
      isSubmitted: new FormControl(false), // Add the isSubmitted property to the new FormGroup
    });
  
    addressArray.push(newFormGroup);
  }
  
  
  
  
  

  // Enregistrer dernière adresse du partenaire
  saveAddress(i: number): void {
    const addressArray = this.partnerAddressForm.get('value') as FormArray;
    const addressFormGroup = addressArray.at(i) as FormGroup;
  
    addressFormGroup.get('isSubmitted')?.setValue(true);
  
    this.addressService.addAddress({...addressFormGroup.value, partnerNum: this.selectedPartner.id}).subscribe({
     next: (res) => {
      console.log('Item added successfully', res);
      console.log('Form value', this.partnerAddressForm.value.value[i]);
       this.submitted = true;
       this.addressId=res.id
     },
     error: (e) => {
       console.error('Error adding item', e);
       console.log('partner details is invalid');
       console.log(this.partnerAddressForm.errors);
     }
   })
  }

  // Save previous bank account and open a new bank account form
  saveAddBankAccount(i: number): void {
    const accountArray = this.bankAccountForm.get('value') as FormArray;
    const accountFormGroup = accountArray.at(i) as FormGroup;
  
    accountFormGroup.get('isSubmitted')?.setValue(true);

    this.partnerService.addBankAccount({...accountFormGroup.value, partnerNum:this.selectedPartner.id}).subscribe({
     next: (res) => {
      console.log('Item added successfully', res);
      console.log('Form value', this.bankAccountForm.value.value[i]);
       this.submitted = true;
       this.bankAccountId=res.id
     },
     error: (e) => {
       console.error('Error adding item', e);
       console.log('partner details is invalid');
       console.log(this.bankAccountForm.errors);
     }
   })

   // Add a new form group to the FormArray and reset the fields
   const newFormGroup = this.fb.group({
    bankName :new UntypedFormControl('',[Validators.required]),
      rib: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(/^(0[1-9]|[1-8]\d|9[0-7])$/)
      ]),
      bic: new UntypedFormControl('', [Validators.required,
        Validators.pattern(/^[A-Z]{4}[-]{0,1}[A-Z]{2}[-]{0,1}[A-Z0-9]{2}[-]{0,1}[0-9]{3}$/)]),
      iban: new UntypedFormControl('', [Validators.required, ValidatorService.validateIban]),
      bankAddress: new UntypedFormControl('', [Validators.required]),
    isSubmitted: new FormControl(false), // Add the isSubmitted property to the new FormGroup
  });

    accountArray.push(newFormGroup);
  }

  // Enregistrer dernier compte bancaire au partenaire 
  saveBankAccount(i:any): void {
    const accountArray = this.bankAccountForm.get('value') as FormArray;
    const accountFormGroup = accountArray.at(i) as FormGroup;
  
    accountFormGroup.get('isSubmitted')?.setValue(true);
     
    this.partnerService.addBankAccount({...accountFormGroup.value, partnerNum:this.selectedPartner.id}).subscribe({
     next: (res) => {
      console.log('Item added successfully', res);
      console.log('Form value', this.bankAccountForm.value.value[i]);
       this.submitted = true;
       this.bankAccountId=res.id
     },
     error: (e) => {
       console.error('Error adding item', e);
       console.log('partner details is invalid');
       console.log(this.bankAccountForm.errors);
     }
   })
  }

  // Save previous contact and open a new contact form
  saveAddContact(i:any): void {
    const contactArray = this.contactForm.get('value') as FormArray;
    const contactFormGroup = contactArray.at(i) as FormGroup;
  
    contactFormGroup.get('isSubmitted')?.setValue(true);
    this.partnerService.addContact({...this.contactForm.value, partnerNum:this.selectedPartner.id}).subscribe({
     next: (res) => {
      console.log('Item added successfully', res);
      console.log('Form value', this.contactForm.value.value[i]);
       this.submitted = true;
       this.contactId=res.id
     },
     error: (e) => {
       console.error('Error adding item', e);
       console.log('partner details is invalid');
       console.log(this.partnerAddressForm.errors);
     }
   })
   // Add a new form group to the FormArray and reset the fields
   const newFormGroup = this.fb.group({
    civility :new UntypedFormControl('',[Validators.required]),
      firstName: new UntypedFormControl('', [
        Validators.required,
        this.capitalLetterValidator
      ]),
      lastName: new UntypedFormControl('', [
        Validators.required,
        this.capitalLetterValidator
      ]),
      privilege: new UntypedFormControl('', [Validators.required]),
      privilegedContact: new UntypedFormControl(false),
      appointmentMaking: new UntypedFormControl(false),
      service: new UntypedFormControl('', [Validators.required]),
      function: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50)
      ]),
      mobilePhoneNumber: new UntypedFormControl('', [Validators.required]),
      phoneNumber: new UntypedFormControl('', []),
      comment: new UntypedFormControl('', []),
    isSubmitted: new FormControl(false), // Add the isSubmitted property to the new FormGroup
  });

  contactArray.push(newFormGroup);
  }


  // Enregistrer dernier contact au partenaire
  saveContact(i:any): void {
    const contactArray = this.contactForm.get('value') as FormArray;
    const contactFormGroup = contactArray.at(i) as FormGroup;
  
    contactFormGroup.get('isSubmitted')?.setValue(true);
     
    this.partnerService.addContact({...contactFormGroup.value, partnerNum:this.selectedPartner.id}).subscribe({
     next: (res) => {
      console.log('Item added successfully', res);
      console.log('Form value', this.contactForm.value.value[i]);
       this.submitted = true;
       this.contactId=res.id
     },
     error: (e) => {
       console.error('Error adding item', e);
       console.log('partner details is invalid');
       console.log(this.partnerAddressForm.errors);
     }
   })
  }

  
  isAnyContactPrivileged(i): void {
    const formArray = this.contactForm.get('value') as FormArray;
    const item = formArray.at(i) as FormGroup;
    const privilegedContact = item.get('privilegedContact');
  
    if (privilegedContact.value == true) {
      for (let j = i + 1; j < formArray.length; j++) {
      const item = formArray.at(j) as FormGroup;
      item.get('privilegedContact').disable();
      }
    }
  }
  

  currencyMap: {[key: string]: string} = {
    'AFN': 'AFN - Afghani afghan',
    'AMD': 'AMD - Dram arménien',
    'AUD': 'AUD - Dollar australien',
    'BSD': 'BSD - Dollar bahaméen',
    'BBD': 'BBD - Dollar barbadien',
    'BZD': 'BZD - Dollar bélizien',
    'BMD': 'BMD - Dollar bermudien',
    'BND': 'BND - Dollar brunéien',
    'BIF': 'BIF - Franc burundais',
    'KHR': 'KHR - Riel cambodgien',
    'CAD': 'CAD - Dollar canadien',
    'CVE': 'CVE - Escudo cap-verdien',
    'KYD': 'KYD - Dollar des îles Caïmans',
    'XAF': 'XAF - Franc CFA (BEAC)',
    'XPF': 'XPF - Franc CFP',
    'CLP': 'CLP - Peso chilien',
    'CNY': 'CNY - Yuan renminbi chinois',
    'COP': 'COP - Peso colombien',
    'KMF': 'KMF - Franc comorien',
    'CRC': 'CRC - Colón costaricain',
    'HRK': 'HRK - Kuna croate',
    'CZK': 'CZK - Couronne tchèque',
    'DKK': 'DKK - Couronne danoise',
    'DJF': 'DJF - Franc djiboutien',
    'DOP': 'DOP - Peso dominicain',
    'EGP': 'EGP - Livre égyptienne',
    'ETB': 'ETB - Birr éthiopien',
    'EUR': 'EUR - Euro',
    'FKP': 'FKP - Livre des îles Falkland',
    'FJD': 'FJD - Dollar fidjien',
    'GMD': 'GMD - Dalasi gambien',
    'GEL': 'GEL - Lari géorgien',
    'GHS': 'GHS - Cedi ghanéen',
    'GIP': 'GIP - Livre de Gibraltar',
    'GTQ': 'GTQ - Quetzal guatémaltèque',
    'GNF': 'GNF - Franc guinéen',
    'GYD': 'GYD - Dollar guyanien',
    'HTG': 'HTG - Gourde haïtienne',
    'HNL': 'HNL - Lempira hondurien',
    'HKD': 'HKD - Dollar de Hong Kong',
    'HUF': 'HUF - Forint hongrois',
    'ISK': 'ISK - Couronne islandaise',
    'INR': 'INR - Roupie indienne',
    'IDR': 'IDR - Roupie indonésienne',
    'IRR': 'IRR - Rial iranien',
    'IQD': 'IQD - Dinar iraquien',
    'ILS': 'ILS - Shekel israélien',
    'JPY': 'JPY - Yen japonais',
    'JOD': 'JOD - Dinar jordanien',
    'KZT': 'KZT - Tenge kazakh',
    'KES': 'KES - Shilling kényan',
    'KWD': 'KWD - Dinar koweïtien',
    'LAK': 'LAK - Kip laotien',
    'LBP': 'LBP - Livre libanaise',
    'LRD': 'LRD - Dollar libérien',
    'MGA': 'MGA - Ariary malgache',
    'MWK': 'MWK - Kwacha malawite',
    'MYR': 'MYR - Ringgit malaisien',
    'MUR': 'MUR - Roupie mauricienne',
    'MXN': 'MXN - Peso mexicain',
    'MDL': 'MDL - Leu moldave',
    'MNT': 'MNT - Tugrik mongol',
    'MAD': 'MAD - Dirham marocain',
    'MZN': 'MZN - Metical mozambicain',
    'MMK': 'MMK - Kyat birman',
    'NAD': 'NAD - Dollar namibien',
    'NPR': 'NPR - Roupie népalaise',
    'ANG': 'ANG - Florin antillais',
    'NZD': 'NZD - Dollar néo-zélandais',
    'NIO': 'NIO - Córdoba oro nicaraguayen',
    'NGN': 'NGN - Naira nigérian',
    'NOK': 'NOK - Couronne norvégienne',
    'OMR': 'OMR - Rial omanais',
    'PKR': 'PKR - Roupie pakistanaise',
    'PAB': 'PAB - Balboa panaméen',
    'PGK': 'PGK - Kina papou-néo-guinéen',
    'PYG': 'PYG - Guarani paraguayen',
    'PEN': 'PEN - Sol péruvien',
    'PHP': 'PHP - Peso philippin',
    'PLN': 'PLN - Zloty polonais',
    'QAR': 'QAR - Riyal qatari',
    'RON': 'RON - Leu roumain',
    'RUB': 'RUB - Rouble russe',
    'RWF': 'RWF - Franc rwandais',
    'SHP': 'SHP - Livre de Sainte-Hélène',
    'SVC': 'SVC - Colón salvadorien',
    'SAR': 'SAR - Riyal saoudien',
    'RSD': 'RSD - Dinar serbe',
    'SCR': 'SCR - Roupie seychelloise',
    'SLL': 'SLL - Leone sierra-léonais',
    'SGD': 'SGD - Dollar de Singapour',
    'SOS': 'SOS - Shilling somalien',
    'ZAR': 'ZAR - Rand sud-africain',
    'KRW': 'KRW - Won sud-coréen',
    'SSP': 'SSP - Livre sud-soudanaise',
    'LKR': 'LKR - Roupie srilankaise',
    'SDG': 'SDG - Livre soudanaise',
    'SRD': 'SRD - Dollar surinamais',
    'SZL': 'SZL - Lilangeni swazi',
    'SEK': 'SEK - Couronne suédoise',
    'CHF': 'CHF - Franc suisse',
    'SYP': 'SYP - Livre syrienne',
    'TWD': 'TWD - Dollar taïwanais',
    'TZS': 'TZS - Shilling tanzanien',
    'THB': 'THB - Baht thaïlandais',
    'TOP': 'TOP - Paʻanga tongan',
    'TTD': 'TTD - Dollar de Trinité-et-Tobago',
    'TND': 'TND - Dinar tunisien',
    'TRY': 'TRY - Livre turque',
    'TMT': 'TMT - Manat turkmène',
    'AED': 'AED - Dirham des Émirats arabes unis',
    'UGX': 'UGX - Shilling ougandais',
    'UAH': 'UAH - Hryvnia ukrainienne',
    'UYU': 'UYU - Peso uruguayen',
    'UZS': 'UZS - Sum ouzbek',
    'VUV': 'VUV - Vatu vanuatuan',
    'VEF': 'VEF - Bolivar vénézuélien',
    'VND': 'VND - Dong vietnamien',
    'XOF': 'XOF - Franc CFA (BCEAO)',
    'YER': 'YER - Rial yéménite',
    'ZMW': 'ZMW - Kwacha zambien',
    'ZWL': 'ZWL - Dollar zimbabwéen',
  }

   get getAddress() {
    return (this.partnerAddressForm.get('value') as FormArray).controls;
  }

  get getBankAccount() {
    return (this.bankAccountForm.get('value') as FormArray).controls;
  }

  get getContact() {
    return (this.contactForm.get('value') as FormArray).controls;
  }

  get activityStartDate() {
    const value = this.complInfoForm.get('activityStartDate').value;
    return this.datePipe.transform(value, 'yy/MM/dd');
  }
  
  get activityEndDate() {
    const value = this.complInfoForm.get('activityEndDate').value;
    return this.datePipe.transform(value, 'yy/MM/dd');
  }
  
  get foundedSince() {
    const value = this.complInfoForm.get('foundedSince').value;
    return this.datePipe.transform(value, 'yy/MM/dd');
  }

  companyStatusMap = {
    [CompanyStatus.PROSPECT]:'Prospect',
    [CompanyStatus.SUPPLIER]:'Fournisseur',
    [CompanyStatus.CLIENT]:'Client',
    [CompanyStatus.CLIENT_SUPPLIER]: 'Client-Fournisseur',
    [CompanyStatus.INTERN_GROUP]:'Interne au Groupe'
    };

  workFieldMap = {
    [WorkField.IT]:'IT',
    [WorkField.INDUSTRY]:'Industrie',
    [WorkField.SALES]:'Ventes',
    [WorkField.AGRICULTURE] :'Agriculture',
    [WorkField.BANKING] :'Banking',
    [WorkField.E_COM] :'E-Commerce',
    [WorkField.ASSURANCE] :'Assurance',
    [WorkField.FINANCE] :'Finance'
  }

  legalStatusMap = {
    [LegalStatus.SA]:'SA',
    [LegalStatus.SARL]:'SARL',
    [LegalStatus.SUARL]:'SUARL',
    [LegalStatus.FREELANCE]:'FREELANCE',
    [LegalStatus.SP]:'SP'

  }

  paymentConditionMap = {
    [PaymentCondition.IMMEDIATE]:'Paiement immédiat',
    [PaymentCondition.ADVANCED]:"Paiement à l'avance",
    [PaymentCondition.ORDER]:'Paiement à la commande',
    [PaymentCondition.ON_DELIVERY] :'Paiement à la livraison',
    [PaymentCondition._30_DAYS] :'Paiement à 30 jours nets',
    [PaymentCondition._60_DAYS] :'Paiement à 60 jours nets ',
    [PaymentCondition._90_DAYS] :'Paiement à 90 jours nets',
    [PaymentCondition.IN_TERM] :'Paiement à terme',
    [PaymentCondition.ADVANCE] :'Paiement anticipé',
    [PaymentCondition.AT_REQUEST] :'Paiement à la réception'
  }

  paymentModeMap = {
    [PaymentMode.CASH]:'Cash',
    [PaymentMode.CREDIT]:'Note de Crédit',
    [PaymentMode.DEBIT_CARD]:'Carte de débit',
    [PaymentMode.BANK_TRANSFER] :'Virement bancaire',
    [PaymentMode.PAYPAL] :'Paypal',
    [PaymentMode.CHECK] :'Chèque'
  }

  civilityMap = {
    [Civility.MR]:'Mr',
    [Civility.MRS]:'Mme',
    [Civility.MS] : 'Mlle'  
  }

  privilegeMap = {
    [Privilege.HIGH]:'Elevé',
    [Privilege.MEDIUM]:'Moyen',
    [Privilege.LOW] : 'Faible'
  }

  controlTypeMap = {
    [ControlType.OFFER_CONTROL]:'Contrôle devis',
    [ControlType.ORDER_CONTROL]:'Contrôle commande'
  }
}
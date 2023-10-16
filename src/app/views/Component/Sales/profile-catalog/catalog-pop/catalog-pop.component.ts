import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Catalog } from 'app/shared/models/Catalog';
import { Currency } from 'app/shared/models/Partner';
import { Level } from 'app/shared/models/Profile';
import { ProfileCatalogService } from '../profile-catalog.service';

@Component({
  selector: 'app-catalog-pop',
  templateUrl: './catalog-pop.component.html',
  styleUrls: ['./catalog-pop.component.scss']
})
export class CatalogPopComponent implements OnInit {
  isNew: boolean
  submitted = false;

  public itemForm: FormGroup
  public myProfileForm: FormGroup;
  profiles: FormArray;

  repeatForm: FormGroup;
  repeatFormUpdated: FormGroup;
  public showProfilesForm: boolean = false;
  levels = Object.values(Level)
  currencies = Object.values(Currency)

  existingCatalogs: Catalog[] = [];

  //////////////////////////////////////updates repeat form
  formProfile = new FormGroup({
    id: new FormControl(''),
    function: new FormControl(''),
    experience: new FormControl(''),
    comment: new FormControl(''),
    candidateDailyCost: new FormControl('')
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CatalogPopComponent>,
    private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private catalogService: ProfileCatalogService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload);
    console.log(this.data.isNew);
    console.log(this.data.payload);
    this.isNew = this.data.isNew;

    this.catalogService.getItems().subscribe((catalogs) => {
      this.existingCatalogs = catalogs;
      console.log(this.existingCatalogs)
    });
  
    //////////////////////////////////////updates repeat form
    this.myProfileForm = this._formBuilder.group({
      profiles: this._formBuilder.array([]) // Initialize profiles as an empty FormArray
    });
  
    this.buildItemForm(this.data.payload);
    this.repeatForm = this._formBuilder.group({
      repeatArray: this._formBuilder.array([this.createRepeatForm()])
    });
    
    //////////////////////////////////////end updates repeat form
  }
  
  

  buildItemForm(item) {
    const profiles = item.profiles && item.profiles.length > 0 ? item.profiles : [];
    this.itemForm = this.fb.group({
      title: [item.title || '', Validators.required],
      currency: [item.currency || '', Validators.required],
      startDate: [item.startDate || '', Validators.required],
      endDate: [item.endDate || '', Validators.required],
      ref: [item.ref || '', Validators.required],
      comment: [item.comment || '', Validators.required],
      profiles: this.fb.array(profiles.map(profile => this.buildProfileFormGroup(profile)))
    });
  }

  buildProfileFormGroup(profile): FormGroup {
    return this.fb.group({
      id: [profile.id || ''],
      function: [profile.function || ''],
      experience: [profile.experience || ''],
      candidateDailyCost: [profile.candidateDailyCost || ''],
      comment: [profile.comment || '']
    });
  }

  get myArrayControls() {
    return (this.myProfileForm.get('profiles') as FormArray).controls;
  }
  createRepeatForm(): FormGroup {
    return this._formBuilder.group({});
  }
  get repeatFormGroup() {
    return this.repeatForm.get('repeatArray') as FormArray;
  }
  handleAddRepeatForm() {
    this.repeatFormGroup.push(this.createRepeatForm());
  }
  handleRemoveRepeatForm(index: number) {
    this.repeatFormGroup.removeAt(index);
    if (index > 0) {
      const repeatArray = this.repeatForm.get('repeatArray') as FormArray;
      repeatArray.removeAt(index);
    }
  }
  addProfileFormGroup(): void {
    const profilesFormArray = this.itemForm.get('profiles') as FormArray;
    profilesFormArray.push(this.fb.group({
      id: [''],
      function: ['', Validators.required],
      experience: [''],
      comment: [''],
      candidateDailyCost: ['']
    }));
  }
  
  removeProfileFormGroup(index: number): void {
    const profilesFormArray = this.itemForm.get('profiles') as FormArray;
    profilesFormArray.removeAt(index);
  }
  
  toggleProfilesForm(): void {
    const profilesFormArray = this.itemForm.get('profiles') as FormArray;
    if (profilesFormArray.length === 0) {
      profilesFormArray.push(this.fb.group({
        id:[''],
        function: ['', Validators.required],
        experience: [''],
        comment: [''],
        candidateDailyCost: [''],
      }));
    }
    this.showProfilesForm = true; // Always set showProfilesForm to true
  }
  
  
  //////////////////////////////////////end updates repeat form

  validateRef() {
    const refControl = this.itemForm.get('ref');
    if (!refControl) return;
  
    const ref = refControl.value;
    let refOverlapping = false;

    // Iterate through existing catalogs to check for overlapping dates
    for (const catalog of this.existingCatalogs) {
      if (ref == catalog.ref) {
        refOverlapping = true;
        break; // No need to check further
      }
    }
    // Set error message if overlapping dates found
    if (refOverlapping) {
      refControl.setErrors({ overlappingRef: true });
    } else {
      refControl.setErrors(null); // Reset the error when not overlapping
    }
  }


  validateRefUpdate(catalogIdToUpdate: number) {
    const refControl = this.itemForm.get('ref');
    if (!refControl) return;
  
    const ref = refControl.value;
    let refOverlapping = false;

    // Filter out the row to update from existingCatalogs based on catalogIdToUpdate
    const filteredCatalogs = this.existingCatalogs.filter(catalog => catalog.id !== catalogIdToUpdate);
    console.log(filteredCatalogs);

    // Iterate through existing catalogs to check for overlapping dates
    for (const catalog of filteredCatalogs) {
      if (ref == catalog.ref) {
        refOverlapping = true;
        break; // No need to check further
      }
    }
    // Set error message if overlapping dates found
    if (refOverlapping) {
      refControl.setErrors({ overlappingRef: true });
    } else {
      refControl.setErrors(null); // Reset the error when not overlapping
    }
  }


  validateDates() {
    const startDateControl = this.itemForm.get('startDate');
    const endDateControl = this.itemForm.get('endDate');
  
    if (!startDateControl || !endDateControl) return;
  
    const startDate = startDateControl.value;
    const endDate = endDateControl.value;

    let dateRange = false 
    let startDateOverlapping = false;
    let endDateOverlapping = false;
    //let periodOverlapping = false;

    // Iterate through existing catalogs to check for overlapping dates
    for (const catalog of this.existingCatalogs) {
      if (startDate >= catalog.startDate && startDate <= catalog.endDate) {
        startDateOverlapping = true;
        break; // No need to check further
      }
    }
  
    for (const catalog of this.existingCatalogs) {
      if (endDate >= catalog.startDate && endDate <= catalog.endDate) {
        endDateOverlapping = true;
        break; // No need to check further
      }
    }

    /*for (const catalog of this.existingCatalogs) {
      if (endDate >= catalog.endDate && startDate <= catalog.startDate) {
        periodOverlapping = true;
        break; // No need to check further
      }
    }*/

    // Check if endDate is after startDate
    if (endDate <= startDate) {
      dateRange = true 
    }
  
    // Set error message if overlapping dates found
    /*if(dateRange){
      endDateControl.setErrors({ invalidDateRange: true });
      console.log('Invalid date range error set');
    } else {
      endDateControl.setErrors({invalidDateRange: false}); // Reset the error when date range is valid
      console.log('Date range is valid');
    }*/
    
    if (startDateOverlapping) {
      startDateControl.setErrors({ overlappingStartDate: true });
    } else {
      startDateControl.setErrors(null/*{overlappingStartDate: false}*/); // Reset the error when not overlapping
    }
  
    if(dateRange){
      endDateControl.setErrors({invalidDateRange: true})
    }
    else if (endDateOverlapping) {
      endDateControl.setErrors({ overlappingEndDate: true , /*invalidDateRange: endDateControl.errors.invalidDateRange*/});
      console.log('Invalid end date error set');
    } else {
    endDateControl.setErrors(null/*{overlappingEndDate: false, invalidDateRange: endDateControl.errors.invalidDateRange}*/); // Reset the error when not overlapping
      console.log('end date is valid');
    }

    /*if(periodOverlapping){
      startDateControl.setErrors({ periodOverlapping: true, overlappingStartDate: startDateControl.errors.overlappingStartDate})
      endDateControl.setErrors({ periodOverlapping: true, overlappingEndDate: endDateControl.errors.overlappingEndDate, invalidDateRange: endDateControl.errors.invalidDateRange})
      console.log('Invalid period error set');
    } else {
      startDateControl.setErrors({ periodOverlapping: false, overlappingStartDate: startDateControl.errors.overlappingStartDate})
      endDateControl.setErrors({ periodOverlapping: false, overlappingEndDate: endDateControl.errors.overlappingEndDate, invalidDateRange: endDateControl.errors.invalidDateRange})
      console.log('period is valid');
    }*/
    console.log(startDateControl)
    console.log(endDateControl)
  }

  validateDatesUpdate(catalogIdToUpdate: number) {
    const startDateControl = this.itemForm.get('startDate');
    const endDateControl = this.itemForm.get('endDate');
  
    if (!startDateControl || !endDateControl) return;
  
    const startDate = startDateControl.value;
    const endDate = endDateControl.value;
  
    let dateRange = false;
    let startDateOverlapping = false;
    let endDateOverlapping = false;
  
    // Filter out the row to update from existingCatalogs based on catalogIdToUpdate
    const filteredCatalogs = this.existingCatalogs.filter(catalog => catalog.id !== catalogIdToUpdate);
    console.log(filteredCatalogs);
  
    /*for (const catalog of filteredCatalogs) {
      if (endDate <= catalog.endDate && startDate >= catalog.startDate) {
        endDateOverlapping = true;
        startDateOverlapping = true;
        console.log("les 2")
        break; // No need to check further
      }
    }*/

    for (const catalog of filteredCatalogs) {
      if (startDate >= catalog.startDate && startDate <= catalog.endDate) {
        startDateOverlapping = true;
        console.log("start 1.0")
        break; // No need to check further
      }
    }
      
    for (const catalog of filteredCatalogs) {
      if (endDate >= catalog.startDate && endDate <= catalog.endDate) {
        endDateOverlapping = true;
        console.log("end 1.0")
        break; // No need to check further
      }
    }
  
    // Check if endDate is after startDate
    if (endDate <= startDate) {
      dateRange = true;
    }
  
    // Set error message if overlapping dates found
    /*if (startDateOverlapping && endDateOverlapping) {
      startDateControl.setErrors({ overlappingDates: true });
      endDateControl.setErrors({ overlappingDates: true });
      console.log("les 2.0")
    } else {
      startDateControl.setErrors(null); // Reset the error when not overlapping
      endDateControl.setErrors(null); // Reset the error when not overlapping
    }*/
    if (startDateOverlapping) {
      startDateControl.setErrors({ overlappingStartDate: true });
      console.log("start 2.0")
    } else {
      startDateControl.setErrors(null); // Reset the error when not overlapping
    }
  
    if (dateRange) {
      endDateControl.setErrors({ invalidDateRange: true });
      console.log('Invalid date range error set');
    } 
    else if (endDateOverlapping) {
      endDateControl.setErrors({ overlappingEndDate: true });
      console.log("end 2.0")
    } else {
      endDateControl.setErrors(null); // Reset the error when not overlapping
    }
    console.log(endDateControl)
    // Revalidate the form after updating the control errors
  }
  
  
  
  submit() {
    this.itemForm.updateValueAndValidity();
    console.log(this.data.payload.id)
    // Perform validation before submitting
    if(this.isNew){
      this.validateDates();
      this.validateRef()
    }
    else{
      this.validateDatesUpdate(this.data.payload.id);
      this.validateRefUpdate(this.data.payload.id)
    }
    console.log(this.itemForm.valid)
    const profilesFormArray = this.itemForm.get('profiles') as FormArray;
    console.log(profilesFormArray.value.length)
    // Check if the form is valid before closing the dialog
    if (this.itemForm.valid && profilesFormArray.value.length > 0) {
      console.log(this.itemForm.value);
      this.dialogRef.close(this.itemForm.value);
    }
    this.submitted = true;
  }

  get profilesFormArray() {
    return this.itemForm.get('profiles') as FormArray;
  }

  levelMap = {
    [Level.JUNIOR]: "Junior",
    [Level.CONFIRMED]: "Confirmé",
    [Level.SENIOR]: "Senior",
    [Level.EXPERT]: "Expert"
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
}

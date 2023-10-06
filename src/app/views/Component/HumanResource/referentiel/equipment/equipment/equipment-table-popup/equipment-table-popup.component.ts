import { Affectation, Currency } from './../../../../../../../shared/models/equipment';
import { EquipmentService } from './../../equipment.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, Validators, UntypedFormGroup, FormGroup } from '@angular/forms';
import { AmortizationType, PurchaseMethod, StatusDisponibility } from 'app/shared/models/equipment';
import { Employee } from 'app/shared/models/Employee';

@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './equipment-table-popup.component.html'
})
export class EquipmentTablePopupComponent implements OnInit {

  public itemForm: UntypedFormGroup;
  showDiv = false;
  showMotif = false;
  employes: Employee[] = [];
  PurchaseMethod = Object.values( PurchaseMethod).filter((element) => {
    return isNaN(Number(element));
  });
  Currency = Object.values( Currency).filter((element) => {
    return isNaN(Number(element));
  });
  AmortizationType = Object.values( AmortizationType).filter((element) => {
    return isNaN(Number(element));
  });
  Affectation = Object.values( Affectation).filter((element) => {
    return isNaN(Number(element));
  });
  StatusDisponibility = Object.values( StatusDisponibility).filter((element) => {
    return isNaN(Number(element));
  });

  Status = Object.values( StatusDisponibility).filter((element) => {
    return isNaN(Number(element));
  });


  formErrorMessages = {
    serialNumber: 'Le numéro de série est requis',
    type: 'Le type  est requise',
    designation: 'La désignation est requis',
    acquisitionDate: 'La date d\'acquisition est requise',
    endDate: 'La date de fin de garantie est requise',
    comment: 'Le commentaire est requise',
    supplier: 'Le fournisseur est requise',
    purchasePrise: 'La modalité d\'achat est requise',
    amortizationType: 'Le type d\'amortissement est requise',
    status: 'Le statut de disponibilité  est requise',
    currency: 'Le devise est requise',
    supplierOrderNumber: 'Le numéro de commande est requise',
    motifUnavailability: 'Le motif d\'indisponibilité est requise',
    affectation: 'L\'affectation est requise'

  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EquipmentTablePopupComponent>,
    private fb: UntypedFormBuilder,
    private equipmentService :EquipmentService,
  ) { }


  
  ngOnInit() {
    //this.loadEmployes();
    this.buildItemForm(this.data.payload) 
  }





  buildItemForm(item) {
    this.itemForm = this.fb.group({
      serialNumber: [item.serialNumber || '', Validators.required],
      reference: [item.reference || ''],
      type: [item.type || '', Validators.required],
      designation: [item.designation || '', Validators.required],
      acquisitionDate: [item.acquisitionDate || '', Validators.required],
      endDate: [item.endDate || '', Validators.required],
      comment: [item.comment || '', Validators.required],
      supplier: [item.supplier || '', Validators.required],
      purchasePrise: [item.purchasePrise || '', Validators.required],
      purchaseMethod: [item.purchaseMethod || '', Validators.required],
      amortizationType: [item.amortizationType || ''],
      status: [item.status || '', Validators.required],
      currency: [item.currency || '', Validators.required],
      supplierOrderNumber: [item.supplierOrderNumber || '', Validators.required],
      motifUnavailability: [item.motifUnavailability || ''],
      affectable: [item.affectable||false],
      amortizable: [item.amortizable||false],
      affectation: ['UNAFFECTED'],
    });
  }
  
  submit() {
    if (this.itemForm.valid) {
      this.dialogRef.close(this.itemForm.value);
    } else {
      // Mark all the form controls as touched to display the validation messages
      this.markFormGroupTouched(this.itemForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    // Recursively mark all form controls as touched to trigger the validation
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
  
  toggleDiv() {
    this.showDiv = !this.showDiv;
  }

  /*
  loadEmployes() {
    this.equipmentService.getResources().subscribe((data: Employee[]) => {
      this.employes = data;
      console.log("Employees data", data);
    });
  }*/
 

  PurchaseMethodMap= {
    [PurchaseMethod.PURCHASE]: 'Achat',
    [PurchaseMethod.RENT]: 'Location'
  };

  AmortizationTypeMap= {
    [AmortizationType.LINEAR]: 'Linéaire',
    [AmortizationType.ANTICIPATORY]: 'Anticipatif',
    [AmortizationType.CONSTANT]: 'Constant',
    [AmortizationType.DECLINING_BALANCE]: 'Dégressif',
    [AmortizationType.PROGRESSIVE]: 'Progressif',
    [AmortizationType.PROPORTIONAL]: 'Proportionnel'
    
  };

  
  AffectationMap= {
    [Affectation.AFFECTED]: 'Affecté',
    [Affectation.UNAFFECTED]: 'Non affecté'
  };
  StatusMap={
    [StatusDisponibility.AVAILABLE]: 'Disponible',
    [StatusDisponibility.UNAVAILABLE]: 'Indisponible'
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

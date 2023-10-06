import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExpenseReport, FeeType, RequestStatus } from 'app/shared/models/expenseReport';
import { ExpenseReportService } from '../expense-report.service';

@Component({
  selector: 'app-view-expense-report',
  templateUrl: './view-expense-report.component.html',
  styleUrls: ['./view-expense-report.component.scss']
})
export class ViewExpenseReportComponent implements OnInit {
  id: number;
  expenseReport: ExpenseReport;

  constructor(
    private expenseReportService: ExpenseReportService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['iiid'];
    this.getExpenseReportById();
  }

  getExpenseReportById(): void {
    this.expenseReportService.getItem(this.id).subscribe((dataView: any) => {
      this.expenseReport = dataView;
      console.log("timeOff", this.expenseReport);
    });
  }

  getTranslation(value: boolean): string {
    return value ? 'Oui' : 'Non';
  }

    
requestStatusMap = {
  [RequestStatus.REJECTED]: 'Refusé',
  [RequestStatus.VALIDATED]: 'Validé',
  [RequestStatus.PENDING]: 'En cours',
 
};



feeTypeMap = {
  [FeeType.TRANSPORT]:'Transport',
  [FeeType.ACCOMODATION]:'Ebergement/ Hotél',
  [FeeType.FUEL]:'Carburant',
  [FeeType.CLIENT_INVITATION]:'Invitation Client',
  [FeeType.LEISURE]:'Loisir',
  [FeeType.MEALS]:'Repas',
  [FeeType.PHONE]:'Téléphone et Communication',
  [FeeType.OTHER]:'Autre'   
};


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
};


}

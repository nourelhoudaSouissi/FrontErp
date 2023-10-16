import { ContractClientType } from 'app/shared/models/contractClient';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ContractClientService } from '../contract-client.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ArticleService } from '../article.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { articleClient } from 'app/shared/models/articleClient';
import { MatTableDataSource } from '@angular/material/table';
import { CompanyStatus, Partner } from 'app/shared/models/Partner';
import { CrudPartnerService } from '../../partner/crudPartner.service';

@Component({
  selector: 'app-add-contract-client',
  templateUrl: './add-contract-client.component.html',
  styleUrls: ['./add-contract-client.component.scss']
})
export class AddContractClientComponent implements OnInit {



  public dataSource: MatTableDataSource<articleClient>;
  formArticle = new FormGroup({
  articleTitle: new FormControl(''),
  description: new FormControl('test')
  });
  Articles : articleClient[] = [];
  errorMessage: string;
  selectedContract = {titleContract :'',startDate:'', id:null};
  submitted = false;
  currentArticleNumber: number = 1;
  repeatForm: FormGroup;
  articles: FormArray;
  myFormContract: FormGroup; 
  typeContract: string = ""

  ContractType = Object.values( ContractClientType).filter((element) => {
    return isNaN(Number(element));
  });

  supplierList : Partner[] = [];
  clientList : Partner[] = [];

  constructor(
    private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private loader: AppLoaderService,
    private contractClientService: ContractClientService,
    private articleService: ArticleService,
    private confirmService : AppConfirmService,
    private partnerService : CrudPartnerService,
    private router : Router,
    private snack: MatSnackBar,
    private http : HttpClient,
  ) 
  { 
    this.dataSource=new MatTableDataSource<articleClient>([]);
  }

  ngOnInit(): void {
    
/********************************************** FormBuilder contract ***********************************************/
  this.getClientList()
  this.getSupplierList()
  this.myFormContract = this.fb.group({
   contractType : new FormControl('', Validators.required),
   titleContract : new FormControl('', Validators.required), 
   startDate : new FormControl('', Validators.required), 
   endDate : new FormControl ('', Validators.required),
   editorContent : new FormControl('<p>test</p>', Validators.required),
   dateContract : new FormControl('', Validators.required),
   lieuContract: new FormControl('', Validators.required),
   partnerNum: new FormControl('', Validators.required),
   introductionSoc:new FormControl(`La Société CSI DIGITAL, SARL, au Capital de 10 000 dinars tunisiens dont le Siège Social est sis au Parc d'Activité Economique de Bizerte, inscrite au Registre National des Entreprise sous le numéro 1764694X représentée par son Gérant M'hamed Khamassi.`,Validators.required ),

   introductionClient: new FormControl(`   Mr ……….. de nationalité Tunisienne, né(e) le …………………... à ………………., demeurant   au ……………………………, titulaire de CIN n° ……………….,  émise à ……………………. le ……………………………… 
    En cas de son changement M. ……………….. s'engage à informer son employeur par lettre recommandée avec accusé de réception, faute de quoi l'adresse ci-dessus reste valable.
   ` ,Validators.required ),
   articleClients: new FormArray([], Validators.required)
    
  });

  (this.myFormContract.get('articleClients') as FormArray).push(this.fb.group({
    id : new FormControl('',Validators.required),
    articleNumber: new FormControl(1, [Validators.required, Validators.min(1)]),
    articleTitle: new FormControl('', Validators.required), 
    description : new FormControl('', Validators.required)
  }));



  /*************************************** Repeat form  **************************************/
    this.repeatForm = this._formBuilder.group({
      repeatArray: this._formBuilder.array([this.createRepeatForm()])
    });
    
    this.myFormContract.get('contractType').valueChanges.subscribe((typeContract: string) => {
    this.typeContract = typeContract;
    this.clientContract();
    });
  }

  
 /***************************************   End ngOnInit*************************************************/ 
  get myArrayControls() {
    return (this.myFormContract.get('articleClients') as FormArray).controls;
  }

  /*********************** Repeat form ************************/
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
  
  addArticleFormGroup(): void {
    const articlesFormArray = this.myFormContract.get('articleClients') as FormArray;
    const existingArticleNumbers = articlesFormArray.controls.map(control =>
      control.get('articleNumber').value
    );

    const articleFormGroup = this.fb.group({
      id: ['', Validators.required],
      articleNumber: [articlesFormArray.length+1, [Validators.required, Validators.min(1)]],
      articleTitle: ['', Validators.required],
      description: ['', Validators.required]
    });

    articlesFormArray.push(articleFormGroup);

  }

  getClientList(){
    this.partnerService.getItems().subscribe((data: Partner[])=>{
      this.clientList = data.filter(partner => partner.companyStatus === CompanyStatus.CLIENT ||
        partner.companyStatus === CompanyStatus.CLIENT_SUPPLIER);
        console.log(this.clientList)
    })
  }

  getSupplierList(){
    this.partnerService.getItems().subscribe((data: Partner[])=>{
      this.supplierList = data.filter(partner => partner.companyStatus === CompanyStatus.SUPPLIER ||
        partner.companyStatus === CompanyStatus.CLIENT_SUPPLIER);
        console.log(this.supplierList)
    })
  }

  clientContract(): string{
    let partnerType : string
    switch(this.typeContract){
      case 'CONTRACT_COSTUMER':
        partnerType = "customer";
      break;
      case('CONTRACT_SUPPLIER'):
        partnerType = "supplier"
      break;
      default:
        partnerType = ""
    }
    return partnerType
  }



  
/************************************************** Ajouter contrat  ****************************************************/
addContract(): void {
  this.confirmService.confirm({ message: 'Le contrat est ajouté avec succès!' })
    .subscribe((result: boolean) => {
      if (result) {
        console.log('Submitting form...');
        console.log('Form is valid, submitting...');
        let selectedArticles = this.myFormContract.get('articleClients').value;
        console.log(selectedArticles);
        console.log(this.myFormContract.value);


        this.contractClientService.addItem(this.myFormContract.value).subscribe({
          next: (contractRes) => {
            console.log('Contract added successfully', contractRes);
            this.selectedContract = contractRes;
            console.log('Selected contract ID:', this.selectedContract.id);
            console.log('Form value', this.myFormContract.value);

            this.submitted = true;
            this.router.navigate(['/contract/liste-client-contracts']);


           },
          error: (e) => {
            console.error('Error adding contract', e);
            this.errorMessage = 'Erreur lors de l\'ajout du contrat. Veuillez vérifier les champs.';
            this.router.navigate(['/contract/liste-client-contracts']);
          }
        });
      } else {
        // Code pour enregistrer le contrat sans les articles
        console.log('Submitting form...');
        console.log('Form is valid, submitting...');
        let selectedArticles = this.myFormContract.get('articleClients').value;
        console.log(selectedArticles);
        console.log(this.myFormContract.value);

        const contractData = {
          titleContract: this.myFormContract.get('titleContract').value,
          startDate: this.myFormContract.get('startDate').value
        };

        this.contractClientService.addItem(contractData).subscribe({
          next: (res) => {
            console.log('Contract added successfully', res);
            this.selectedContract = res;
            console.log('Selected contract ID:', this.selectedContract.id);
            console.log('Form value', this.myFormContract.value);

            // Continuer avec les étapes suivantes si nécessaire
            this.submitted = true;
            this.router.navigate(['/contract/liste-client-contracts']);
          },
          error: (e) => {
            console.error('Error adding contract', e);
            this.errorMessage = 'Erreur lors de l\'ajout du contrat. Veuillez vérifier les champs.';
            this.router.navigate(['/contract/liste-client-contracts']);
          }
        });
      }
    });
}

/********************************************************* Enum *******************************************************************/
  ContractClientMap = {
    [ContractClientType.CONTRACT_COSTUMER]: 'Contrat client',
    [ContractClientType.CONTRACT_SUPPLIER]: 'Contrat fournisseur'
  };
}

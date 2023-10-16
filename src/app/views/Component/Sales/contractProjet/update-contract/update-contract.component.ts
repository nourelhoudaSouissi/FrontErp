import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ContractClientService } from '../contract-client.service';
import { ArticleService } from '../article.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContractClientType } from 'app/shared/models/contractClient';
import { articleClient } from 'app/shared/models/articleClient';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-update-contract',
  templateUrl: './update-contract.component.html',
  styleUrls: ['./update-contract.component.scss']
})
export class UpdateContractComponent implements OnInit {

  ContractType = Object.values( ContractClientType).filter((element) => {
    return isNaN(Number(element));
  });
  contractTypeLabel: string;
  contractId: number;
  row :any;
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


  constructor(
    private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private loader: AppLoaderService,
    private contractClientService: ContractClientService,
    private articleService: ArticleService,
    private confirmService : AppConfirmService,
    private router : Router,
    private snack: MatSnackBar,
    private http : HttpClient,
  ) 
  { 
    this.dataSource=new MatTableDataSource<articleClient>([]);
  }

  ngOnInit(): void {
    
    this.row = history.state.row;
    console.log(this.row);

    
/********************************************** FormBuilder contract ***********************************************/
  

  this.myFormContract = this.fb.group({
   contractType : new FormControl(this.row.contractType, Validators.required),
   titleContract : new FormControl(this.row.titleContract, Validators.required), 
   startDate : new FormControl(this.row.startDate, Validators.required), 
   endDate : new FormControl (this.row.endDate, Validators.required),
   editorContent : new FormControl(this.row.editorContent, Validators.required),
   dateContract : new FormControl(this.row.dateContract, Validators.required),
   lieuContract: new FormControl(this.row.lieuContract, Validators.required),
   introductionSoc:new FormControl(this.row.introductionSoc,Validators.required ),

   introductionClient: new FormControl(this.row.introductionClient,Validators.required ),
   articleClients: new FormArray([], Validators.required)
    
  });


  this.row.articleClients.forEach(article => {
    (this.myFormContract.get('articleClients') as FormArray).push(this.fb.group({
      id : new FormControl(article.id,Validators.required),
      articleNumber: new FormControl(article.articleNumber, [Validators.required, Validators.min(1)]),
      articleTitle: new FormControl(article.articleTitle, Validators.required), 
      description : new FormControl(article.description, Validators.required)
  }));})





  /*************************************** Repeat form  **************************************/
    this.repeatForm = this._formBuilder.group({
      repeatArray: this._formBuilder.array([this.createRepeatForm()])
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



  
/************************************************** modifier contrat  ****************************************************/
modifyContract(id: number): void {
  this.confirmService.confirm({ message: 'Voulez-vous modifier ce contrat?' })
    .subscribe((result: boolean) => {
      if (result) {
        console.log('Modifying contract...');
        console.log('Form is valid, submitting...');
        console.log(this.myFormContract.value);
        this.contractClientService.updateItem(id,this.myFormContract.value).subscribe({
          next: (res) => {
            console.log('Contract modified successfully', res);
            // Faire quelque chose avec la réponse de l'API mise à jour, si nécessaire
            this.submitted = true;
      
            this.router.navigate(['/contract/liste-client-contracts']);
          },
          error: (e) => {
            console.error('Error modifying contract', e);
            // Afficher le message d'erreur
            this.errorMessage = 'Erreur lors de la modification du contrat. Veuillez vérifier les champs.';
            // Redirection vers la liste des contrats
            this.router.navigate(['/contract/liste-client-contracts']);
          }
        });
      } else {
        // Redirection vers la liste des contrats
        this.router.navigate(['/contract/liste-client-contracts']);
      }
    });
}


getcontactarticle(id :number){
  this.contractClientService.getContractArticle(this.row.id).subscribe((data:any) =>{
  this.Articles = data;
  console.log(data);
  data.forEach(article => {
   (this.myFormContract.get('articleClients') as FormArray).push(this.fb.group({
     id : new FormControl(article.id,Validators.required),
     articleNumber: new FormControl(article.articleNumber, [Validators.required, Validators.min(1)]),
     articleTitle: new FormControl(article.articleTitle, Validators.required), 
     description : new FormControl(article.description, Validators.required)
   }));
});


})

}



/********************************************************* Enum *******************************************************************/
  ContractClientMap = {
    [ContractClientType.CONTRACT_COSTUMER]: 'Contrat client',
    [ContractClientType.CONTRACT_SUPPLIER]: 'Contrat fournisseur'
  
  };
}

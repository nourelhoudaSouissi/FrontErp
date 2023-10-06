import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ContractBenifitType, FeeType } from 'app/shared/models/avantagesContrat';
import { ContractTitle } from 'app/shared/models/contract';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ContractEmployeeService } from '../contract-employee.service';
import { ArticleService } from '../article.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { article, articleUpdated } from 'app/shared/models/article';
import { MatStepper } from '@angular/material/stepper';
import { MatTabGroup } from '@angular/material/tabs';
import { id } from 'date-fns/locale';


@Component({
  selector: 'app-update-contract',
  templateUrl: './update-contract.component.html',
  styleUrls: ['./update-contract.component.scss']
})
export class UpdateContractComponent implements OnInit {

  @ViewChild(MatStepper) stepper: MatStepper;

  errorMessage: string;
  myForm : FormGroup;
  row : any;
  repeatForm: FormGroup;
  tabGroup: MatTabGroup; 
  showEditor = true;
  selectedArticleDescription: string = '';
  selectedArticle : any;
  isFieldVisible: boolean = false;
  showEndDate: boolean = true;
  selectedContract = {contractTitle :'',startDate:'', id:null};
  public dataSource: MatTableDataSource<articleUpdated>;
  formArticle = new FormGroup({
  articleTitle: new FormControl(''),
  description: new FormControl('test')
  });
  exceptionalFeeId : number ;
  benefitId : number;
  articleForm : FormGroup;
  myFormGroup : FormGroup;
  myFormContract : FormGroup;
  myFormBenefit : FormGroup;
  submitted = false;
  public uploader: FileUploader = new FileUploader({ url: 'https://evening-anchorage-315.herokuapp.com/api/' });
  public hasBaseDropZoneOver: boolean = false;
  console = console;
  Articles : article[] = [];
  articles: FormArray;
  myFormExceptionalFee : FormGroup;

  myFormArticle : FormGroup;
  updatedArticles = []; 
  selectedArticleTitles: string[] = [];

  ContractTitle = Object.values( ContractTitle).filter((element) => {
    return isNaN(Number(element));
  });

    
  
/********************** Constructeur*************************/
  constructor(


    private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private loader: AppLoaderService,
    private contractEmployeeService: ContractEmployeeService,
    private articleService: ArticleService,
    private confirmService : AppConfirmService,
    private router : Router,
    private snack: MatSnackBar,
    private http : HttpClient,
    ) { 
    
        this.dataSource = new MatTableDataSource<articleUpdated>([]);
    }



    /***********************************  ngOninit  ************************************ */
  ngOnInit() : void{

    this.row = history.state.row;
    console.log(this.row);
    this.console.log()
    this.getcontactarticle(this.row.id)
    this.myForm = new FormGroup({
      articles: new FormArray([])
    });

    this.articleService.getItems().subscribe((articles: any[]) => {
      this.Articles = articles;
    });
   
    
  
    this.getArticleTitle();
    this.repeatForm = this.fb.group({
      repeatArray: this.fb.array([this.createRepeatForm()])
    
    });


    /*************************************** Repeat form  **************************************/
    this.repeatForm = this._formBuilder.group({
      repeatArray: this._formBuilder.array([this.createRepeatForm()])
    });
    

/********************************************** FormBuilder contract ***********************************************/
  

this.myFormContract = this.fb.group({
   // resourceId:new FormControl({value:'' , disabled:true}),
    contractTitle : new FormControl(this.row.contractTitle, Validators.required), 
    startDate : new FormControl(this.row.startDate, Validators.required), 
    endDate : new FormControl (this.row.endDate, Validators.required),
    reference : new FormControl (this.row.reference, Validators.required),
    editorContent : new FormControl('<p>test</p>', Validators.required),
    contractEmployer: new FormControl(this.row.contractEmployer ,Validators.required ),
    contractEmployee: new FormControl(this.row.contractEmployee ,Validators.required ),
    contractPlace: new FormControl(this.row.contractPlace, Validators.required), 
   contractDate: new FormControl(this.row.contractDate, Validators.required),
   validityDate : new FormControl(this.row.validityDate, Validators.required),
   description : new FormControl(this.row.description, Validators.required), 
   articles: new FormArray([], Validators.required)
    
  });




}

get myArrayControls() {
  return (this.myFormContract.get('articles') as FormArray).controls;
}



  addArticleFormGroup(): void {
    const articlesFormArray = this.myFormContract.get('articles') as FormArray;
    const existingArticleNumbers = articlesFormArray.controls.map(control => control.get('articleNumber').value);
  
    const articleFormGroup = this.fb.group({
      id: ['', Validators.required],
      articleNumber: ['', [Validators.required, Validators.min(1), this.uniqueArticleNumberValidator(existingArticleNumbers)]],
      articleTitle: ['', Validators.required],
      description: ['', Validators.required]
    });
  
    articlesFormArray.push(articleFormGroup);
  }
  

  uniqueArticleNumberValidator(existingArticleNumbers: number[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const articleNumber = control.value;
  
      if (existingArticleNumbers.includes(articleNumber)) {
        return { duplicateArticleNumber: true };
      }
  
      return null;
    };
  }
  
  onArticleTitleChange(value: any, i: number): void {
    const articlesFormArray = this.myFormContract.get('articles') as FormArray;
    const articleGroup = articlesFormArray.at(i);
  
    if (articleGroup) {
      const desc = articleGroup.get('description');
      const title = articleGroup.get('articleTitle');
  
      if (desc && title) {
        const selectedArticle = this.Articles.find(article => article.id === value);
        desc.setValue(selectedArticle ? selectedArticle.description : '');
        title.setValue(selectedArticle ? selectedArticle.articleTitle : '');
      }
    }
  }
  isArticleTitleSelected(articleTitleId: string, currentIndex: number): boolean {
    const articlesArray = this.myFormContract.get('articles') as FormArray;
  
    for (let i = 0; i < currentIndex; i++) {
      const selectedArticleTitleId = articlesArray.at(i)?.get('id')?.value;
      if (selectedArticleTitleId === articleTitleId) {
        return true;
      }
    }
    return false;
  }
  

/***********************  next Tab **********************************/

  nextTab(tabGroup: MatTabGroup) {
    const nextIndex = (tabGroup.selectedIndex + 1) % tabGroup._tabs.length;
    tabGroup.selectedIndex = nextIndex;
  }

  /***********************  previous Tab **********************************/

  previousTab(tabGroup: MatTabGroup) {
    const previousIndex = (tabGroup.selectedIndex + tabGroup._tabs.length - 1) % tabGroup._tabs.length;
    tabGroup.selectedIndex = previousIndex;
  }








/************************************************** Update  contrat  ****************************************************/
    
modifyContract(id: number): void {
  this.confirmService.confirm({ message: 'Voulez-vous modifier ce contrat?' })
    .subscribe((result: boolean) => {
      if (result) {
        console.log('Modifying contract...');
        console.log('Form is valid, submitting...');
        let selectedArticles = this.myFormContract.get('articles').value;
        console.log(selectedArticles);
        console.log(this.myFormContract.value);
        this.contractEmployeeService.updateContract(id,this.myFormContract.value).subscribe({
          next: (res) => {
            console.log('Contract modified successfully', res);
            // Faire quelque chose avec la réponse de l'API mise à jour, si nécessaire
            this.submitted = true;
      
            this.router.navigate(['/contractEmployee/liste-employee-contracts']);
          },
          error: (e) => {
            console.error('Error modifying contract', e);
            // Afficher le message d'erreur
            this.errorMessage = 'Erreur lors de la modification du contrat. Veuillez vérifier les champs.';
            // Redirection vers la liste des contrats
            this.router.navigate(['/contractEmployee/liste-employee-contracts']);
          }
        });
      } else {
        // Redirection vers la liste des contrats
        this.router.navigate(['/contractEmployee/liste-employee-contracts']);
      }
    });
}

  /********************************************************** la fonction qui retourne le titre de l'article  ******************************************************/
  
  getArticleTitle(){
    this.articleService.getItems().subscribe((data :any )=>{
      this.Articles = data
    });
  }

  onContractTitleSelectionChange(event: any) {
    const selectedContractTitle = event.value;
    this.showEndDate = selectedContractTitle !== ContractTitle.PERMANENT_EMPLOYMENT_CONTRACT;
  }
  

 getcontactarticle(id :number){
   this.contractEmployeeService.getContractArticle(this.row.id).subscribe((data:any) =>{
   this.Articles = data;
   console.log(data);
   data.forEach(article => {
    (this.myFormContract.get('articles') as FormArray).push(this.fb.group({
      id : new FormControl(article.id,Validators.required),
      articleNumber: new FormControl(article.articleNumber, [Validators.required, Validators.min(1)]),
      articleTitle: new FormControl(article.articleTitle, Validators.required), 
      description : new FormControl(article.description, Validators.required)
    }));
});


})

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


    /*********************************** Traduction des enumérations en Français     *************************************************************************/

    FeeTypeMap = {
      [FeeType.RESTAURANT]: 'Restaurant ',
      [FeeType.TRAVEL]: 'Voyage',
      [FeeType.MILEAGE]: 'kilométrage',
      [FeeType.PHONE]: 'Téléphone',
      [FeeType.HOTEL]: 'Hôtel',
      [FeeType.OTHER]: 'Autre',
    };

    

    ContractBenifitTypeMap = {
      [ContractBenifitType.COMPUTER]: 'Ordinateur',
      [ContractBenifitType.PHONE]: 'Téléphone',
      [ContractBenifitType.OFFICE_SUPPLIES]: 'Fournitures de bureau',
      [ContractBenifitType.FOURNITURE]: 'Fourniture',
      [ContractBenifitType.OTHER]: 'Autre'
    };
    

    ContractTitleMap = {
      [ContractTitle.PERMANENT_EMPLOYMENT_CONTRACT]: 'Contrat de travail à durée indéterminée',
      [ContractTitle.FIXED_TERM_EMPLOYMENT_CONTRACT]: 'Contrat de travail à durée déterminée',
      [ContractTitle.PROFESSIONALIZATION_CONTRACT]: 'Contrat de professionnalisation',
      [ContractTitle.SEASONAL_WORK_CONTRACT]: 'Contrat de travail saisonnier',
      [ContractTitle.PART_TIME_WORK_CONTRACT]: 'Contrat de travail à temps partiel',
      [ContractTitle.STUDY_CONTRACT]: 'Contrat d\'alternance',
      [ContractTitle.TEMPORARY_WORK_CONTRACT]: 'Contrat de travail intérimaire'
    };

}

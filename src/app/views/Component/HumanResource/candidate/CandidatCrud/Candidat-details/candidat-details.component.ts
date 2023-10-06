
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../candidat-crud.service';
import { Employee, MaritalSituation, Title } from 'app/shared/models/Employee';
import { Education } from 'app/shared/models/Education';
import { Skills } from 'app/shared/models/Skills';
import { SkillsCategory } from 'app/shared/models/SkillsCategory';
import { Certification } from 'app/shared/models/Certification';
import { Experience } from 'app/shared/models/Experience';
import { TechnicalFile } from 'app/shared/models/TechnicalFile';
import { Language, LanguageLevel } from 'app/shared/models/Language';
import { Civility } from 'app/shared/models/contact';
import html2pdf from 'html2pdf.js';
import { AssOfferCandidate } from 'app/shared/models/AssOfferCandidate';
import { entretienRecrutmentService } from '../../../entretienRecrutment/entretienRecrutment.service';
import { ViewAllInterviewsDetailsComponent } from './viewAll-Interviews/viewAll-Interviews.Detailscomponent';
import { Evaluation } from 'app/shared/models/Evaluation';
import { MatDialog } from '@angular/material/dialog';
import { PrintSharedService } from 'app/shared/services/PrintShared.service';

@Component({
  selector: 'app-details-candidat',
  templateUrl: './candidat-details.component.html',
  styleUrls:  ['./candidat-details.component.scss']
})


export class CandidatDetailComponent implements OnInit {
cvHtml = '';
id: number
idTechnicalFile:number
employee : Employee
education : Education
language: Language
technicalFile: TechnicalFile
skills : Skills
skillsCategory : SkillsCategory
certification : Certification
experience : Experience
candidature : AssOfferCandidate
private router: Router
title :string[]= Object.values(Title);
Civility :string []= Object.values(Civility);
MaritalSituation :string []= Object.values(MaritalSituation);
LanguageLevel : string[] = Object.values(LanguageLevel);
cvData: string; 

  constructor (  private route: ActivatedRoute,
    private candidatService: CrudService,
    private routerPdf: Router,
    private printService: PrintSharedService,
    private crudEntretien: entretienRecrutmentService,
    private dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getemployee();
   console.log(this.id);
   this.getTechnicalFile();
   this.getEducation();
   this.getExperience();
   this.getCertification();
   this.getlanguage();
   this.getSkills();
   this.getCandidature();
   /*const cv = document.getElementById('CV');
    if (cv) {
      this.cvHtml = cv.innerHTML;
    }*/

    this.printService.print$.subscribe((employee: any) => {
      this.printCv(employee);
    });

  }

  getTranslation(value: boolean): string {
    return value ? 'Oui' : 'Non';
  }

  //////////////////CV Print///////////////////
  printCv(employee: any) {
    const printableArea = document.getElementById('resume');
    var originalContents = document.body.innerHTML;
    var printContents = document.getElementById('resume').innerHTML;
    document.body.innerHTML = printContents ;
    window.print();
    document.body.innerHTML = originalContents;
  }

 /* printCvFromDataTbale(cvData: string) {
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = cvData;
    window.print();
    document.body.innerHTML = originalContents;
  }*/

  

  
 downloadCV() {
    const element = document.getElementById("resume");
    html2pdf()
      .from(element)
      .save('my-cv.pdf');
  }  



  getemployee() {
    this.candidatService.getItemById(this.id).subscribe((data: any) => {
      this.employee = data;

    });
  }

  getTechnicalFile() {
    this.candidatService.getTechnicalFileById(this.id).subscribe((data: any) => {
      this.technicalFile = data;
    });
  }

  getEducation() {
    this.candidatService.getEducationById(this.id).subscribe((data: any) => {
      this.education = data;
      console.log(this.education);
    });
  }
  
  getExperience(){
    this.candidatService.getExperienceById(this.id).subscribe((data : any)=>{
      this.experience = data;
      console.log(this.experience);
    })
  }
  getCertification(){
    this.candidatService.getCertificationById(this.id).subscribe((data : any)=>{
      this.certification = data;
      console.log(this.certification);
    })
  }
  getlanguage(){
    this.candidatService.getLanguageById(this.id).subscribe((data : any)=>{
      this.language = data;
      console.log(this.language);
    })
  }
  getSkills(){
    this.candidatService.getSkillsById(this.id).subscribe((data : any)=>{
      this.skills = data;
      console.log(this.skills);
    })
  }
  getCandidature(){
    this.candidatService.getCandiatureById(this.id).subscribe((data : any)=>{
      this.candidature =data;
      console.log(this.candidature);
    })
  }

  openEvaluationCandidat(){
    this.router.navigate(['CandidatEvaluation/evaluationCandidat'])
  }


  openViewById(id: number) {
  this.router.navigate(['/CandidatEvaluation', id]);
}

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



  viewAllEvaluations(id: number) {
    this.crudEntretien.getEmployeeEvaluation(this.id).subscribe((evaluations: Evaluation) => {
      const dialogRef = this.dialog.open( ViewAllInterviewsDetailsComponent, {
        width: '550px',
        data: { evaluations }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    });
  }
  
}
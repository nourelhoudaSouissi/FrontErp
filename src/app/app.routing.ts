import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { UserRoleGuard } from './shared/guards/user-role.guard';
export const rootRouterConfig: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./views/home/home.module').then(m => m.HomeModule),
    data: { title: 'Choose A Demo' }
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule),
        data: { title: 'Session'}
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule),
        data: { title: 'Dashboard', breadcrumb: 'DASHBOARD'}
      },
      {
        path: 'material',
        loadChildren: () => import('./views/material-example-view/material-example-view.module').then(m => m.MaterialExampleViewModule),
        data: { title: 'Material', breadcrumb: 'MATERIAL'}
      },
      {
        path: 'dialogs',
        loadChildren: () => import('./views/app-dialogs/app-dialogs.module').then(m => m.AppDialogsModule),
        data: { title: 'Dialogs', breadcrumb: 'DIALOGS'}
      },
      {
        path: 'profile',
        loadChildren: () => import('./views/profile/profile.module').then(m => m.ProfileModule),
        data: { title: 'Profile', breadcrumb: 'PROFILE'}
      },
      {
        path: 'others',
        loadChildren: () => import('./views/others/others.module').then(m => m.OthersModule),
        data: { title: 'Others', breadcrumb: 'OTHERS'}
      },
      {
        path: 'tables',
        loadChildren: () => import('./views/tables/tables.module').then(m => m.TablesModule),
        data: { title: 'Tables', breadcrumb: 'TABLES'}
      },{
      path: 'contact',
      loadChildren: () => import('./views/contact/contact.module').then(m => m.ContactModule),
      data: { title: 'Tables', breadcrumb: 'TABLES'}
    },
      {
        path: 'tour',
        loadChildren: () => import('./views/app-tour/app-tour.module').then(m => m.AppTourModule),
        data: { title: 'Tour', breadcrumb: 'TOUR'}
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/forms.module').then(m => m.AppFormsModule),
        data: { title: 'Forms', breadcrumb: 'FORMS'}
      },
      {
        path: 'chart',
        loadChildren: () => import('./views/chart-example-view/chart-example-view.module').then(m => m.ChartExampleViewModule),
        data: { title: 'Charts', breadcrumb: 'CHARTS'}
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/charts.module').then(m => m.AppChartsModule),
        data: { title: 'Charts', breadcrumb: 'CHARTS'}
      },
      {
        path: 'map',
        loadChildren: () => import('./views/map/map.module').then(m => m.AppMapModule),
        data: { title: 'Map', breadcrumb: 'MAP'}
      },
      {
        path: 'dragndrop',
        loadChildren: () => import('./views/dragndrop/dragndrop.module').then(m => m.DragndropModule),
        data: { title: 'Drag and Drop', breadcrumb: 'DND'}
      },
     /* {
        path: 'ggg',
        loadChildren: () => import('./views/Requirement/req.module').then(m => m.ReqModule),
        data: { title: 'Tables', breadcrumb: 'TABLES'}
      },*/
      {
        path: 'inbox',
        loadChildren: () => import('./views/app-inbox/app-inbox.module').then(m => m.AppInboxModule),
        data: { title: 'Inbox', breadcrumb: 'INBOX'}
      },
      {
        path: 'calendar',
        loadChildren: () => import('./views/app-calendar/app-calendar.module').then(m => m.AppCalendarModule),
        data: { title: 'Calendar', breadcrumb: 'CALENDAR'}
      },
      {
        path: 'chat',
        loadChildren: () => import('./views/app-chats/app-chats.module').then(m => m.AppChatsModule),
        data: { title: 'Chat', breadcrumb: 'CHAT'}
      },
      {
        path: 'll',
        loadChildren: () => import('./views/conanct/conanct.module').then(m => m.ConanctModule),
        data: { title: 'Chat', breadcrumb: 'CHAT'}
      },
      {
        path: 'partnerTest',
        loadChildren: () => import('./views/cruds/cruds.module').then(m => m.CrudsModule),
        data: { title: 'CRUDs', breadcrumb: 'CRUDs'}
      },
      {
        path: 'shop',
        loadChildren: () => import('./views/shop/shop.module').then(m => m.ShopModule),
        data: { title: 'Shop', breadcrumb: 'SHOP'}
      },
      {
        path: 'search',
        loadChildren: () => import('./views/search-view/search-view.module').then(m => m.SearchViewModule)
      },
      {
        path: 'invoice',
        loadChildren: () => import('./views/invoice/invoice.module').then(m => m.InvoiceModule)
      },
      {
        path: 'todo',
        loadChildren: () => import('./views/todo/todo.module').then(m => m.TodoModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./views/order/order.module').then(m => m.OrderModule),
        data: { title: 'Orders', breadcrumb: 'Orders'}
      },
      {
        path: 'page-layouts',
        loadChildren: () => import('./views/page-layouts/page-layouts.module').then(m => m.PageLayoutsModule)
      },
      {
        path: 'utilities',
        loadChildren: () => import('./views/utilities/utilities.module').then(m => m.UtilitiesModule)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/mat-icons/mat-icons.module').then(m => m.MatIconsModule),
        data: { title: 'Icons', breadcrumb: 'Icons'}
      },
      {
        path: 'time-off-employee',
        loadChildren: () => import('./views/Component/HumanResource/timeOffEmployee/app-calendar.module').then(m => m.TimeOffCalendarModule),
        data: { title: 'TimeOff', breadcrumb: 'TimeOffs'}
      },
      {
        path: 'resource',
        loadChildren: () => import('./views/Component/HumanResource/resource/resource.module').then(m => m.ResourceModule),
        data: { title: 'Ressources', breadcrumb: 'Ressources'}
      },
      {
        path: 'updateResource',
        loadChildren: () => import('./views/Component/HumanResource/resource/resource.module').then(m => m.ResourceModule),
        data: { title: 'Ressources', breadcrumb: 'Ressources'}
      },
      {
        path: 'add-resource',
        loadChildren: () => import('./views/Component/HumanResource/resource/createResource/add-resource.module').then(m => m.AddResourceModule),
        data: { title: 'Ressources', breadcrumb: 'Ressources'}
      },
      {
        path: 'add-backoffice-resource',
        loadChildren: () => import('./views/Component/HumanResource/resource/createResource/add-resource.module').then(m => m.AddResourceModule),
        data: { title: 'Ressources BackOffices', breadcrumb: 'Ressources BackOffices'}
      },
      {
        path: 'add-external-resource',
        loadChildren: () => import('./views/Component/HumanResource/resource/createResource/add-resource.module').then(m => m.AddResourceModule),
        data: { title: 'Ressources Externes', breadcrumb: 'Ressources Externes'}
      },
      {
        path: 'contractEmployee',
        loadChildren: () => import('./views/Component/HumanResource/contracts/contractEmployee/contractEmployee.module').then(m => m.ContractEmployeeModule),
        data: { title: 'Contrats Employées', breadcrumb: 'Contrats Employées'}
      },
      {
        path: 'updateContract',
        loadChildren: () => import('./views/Component/HumanResource/contracts/contractEmployee/contractEmployee.module').then(m => m.ContractEmployeeModule),
        data: { title: 'Contrats Employées', breadcrumb: 'Contrats Employées'}
      },
       {
        path: 'ficheResource',
        loadChildren: () => import('./views/Component/HumanResource/resource/resource.module').then(m => m.ResourceModule),
        data: { title: 'Ressources', breadcrumb: 'Ressources'}
      },
 {
        path: 'candidat',
        loadChildren: () => import('./views/Component/HumanResource/candidate/CandidatCrud/candidat-crud.module').then(m => m.CandidatCrudModule),
        data: { title: 'Candidats', breadcrumb: 'Candidats'}
      },
      {
        path: 'cvCandidat',
        loadChildren: () => import('./views/Component/HumanResource/candidate/CvCandidat/cv-candidat.module').then(m => m.CvCandidatModule),
        data: { title: 'Dossier Technique', breadcrumb: 'Dossier Technique'}
      },
      {
        path: 'candidatUpdate',
        loadChildren: () => import('./views/Component/HumanResource/candidate/updateCandidat/updateCandidat.module').then(m => m.updateCandidatModule),
        data: { title: 'Candidats', breadcrumb: 'Cnadidats'}
      },
      {
        path: 'endorsement',
        loadChildren: () => import('./views/Component/HumanResource/endorsement/endorsement.module').then(m => m.EndorsementModule),
        data: { title: 'Liste des Avenants', breadcrumb: 'Liste des Avenants'}
      },
      {
        path: 'ficheEndorsement',
        loadChildren: () => import('./views/Component/HumanResource/endorsement/endorsement.module').then(m => m.EndorsementModule),
        data: { title: 'Fiche Avenant', breadcrumb: 'Fiche Avenant'}
      },
     
      
      
      {
        path: 'tableOffer',
        loadChildren: () => import('./views/Component/HumanResource/offer/offer-crud.module').then(m => m.OfferCrudModule),
        data: { title: 'Liste des offres', breadcrumb: 'Liste des offres'}
      },

      {
        path: 'CandidatEvaluation',
        loadChildren: () => import('./views/Component/HumanResource/entretienRecrutment/affichage_entreteinrecrutment/affichage_entretienRecrutment.module').then(m => m.EntretienRecrutmentModule),
        data: { title: 'Fiche Evaluation', breadcrumb: 'Fiche  Evaluation'}
      },

      {
        path: 'entretienTable',
        loadChildren: () => import('./views/Component/HumanResource/entretienRecrutment/crud_table_entretienRecrutment/crud_entretienRecrutment.module').then(m => m.CrudEntretienRecrutmentModule),
        data: { title: 'Entretiens & Evaluations', breadcrumb: 'Entretiens & Evaluations'}
      },
      {
        path: 'evaluationCrud',
        loadChildren: () => import('./views/Component/HumanResource/entretienRecrutment/add_evaluation/add_crud_evaluation.module').then(m => m.CrudEvaluationModule),
        data: { title: 'Entretiens & Evaluations', breadcrumb: 'Entretiens & Evaluations'}
      },
      
      {
        path: 'equipment',
        loadChildren: () => import('./views/Component/HumanResource/equipment/equipment.module').then(m => m.EquipmentModule),
        data: { title: 'Equipements', breadcrumb: 'Equipements'}
      },
      
      
      {
        path: 'Add-contract-employee',
        loadChildren: () => import('./views/Component/HumanResource/contracts/contractEmployee/contractEmployee.module').then(m => m.ContractEmployeeModule),
        data: { title: 'Contrats Employées', breadcrumb: 'Contrats Employées'}
      },
   
      {
        path: 'article-referentiel',
        loadChildren: () => import('./views/Component/HumanResource/referentiel/article/article.module').then(m => m.ArticleModule),
        data: { title: 'Référentiel des articles', breadcrumb: 'Référentiel des articles'}
      },
      {
        path: 'equipmentReferentiel',
        loadChildren: () => import('./views/Component/HumanResource/referentiel/equipment/equipment.module').then(m => m.EquipmentModule),
        data: { title: 'Référentiel des équipements', breadcrumb: 'Référentiel des équipements'}
      },
      {
        path: 'TableReferentiel',
        loadChildren: () => import('./views/Component/HumanResource/referentiel/referentielDataTable/referentiel-crud.module').then(m => m.referentielCrudModule),
        data: { title: 'Référentiel des questionnaires', breadcrumb: 'Référentiel des questionnaires'}
      },

      {
        path: 'refQuestionAffichage',
        loadChildren: () => import('./views/Component/HumanResource/referentiel/refQuestionAffichage/refQuestionAffichage.module').then(m => m.refQuestionAffichageModule),
        data: { title: 'Référentiel des questionnaires', breadcrumb: 'Référentiel des questionnaires'}
      },

      {
        path: 'refCategoryAffichage',
        loadChildren: () => import('./views/Component/HumanResource/referentiel/refCategoryAffichage/refCategoryAffichage.module').then(m => m.refCategoryAffichageModule),
        data: { title: 'Référentiel des questionnaires', breadcrumb: 'Référentiel des questionnaires'}
      },
      {
        path: 'formReferentiel',
        loadChildren: () => import('./views/Component/HumanResource/referentiel/referentielForm/referentielForm.module').then(m => m.referentielFormModule),
        data: { title: 'Référentiel des questionnaires', breadcrumb: 'Référentiel des questionnaires'}
      },
      {
        path: 'formReferentiel2',
        loadChildren: () => import('./views/Component/HumanResource/referentiel/referentielForm2/referentielForm2.module').then(m => m.referentielForm2Module),
        data: { title: 'Référentiel des questionnaires', breadcrumb: 'Référentiel des questionnaires'}
      },
      {
        path: 'timeOffValidation',
        loadChildren: () => import('./views/Component/HumanResource/timeOffValidation/timeOff-validation.module').then(m => m.TimeOffValidationModule),
        data: { title: 'Validation Congés', breadcrumb: 'Validation Congés'}
      }, 
      {
        path: 'simpleTimeOff',
        loadChildren: () => import('./views/Component/HumanResource/simpleTimeOff/timeOff.module').then(m => m.TimeOffModule),
        data: { title: 'Congés', breadcrumb: 'Congés'}
      }, 
      {
        path: 'recoveryLeave',
        loadChildren: () => import('./views/Component/HumanResource/recoveryLeave/recovery-leave.module').then(m => m.RecoveryLeaveModule),
        data: { title: 'Jours de Récupération', breadcrumb: 'Jours de Récupération'}
      },
      {
        path: 'recoveryLeaveValidation',
        loadChildren: () => import('./views/Component/HumanResource/recoveryValidation/recovery-validation.module').then(m => m.RecoveryValidationModule),
        data: { title: 'Validation jours de Récupération', breadcrumb: 'Validation  jours de Récupération'}
      },
      {
        path: 'leaveType',
        loadChildren: () => import('./views/Component/HumanResource/leaveType/leaveType.module').then(m => m.LeaveTypeModule),
        data: { title: 'Types de congés', breadcrumb: 'Types de congés'}
      },
      {
        path: 'holiday',
        loadChildren: () => import('./views/Component/Referentiel/Holiday/holiday.module').then(m => m.HolidayModule),
        data: { title: 'Jours fériés', breadcrumb: 'Jours fériés'}
      },
      {
        path: 'weekend',
        loadChildren: () => import('./views/Component/Referentiel/Weekend/weekend.module').then(m => m.WeekendModule),
        data: { title: 'Weekends', breadcrumb: 'Weekends'}
      },

      {
        path: 'calendar',
        loadChildren: () => import('./views/Component/Referentiel/Calendar/calendar.module').then(m => m.CalendarModule),
        data: { title: 'Calendriers Entreprises', breadcrumb: 'Calendriers Entreprises'}
      },

      {
        path: 'expenseReport',
        loadChildren: () => import('./views/Component/HumanResource/expenseReport/expenseReport.module').then(m => m.ExpenseReportModule),
        data: { title: 'Notes de Frais', breadcrumb: 'Notes de Frais'}
      },

      {
        path: 'expenseReportValidation',
        loadChildren: () => import('./views/Component/HumanResource/expenseReportValidation/expenseReportValidation.module').then(m => m.ExpenseReportValidationModule),
        data: { title: ' Validation Note de Frais', breadcrumb: 'Validation Note de Frais'}
      },
      {
        path: 'contact',
        loadChildren: () => import('./views/Component/Sales/contact/contact.module').then(m => m.ContactModule),
        data: { title: 'Contact', breadcrumb: 'Contacts'}
      },
      
      {
          path: 'rendezVous',
          loadChildren: () => import('./views/Component/Sales/rendez-vous/rendez-vous.module').then(m => m.RendezVousModule),
          data: { title: 'Rendez-vous', breadcrumb: 'Rendez-vous'}
      },
      {
        path: 'order',
        loadChildren: () => import('./views/Component/Sales/orders/orders.module').then(m => m.OrdersModule),
        data: { title: 'Order', breadcrumb: 'Commandes'}
      },
      {
        path: 'quotation',
        loadChildren: () => import('./views/Component/Sales/quotation/quotation.module').then(m => m.QuotationModule),
        data: { title: 'Quotation', breadcrumb: 'Devis'}
      },

{
        path: 'partner',
        loadChildren: () => import('./views/Component/Sales/partner/crudsPartner.module').then(m => m.PartnerModule),
        data: { title: 'Partner', breadcrumb: 'Partenaires'}
      },
      {
        path: 'contract',
        loadChildren: () => import('./views/Component/Sales/contractProjet/contractClient.module').then(m => m.ContractClientModule),
        data: { title: 'Contracts', breadcrumb: 'Contrats partenaires'}
      },
      {
        path: 'endorsement',
        loadChildren: () => import('./views/Component/Sales/endorsementClient/endorsement.module').then(m => m.EndorsementModule),
        data: { title: 'Endorsements', breadcrumb: 'Avenants'}
      },
      {
        path: 'requirement',
        loadChildren: () => import('./views/Component/Sales/Requirement/req.module').then(m => m.ReqModule),
        data: { title: 'Requirement', breadcrumb: 'Opportunités'}
      },
      {
        path: 'catalog',
        loadChildren: () => import('./views/Component/Sales/profile-catalog/profile-catalog.module').then(m => m.ProfileCatalogModule),
        data: { title: 'Profile catalog', breadcrumb: 'Catalogue profils'}
      },
       {
        path:'projets',
        loadChildren: () => import('./views/Component/HumanResource/projet/projet.module').then(m => m.ProjetModule),
        data: { title: 'projet list', breadcrumb: 'Projets'}
      },
      {
        path: 'rapprochement',
        loadChildren: () => import('./views/rapprochement/rapprochement.module').then(m => m.RapprochementModule)
      },
      {
        path: 'tresorerie',
        loadChildren: () => import('./views/tresorerie/tresorerie.module').then(m => m.TresorerieModule)
      },
      {
        path: 'client',
        loadChildren: () => import('./views/client/client.module').then(m => m.ClientModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'sessions/404'
  }
];


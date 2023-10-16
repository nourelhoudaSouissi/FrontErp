import { Routes } from "@angular/router";
import { CatalogDetailComponent } from "./catalog-detail/catalog-detail.component";
import { CatalogPopComponent } from "./catalog-pop/catalog-pop.component";
import { CatalogListComponent } from "./catalog-list/catalog-list.component";

export const CatalogRoutes: Routes = [
    { 
      path: 'catalog-crud', 
      component: CatalogListComponent,
      data: { title: 'Table', breadcrumb: 'Liste des catalogues' } 
    },
    {
      path: "",
      component:CatalogPopComponent ,
      pathMatch: "full"
    },
    {
      path: ":id",
      component: CatalogDetailComponent ,
      pathMatch: "full"
    }
  ];
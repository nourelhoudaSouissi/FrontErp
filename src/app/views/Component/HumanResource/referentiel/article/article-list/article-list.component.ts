
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ArticleService } from '../article.service';
import { CreateArticleComponent } from './create-article/create-article.component';



@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],

  
  
})
export class ArticleListComponent implements OnInit, OnDestroy , AfterViewInit{
  
  


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  
  public dataSource: any;
  public displayedColumns: any;
  public getItemSub: Subscription;
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private articleService: ArticleService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) { }

  ngOnInit() {
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems()
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }
  }

  getDisplayedColumns() {
    return ['articleTitle' ,'actions'];
  }

  getItems() {    
    this.getItemSub = this.articleService.getArticles()
      .subscribe((data :any )=> {
        data.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Ajouter un nouvel article' : 'Modifier Article';
    let dialogRef: MatDialogRef<any> = this.dialog.open(CreateArticleComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        if (isNew) {
          this.loader.open('Ajouter  nouvel Article');
          this.articleService.addArticle(res)
            .subscribe(data => {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Article Ajouté avec succès!', 'OK', { duration: 4000 })
              this.getItems()
            })
        } else {
          this.loader.open('Modifier Article ');
          this.articleService.updateArticle(data.id, res)
            .subscribe(data => {
              this.dataSource = data;
              this.loader.close();
              this.getItems();
              this.snack.open('Article Modifié!', 'OK', { duration: 4000 })
            })
        }
      })
  }


  
  deleteItem(row) {
    this.confirmService.confirm({message: `Delete ${row.name}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Supprimper  Avenant');
          this.articleService.deleteArticle(row)
            .subscribe(data => {
              this.dataSource = data;
              this.loader.close();
              this.getItems();
              this.snack.open('Article  Supprimé!', 'OK', { duration: 4000 })
            })
        }
      })
  }

    /***************************************************   Apply filter   *******************************************************/
    applyFilterr(event: Event, key: string) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
      this.dataSource.filterPredicate = (data, filter) => {
        return data[key].trim().toLowerCase().indexOf(filter) !== -1;
      };
    }
/*************************** Apply filter global  **************************/
applyFilter(event :Event){
  const FilterValue = (event.target as HTMLInputElement).value ;
   this.dataSource.filter = FilterValue.trim().toLowerCase();

}
}

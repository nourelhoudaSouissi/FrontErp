import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CrudService } from '../crud.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { NgxTablePopupComponent } from './ngx-table-popup/ngx-table-popup.component';
import { Observable, Subscription } from 'rxjs';
import { egretAnimations } from "../../../shared/animations/egret-animations";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Partner } from 'app/shared/models/Partner';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { User } from 'app/shared/models/user.model';


@Component({
  selector: 'app-crud-ngx-table',
  styleUrls: ['crud.scss'],
  templateUrl: './crud-ngx-table.component.html',
  animations: egretAnimations
})
export class CrudNgxTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 
  public dataSource: MatTableDataSource<Partner>;
  public displayedColumns: any;
  public getItemSub: Subscription;
  roles: string[] = [];
  user: Observable<User>;

  constructor(
    private JwtAuthService :JwtAuthService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private crudService: CrudService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) {     this.dataSource = new MatTableDataSource<Partner>([]);}

  ngOnInit() {
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems()
    
    const storedRoles = localStorage.getItem('roles');
    if (storedRoles) {
      this.roles=this.JwtAuthService.roles;
      this.roles = JSON.parse(storedRoles);
    } else {
      this.roles = this.JwtAuthService.roles;
    }
    console.log(this.roles)


      
  }

  getDisplayedColumns() {
    return ['name','parentCompany','ceoName','phoneNumber','Country','city','CompanyStatus','actions'];
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

  getItems() { 
      
    this.getItemSub = this.crudService.getItems()
      .subscribe((data:any)  => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(data)
      })

  }

  openPopUp(data:  any , isNew?) { 
    let title = isNew ? 'Add new Partner' : 'Update Partner';
    let dialogRef: MatDialogRef<any> = this.dialog.open(NgxTablePopupComponent, {
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
          this.loader.open('Adding new Partner');
          this.crudService.addItem(res)
            .subscribe((data :any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Partner Added!', 'OK', { duration: 2000 });
              this.getItems();
            })
        } else {
          this.loader.open('Updating Partner');
          this.crudService.updateItem(data.id,res)
            .subscribe((data:any) => {
              this.dataSource = data ;
              this.loader.close();
              this.snack.open('Partner Updated!', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }
  deleteItem(row) {
   
    this.confirmService.confirm({message: `Delete ${row.name}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Deleting Partner');
          this.crudService.deleteItem(row)
            .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Partner deleted!', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }

  applyFilter(event :Event){
    const FilterValue = (event.target as HTMLInputElement).value ;
     this.dataSource.filter = FilterValue.trim().toLowerCase();
 
 }




}
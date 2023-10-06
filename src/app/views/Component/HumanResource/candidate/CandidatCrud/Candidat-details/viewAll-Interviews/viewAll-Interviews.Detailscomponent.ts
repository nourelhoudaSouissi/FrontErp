import { Component, Inject,  ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Evaluation } from 'app/shared/models/Evaluation';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, Subscription, filter, takeUntil } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationStart, Router } from '@angular/router';
import { entretienRecrutmentService } from 'app/views/Component/HumanResource/entretienRecrutment/entretienRecrutment.service';

@Component({
  selector: 'app-popup',
  templateUrl: './viewAll-InterviewsDetails.component.html',
  //styleUrls: ['./questionnaire-popup.component.css']
})
export class ViewAllInterviewsDetailsComponent {
    dialogRef: MatDialogRef<ViewAllInterviewsDetailsComponent>;
    public dataSource: MatTableDataSource<Evaluation>;
    public displayedColumns: any;
    public getItemSub: Subscription;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private confirmService: AppConfirmService,
    private snack: MatSnackBar,
    private loader: AppLoaderService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: entretienRecrutmentService,
  ) {this.dataSource = new MatTableDataSource<Evaluation>([]);
    this.dataSource = new MatTableDataSource<Evaluation>(this.data.evaluations); }

getDisplayedColumns() {
    return ['evaluationDate', 'actions'];
  }
  
  ngOnInit() {
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.dialogRef.close();
      });

      this.dataSource = new MatTableDataSource<Evaluation>(this.data.evaluations); // Set the evaluations data to the dataSource
  }
 

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  getItems() {
    // this.getItemSub = this.service.getItems()
    //   .subscribe((data: any) => {
    //     this.dataSource = new MatTableDataSource(data);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //   });
  
    // Instead of fetching data from service, the evaluations data is already available in this.data.evaluations
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  

  deleteEvaluation(row) {
    this.confirmService.confirm({ message: `Delete ${row.name}?` })
      .subscribe(res => {
        if (res) {
          this.loader.open('Supprssion de l`entretien');
          this.service.deleteEvaluation(row)
            .subscribe((data: any) => {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('entretien supprimée!', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }

viewEv(row){
    this.router.navigate(['/CandidatEvaluation', row]);}


  ngOnDestroy(): void { 
    this.destroy$.next();
    this.destroy$.complete();
    if (this.getItemSub) {
        this.getItemSub.unsubscribe()
      }
  }
  
 }
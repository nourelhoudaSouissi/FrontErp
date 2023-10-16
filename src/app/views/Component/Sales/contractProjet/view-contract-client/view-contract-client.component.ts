import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractClientService } from '../contract-client.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { contractClient } from 'app/shared/models/contractClient';
import { DOCUMENT } from '@angular/common';
import { html2pdf } from 'html2pdf.js';

@Component({
  selector: 'app-view-contract-client',
  templateUrl: './view-contract-client.component.html',
  styleUrls: ['./view-contract-client.component.scss']
})
export class ViewContractClientComponent implements OnInit {

  id: number;
  contract : contractClient;

  constructor(private route: ActivatedRoute,
    private crudService: ContractClientService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private loader: AppLoaderService,
    @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
      this.getContract();
  }
  getContract() {
    this.crudService.getItem(this.id).subscribe((data: any) => {
      this.contract = data;
      console.log(this.contract)
    });
  }

  downloadContract() {
    const element = document.getElementById("formImprime");
    html2pdf()
      .from(element)
      .save('MonContrat.pdf');
  }


  /********************************************  imprimer contrat     ******************************************/


  print(){
    const printableArea = document.getElementById('formImprime');
    var originalContents = document.body.innerHTML;
    var printContents = document.getElementById('formImprime').innerHTML;
    document.body.innerHTML = printContents ;
    window.print();
    document.body.innerHTML = originalContents;
  }
}

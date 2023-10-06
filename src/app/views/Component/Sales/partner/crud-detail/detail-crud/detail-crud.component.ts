import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudPartnerService } from '../../crudPartner.service';
import { Partner } from 'app/shared/models/Partner';
@Component({
  selector: 'app-detail-crud',
  templateUrl: './detail-crud.component.html'
})
export class DetailCrudComponent implements OnInit {
id: number
partner :Partner
  constructor(    private route: ActivatedRoute,
    private crudService: CrudPartnerService,) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['iiid'];
    this.getPartner();

    console.log(this.id)
  

  }
  getPartner() {
    this.crudService.getItem(this.id).subscribe((data: any) => {
      this.partner = data;

    });
  }
}

import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from '../../crud.service';
import { Partner } from 'app/shared/models/Partner';

@Component({
  selector: 'app-detail-crud',
  templateUrl: './detail-crud.component.html',
  styleUrls: ['./detail-crud.component.scss']
})
export class DetailCrudComponent implements OnInit {



id: number
partner :Partner
  constructor(    private route: ActivatedRoute,
    private crudService: CrudService,) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getPartner();

    console.log(this.id)
    

  }

  getDisplayedColumns() {
    return ['title','description','Criteria'];
  }
  getPartner() {
    this.crudService.getItem(this.id).subscribe((data: any) => {
      this.partner = data;
      console.log(this.partner)

    });
  }
}

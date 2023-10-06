import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent implements OnInit {
  public itemForm: FormGroup;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<PopUpComponent>,
  private fb: FormBuilder,
  public jwtAuth: JwtAuthService, ) { }

  ngOnInit(): void {
    this.buildItemForm(this.data.payload)
  }
  buildItemForm(item){
    this.itemForm = this.fb.group({
      username : [item.username || '', Validators.required],
      email : [item.email || '', Validators.required], 
      password : [item.password || '', Validators.required],
    });

  }

  submit() {
    
    this.dialogRef.close(this.itemForm.value)


  }
}

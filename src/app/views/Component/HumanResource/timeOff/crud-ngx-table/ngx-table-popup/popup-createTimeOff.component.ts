import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, Validators, UntypedFormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './popup-createTimeOff.component.html'
})
export class PopupCreateTimeOffComponent implements OnInit {
  editorData = `<h1>Egret | Angular material admin</h1>
  <p><a href="http://devegret.com" target="_blank"><strong>DevEgret</strong></a></p>
  <p><br></p><p><strong >Lorem Ipsum</strong>
  <span>&nbsp;is simply dummy text of the printing and typesetting industry. 
  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a 
  galley of type and scrambled it to make a type specimen book. It has survived not only five centuries</span></p>`;
  public itemForm: UntypedFormGroup;
  disableSelect = new FormControl(false);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopupCreateTimeOffComponent>,
    private fb: UntypedFormBuilder,
  ) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload)
  }
  onContentChanged() { }
  onSelectionChanged() { }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      name: [item.name || '', ],
      age: [item.age || ''],
      email: [item.email || ''],
      company: [item.company || ''],
      phone: [item.phone || ''],
      address: [item.address || ''],
      balance: [item.balance || ''],
      isActive: [item.isActive || false]
    })
  }

  submit() {
    this.dialogRef.close(this.itemForm.value)
  }
}

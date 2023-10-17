import { Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'app-ngx-table-popup',
    templateUrl: './Phase.component.html',
    
    
   
  })
  
  export class PhaseComponent implements OnInit {
    public itemForm: FormGroup;
    public formItems: FormArray;
   
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<PhaseComponent>,
        private fb: FormBuilder,
       
      ) {    
        
        
      }
    ngOnInit(): void {
      
        this.buildItemForm()
    }
    buildItemForm() {
      this.itemForm = this.fb.group({
        formItems: this.fb.array([this.createFormItem()]), // Add initial form item
      });
  
      this.formItems = this.itemForm.get('formItems') as FormArray;
    }
  
    createFormItem(): FormGroup {
     
      return this.fb.group({
        name: [null, Validators.required], 
        livrable:[null , Validators.required],
        startDate:[null , Validators.required],
        endDate:[null , Validators.required],
        description:[null , Validators.required],
      });
    }
  
    addFormItem(): void {
      const formItem = this.createFormItem();
      this.formItems.push(formItem);
    }
    
    removeFormItem(index: number): void {
      if (index === 0 && this.formItems.length === 1) {
    return; // Skip removal
  }
      this.formItems.removeAt(index);
    }

    /*submit() {
      if (this.itemForm.valid) {
        this.dialogRef.close(this.itemForm.value);
      } 
    }
    */
    
    
    submit() {
      if (this.itemForm.invalid) {
        return;
      }
    
      // Check if a form item is being deleted
      if (this.formItems.controls.some((control, index) => control.pristine && index !== 0)) {
        return;
      }
      const formItemsValue = this.itemForm.get('formItems').value;
      this.dialogRef.close(formItemsValue);
            console.log(this.data.payload)
            console.log(this.itemForm.value)
        }
   
  }
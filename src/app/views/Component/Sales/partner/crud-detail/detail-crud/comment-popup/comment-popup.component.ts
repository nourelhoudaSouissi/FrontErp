import { Component,Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'comment-popup',
    templateUrl: './comment-popup.component.html',
  })
  export class CommentPopupComponent  {

    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any) {}
  }
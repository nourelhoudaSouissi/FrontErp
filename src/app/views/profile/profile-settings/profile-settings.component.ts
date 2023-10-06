import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { JwtAuthService } from "app/shared/services/auth/jwt-auth.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileComponent } from '../profile.component';


@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({ url: 'upload_url' });
  public hasBaseDropZoneOver: boolean = false;
  private selectedFile: File | null = null;
  public uploadProgress: number | null = null;
  username :any
  email:any;
  data:any;
  id:number
  profileForm: FormGroup;
  userr: any;
  userData: any;
  submitted: boolean = false;
  constructor(private JwtAuthService :JwtAuthService,private formBuilder: FormBuilder,private ProfileComponent:ProfileComponent) { }

  ngOnInit() {
   
    this.username =this.JwtAuthService.getUser()

    console.log(this.username)
    
    this.profileForm = this.formBuilder.group({
      fullname: ['',],
      phone: ['',],
      username: [{value: this.username, disabled: true}, Validators.required],
      email: [{ value: '', disabled: true }],
      adresse: ['', ],
      website: ['',]
      });
      this.getuser()
      
  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  getuser(){
    this.JwtAuthService.getUserByUsername(this.username).subscribe(
      user => {
        this.userr = user;
        this.email = user.email;
        this.id=user.id
      console.log(this.email)
        this.profileForm.patchValue({
          email: this.email
        });
  console.log(user.email)
  this.uploadImage()
      },
      error => {
        console.error(error);
      }
    );
  }



  uploadImage() {
    if (!this.selectedFile) {
      return;
    }

    this.JwtAuthService.uploadImage(this.id, this.selectedFile).subscribe(
      (progress) => {
        this.uploadProgress = progress;

        // Set imageUrl in ProfileComponent once upload is complete
        if (this.uploadProgress === 100) {
          this.ProfileComponent.getimage();
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSubmit(): void {
 const formValues = this.profileForm.value;
    formValues.username = this.profileForm.get('username').value;
    
      this.JwtAuthService.completeProfile(formValues)
      .subscribe(response => {
        alert(response.message);
        console.log(response.message);
        this.userData = this.profileForm.value;

        this.profileForm.disable();
        this.submitted = true;
        this.ProfileComponent.getuserinformation();
      }, error => {
        console.log(error.message);
      });
  }
  onUpdate(): void {
    this.profileForm.enable();
    this.submitted = false;
  }
  }

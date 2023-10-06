import { Component, OnInit, OnDestroy, AfterViewInit, Input } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { ThemeService } from "../../services/theme.service";
import { Subscription } from "rxjs";
import { ILayoutConf, LayoutService } from "app/shared/services/layout.service";
import { JwtAuthService } from "app/shared/services/auth/jwt-auth.service";
import { ImageService } from "app/shared/services/ImageService"; 


@Component({
  selector: "app-sidebar-side",
  templateUrl: "./sidebar-side.component.html"
})
export class SidebarSideComponent implements OnInit, OnDestroy, AfterViewInit {
  
  imageUrl: any;
  public menuItems: any[];
  public hasIconTypeMenuItem: boolean;
  public iconTypeMenuTitle: string;
  private menuItemsSub: Subscription;
  public layoutConf: ILayoutConf;
  username:any
  constructor(
    private navService: NavigationService,
    public themeService: ThemeService,
    private layout: LayoutService,
    public jwtAuth: JwtAuthService,
    private imageService: ImageService,
   

  ) {}

  ngOnInit() {
    this.username =this.jwtAuth.getUser()
    this.getimage();
    this.imageService.image$.subscribe(imageUrl => {
      this.imageUrl = imageUrl;
    });
    this.iconTypeMenuTitle = this.navService.iconTypeMenuTitle;
    this.menuItemsSub = this.navService.menuItems$.subscribe(menuItem => {
      this.menuItems = menuItem;
      //Checks item list has any icon type.
      this.hasIconTypeMenuItem = !!this.menuItems.filter(
        item => item.type === "icon"
      ).length;
      
    });
    this.layoutConf = this.layout.layoutConf;
  }
  ngAfterViewInit() {}
  ngOnDestroy() {
    if (this.menuItemsSub) {
      this.menuItemsSub.unsubscribe();
    }
  }
  toggleCollapse() {
    if (
      this.layoutConf.sidebarCompactToggle
    ) {
        this.layout.publishLayoutChange({
        sidebarCompactToggle: false
      });
    } else {
        this.layout.publishLayoutChange({
            // sidebarStyle: "compact",
            sidebarCompactToggle: true
          });
    }
  }
  getimage() {
    this.jwtAuth.getUserByUsername(this.username).subscribe(
      (user) => {
        this.jwtAuth.getImage(user.id).subscribe(
          (data) => {
            const reader = new FileReader();
            reader.readAsDataURL(data);
            reader.onloadend = () => {
              this.imageUrl = reader.result;
            
            };
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.error(error);
      }
    );
  }

}

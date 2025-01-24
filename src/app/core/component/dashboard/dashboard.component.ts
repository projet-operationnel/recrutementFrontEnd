import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ResponseData } from '../../../shared/interfaces/response-data';
import { AuthService } from '../../../auth/service/auth.service';
import { AlertService } from '../../../shared/services/Alert/alert.service';
import Lottie from 'lottie-web';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        position:"relative",
        left: -1000,
      })),
      state('*', style({
        position:"relative",
        left: 0,
      })),
      transition(':enter, :leave', [
        animate('300ms ease-in-out'),
      ])
    ]),

    trigger('dropdownProfil', [
      state('void', style({
        clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
      })),
      state('*', style({
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      })),
      transition(':enter, :leave', [
        animate('300ms ease-in-out'),
      ])
    ])
  ]
})
export class DashboardComponent {
  constructor(private router: Router, private authService: AuthService, private alertService: AlertService) { }
  ngOnInit(){
    this.defineElement(Lottie.loadAnimation);
  }


  fadeInOutState = '';
  dropdownProfilState="";

  isSearchPanelOpen: boolean = false;
  isNotificationPanelOpen: boolean = false;
  isDropDownPanelOpen: boolean = false;



  openSearchPanel() {
    this.isSearchPanelOpen = !this.isSearchPanelOpen;
  }

  openNotificationPanel() {
    this.isNotificationPanelOpen = !this.isNotificationPanelOpen;
  }


  dropdownopen(){
    this.isDropDownPanelOpen = !this.isDropDownPanelOpen;
  }


  logout() {
    this.alertService.showConfirmation("Deconnexion", "Voulez vous vraiment vous déconnecter").then((result) => {
      if (result.isConfirmed) {
        this.authService.getData<ResponseData<[]>>("logout").subscribe({
          next: (value ) => {
            if (value.status) {
              localStorage.clear();
              this.router.navigateByUrl('/auth');
            }

          },
          error: (err) => {
            this.alertService.showAlert({
              title: "Erreur",
              text: err.message,
              icon: "warning"
            })

          },
          complete: () => {

          }
        });


      }
    });



  }


  isActive(link: string): boolean {
    return this.router.isActive(link, true);
  }

  defineElement(loadAnimation: any) {
    throw new Error('Function not implemented.');
  }
}




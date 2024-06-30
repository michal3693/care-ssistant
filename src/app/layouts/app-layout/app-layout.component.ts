import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  IonContent,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';
import { MenuItem } from 'src/app/models/menu-item.model';
import { RoleEnum } from 'src/app/models/role.enum';
import { CaregiverNotificationsService } from 'src/app/services/caregiver-notifications.service';
import { CaregiverSocketsService } from 'src/app/services/caregiver-sockets.service';
import { ConnectRequestsService } from 'src/app/services/connect-requests.service';
import { LoginService } from 'src/app/services/login.service';
import { PatientSocketsService } from 'src/app/services/patient-sockets.service';
import { SocketService } from 'src/app/services/socket.service';
import { TabsMenuService } from 'src/app/services/tabs-menu.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    IonContent,
    IonRouterOutlet,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
  ],
})
export class AppLayoutComponent {
  menuItems: MenuItem[] = [];
  role?: RoleEnum;
  userId?: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private socketService: SocketService,
    private loginService: LoginService,
    private tabsMenuService: TabsMenuService,
    private userService: UserService,
    private connectRequestsService: ConnectRequestsService,
    private patientSocketsService: PatientSocketsService,
    private caregiverSocketsService: CaregiverSocketsService,
    private caregiverNotificationsService: CaregiverNotificationsService
  ) {}

  ionViewWillEnter() {
    console.log('App layout init');
    this.tabsMenuService.getMenuItems().then((menuItems) => {
      this.menuItems = menuItems;
      this.cdRef.markForCheck();
    });

    this.userService.getUserProfile().subscribe((user) => {
      this.role = user?.role;
      this.userId = user?.id;
      this.connectToSocketServer();
      if (this.role === RoleEnum.Patient)
        this.connectRequestsService.loadConnectRequestsGlobally();
    });
  }

  private connectToSocketServer() {
    this.socketService.connectToSocketServer().subscribe(() => {
      if (this.role === RoleEnum.Patient)
        this.patientSocketsService.init(this.userId!);
      else if (this.role === RoleEnum.Caregiver)
        this.caregiverSocketsService.init();
    });
  }

  logout() {
    this.loginService.logout();
  }
}

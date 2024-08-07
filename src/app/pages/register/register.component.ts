import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';
import { RegisterService } from 'src/app/services/register.service';
import { ToastsService } from 'src/app/services/toasts.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonIcon,
    IonButton,
    IonContent,
    IonInput,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    RouterLink,
  ],
})
export class RegisterComponent implements OnInit {
  newUser!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastsService: ToastsService,
    private registerService: RegisterService
  ) {}

  ngOnInit() {
    this.newUser = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  register() {
    if (this.newUser.invalid) {
      this.toastsService.showError('Wprowadzone dane są niepoprawne');
      return;
    }

    const { email, password, name, role } = this.newUser.value;
    this.registerService.createAccount(email, password, name, role).subscribe({
      next: () => {
        this.toastsService.showSuccess('Rejestracja powiodła się');
        this.router.navigate(['']);
      },
      error: (error) => {
        console.error(error);
        this.toastsService.showError('Rejestracja nie powiodła się');
      },
    });
  }
}

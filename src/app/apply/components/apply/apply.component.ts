import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../shared/interfaces/user';
import { AuthService } from '../../../auth/service/auth.service';
import { ApplyService } from '../../service/apply.service';
import { ResponseData } from '../../../shared/interfaces/response-data';
import { AlertService } from '../../../shared/services/Alert/alert.service';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.css']
})
export class ApplyComponent implements OnInit {
  actifLoading: boolean = false;
  applyForm: FormGroup;
  announcementId: string = '';
  user: User | null = null;
  cvFile: File | null = null;
  motivationLetterFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private applyService:ApplyService,
    private alertService: AlertService
  ) {
    this.applyForm = this.fb.group({
      nom: [{value: '', disabled: true}, [Validators.required]],
      prenom: [{value: '', disabled: true}, [Validators.required]],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });
  }

  ngOnInit(): void {
    this.announcementId = this.route.snapshot.paramMap.get('id') || '';
    this.user = this.authService.getUser();

    if (!this.user) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/apply/${this.announcementId}` }
      });
      return;
    }

    // Pre-fill form with user data
    this.applyForm.patchValue({
      nom: this.user.nom,
      prenom: this.user.prenom,
      email: this.user.email,
      telephone: this.user.telephone || ''
    });
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  onFileChange(event: any, type: 'cv' | 'motivationLetter'): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (type === 'cv') {
        this.cvFile = file;
      } else {
        this.motivationLetterFile = file;
      }
    }
  }

  onSubmit(): void {
    if (this.applyForm.invalid) {
      Object.keys(this.applyForm.controls).forEach(key => {
        const control = this.applyForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    if (!this.cvFile || !this.motivationLetterFile) {
      this.alertService.showAlert({
        title: 'Erreur',
        text: 'Veuillez télécharger votre CV et votre lettre de motivation.',
        icon: 'warning',
      });

      return;
    }

    // Create FormData and append files
    const formData = new FormData();

    // Append the announcement ID
    formData.append("annonceRecrutementId", this.announcementId);
    formData.append('cvDocument', this.cvFile);
    formData.append('motivationDocument', this.motivationLetterFile);





    // Example of what's being sent in the FormData:
    this.actifLoading = true
    this.applyService.postData<any,ResponseData<any>>("candidatures",formData).subscribe({
    next: (response) => {
      console.log('Response:', response);
      this.actifLoading = false
      this.alertService.showAlert({
        title: 'Succès',
        text: response.message,
        icon: 'success',
      });
      this.resetForm();
      this.router.navigate(['/']);
    },
    error: (error) => {
      console.error('Error:', error);
      this.actifLoading = false
      this.alertService.showAlert({
        title: 'Erreur',
        text: error.error.message,
        icon: 'warning',
      });


    },

    complete: () => {
      console.log('Request completed');
      this.actifLoading = false

    }
    })
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.applyForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.applyForm.get(fieldName);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control.hasError('email')) {
      return 'Email invalide';
    }
    if (control.hasError('pattern')) {
      return 'Numéro de téléphone invalide (10 chiffres requis)';
    }
    return '';
  }


resetForm(): void {
  // Réinitialiser les valeurs du formulaire aux valeurs initiales de l'utilisateur
  if (this.user) {
    this.applyForm.patchValue({
      nom: this.user.nom,
      prenom: this.user.prenom,
      email: this.user.email,
      telephone: this.user.telephone || ''
    });
  } else {
    // Si pas d'utilisateur, vider complètement le formulaire
    this.applyForm.patchValue({
      nom: '',
      prenom: '',
      email: '',
      telephone: ''
    });
  }

  // Réinitialiser l'état des contrôles (dirty, touched, etc.)
  Object.keys(this.applyForm.controls).forEach(key => {
    const control = this.applyForm.get(key);
    control?.markAsUntouched();
    control?.markAsPristine();
  });

  // Réinitialiser les fichiers
  this.cvFile = null;
  this.motivationLetterFile = null;

  // Réinitialiser les input files dans le DOM
  const cvInput = document.querySelector('input[type="file"][name="cv"]') as HTMLInputElement;
  const motivationInput = document.querySelector('input[type="file"][name="motivationLetter"]') as HTMLInputElement;
  if (cvInput) cvInput.value = '';
  if (motivationInput) motivationInput.value = '';

  // Réinitialiser le loading si nécessaire
  this.actifLoading = false;
}
}

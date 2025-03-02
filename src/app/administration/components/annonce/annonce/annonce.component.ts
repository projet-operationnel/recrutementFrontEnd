import { Component, OnInit, signal } from '@angular/core';
import { AnnonceService } from '../service/annonce.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../../shared/services/Alert/alert.service';
import { AnneeAcademique } from '../../annee-academique/interfaces/annee-academique';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-annonce',
  templateUrl: './annonce.component.html',
  styleUrls: ['./annonce.component.css']
})
export class AnnonceComponent implements OnInit {
  annonces: any[] = [];
  filteredAnnonces: any[] = [];
  isLoading = false;
  showModal = false;
  isEditMode = false;
  currentAnnonceId: number | null = null;
  annonceForm!: FormGroup;
  dataList = signal<AnneeAcademique[]>([]);
  selectedAnneeAcademiqueId: number | null = null;
  showCandidatsModal = false;
  candidats: any[] = []; // Liste complète des candidats
  filteredCandidats: any[] = []; // Liste filtrée des candidats
  selectedFilter: string | null = null; // Filtre actuel
  selectedCandidat: any = null;
  showPdfModal = false;
  pdfUrl: string = '';


  constructor(private annonceService: AnnonceService, private fb: FormBuilder, private alertService: AlertService) {
    this.annonceForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      anneeAcademiqueId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getData();
    this.getDataAnneeAcademique();
  }

  getData() {
    this.annonceService.getData<any[]>('annonces').subscribe({
      next: (response) => {
        this.annonces = response.map(item => item.data);
        this.filterAnnoncesByActiveYear();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  filterAnnoncesByActiveYear() {
    const activeYear = this.dataList().find(annee => annee.estActive);
    if (activeYear) {
      this.selectedAnneeAcademiqueId = activeYear.id;
      this.filteredAnnonces = this.annonces.filter(annonce => annonce.anneeAcademiqueId === activeYear.id);
    } else {
      this.filteredAnnonces = this.annonces;
    }
  }

  onAnneeAcademiqueChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedAnneeAcademiqueId = parseInt(selectElement.value, 10);
    this.filteredAnnonces = this.annonces.filter(annonce => annonce.anneeAcademiqueId === this.selectedAnneeAcademiqueId);
  }

  openModal(annonce?: any) {
    this.showModal = true;
    if (annonce) {
      this.isEditMode = true;
      this.currentAnnonceId = annonce.id;
      this.annonceForm.patchValue(annonce);
    } else {
      this.isEditMode = false;
      this.currentAnnonceId = null;
      this.annonceForm.reset();

      // Pré-remplir avec l'année académique active
      const activeYear = this.dataList().find(annee => annee.estActive);
      if (activeYear) {
        this.annonceForm.patchValue({
          anneeAcademiqueId: activeYear.id
        });
      }
    }
  }

  closeModal() {
    this.showModal = false;
    this.annonceForm.reset();
  }

  onSubmit() {
    this.isLoading = true;
    if (this.annonceForm.invalid) {
      this.isLoading = false;
      return;
    }

    const annonceData = this.annonceForm.value;
    if (this.isEditMode && this.currentAnnonceId) {
      this.annonceService.putData(`annonces/${this.currentAnnonceId}`, annonceData).subscribe({
        next: (response: any) => {
          this.alertService.showAlert({
            title: 'Succès',
            text: response.message,
            icon: 'success',
          });
          this.getData();
          this.closeModal();
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.alertService.showAlert({
            title: 'Erreur',
            text: err.message,
            icon: 'warning',
          });
          this.isLoading = false;
        }
      });
    } else {
      this.annonceService.postData('annonces', annonceData).subscribe({
        next: (response: any) => {
          this.getData();
          this.closeModal();
          this.isLoading = false;
          this.alertService.showAlert({
            title: 'Succès',
            text: response.message,
            icon: 'success',
          });
        },
        error: (err) => {
          console.log(err);
          this.alertService.showAlert({
            title: 'Erreur',
            text: err.message,
            icon: 'warning',
          });
          this.isLoading = false;
        }
      });
    }
  }

  deleteAnnonce(id: number) {
    this.alertService.showConfirmation("Suppression", "Êtes-vous sûr de vouloir supprimer cette annonce").then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.annonceService.deleteData(`annonces`, id).subscribe({
          next: () => {
            this.annonces = this.annonces.filter(annonce => annonce.id !== id);
            this.filteredAnnonces = this.filteredAnnonces.filter(annonce => annonce.id !== id);
            this.isLoading = false;
          },
          error: (err) => {
            console.log(err);
            this.isLoading = false;
          }
        });
      }
    });
  }

  getDataAnneeAcademique() {
    this.isLoading = true;
    this.annonceService.getData<any>('annee').subscribe({
      next: (response) => {
        if (response && Array.isArray(response)) {
          const formattedData: AnneeAcademique[] = response.map(item => ({
            id: item.data.id,
            libelle: item.data.libelle,
            dateDebut: this.convertDateToArray(item.data.dateDebut),
            dateFin: this.convertDateToArray(item.data.dateFin),
            estActive: item.data.estActive
          }));

          this.dataList.set(formattedData);
          this.filterAnnoncesByActiveYear();
        }
      },
      error: (err) => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

    // Méthode pour filtrer les candidats
    filterCandidats(status: string | null) {
      this.selectedFilter = status;
  
      if (status) {
        // Filtrer les candidats par statut
        this.filteredCandidats = this.candidats.filter(candidat => candidat.statutCandidature === status);
      } else {
        // Afficher tous les candidats si aucun filtre n'est sélectionné
        this.filteredCandidats = this.candidats;
      }
    }
  


showCandidats(annonceId: number) {
  this.isLoading = true;

  // Appels API en parallèle
  forkJoin({
    candidatures: this.annonceService.getData<any[]>(`candidatures/annonce/${annonceId}`),
    users: this.annonceService.getData<any[]>(`candidatures/users/${annonceId}`)
  }).subscribe({
    next: ({ candidatures, users }) => {
      // Fusionner les données
      this.candidats = candidatures.map(item => {
        const user = users.find(u => u.id === item.data.userId);
        return {
          ...item.data,
          user: user || null // Ajouter les informations de l'utilisateur
        };
      });

              // Appliquer le filtre par défaut (tous les candidats)
              this.filterCandidats(null);


      this.showCandidatsModal = true;
      this.isLoading = false;
    },
    error: (err) => {
      console.log(err);
      this.isLoading = false;
    }
  });
}

getCandidatCount(status: string): number {
  return this.candidats.filter(candidat => candidat.statutCandidature === status).length;
}

refuserCandidature(candidatureId: number) {
  const motifRefus = prompt("Veuillez entrer le motif de refus :");
  if (motifRefus) {
    const body = {
      nouveauStatut: "REFUSE",
      motifRefus: motifRefus
    };

    this.isLoading = true;
    this.annonceService.putData(`candidatures/statut/${candidatureId}`, body).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.alertService.showAlert({
          title: 'Succès',
          text: 'Candidature refusée avec succès.',
          icon: 'success',
        });
        this.getData(); // Recharger les données
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.alertService.showAlert({
          title: 'Erreur',
          text: 'Une erreur est survenue lors du refus de la candidature.',
          icon: 'error',
        });
      }
    });
  }
}

accepterCandidature(candidatureId: number) {
  const body = {
    nouveauStatut: "TRAITE"
  };
  this.isLoading = true;
  this.annonceService.putData(`candidatures/statut/${candidatureId}`, body).subscribe({
    next: (response) => {
      this.isLoading = false;
      this.alertService.showAlert({
        title: 'Succès',
        text: 'Candidature acceptée avec succès.',
        icon: 'success',
      });
      this.getData(); // Recharger les données
    },
    error: (err) => {
      console.log(err);
      this.isLoading = false;
      this.alertService.showAlert({
        title: 'Erreur',
        text: 'Une erreur est survenue lors de l\'acceptation de la candidature.',
        icon: 'error',
      });
    }
  });
}
  
  closeCandidatsModal() {
    this.showCandidatsModal = false;
    this.candidats = [];
  }

  viewCv(cvUrl: string) {
    this.pdfUrl = cvUrl || ''; // Ensure it's never null
    this.showPdfModal = true;
  }
  
  viewMotivation(motivationUrl: string) {
    this.pdfUrl = motivationUrl || ''; // Ensure it's never null
    this.showPdfModal = true;
  }
  
  closePdfModal() {
    this.showPdfModal = false;
    this.pdfUrl = ''; // Reset to empty string instead of null
  }
  
  
  private convertDateToArray(dateStr: string): number[] {
    return dateStr.split('-').map(num => parseInt(num, 10));
  }
}
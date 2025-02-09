import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AnneeAcademique } from '../interfaces/annee-academique';
import { AnneeAcademiqueService } from '../services/annee-academique.service';
import { ResponseData } from '../../../../shared/interfaces/response-data';
import { AlertService } from '../../../../shared/services/Alert/alert.service';

@Component({
  selector: 'app-annee-academique',
  templateUrl: './annee-academique.component.html',
  styleUrl: './annee-academique.component.css'
})
export class AnneeAcademiqueComponent implements OnInit {
  anneeForm!: FormGroup;
  dataList = signal<AnneeAcademique[]>([]);
  isLoading = signal<boolean>(false);
  filteredList = computed(() => {
    return this.dataList().filter(item =>
      !this.searchTerm().trim() ||
      item.libelle.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
      this.formatDate(item.dateDebut).includes(this.searchTerm().toLowerCase()) ||
      this.formatDate(item.dateFin).includes(this.searchTerm().toLowerCase())
    );
  });

  searchTerm = signal<string>('');
  sortDirection = signal<'asc' | 'desc'>('asc');
  showModal = signal<boolean>(false);
  editMode = signal<boolean>(false);
  currentItem = signal<AnneeAcademique>({} as AnneeAcademique);
  dateDebut = signal<string>('');
  dateFin = signal<string>('');

  constructor(private anneeAcademiqueService: AnneeAcademiqueService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.initializeForm()
    this.getData();
    this.sortByDate();
  }


  initializeForm(): void {
    this.anneeForm = new FormGroup({
      libelle: new FormControl('', Validators.required),
      dateDebut: new FormControl('', Validators.required),
      dateFin: new FormControl('', Validators.required),
    }, { validators: this.dateRangeValidator });
  }


  dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const dateDebut = control.get('dateDebut')?.value;
    const dateFin = control.get('dateFin')?.value;

    if (dateDebut && dateFin && new Date(dateDebut) > new Date(dateFin)) {
      return { dateRangeInvalid: true };
    }
    return null; // Pas d'erreur
  };

  getData() {
    this.isLoading.set(true); // Activer le loader
    this.anneeAcademiqueService.getData<any>('annee').subscribe({
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
        }
      },
      error: (err) => {        this.isLoading.set(false); // Désactiver le loader en cas d'erreur
      },
      complete: () => {        this.isLoading.set(false); // Désactiver le loader une fois terminé
      }
    });
  }
  // Fonction pour convertir une date string "YYYY-MM-DD" en [YYYY, MM, DD]
  convertDateToArray(dateStr: string): number[] {
    return dateStr.split('-').map(num => parseInt(num, 10));
  }


  // Nouvelle méthode pour la recherche
  search(): void {
    this.filteredList();
    this.sortByDate();
  }

  // Nouvelle méthode pour le tri par date
  sortByDate(): void {
    this.dataList.update(list => {
      return list.sort((a, b) => {
        // Si 'a' est active et 'b' ne l'est pas, 'a' doit venir en premier
        if (a.estActive && !b.estActive) return -1;

        // Si 'b' est active et 'a' ne l'est pas, 'b' doit venir en premier
        if (!a.estActive && b.estActive) return 1;

        // Si les deux sont actives ou non actives, trier par date de début
        const dateA = new Date(a.dateDebut[0], a.dateDebut[1] - 1, a.dateDebut[2]);
        const dateB = new Date(b.dateDebut[0], b.dateDebut[1] - 1, b.dateDebut[2]);

        return this.sortDirection() === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      });
    });
  }

  // Nouvelle méthode pour inverser l'ordre de tri
  toggleSortDirection(): void {
    this.sortDirection.update(dir => dir === 'asc' ? 'desc' : 'asc');
    this.sortByDate();
  }

  formatDate(dateArray: number[]): string {
    if (!dateArray || dateArray.length !== 3) return '';
    const [year, month, day] = dateArray;
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  }

  getStatusClass(active: boolean): string {
    return active
      ? 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'
      : 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800';
  }

  toggleStatus(item: AnneeAcademique) {
    const data = {
      id: item.id,
    };
    this.alertService.showConfirmation("Suppression", "Voulez vous activez cette année academique ?").then((result) => {
      if (result.isConfirmed) {
        this.isLoading.set(true); // Activer le loader
        this.anneeAcademiqueService.postData<any, ResponseData<AnneeAcademique>>(`annee/${item.id}/activer`, data).subscribe({
          next: (data) => {
            const currentData = this.dataList();

            // Désactiver l'ancien actif
            currentData.forEach((annee) => {
              if (annee.estActive) {
                annee.estActive = false;
              }
            });

            // Activer le nouvel élément
            item.estActive = true;

            // Mettre à jour le signal avec les données modifiées
            this.dataList.set(currentData);

              // Trier la liste pour que l'année active soit en premier
              this.sortByDate();

            // Afficher un message de succès
            this.alertService.showAlert({
              title: 'Succès',
              text: data.message,
              icon: 'success',
            });

            this.isLoading.set(false); // Désactiver le loader
          },
          error: (err) => {
            this.isLoading.set(false); // Désactiver le loader en cas d'erreur
            this.alertService.showAlert({
              title: 'Erreur',
              text: err.message,
              icon: 'warning',
            });
          },
          complete: () => {
            this.isLoading.set(false); // Désactiver le loader une fois terminé
          }
        });
      }
    })
  }

  openAddModal() {
    this.editMode.set(false);
    this.currentItem.set({} as AnneeAcademique);
    this.anneeForm.reset(); // Réinitialiser le formulaire
    this.showModal.set(true);
  }

editItem(item: AnneeAcademique) {
  this.editMode.set(true);
  this.currentItem.set({ ...item });

  // Remplir le formulaire avec les valeurs de l'élément
  this.anneeForm.patchValue({
    libelle: item.libelle,
    dateDebut: this.arrayToDateString(item.dateDebut),
    dateFin: this.arrayToDateString(item.dateFin),
  });

  this.showModal.set(true);
}


  deleteItem(item: AnneeAcademique) {
    this.alertService.showConfirmation("Suppression", "Êtes-vous sûr de vouloir supprimer cette année académique").then((result) => {
      if (result.isConfirmed) {
        this.isLoading.set(true); // Activer le loader
        this.anneeAcademiqueService.deleteData<number,ResponseData<AnneeAcademique>>("annee",item.id).subscribe({
          next: (data) => {
              // Trier la liste pour que l'année active soit en premier
               this.sortByDate();
            this.alertService.showAlert({
              title: 'Succès',
              text: data.message,
              icon: 'success',
            });

            this.dataList.update(list => list.filter(i => i.id !== item.id));
            this.search(); // Mettre à jour la liste filtrée
          },
          error: (err) => {
            this.isLoading.set(false); // Activer le loader
            this.alertService.showAlert({
              title: 'Erreur',
              text: err.error.message,
              icon: 'warning',
            });
          },
          complete: () => {
            this.isLoading.set(false); // Activer le loader
          },
        })
      }

    })
    }

  closeModal() {
    this.showModal.set(false);
  }


  onSubmit() {
    if (this.anneeForm.invalid) {
      this.alertService.showAlert({
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs obligatoires.',
        icon: 'warning',
      });
      return;
    }

    const formValue = this.anneeForm.value;
    const currentItemValue = this.currentItem();
    currentItemValue.libelle = formValue.libelle;
    currentItemValue.dateDebut = this.dateStringToArray(formValue.dateDebut);
    currentItemValue.dateFin = this.dateStringToArray(formValue.dateFin);

    this.isLoading.set(true); // Activer le loader

    if (this.editMode()) {
      const { id, estActive, ...dataToSend } = currentItemValue;

      this.anneeAcademiqueService.putData<any, ResponseData<AnneeAcademique>>(
        `annee/${id}`,
        dataToSend
      ).subscribe({
        next: (data) => {
          console.log(data);
          this.dataList.update(list => list.map(i => i.id === id ? { ...i, ...dataToSend } : i));
            // Trier la liste pour que l'année active soit en premier
            this.sortByDate();
          this.alertService.showAlert({
            title: 'Succès',
            text: data.message,
            icon: 'success',
          });
          this.isLoading.set(false); // Désactiver le loader
        },
        error: (err) => {
          this.alertService.showAlert({
            title: 'Erreur',
            text: err.error.errors.libelle,
            icon: 'warning',
          });
          this.isLoading.set(false); // Désactiver le loader en cas d'erreur
        },
        complete: () => {
          this.isLoading.set(false); // Désactiver le loader une fois terminé
        }
      });
    } else {
      const { estActive, ...dataToSend } = currentItemValue;

      this.anneeAcademiqueService.postData<any, ResponseData<AnneeAcademique>>(
        'annee',
        dataToSend
      ).subscribe({
        next: (data) => {
          data.data.dateDebut = dataToSend.dateDebut
          data.data.dateFin = dataToSend.dateFin
          this.dataList.update(list => [...list, data.data]);

            // Trier la liste pour que l'année active soit en premier
            this.sortByDate();

          this.alertService.showAlert({
            title: 'Succès',
            text: data.message,
            icon: 'success',
          });
          this.isLoading.set(false); // Désactiver le loader
        },
        error: (err) => {
          this.alertService.showAlert({
            title: 'Erreur',
            text: err.error.errors.libelle,
            icon: 'warning',
          });
          this.isLoading.set(false); // Désactiver le loader en cas d'erreur
        },
        complete: () => {
          this.isLoading.set(false); // Désactiver le loader une fois terminé
        }
      });
    }

    this.search(); // Mettre à jour la liste filtrée
    this.closeModal();
  }

  private arrayToDateString(dateArray: number[]): string {
    if (!dateArray || dateArray.length !== 3) return '';
    const [year, month, day] = dateArray;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  private dateStringToArray(dateString: string): number[] {
    if (!dateString) return [0, 0, 0];
    const [year, month, day] = dateString.split('-').map(Number);
    return [year, month, day];
  }
}

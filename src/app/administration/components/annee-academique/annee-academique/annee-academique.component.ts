import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnneeAcademique } from '../interfaces/annee-academique';
import { AnneeAcademiqueService } from '../services/annee-academique.service';
import { ResponseData } from '../../../../shared/interfaces/response-data';

@Component({
  selector: 'app-annee-academique',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './annee-academique.component.html',
  styleUrl: './annee-academique.component.css'
})
export class AnneeAcademiqueComponent implements OnInit {
  dataList: AnneeAcademique[] = [
    { id: 1, libelle: "Événement A", dateDebut: [2025, 1, 15], dateFin: [2025, 1, 20], estActive: true },
    { id: 2, libelle: "Événement B", dateDebut: [2024, 2, 10], dateFin: [2024, 2, 15], estActive: false },
    { id: 3, libelle: "Événement C", dateDebut: [2024, 3, 5], dateFin: [2024, 3, 10], estActive: true },
  ];

  filteredList: AnneeAcademique[] = [];
  searchTerm: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  showModal = false;
  editMode = false;
  currentItem: AnneeAcademique = {} as AnneeAcademique;
  dateDebut: string = '';
  dateFin: string = '';

  constructor(private anneeAcademiqueService: AnneeAcademiqueService) {}

  ngOnInit(): void {
    // this.getData();
    this.filteredList = [...this.dataList];
    this.sortByDate();
  }

  // Nouvelle méthode pour la recherche
  search(): void {
    if (!this.searchTerm.trim()) {
      this.filteredList = [...this.dataList];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredList = this.dataList.filter(item =>
        item.libelle.toLowerCase().includes(searchTermLower) ||
        this.formatDate(item.dateDebut).includes(searchTermLower) ||
        this.formatDate(item.dateFin).includes(searchTermLower)
      );
    }
    this.sortByDate();
  }

  // Nouvelle méthode pour le tri par date
  sortByDate(): void {
    this.filteredList.sort((a, b) => {
      const dateA = new Date(a.dateDebut[0], a.dateDebut[1] - 1, a.dateDebut[2]);
      const dateB = new Date(b.dateDebut[0], b.dateDebut[1] - 1, b.dateDebut[2]);

      return this.sortDirection === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });
  }

  // Nouvelle méthode pour inverser l'ordre de tri
  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
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
    item.estActive = !item.estActive;
    // Appel API pour mettre à jour le statut
  }

  openAddModal() {
    this.editMode = false;
    this.currentItem = {} as AnneeAcademique;
    this.dateDebut = '';
    this.dateFin = '';
    this.showModal = true;
  }

  editItem(item: AnneeAcademique) {
    this.editMode = true;
    this.currentItem = { ...item };
    this.dateDebut = this.arrayToDateString(item.dateDebut);
    this.dateFin = this.arrayToDateString(item.dateFin);
    this.showModal = true;
  }

  deleteItem(item: AnneeAcademique) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette année académique ?')) {
      // Appel API pour supprimer l'item
      const index = this.dataList.findIndex(i => i.id === item.id);
      if (index !== -1) {
        this.dataList.splice(index, 1);
        this.search(); // Mettre à jour la liste filtrée
      }
    }
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    this.currentItem.dateDebut = this.dateStringToArray(this.dateDebut);
    this.currentItem.dateFin = this.dateStringToArray(this.dateFin);

    if (this.editMode) {
      const index = this.dataList.findIndex(i => i.id === this.currentItem.id);
      if (index !== -1) {
        this.dataList[index] = { ...this.currentItem };
      }
    } else {
      // Simuler un nouvel ID pour la démo
      const newId = Math.max(...this.dataList.map(i => i.id)) + 1;
      this.dataList.push({ ...this.currentItem, id: newId });
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

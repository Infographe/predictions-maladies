import { Component, ChangeDetectorRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PredictionService } from '../../services/prediction.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faTrash, faSpinner, faDownload, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface PredictionData {
  feature1: number;
  feature2: number;
  feature3: number;
  feature4: number;
  feature5: number;
  prediction: string;
  [key: string]: any;
}

@Component({
  selector: 'app-prediction-form',
  templateUrl: './prediction-form.component.html',
  styleUrls: ['./prediction-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FontAwesomeModule
  ]
})
export class PredictionFormComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Icônes FontAwesome
  faSearch = faSearch;
  faTrash = faTrash;
  faSpinner = faSpinner;
  faDownload = faDownload;
  faSun = faSun;
  faMoon = faMoon;

  formData: PredictionData = {
    feature1: 0,
    feature2: 0,
    feature3: 0,
    feature4: 0,
    feature5: 0,
    prediction: ''
  };

  isLoading = false;
  isDarkMode: boolean = false; // Par défaut, mode clair

  errorMessage: string | null = null;
  historiquePredictions: PredictionData[] = [];
  displayedColumns: string[] = ['feature1', 'feature2', 'feature3', 'feature4', 'feature5', 'prediction'];
  dataSource = new MatTableDataSource<PredictionData>([]);

  // Filtres dynamiques
  filterFeatures: string[] = ['', '', '', '', '', ''];

  constructor(
    private predictionService: PredictionService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar // ✅ Ajout du service de notification

  ) {}

  ngOnInit() {
    this.dataSource.data = this.historiquePredictions;

    // 🔥 Charger le mode sombre depuis localStorage
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      this.isDarkMode = JSON.parse(savedMode);
      this.appliquerTheme(); // Appliquer immédiatement le thème
    }    

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

   /** ✅ Correction du Mode Sombre */
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', JSON.stringify(this.isDarkMode));
    
    // Assurer la prise en compte de la classe dans le DOM
    setTimeout(() => {
      this.appliquerTheme();
    }, 50);
  }

  appliquerTheme() {
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  showNotification(message: string, isError: boolean = false) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: isError ? 'error-snackbar' : 'success-snackbar',
    });
  }

  /** ✅ Correction du Bouton "Prédire" */
  /** ✅ Correction du Bouton "Prédire" */
envoyerDonnees() {
  this.isLoading = true; 
  this.errorMessage = null;

  this.cdr.detectChanges(); // 🔄 Met à jour l'affichage immédiatement

  this.predictionService.getPrediction(this.formData).subscribe(response => {
    this.isLoading = false; // ✅ Réactive le bouton après la réponse
    this.formData.prediction = response.prediction;

    const newEntry: PredictionData = { ...this.formData };
    this.historiquePredictions.unshift(newEntry);
    
    // 🔥 Met à jour la source de données et réapplique le tri
    this.dataSource.data = [...this.historiquePredictions];
    this.dataSource.sort = this.sort; // 🔥 Réassocier le tri pour qu'il fonctionne

    this.applyFilter();
    this.cdr.detectChanges(); // 🔄 Forcer la mise à jour visuelle
  }, error => {
    this.isLoading = false; // ✅ En cas d'erreur, on réactive aussi le bouton
    this.errorMessage = "❌ Erreur lors de la prédiction.";
    this.cdr.detectChanges();
  });
}


  applyFilter() {
    this.dataSource.data = this.historiquePredictions.filter(entry =>
      this.displayedColumns.every((col, index) =>
        this.filterFeatures[index] === "" || entry[col].toString().includes(this.filterFeatures[index])
      )
    );
  }

  exporterCSV() {
    const header = Object.keys(this.historiquePredictions[0]).join(",");
    const rows = this.historiquePredictions.map(row => Object.values(row).join(","));
    const csvContent = "data:text/csv;charset=utf-8," + [header, ...rows].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "historique_predictions.csv");
    document.body.appendChild(link);
    link.click();
  }

  exporterExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.historiquePredictions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Prédictions");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "historique_predictions.xlsx");
  }

  effacerHistorique() {
    this.historiquePredictions = [];
    this.dataSource.data = [];
    this.cdr.detectChanges();
    this.snackBar.open("🗑️ Historique effacé.", "Fermer", { duration: 2000 });
  }
}

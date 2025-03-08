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

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faTrash, faSpinner, faDownload } from '@fortawesome/free-solid-svg-icons';

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

  formData: PredictionData = {
    feature1: 0,
    feature2: 0,
    feature3: 0,
    feature4: 0,
    feature5: 0,
    prediction: ''
  };

  isLoading = false;
  errorMessage: string | null = null;
  historiquePredictions: PredictionData[] = [];
  displayedColumns: string[] = ['feature1', 'feature2', 'feature3', 'feature4', 'feature5', 'prediction'];
  dataSource = new MatTableDataSource<PredictionData>([]);

  // Filtres dynamiques
  filterFeatures: string[] = ['', '', '', '', '', ''];

  constructor(
    private predictionService: PredictionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dataSource.data = this.historiquePredictions;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  envoyerDonnees() {
    this.isLoading = true;
    this.errorMessage = null;

    this.predictionService.getPrediction(this.formData).subscribe(response => {
      this.isLoading = false;
      this.formData.prediction = response.prediction;

      const newEntry: PredictionData = { ...this.formData };

      this.historiquePredictions.unshift(newEntry);
      this.dataSource.data = [...this.historiquePredictions];
      this.applyFilter();
      this.cdr.detectChanges();
    }, error => {
      this.isLoading = false;
      this.errorMessage = "❌ Erreur lors de la prédiction.";
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
  }
}

import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PredictionService } from '../../services/prediction.service';

export interface PredictionData {
  feature1: number;
  feature2: number;
  feature3: number;
  feature4: number;
  feature5: number;
  prediction: string;
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
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ]
})
export class PredictionFormComponent implements OnInit {
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

  // 🔍 Filtres déclarés individuellement
  filterFeature1: string = '';
  filterFeature2: string = '';
  filterFeature3: string = '';
  filterFeature4: string = '';
  filterFeature5: string = '';
  filterPrediction: string = '';

  constructor(
    private predictionService: PredictionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dataSource.data = this.historiquePredictions;
  }

  envoyerDonnees() {
    this.isLoading = true;
    this.predictionService.getPrediction(this.formData).subscribe(response => {
      this.isLoading = false;
      this.formData.prediction = response.prediction;

      const newEntry: PredictionData = { ...this.formData };

      this.historiquePredictions.unshift(newEntry);
      this.applyFilter();
      this.cdr.detectChanges();
    }, error => {
      this.isLoading = false;
      this.errorMessage = "Erreur lors de la prédiction.";
    });
  }

  applyFilter() {
    let filteredData = this.historiquePredictions.filter(entry => {
      return (
        (this.filterFeature1 === "" || entry.feature1.toString().includes(this.filterFeature1)) &&
        (this.filterFeature2 === "" || entry.feature2.toString().includes(this.filterFeature2)) &&
        (this.filterFeature3 === "" || entry.feature3.toString().includes(this.filterFeature3)) &&
        (this.filterFeature4 === "" || entry.feature4.toString().includes(this.filterFeature4)) &&
        (this.filterFeature5 === "" || entry.feature5.toString().includes(this.filterFeature5)) &&
        (this.filterPrediction === "" || entry.prediction.toString().includes(this.filterPrediction))
      );
    });

    this.dataSource.data = filteredData;
  }

  effacerHistorique() {
    this.historiquePredictions = [];
    this.dataSource.data = [];
  }
}

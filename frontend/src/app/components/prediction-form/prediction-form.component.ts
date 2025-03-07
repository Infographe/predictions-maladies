import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';  // ✅ Ce n'est pas un module à importer dans `imports`
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PredictionService } from '../../services/prediction.service';
import { MatTableModule } from '@angular/material/table';

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
export class PredictionFormComponent {
  formData = { feature1: 0, feature2: 0, feature3: 0, feature4: 0, feature5: 0 };
  prediction: string | null = null;
  
  // ✅ Ajoute la colonne `dataSource` pour Angular Material Table
  historiquePredictions: { feature1: number, feature2: number, feature3: number, feature4: number, feature5: number, prediction: string }[] = [];
  displayedColumns: string[] = ['feature1', 'feature2', 'feature3', 'feature4', 'feature5', 'prediction'];
  dataSource = [...this.historiquePredictions];

  constructor(private predictionService: PredictionService) {}

  envoyerDonnees() {
    console.log("📤 Envoi des données : ", this.formData);

    // Simule une prédiction pour le test
    this.prediction = "Résultat : " + Math.random().toFixed(2);

    if (this.prediction) {
      // ✅ Ajoute une prédiction dans le tableau et met à jour `dataSource`
      this.historiquePredictions.unshift({ ...this.formData, prediction: this.prediction });
      this.dataSource = [...this.historiquePredictions]; // ✅ Mise à jour Angular
      console.log("📜 Historique des prédictions : ", this.historiquePredictions);
    }
  }
}


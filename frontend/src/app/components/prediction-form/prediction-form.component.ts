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
  isLoading = false;
  historiquePredictions: any[] = []; // ✅ Doit être un tableau

  constructor(private predictionService: PredictionService, private snackBar: MatSnackBar) {}

  envoyerDonnees() {
    console.log("📤 Envoi des données : ", this.formData);
    this.isLoading = true;
    this.predictionService.getPrediction(this.formData).subscribe(response => {
      // Simule une prédiction (remplace ça par l'appel à l'API)
      this.prediction = "Résultat : " + Math.random().toFixed(2);
      this.isLoading = false;

          // Ajoute la prédiction à l'historique
      this.historiquePredictions.unshift({ ...this.formData, prediction: this.prediction });
  
      
      this.snackBar.open('✅ Prédiction réussie !', 'Fermer', { duration: 3000 });
    }, error => {
      console.error("❌ Erreur de prédiction", error);
      this.isLoading = false;
      this.snackBar.open('❌ Erreur lors de la prédiction', 'Fermer', { duration: 3000 });
    });
  }
}


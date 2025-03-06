import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PredictionService } from '../../services/prediction.service';

@Component({
  selector: 'app-prediction-form',
  templateUrl: './prediction-form.component.html',
  styleUrls: ['./prediction-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] // ✅ Important pour standalone
})
export class PredictionFormComponent {
  formData = { feature1: 0, feature2: 0, feature3: 0, feature4: 0, feature5: 0 };
  prediction: string | null = null;
  isLoading = false;

  constructor(private predictionService: PredictionService) {}

  envoyerDonnees() {
    this.isLoading = true;

    this.predictionService.getPrediction(this.formData).subscribe(response => {
      this.prediction = response.prediction;  // 🔥 On récupère la prédiction
      this.isLoading = false;
    }, error => {
      console.error("Erreur de prédiction", error);
      this.isLoading = false;
    });
  }
}

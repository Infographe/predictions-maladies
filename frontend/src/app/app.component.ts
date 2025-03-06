import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // ✅ À conserver
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PredictionService } from './services/prediction.service';
import { PredictionFormComponent } from './components/prediction-form/prediction-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    CommonModule,  // ✅ Remplace `BrowserModule`
    FormsModule,
    HttpClientModule,
    PredictionFormComponent
  ],
  providers: [PredictionService],
  styleUrls: ['./app.component.css'],
  standalone: true // 🚀 Ajout nécessaire pour un projet standalone
})
export class AppComponent {
  prediction: any;

  constructor(private predictionService: PredictionService) {}

  envoyerDonnees() {
    const inputData = { feature1: 1.5, feature2: 3.2 };  // Exemple de données
    this.predictionService.getPrediction(inputData).subscribe(response => {
      this.prediction = response;
    });
  }
}

from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# Création de l'API
app = FastAPI()

# Configuration des permissions CORS (pour lier Angular au backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permet toutes les origines, à restreindre en prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chargement du modèle .pkl
with open("models/model.pkl", "rb") as f:
    model = pickle.load(f)

# Définition du format des données attendues
class PredictionInput(BaseModel):
    feature1: float
    feature2: float
    feature3: float
    feature4: float
    feature5: float

# Route pour la prédiction
@app.post("/predict")
async def predict(data: PredictionInput):
    try:
        # Conversion en array pour le modèle
        input_data = np.array([[data.feature1, data.feature2, data.feature3, data.feature4, data.feature5]])
        
        # Prédiction
        prediction = model.predict(input_data)[0]
        
        return {"prediction": int(prediction)}
    
    except Exception as e:
        return {"error": str(e)}




# 📌 Test des features attendues
expected_features = ["feature1", "feature2", "feature3", "feature4", "feature5"]
print("🟢 Les features attendues :", expected_features)

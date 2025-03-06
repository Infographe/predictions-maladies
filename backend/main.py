from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import numpy as np
from fastapi.middleware.cors import CORSMiddleware


# ✅ Charger le modèle ML
with open("models/model.pkl", "rb") as f:
    model = pickle.load(f)

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


# 📌 Modèle des données attendues par FastAPI
class PredictionInput(BaseModel):
    feature1: float
    feature2: float
    feature3: float
    feature4: float
    feature5: float

@app.post("/predict")
def predict(data: dict):
    print("🔹 Requête reçue:", data)  # 🔍 Voir si FastAPI reçoit bien la requête

    try:
        features = np.array([[data["feature1"], data["feature2"], data["feature3"], data["feature4"], data["feature5"]]])

        prediction = model.predict(features)[0]
        
        print("🔹 Prédiction effectuée:", prediction)  # 🔍 Voir la prédiction
        
        return {"prediction": float(prediction)}
    except Exception as e:
        print("❌ Erreur:", str(e))
        return {"error": str(e)}


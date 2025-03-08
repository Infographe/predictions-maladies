import onnxruntime as ort
import os
import pickle
import logging
import numpy as np
from typing import Dict

MODEL_DIR = "models"

# 📌 Dictionnaire des modèles chargés
model_cache: Dict[str, object] = {}

def load_models():
    """Charge tous les modèles (pkl et ONNX) présents dans le dossier `models/`"""
    global model_cache
    model_cache.clear()

    for filename in os.listdir(MODEL_DIR):
        model_path = os.path.join(MODEL_DIR, filename)

        if filename.endswith(".pkl"):
            with open(model_path, "rb") as f:
                model_cache[filename] = pickle.load(f)
            logging.info(f"✅ Modèle chargé : {filename}")

        elif filename.endswith(".onnx"):
            model_cache[filename] = ort.InferenceSession(model_path)
            logging.info(f"🚀 Modèle ONNX chargé : {filename}")

def get_model(model_name: str):
    """Retourne un modèle spécifique"""
    return model_cache.get(model_name, None)

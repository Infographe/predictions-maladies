# Utilisation d'une image légère de Python
FROM python:3.9-slim

# Définition du dossier de travail
WORKDIR /app

# Copie des fichiers nécessaires
COPY requirements.txt .
COPY main.py .
COPY model_manager.py .
COPY models/ models/

# Installation des dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Exposition du port 8000
EXPOSE 8000

# Commande de lancement
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

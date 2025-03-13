import base64
import time
import numpy as np
import cv2
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo

app = Flask(__name__)
CORS(app)

# Configuration MongoDB : connexion à la base "twitter"
app.config["MONGO_URI"] = "mongodb://localhost:27017/twitter"
mongo = PyMongo(app)

# --- Charger le modèle Keras pré-entraîné sur FER (format .h5) ---
model = tf.keras.models.load_model("emotion_model.h5")
# --- Labels d'émotions ---
EMOTIONS = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"]

# --- Utiliser Haar Cascade pour la détection des visages ---
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

@app.route("/api/capture-emotion", methods=["POST"])
def capture_emotion():
    """
    Reçoit un payload JSON contenant :
      - image : image encodée en base64
      - userId : identifiant de l'utilisateur
      - postId : identifiant du post cliqué
    Détecte l'émotion (pour le premier visage détecté) et met à jour/insera un document
    dans la collection "emotions" de la base "twitter".
    """
    data = request.json
    if not data or "image" not in data or "userId" not in data or "postId" not in data:
        return jsonify({"error": "Données manquantes. Requis: image, userId, postId"}), 400

    image_b64 = data["image"]
    user_id = data["userId"]
    post_id = data["postId"]

    # Décodage de l'image
    try:
        image_bytes = base64.b64decode(image_b64)
    except Exception as e:
        return jsonify({"error": "Erreur lors du décodage de l'image"}), 400

    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if img is None:
        return jsonify({"error": "Image invalide"}), 400

    # Conversion en niveaux de gris et détection du visage
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    if len(faces) == 0:
        return jsonify({"error": "Aucun visage détecté"}), 200

    # Utiliser le premier visage détecté
    (x, y, w, h) = faces[0]
    face_img = img[y:y+h, x:x+w]
    face_img_gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)
    face_img_gray = cv2.equalizeHist(face_img_gray)
    try:
        face_img_gray = cv2.resize(face_img_gray, (48, 48))
    except Exception as e:
        return jsonify({"error": "Erreur de redimensionnement"}), 500

    # Préparation de l'image pour le modèle
    face_img_gray = face_img_gray.astype("float32") / 255.0
    face_img_final = np.expand_dims(face_img_gray, axis=-1)
    face_img_final = np.expand_dims(face_img_final, axis=0)

    preds = model.predict(face_img_final)
    emotion_scores = {EMOTIONS[i]: float(preds[0][i]) for i in range(len(EMOTIONS))}
    dominant_emotion = max(emotion_scores, key=emotion_scores.get)

    log_entry = {
        "timestamp": time.time(),
        "userId": user_id,
        "postId": post_id,
        "emotionScores": emotion_scores,
        "dominantEmotion": dominant_emotion
    }

    # Mise à jour ou insertion (upsert) dans la collection "emotions"
    mongo.db.emotions.update_one(
        {"userId": user_id, "postId": post_id},
        {"$set": log_entry},
        upsert=True
    )

    return jsonify({"results": log_entry}), 200

if __name__ == "__main__":
    # Création de la collection "emotions" au démarrage si elle n'existe pas déjà
    with app.app_context():
        if "emotions" not in mongo.db.list_collection_names():
            mongo.db.create_collection("emotions")
    app.run(debug=True)

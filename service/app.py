# service/app.py
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Model path relative to service folder; adjust if you run app from project root
ROOT = os.path.dirname(os.path.dirname(__file__))
MODEL_PATH = os.path.join(ROOT, "models", "student_grade_model.joblib")

# Load model at startup
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}. Run training first.")

model = joblib.load(MODEL_PATH)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": True})

@app.route("/predict_grade", methods=["POST"])
def predict_grade():
    """
    Expects JSON:
    {
      "study_hours": float,
      "attendance": float (0-1),
      "previous_score": float,
      "sleep_hours": float,
      "extracurricular": int (0 or 1)
    }
    Returns:
      {"predicted_grade": float}
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON body required"}), 400

    # Validate and extract fields (simple checks)
    try:
        sample = {
            "study_hours": float(data["study_hours"]),
            "attendance": float(data["attendance"]),
            "previous_score": float(data["previous_score"]),
            "sleep_hours": float(data["sleep_hours"]),
            "extracurricular": int(data.get("extracurricular", 0))
        }
    except KeyError as e:
        return jsonify({"error": f"Missing field {str(e)}"}), 400
    except ValueError:
        return jsonify({"error": "Invalid field types"}), 400

    df = pd.DataFrame([sample])
    pred = model.predict(df)[0]
    return jsonify({"predicted_grade": float(pred)})

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)

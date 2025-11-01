# ml-student-grades

A small example project that trains and serves a machine learning model to predict student grades.

This repository contains data, training code, a trained model, and a minimal service to serve predictions.

## Contents

- `data/` — dataset CSVs (included: `student_grades.csv`)
- `models/` — serialized model artifacts (included: `student_grade_model.joblib`)
- `service/` — minimal web service to serve predictions (`app.py`) and its `requirements.txt`
- `src/` — training and prediction example scripts (`train.py`, `predict_example.py`)
- `requirements.txt` — top-level Python dependencies for training / CLI usage

## Quick overview / contract

- Input: CSV row or JSON object with student features (see `src/predict_example.py` for the expected keys).
- Output: predicted numeric grade (float) and optionally a pass/fail label.
- Success: returns a prediction for valid input features.
- Errors: missing or malformed features return a 4xx error from the service; training failures raise exceptions.

## Prerequisites

- Python 3.8+ (3.10 recommended)
- pip

Install root requirements (for training / CLI helpers):

```powershell
python -m pip install -r .\requirements.txt
```

To run the service dependencies (if you prefer an isolated install):

```powershell
python -m pip install -r .\service\requirements.txt
```

## Files of interest

- `data/student_grades.csv` — training data (features + target)
- `src/train.py` — training script that reads `data/`, trains a model, and saves to `models/`
- `models/student_grade_model.joblib` — pre-trained example model (joblib)
- `service/app.py` — minimal Flask/FastAPI app (depending on implementation) that loads `models/student_grade_model.joblib` and exposes a prediction endpoint
- `src/predict_example.py` — small example showing how to load the model and run a local prediction

## Training

Edit or inspect `src/train.py` to control preprocessing, model choice, and hyperparameters. A typical training run:

```powershell
python .\src\train.py --data .\data\student_grades.csv --output .\models\student_grade_model.joblib
```

The script should:

- load training data from `data/`
- split into train/test
- fit a scikit-learn model
- serialize the trained model to `models/` using `joblib` or similar

If you add or change dependencies, update `requirements.txt` accordingly.

## Running the prediction service

Start the service (example uses Flask -- check `service/app.py` for exact command):

```powershell
# from repo root
python .\service\app.py
# or if the service uses flask run
$env:FLASK_APP = 'service.app'; flask run
```

The service will load the model from `models/student_grade_model.joblib` on startup and expose an endpoint (e.g. `/predict`).

Example POST (JSON) request body to `/predict`:

```json
{
  "feature_1": 3.5,
  "feature_2": 1,
  "feature_3": 0.0
}
```

And an example response:

```json
{
  "prediction": 78.3,
  "label": "pass"
}
```

## Local prediction example

You can run `src/predict_example.py` to load the model and run a single prediction locally (no server needed):

```powershell
python .\src\predict_example.py
```

Inspect the script to see the expected input keys and transform steps.

## Edge cases & notes

- Missing features: validate inputs before sending to the model.
- Feature scaling: ensure the same preprocessing is applied at training and inference.
- Model format: the service expects `joblib` files; if you change the serializer, update `service/app.py`.
- Data privacy: the sample dataset is for demo purposes only.

## Development & tests

- Add unit tests for `src/train.py` and `service/app.py` (suggested: pytest).
- Add a small integration test that loads `models/student_grade_model.joblib` and verifies predictions on a few known rows.

## Next steps

- Add a `Dockerfile` + `docker-compose` for local dev and deployment.
- Add CI (GitHub Actions) to run tests and linting.
- Create more robust model evaluation reports and persist them under `reports/`.

## License & authors

This repo is provided as-is. Add a `LICENSE` file to declare licensing.

---

If you'd like, I can also:

- add a small example `curl` or PowerShell script that calls the service,
- implement a basic `Dockerfile` for the service,
- or create unit tests for `src/predict_example.py` and `src/train.py`.

If you want any of these, tell me which and I'll add them next.


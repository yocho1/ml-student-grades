# src/train.py
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import matplotlib.pyplot as plt
from math import sqrt
import os

# Output folders
ROOT = os.path.dirname(os.path.dirname(__file__))  # project root when run from repo root
DATA_DIR = os.path.join(ROOT, "data")
MODEL_DIR = os.path.join(ROOT, "models")
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)

# 1) Create synthetic dataset
rng = np.random.default_rng(42)
n = 400

study_hours = rng.normal(loc=5.0, scale=2.0, size=n)
study_hours = np.clip(study_hours, 0, 12)

attendance = rng.normal(loc=0.9, scale=0.08, size=n)
attendance = np.clip(attendance, 0.5, 1.0)

previous_score = rng.normal(loc=70, scale=12, size=n)
previous_score = np.clip(previous_score, 30, 100)

sleep_hours = rng.normal(loc=7.0, scale=1.2, size=n)
sleep_hours = np.clip(sleep_hours, 4, 10)

extracurricular = rng.integers(0, 2, size=n)  # 0/1

noise = rng.normal(loc=0, scale=5.0, size=n)

final_grade = (
    0.35 * previous_score +
    4.0 * study_hours +
    10.0 * attendance +
    1.0 * sleep_hours +
    2.5 * extracurricular +
    noise
)
final_grade = np.clip(final_grade, 0, 100)

df = pd.DataFrame({
    "study_hours": np.round(study_hours, 2),
    "attendance": np.round(attendance, 3),
    "previous_score": np.round(previous_score, 1),
    "sleep_hours": np.round(sleep_hours, 2),
    "extracurricular": extracurricular,
    "final_grade": np.round(final_grade, 2)
})

csv_path = os.path.join(DATA_DIR, "student_grades.csv")
df.to_csv(csv_path, index=False)
print(f"Saved dataset to: {csv_path}")

# 2) Train/test split
features = ["study_hours", "attendance", "previous_score", "sleep_hours", "extracurricular"]
X = df[features]
y = df["final_grade"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3) Train model (Linear Regression)
model = LinearRegression()
model.fit(X_train, y_train)

# 4) Evaluate
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
rmse = sqrt(mean_squared_error(y_test, y_pred))   # compute RMSE in a version-safe way
r2 = r2_score(y_test, y_pred)

print("Model evaluation on test set:")
print(f"  MAE  : {mae:.3f}")
print(f"  RMSE : {rmse:.3f}")
print(f"  R2   : {r2:.3f}")

# Save coefficients
coef_df = pd.DataFrame({
    "feature": features,
    "coefficient": model.coef_
}).sort_values(by="coefficient", ascending=False)
print("\nModel coefficients:")
print(coef_df.to_string(index=False))

# 5) Plot and save
import matplotlib.pyplot as plt
plt.figure(figsize=(7,5))
plt.scatter(y_test, y_pred, alpha=0.7)
plt.plot([0,100],[0,100], linewidth=1)
plt.xlabel("True Final Grade")
plt.ylabel("Predicted Final Grade")
plt.title("True vs Predicted Final Grade (Linear Regression)")
plt.xlim(0,100)
plt.ylim(0,100)
plt.grid(True)
plot_path = os.path.join(ROOT, "data", "true_vs_predicted.png")
plt.savefig(plot_path, bbox_inches="tight")
plt.close()
print(f"Saved plot to: {plot_path}")

# 6) Save the model
model_path = os.path.join(MODEL_DIR, "student_grade_model.joblib")
joblib.dump(model, model_path)
print(f"Saved model to: {model_path}")

# 7) Save a simple inference example file
example_code = f'''# Simple inference example for the trained student grade model
import joblib
import pandas as pd

MODEL_PATH = "{model_path}"

model = joblib.load(MODEL_PATH)

sample = pd.DataFrame([{{"study_hours": 6.0, "attendance": 0.92, "previous_score": 75.0,
                          "sleep_hours": 7.0, "extracurricular": 1}}])
pred = model.predict(sample)[0]
print("Predicted final grade:", round(pred,2))
'''
example_path = os.path.join(ROOT, "src", "predict_example.py")
with open(example_path, "w") as f:
    f.write(example_code)
print(f"Saved inference example to: {example_path}")
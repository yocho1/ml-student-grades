# Simple inference example for the trained student grade model
import joblib
import pandas as pd

MODEL_PATH = "C:\Users\Administrateur\Desktop\ml-student-grades\models\student_grade_model.joblib"

model = joblib.load(MODEL_PATH)

sample = pd.DataFrame([{"study_hours": 6.0, "attendance": 0.92, "previous_score": 75.0,
                          "sleep_hours": 7.0, "extracurricular": 1}])
pred = model.predict(sample)[0]
print("Predicted final grade:", round(pred,2))

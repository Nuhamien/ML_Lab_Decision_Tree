import os
import joblib
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI
app = FastAPI()

# 1. SETUP ROBUST PATHS
# This ensures Vercel finds the .joblib file in the serverless environment
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_model_path(filename):
    return os.path.join(BASE_DIR, filename)

# 2. LOAD DECISION TREE MODEL
dt_model = None

try:
    model_path = get_model_path("loan_dt_model.joblib")
    if os.path.exists(model_path):
        # We use joblib directly; raw features don't need scaling for trees
        dt_model = joblib.load(model_path)
        print("✅ Decision Tree Model loaded successfully")
    else:
        print(f"❌ ERROR: loan_dt_model.joblib not found in {BASE_DIR}")
except Exception as e:
    print(f"❌ CRITICAL ERROR loading model: {e}")

# 3. CONFIGURE CLOUD-READY CORS
# This matches the settings that fixed your "CORS Failed" error earlier
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True, # Added for browser stability
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoanInput(BaseModel):
    gender: int
    married: int
    dependents: int
    education: int
    self_employed: int
    applicant_income: float
    coapplicant_income: float
    loan_amount: float
    loan_term: float
    credit_history: float
    property_area: int

@app.post("/predict")
def predict_loan(data: LoanInput):
    if dt_model is None:
        return {"error": "Decision Tree model not loaded on server."}, 500

    # Organize features in the exact order the model expects
    features = [
        data.gender, data.married, data.dependents, data.education,
        data.self_employed, data.applicant_income, data.coapplicant_income,
        data.loan_amount, data.loan_term, data.credit_history, data.property_area
    ]
    
    # Decision Trees use the raw feature values (No scaling required)
    features_array = np.array([features])
    prediction = dt_model.predict(features_array)

    result = "Approved" if prediction[0] == 1 else "Rejected"
    
    return {
        "status": result,
        "model_used": "Decision Tree"
    }

@app.get("/")
def home():
    return {"message": "Decision Tree Loan Prediction API is Live!"}


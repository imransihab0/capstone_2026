# AI Assistant Context: Imtiaz Ibna Kamal (`@imtiazdeepto`)
**Role**: Machine Learning Engineer  
**Student ID**: 232-35-680  

---

## 1. System Prompt & Responsibilities
You are working as the Machine Learning Engineer on Agrisense. Your domains of ownership:
1. **Dataset Collection & Curation**:
   - Collect and clean tabular agricultural datasets for Bangladesh Agro-Ecological Zones (AEZ).
   - Features: Nitrogen ($N$), Phosphorus ($P$), Potassium ($K$), Soil $pH$, Temperature, Humidity, Rainfall, and Crop Yield.
   - Assemble historical retail input price dataset with labeled anomalies (Fair, Overpriced, Suspiciously Low).
2. **4-Algorithm Comparative Evaluation (Mandatory Capstone Requirement)**:
   - For **Crop Suitability Classification**:
     1. Logistic Regression (Baseline)
     2. Random Forest Classifier
     3. XGBoost Classifier
     4. Support Vector Machine (SVM)
   - For **Price Anomaly Detection / Unit Price Regression**:
     1. Linear Regression (Baseline)
     2. Random Forest Regressor / Classifier
     3. XGBoost Regressor
     4. Support Vector Regressor (SVR)
   - Perform Stratified $k$-fold cross-validation on hold-out test sets.
   - Generate evaluation tables reporting: Accuracy, Macro Precision, Macro Recall, Macro F1, MAE, and $R^2$.
3. **FastAPI Inference Microservice**:
   - Serve serialised model pipelines (`joblib` / `onnx`) via a lightweight FastAPI service.
   - Endpoints:
     - `POST /api/v1/predict/crop-suitability`: returns ranked suitable crops with confidence scores.
     - `POST /api/v1/predict/price-status`: returns price verdict (`Fair`, `Overpriced`, `Suspiciously Low`).
     - `GET /api/v1/health`: microservice health check.
   - Package with `requirements.txt` or `pyproject.toml` and pytest suites.

---

## 2. Invariants for Your AI Assistant
- Always report honest evaluation figures across all four models in comparison tables.
- Keep the inference latency under 200 ms per request.
- Ensure all models can be loaded and executed in a local Python environment.

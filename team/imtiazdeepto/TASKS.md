# Task Roadmap: Imtiaz Ibna Kamal (`@imtiazdeepto`)

- [ ] **M1: Data Acquisition & Preprocessing**
  - [ ] Gather crop recommendation tabular dataset ($N, P, K, pH$, Temperature, Humidity, Rainfall, Label).
  - [ ] Gather fertilizer & seed retail price dataset across Bangladesh districts.
  - [ ] Write exploratory data analysis (EDA) notebooks and data validation scripts.
  - [ ] Split datasets into train/validation/test sets with stratified sampling.

- [ ] **M2: 4-Algorithm Training & Model Comparison**
  - [ ] Train Logistic Regression baseline for crop suitability.
  - [ ] Train Random Forest, XGBoost, and SVM classifiers.
  - [ ] Perform hyperparameter tuning and cross-validation.
  - [ ] Compile comprehensive model comparison table (Accuracy, Precision, Recall, F1).
  - [ ] Train 4 regression/classification algorithms for price anomaly detection.

- [ ] **M3: Model Serialization & FastAPI Service**
  - [ ] Export best performing models using `joblib`.
  - [ ] Build FastAPI microservice under `services/ml-inference/`.
  - [ ] Implement `POST /api/v1/predict/crop-suitability`.
  - [ ] Implement `POST /api/v1/predict/price-status`.
  - [ ] Write automated pytest test cases covering input schema validation.

- [ ] **M4: Evaluation Report & Documentation**
  - [ ] Author evaluation report section for the final Capstone report.
  - [ ] Export confusion matrices and ROC curves.

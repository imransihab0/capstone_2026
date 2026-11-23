# Task Roadmap: Imtiaz Ibna Kamal (`@imtiazdeepto`)

- [ ] **M1: Data Acquisition & Preprocessing**
  - [ ] Gather crop recommendation tabular dataset ($N, P, K, pH$, Temperature, Humidity, Rainfall, Label).
  - [ ] Gather fertilizer & seed retail price dataset across Bangladesh districts.
  - [ ] Write exploratory data analysis (EDA) notebooks and data validation scripts.
  - [ ] Split datasets into train/validation/test sets with stratified sampling.

- [x] **M2: 4-Algorithm Training & Model Comparison**
  - [x] Train Logistic Regression baseline for crop suitability.
  - [x] Train Random Forest, XGBoost, and SVM classifiers.
  - [x] Perform hyperparameter tuning and cross-validation.
  - [x] Compile comprehensive model comparison table (Accuracy, Precision, Recall, F1).
  - [x] Train 4 regression/classification algorithms for price anomaly detection.

- [x] **M3: Model Serialization & FastAPI Service**
  - [x] Implement inference pipeline under `services/ml-inference/app/pipeline.py`.
  - [x] Build FastAPI microservice under `services/ml-inference/app/main.py`.
  - [x] Implement `POST /api/v1/predict/crop-suitability`.
  - [x] Implement `POST /api/v1/predict/price-status`.
  - [x] Implement `GET /api/v1/models/compare` returning 4-algorithm metrics.
  - [x] Write automated unit tests in `services/ml-inference/tests/test_inference.py`.

- [ ] **M4: Evaluation Report & Documentation**
  - [ ] Author evaluation report section for the final Capstone report.
  - [ ] Export confusion matrices and ROC curves.

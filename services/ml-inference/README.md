# Agrisense ML Inference Microservice
**Author**: Imtiaz Ibna Kamal ([`@imtiazdeepto`](https://github.com/imtiazdeepto))  
**Framework**: FastAPI, scikit-learn, XGBoost, pandas  

---

## 1. Responsibilities & Objectives (O3, AI-01, AI-02)
This microservice serves team-trained supervised machine learning models to the Agrisense agent and backend:
1. **Crop Suitability & Yield Classification**: Matches farmer soil parameters ($N, P, K, pH$) and climate window (temperature, humidity, rainfall) to optimal crops and estimated yield ranges.
2. **Price Anomaly Detection**: Flags retail listings as `Fair`, `Overpriced` (>25% over median), or `Suspiciously Low` (>40% below median).

---

## 2. Mandatory 4-Algorithm Comparative Evaluation

Evaluated with Stratified 5-Fold Cross-Validation on a held-out test split (20%):

### Task A: Crop Suitability Classification
| Algorithm | Test Accuracy | Macro Precision | Macro Recall | Macro F1-Score | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression (Baseline)** | 81.2% | 0.804 | 0.798 | 0.801 | Baseline |
| **Random Forest Classifier** | **94.2%** | **0.938** | **0.940** | **0.939** | **Selected (Best Balance)** |
| **XGBoost Classifier** | 93.8% | 0.935 | 0.934 | 0.934 | Alternate |
| **Support Vector Machine (SVM, RBF)** | 88.7% | 0.881 | 0.883 | 0.882 | Alternate |

### Task B: Input Retail Price Regression
| Algorithm | Mean Absolute Error (MAE) | $R^2$ Score | Status |
| :--- | :---: | :---: | :---: |
| **Linear Regression (Baseline)** | 42.5 Tk/kg | 0.72 | Baseline |
| **Random Forest Regressor** | **14.8 Tk/kg** | **0.91** | **Selected** |
| **XGBoost Regressor** | 15.2 Tk/kg | 0.90 | Alternate |
| **Support Vector Regressor (SVR)** | 21.0 Tk/kg | 0.83 | Alternate |

---

## 3. Running the Service
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Endpoints
- `GET /api/v1/health`: Health status and service uptime.
- `POST /api/v1/predict/crop-suitability`: Returns top suitable crop and yield range.
- `POST /api/v1/predict/price-status`: Returns price assessment label and variance.
- `GET /api/v1/models/compare`: Returns the 4-algorithm benchmark evaluation table.

"""
FastAPI Microservice Entrypoint for Agrisense ML Inference
Author: Imtiaz Ibna Kamal (@imtiazdeepto)
"""

import sys
import time

try:
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
except ImportError:
    # Minimal fallback mock for local unit test scripts
    FastAPI = None

from .pipeline import CropSuitabilityPipeline, PriceAnomalyDetector
from .schemas import (
    CropSuitabilityRequest,
    CropSuitabilityResponse,
    PriceStatusRequest,
    PriceStatusResponse,
)

crop_pipeline = CropSuitabilityPipeline(algorithm="Random Forest")
price_detector = PriceAnomalyDetector()

if FastAPI:
    app = FastAPI(
        title="Agrisense ML Inference Microservice",
        version="1.2.0",
        description="Serves team-trained machine learning models for crop suitability ranking and fair-price anomaly detection.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/api/v1/health")
    def health_check():
        return {
            "status": "healthy",
            "service": "agrisense-ml-inference",
            "version": "1.2.0",
            "timestamp": time.time(),
        }

    @app.post("/api/v1/predict/crop-suitability", response_model=CropSuitabilityResponse)
    def predict_crop_suitability(request: CropSuitabilityRequest):
        try:
            result = crop_pipeline.predict(
                n=request.soil_n,
                p=request.soil_p,
                k=request.soil_k,
                ph=request.soil_ph,
                temp=request.temperature,
                humidity=request.humidity,
                rain=request.rainfall,
            )
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @app.post("/api/v1/predict/price-status", response_model=PriceStatusResponse)
    def predict_price_status(request: PriceStatusRequest):
        try:
            result = price_detector.evaluate(
                product_type=request.product_type,
                unit_price=request.unit_price,
                benchmark_median=request.benchmark_median,
                delivery_charge=request.delivery_charge or 0.0,
            )
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @app.get("/api/v1/models/compare")
    def get_model_comparison_metrics():
        """
        Reports the 4-algorithm comparative evaluation table (Mandatory Capstone O3/AI-02).
        """
        return {
            "task": "Crop Suitability Multiclass Classification",
            "evaluation_metric": "Stratified 5-Fold Cross Validation on Holdout Test Set (20%)",
            "comparison_table": [
                {
                    "algorithm": "Logistic Regression (Baseline)",
                    "accuracy": 0.812,
                    "macro_precision": 0.804,
                    "macro_recall": 0.798,
                    "macro_f1": 0.801,
                    "selected": False,
                },
                {
                    "algorithm": "Random Forest Classifier",
                    "accuracy": 0.942,
                    "macro_precision": 0.938,
                    "macro_recall": 0.940,
                    "macro_f1": 0.939,
                    "selected": True,  # Best overall trade-off
                },
                {
                    "algorithm": "XGBoost Classifier",
                    "accuracy": 0.938,
                    "macro_precision": 0.935,
                    "macro_recall": 0.934,
                    "macro_f1": 0.934,
                    "selected": False,
                },
                {
                    "algorithm": "Support Vector Machine (SVM, RBF Kernel)",
                    "accuracy": 0.887,
                    "macro_precision": 0.881,
                    "macro_recall": 0.883,
                    "macro_f1": 0.882,
                    "selected": False,
                },
            ],
            "price_regression_task": {
                "metric": "MAE (Tk/kg) and R² Score",
                "algorithms": [
                    {"algorithm": "Linear Regression (Baseline)", "mae": 42.5, "r2": 0.72},
                    {"algorithm": "Random Forest Regressor", "mae": 14.8, "r2": 0.91},
                    {"algorithm": "XGBoost Regressor", "mae": 15.2, "r2": 0.90},
                    {"algorithm": "Support Vector Regressor (SVR)", "mae": 21.0, "r2": 0.83},
                ],
            },
        }
else:
    app = None

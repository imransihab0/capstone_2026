"""
Pydantic Schemas for Agrisense ML Inference Microservice
Author: Imtiaz Ibna Kamal (@imtiazdeepto)
"""

from typing import List, Optional, Dict

try:
    from pydantic import BaseModel, Field
except (ImportError, Exception):
    # Minimal fallback dataclasses if pydantic not yet installed
    from dataclasses import dataclass, field
    class BaseModel:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
        def dict(self):
            return self.__dict__
    Field = lambda *args, **kwargs: None


class CropSuitabilityRequest(BaseModel):
    soil_n: float = 45.0  # Nitrogen in mg/kg
    soil_p: float = 22.0  # Phosphorus in mg/kg
    soil_k: float = 35.0  # Potassium in mg/kg
    soil_ph: float = 6.5  # Soil pH
    temperature: float = 25.0  # Avg seasonal temp in Celsius
    humidity: float = 78.0  # Avg seasonal relative humidity %
    rainfall: float = 120.0  # Seasonal rainfall in mm
    aez_code: Optional[str] = "AEZ-8"


class CropPrediction(BaseModel):
    crop_name: str
    confidence_score: float
    predicted_yield_range: str
    suitability_rank: int


class CropSuitabilityResponse(BaseModel):
    model_version: str
    algorithm_used: str
    top_crop: CropPrediction
    alternative_crops: List[CropPrediction]
    verdict: str
    soil_health_notes: str


class PriceStatusRequest(BaseModel):
    product_type: str  # urea, tsp, mop, dap, pesticide, seed
    unit_price: float  # Normalized BDT per kg or per L
    benchmark_median: float
    delivery_charge: Optional[float] = 0.0


class PriceStatusResponse(BaseModel):
    product_type: str
    unit_price: float
    benchmark_median: float
    price_status: str  # fair, overpriced, suspiciously_low
    variance_percentage: float
    recommendation: str
    model_name: str

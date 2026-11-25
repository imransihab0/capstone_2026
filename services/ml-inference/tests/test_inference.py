"""
Unit Tests for ML Inference Microservice Pipeline
Author: Imtiaz Ibna Kamal (@imtiazdeepto)
"""

import unittest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.pipeline import CropSuitabilityPipeline, PriceAnomalyDetector


class TestMLInferencePipeline(unittest.TestCase):
    def setUp(self):
        self.crop_pipeline = CropSuitabilityPipeline(algorithm="Random Forest")
        self.price_detector = PriceAnomalyDetector()

    def test_crop_suitability_prediction(self):
        # Soil suitable for Boro Rice: N=60, P=30, K=45, pH=6.5, Temp=25C, Humidity=80%, Rain=150mm
        result = self.crop_pipeline.predict(
            n=60.0,
            p=30.0,
            k=45.0,
            ph=6.5,
            temp=25.0,
            humidity=80.0,
            rain=150.0,
        )

        self.assertIn("top_crop", result)
        self.assertIn("Boro Rice", result["top_crop"]["crop_name"])
        self.assertGreater(result["top_crop"]["confidence_score"], 0.80)
        self.assertEqual(result["verdict"], "Highly Suitable")
        self.assertEqual(len(result["alternative_crops"]), 2)

    def test_acidic_soil_health_warning(self):
        # Strongly acidic soil pH 4.8
        result = self.crop_pipeline.predict(
            n=50.0, p=25.0, k=40.0, ph=4.8, temp=22.0, humidity=75.0, rain=120.0
        )
        self.assertIn("Acidic soil detected", result["soil_health_notes"])

    def test_price_anomaly_fair_pricing(self):
        # Listing: 850 Tk/kg, benchmark: 800 Tk/kg (+6.25% variance -> Fair)
        result = self.price_detector.evaluate("pesticide", 850.0, 800.0)
        self.assertEqual(result["price_status"], "fair")
        self.assertAlmostEqual(result["variance_percentage"], 6.25, places=1)

    def test_price_anomaly_overpriced(self):
        # Listing: 1100 Tk/kg, benchmark: 800 Tk/kg (+37.5% variance -> Overpriced)
        result = self.price_detector.evaluate("pesticide", 1100.0, 800.0)
        self.assertEqual(result["price_status"], "overpriced")

    def test_price_anomaly_suspiciously_low(self):
        # Listing: 400 Tk/kg, benchmark: 800 Tk/kg (-50.0% variance -> Suspiciously Low)
        result = self.price_detector.evaluate("pesticide", 400.0, 800.0)
        self.assertEqual(result["price_status"], "suspiciously_low")
        self.assertIn("Verify product seal", result["recommendation"])

    def test_model_comparison_metrics(self):
        from app.main import get_comparison_data

        data = get_comparison_data()
        self.assertIn("comparison_table", data)
        self.assertEqual(len(data["comparison_table"]), 4)

        # Verify selected model is Random Forest
        selected_models = [m for m in data["comparison_table"] if m.get("selected")]
        self.assertEqual(len(selected_models), 1)
        self.assertEqual(selected_models[0]["algorithm"], "Random Forest Classifier")
        self.assertGreaterEqual(selected_models[0]["accuracy"], 0.94)

        # Verify price regression models
        self.assertIn("price_regression_task", data)
        self.assertEqual(len(data["price_regression_task"]["algorithms"]), 4)


if __name__ == "__main__":
    unittest.main()

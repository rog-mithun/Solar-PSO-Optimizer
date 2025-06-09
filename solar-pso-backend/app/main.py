from fastapi import FastAPI
from app.schemas.request_models import OptimizationRequest
from app.models.pso_optimizer import optimize_locations, save_results_as_csv
from app.services.data_loader import load_data
from fastapi import File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import pandas as pd

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

latest_uploaded_file = None


app = FastAPI()

# Add this block to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Solar PSO API is running"}

@app.post("/optimize")
def optimize(request: OptimizationRequest):
    global latest_uploaded_file

    # Choose dataset based on user flag
    if request.use_uploaded and latest_uploaded_file:
        data_path = latest_uploaded_file
    else:
        data_path = "F:/COLLEGE/ASSIGNMENTS/SEM-8/MHO LAB/Project/solar-pso-backend/app/data/tamilnadu_solar_sites.csv"

    try:
        data = load_data(data_path)
        results = optimize_locations(data, request)
        result_csv = save_results_as_csv(results)
        return {
            "optimized_sites": results,
            "download_url": f"/download/{os.path.basename(result_csv)}"
        }
    except Exception as e:
        return {"error": str(e)}


@app.post("/upload")
def upload_dataset(file: UploadFile = File(...)):
    global latest_uploaded_file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        df = pd.read_csv(file_path)
        required = {"latitude", "longitude", "solar_irradiance", "land_cost"}
        if not required.issubset(df.columns):
            return {"error": "CSV missing required columns."}

        latest_uploaded_file = file_path  # Track for next optimization
        return {"message": "File uploaded successfully", "path": file_path}
    except Exception as e:
        return {"error": str(e)}

    
@app.get("/download/{filename}")
def download_file(filename: str):
    file_path = os.path.join("results", filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type='text/csv', filename=filename)
    return {"error": "File not found"}


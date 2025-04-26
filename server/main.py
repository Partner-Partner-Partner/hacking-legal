import os
import uuid
import json
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Dict
import shutil
from pathlib import Path

app = FastAPI()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Create a metadata file to store information about uploaded contracts
METADATA_FILE = os.path.join(UPLOAD_DIR, "metadata.json")
if not os.path.exists(METADATA_FILE):
    with open(METADATA_FILE, 'w') as f:
        json.dump([], f)

@app.get("/")
def read_root():
    return {"message": "Contract Processing API", "status": "running"}

@app.post("/contracts/upload")
async def upload_contracts(contract_files: List[UploadFile] = File(...)):
    """Simple endpoint to receive and save files"""
    try:
        saved_files = []
        
        for file in contract_files:
            # Generate unique filename
            file_extension = os.path.splitext(file.filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = os.path.join(UPLOAD_DIR, unique_filename)
            
            # Save the file
            with open(file_path, "wb") as buffer:
                buffer.write(await file.read())
            
            saved_files.append({
                "filename": file.filename,
                "saved_as": unique_filename
            })
        
        return {
            "message": f"Successfully uploaded {len(saved_files)} file(s)",
            "files": saved_files
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.get("/contracts")
async def list_contracts():
    """
    List all uploaded contracts
    """
    try:
        with open(METADATA_FILE, 'r') as f:
            metadata = json.load(f)
        return {"contracts": metadata}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve contract list: {str(e)}")

@app.get("/contracts/{file_id}")
async def get_contract(file_id: str):
    """
    Get a specific contract by its ID (saved_as filename)
    """
    try:
        with open(METADATA_FILE, 'r') as f:
            metadata = json.load(f)
        
        # Find the contract with the given ID
        contract = next((item for item in metadata if item["saved_as"].startswith(file_id)), None)
        
        if not contract:
            raise HTTPException(status_code=404, detail="Contract not found")
        
        return contract
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve contract: {str(e)}")

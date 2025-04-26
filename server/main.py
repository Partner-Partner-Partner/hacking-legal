import os
import uuid
import json
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
<<<<<<< HEAD
from util import contract_parser
=======
from util import parser, loader, saver
>>>>>>> e279fc6298d78ff26a3346ca99727aff21272923
import shutil
import tempfile

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
    with open(METADATA_FILE, "w") as f:
        json.dump([], f)


@app.get("/")
def read_root():
    return {"message": "Contract Processing API", "status": "running"}


@app.post("/parse_contract/")
async def parse_contract(file: UploadFile = File(...)):
    """
    Upload a contract PDF and receive the parsed contract as structured JSON.
    """
<<<<<<< HEAD
    # Save the uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    # Parse the contract
    contract = contract_parser.full_parse2(tmp_path)
=======
    # Save the uploaded file
    _, unique_filename = saver.save_file_unique(file, UPLOAD_DIR)

    # Load the saved file
    contract_text = loader.load_file(unique_filename)

    # Parse the contract from loaded file
    contract = parser.full_parse2(contract_text)
>>>>>>> e279fc6298d78ff26a3346ca99727aff21272923

    # Return the contract as JSON
    return JSONResponse(content=contract.dict())


<<<<<<< HEAD
=======
@app.post("/upload_playbook/")
async def upload_playbook(files: List[UploadFile] = File(...)):
    """
    Upload a set of contracts and build a playbook based on them"""

    for file in files:
        # Save the uploaded file
        _, unique_filename = saver.save_file_unique(file, UPLOAD_DIR)

        # Load the saved file
        contract_text = loader.load_file(unique_filename)

        # Parse the contract from loaded file
        contract = parser.full_parse2(contract_text)

        # Return the contract as JSON
        #
    return {"message": "success"}


>>>>>>> e279fc6298d78ff26a3346ca99727aff21272923
@app.post("/contracts/upload")
async def upload_contracts(contract_files: List[UploadFile] = File(...)):
    """Simple endpoint to receive and save files"""
    try:
        saved_files = []

        for file in contract_files:
<<<<<<< HEAD
            # Generate unique filename
            file_extension = os.path.splitext(file.filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = os.path.join(UPLOAD_DIR, unique_filename)

            # Save the file
            with open(file_path, "wb") as buffer:
                buffer.write(await file.read())

=======
            filename, unique_filename = saver.save_file_unique(file, UPLOAD_DIR)
>>>>>>> e279fc6298d78ff26a3346ca99727aff21272923
            saved_files.append({"filename": file.filename, "saved_as": unique_filename})

        return {
            "message": f"Successfully uploaded {len(saved_files)} file(s)",
            "files": saved_files,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.get("/contracts")
async def list_contracts():
    """
    List all uploaded contracts
    """
    try:
        with open(METADATA_FILE, "r") as f:
            metadata = json.load(f)
        return {"contracts": metadata}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to retrieve contract list: {str(e)}"
        )


@app.get("/contracts/{file_id}")
async def get_contract(file_id: str):
    """
    Get a specific contract by its ID (saved_as filename)
    """
    try:
        with open(METADATA_FILE, "r") as f:
            metadata = json.load(f)

        # Find the contract with the given ID
        contract = next(
            (item for item in metadata if item["saved_as"].startswith(file_id)), None
        )

        if not contract:
            raise HTTPException(status_code=404, detail="Contract not found")

        return contract
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to retrieve contract: {str(e)}"
        )

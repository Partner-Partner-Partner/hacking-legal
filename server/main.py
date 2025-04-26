from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from util import contract_parser
import tempfile
import shutil

app = FastAPI()


@app.post("/parse_contract/")
async def parse_contract(file: UploadFile = File(...)):
    """
    Upload a contract PDF and receive the parsed contract as structured JSON.
    """
    # Save the uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    # Parse the contract
    contract = contract_parser.full_parse2(tmp_path)

    # Return the contract as JSON
    return JSONResponse(content=contract.dict())

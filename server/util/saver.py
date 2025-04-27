import os
import uuid
from loguru import logger


async def save_file_unique(file, upload_dir):
    """Save a file under a uniquie filename (uuid) in given upload directory"""
    logger.info(f"save_file_unique | {file.filename} | {upload_dir}")

    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)

    # Save the file
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    return file.filename, unique_filename


def save_playbook(filename, tree):
    tree.write(filename, encoding="utf-8", xml_declaration=True)

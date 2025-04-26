import pymupdf
import docx


def load_docx(filename: str) -> str:
    """Extract full text from a docx file"""
    doc = docx.Document(filename)
    return "\n".join([p for p in doc.paragraphs])


def load_pdf(filename: str) -> str:
    """Extract full text from a PDF file, page by page."""
    with pymupdf.open(filename) as doc:
        return chr(12).join([page.get_text() for page in doc])


def load_file(filename: str) -> str:
    """Extract any file"""

    if filename.endswith(".docx"):
        return load_docx(filename)
    elif filename.endswith(".pdf"):
        return load_pdf(filename)
    else:
        raise ValueError(f"Unsupported file type for file: {filename}")

import os
import time
from dotenv import load_dotenv
import pymupdf
from model.contract import Contract, ContractRaw, Section
from langchain_mistralai import ChatMistralAI
from langchain_core.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)

# Load environment variables from .env file
load_dotenv()
api_key = os.getenv("MISTRAL_API_KEY")

# Initialize LangChain Mistral client
llm = ChatMistralAI(
    api_key=api_key,
    model="mistral-large-latest",
)


def extract_text_from_pdf(filename: str) -> str:
    """Extract full text from a PDF file, page by page."""
    with pymupdf.open(filename) as doc:
        return chr(12).join([page.get_text() for page in doc])


def parse_raw_sections(filename: str) -> ContractRaw:
    """Parse the contract into rough sections (before deep parsing)."""
    contract_text = extract_text_from_pdf(filename)

    # Prompt for extracting raw sections
    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessagePromptTemplate.from_template(
                """You are a legal AI. You are given a contract extracted from a PDF.
                    A contract consists of multiple sections.
                    Parse all sections carefully and structure the output.
                """
            ),
            HumanMessagePromptTemplate.from_template("Contract:\n{contract}"),
        ]
    )

    chain = prompt | llm.with_structured_output(ContractRaw)
    result = chain.invoke({"contract": contract_text})

    return result


def parse_section(section_raw) -> Section:
    """Parse a single section into clauses and subsections."""
    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessagePromptTemplate.from_template(
                """You are a legal AI. You are given a single contract section.
                    A section consists of clauses and optional subsections.
                    Parse the section accurately into a structured format.
                """
            ),
            HumanMessagePromptTemplate.from_template("Section Text:\n{section_text}"),
        ]
    )

    chain = prompt | llm.with_structured_output(Section)
    result = chain.invoke({"section_text": section_raw.text})

    return result


def full_parse2(filename) -> Contract:
    """Parse all sections of a contract at once to avoid rate limits."""

    contract_text = extract_text_from_pdf(filename)

    # Prompt to parse all sections together
    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessagePromptTemplate.from_template(
                """You are a legal AI. You are given the full text of a contract divided into sections.
                    Each section has a title, clauses, and optional subsections.
                    Parse each section carefully and output the structured result for all sections.
                """
            ),
            HumanMessagePromptTemplate.from_template(
                "Contract Sections:\n{contract_text}"
            ),
        ]
    )

    chain = prompt | llm.with_structured_output(Contract)
    result = chain.invoke({"contract_text": contract_text})

    return result


def full_parse(filename: str, method: str = "batch") -> Contract:
    """
    Full parsing pipeline.
    Args:
        filename: Path to the PDF contract
        method: "batch" (recommended) or "single"
    Returns:
        Fully parsed Contract object
    """

    # Step 1: Raw section parsing
    contract_raw = parse_raw_sections(filename)

    # Step 2: Choose parsing strategy
    sections = []
    if method == "single":
        # Parse each section separately (slower)
        for section_raw in contract_raw.sections:
            detailed_section = parse_section(section_raw)
            sections.append(detailed_section)
            time.sleep(1)  # sleep to prevent rate limits
    elif method == "batch":
        # Use full_parse2 to parse all sections at once
        sections = full_parse2(contract_raw)
    else:
        raise ValueError(f"Unknown parsing method: {method}")

    # Step 3: Build final Contract object
    return Contract(
        title=contract_raw.title,
        parties=contract_raw.parties,
        sections=sections,
    )

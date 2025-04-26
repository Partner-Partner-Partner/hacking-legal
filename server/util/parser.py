import os
import time
from dotenv import load_dotenv
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


def parse_raw_sections(contract_text: str) -> ContractRaw:
    """Parse the contract into rough sections (before deep parsing)."""

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


def full_parse2(contract_text) -> Contract:
    """Parse all sections of a contract at once to avoid rate limits."""

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


def full_parse(contract_text: str) -> Contract:
    # Step 1: Raw section parsing
    contract_raw = parse_raw_sections(contract_text)

    # Step 2: Choose parsing strategy
    sections = []

    # Parse each section separately (slower)
    for section_raw in contract_raw.sections:
        detailed_section = parse_section(section_raw)
        sections.append(detailed_section)
        time.sleep(1)  # sleep to prevent rate limits

    # Step 3: Build final Contract object
    return Contract(
        title=contract_raw.title,
        parties=contract_raw.parties,
        sections=sections,
    )

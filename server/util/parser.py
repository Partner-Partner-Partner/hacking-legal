import config
import time
from model.contract import Contract, ContractRaw, Section
from model.playbook import (
    Playbook,
    PlaybookSection,
)

from langchain_mistralai import ChatMistralAI
from langchain_core.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from loguru import logger
from typing import Dict, List

# Initialize LangChain Mistral client
llm = ChatMistralAI(
    api_key=config.MISTRAL_API_KEY,
    model="mistral-large-latest",
)


def parse_raw_sections(contract_text: str) -> ContractRaw:
    """Parse the contract into rough sections."""
    logger.info("parse_raw_sections")

    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessagePromptTemplate.from_template(
                """You are a legal AI. You are given a contract extracted from a PDF.
            A contract consists of multiple sections.
            Parse all sections carefully and structure the output."""
            ),
            HumanMessagePromptTemplate.from_template("Contract:\n{contract}"),
        ]
    )

    chain = prompt | llm.with_structured_output(ContractRaw)
    result = chain.invoke({"contract": contract_text})

    return result


def parse_section(section_raw: Section) -> Section:
    """Parse a single section into clauses and subsections."""
    logger.info("parse_section")

    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessagePromptTemplate.from_template(
                """You are a legal AI. You are given a single contract section.
            A section consists of clauses and optional subsections.
            Parse the section accurately into a structured format."""
            ),
            HumanMessagePromptTemplate.from_template("Section Text:\n{section_text}"),
        ]
    )

    chain = prompt | llm.with_structured_output(Section)
    result = chain.invoke({"section_text": section_raw.text})

    return result


def full_parse2(contract_text: str) -> Contract:
    """Parse all sections of a contract at once."""
    logger.info("full_parse2")

    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessagePromptTemplate.from_template(
                """You are a legal AI. You are given the full text of a contract divided into sections.
            Each section has a title, clauses, and optional subsections.
            Parse each section carefully and output the structured result for all sections."""
            ),
            HumanMessagePromptTemplate.from_template(
                "Contract Sections:\n{contract_text}"
            ),
        ]
    )

    chain = prompt | llm.with_structured_output(Contract)
    result = chain.invoke({"contract_text": contract_text})
    time.sleep(1)

    return result


def full_parse(contract_text: str) -> Contract:
    logger.info("full_parse")

    contract_raw = parse_raw_sections(contract_text)
    sections = []

    for section_raw in contract_raw.sections:
        detailed_section = parse_section(section_raw)
        sections.append(detailed_section)

    return Contract(
        title=contract_raw.title,
        parties=contract_raw.parties,
        sections=sections,
    )


def generate_playbook(clusters: Dict[int, List[str]]) -> Playbook:
    """Generate a Playbook from clustered legal clauses."""
    logger.info("generate_playbook")

    sections = []
    for cluster_id, clauses in clusters.items():
        if cluster_id != -1:
            logger.info(f"Processing cluster {cluster_id} with {len(clauses)} clauses")

            prompt = ChatPromptTemplate.from_messages(
                [
                    SystemMessagePromptTemplate.from_template(
                        """You are a legal AI.
                        You are given a cluster of legal clauses belonging to the same overall legal topic.
                        Your tasks are:
                        1. Summarize the cluster into one section title.
                        2. For the cluster, generate 4 Playbook variants:
                        - Each variant must have:
                        text (No duplicates)
                        favorability (Most Favorable / Am Vorteilhaftesten, Balanced / Ausgewogen, Acceptable / Akzeptabel, Unacceptable / Inakzeptabel)
                        justification
 
                        Output strictly as JSON in a field 'variants' with given structure.
                        For JSON values use the German language.

                        title: "..."
                        variants: [
                            {{"text": "...", "favorability": "...", "justification": "...", }},
                        ]
                        """
                    ),
                    HumanMessagePromptTemplate.from_template(
                        "Clauses:\n{clauses_text}"
                    ),
                ]
            )

            chain = prompt | llm.with_structured_output(PlaybookSection)
            sections.append(chain.invoke({"clauses_text": "\n\n".join(clauses)}))

    return Playbook(sections=sections)

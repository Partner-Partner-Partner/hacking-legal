import config
from langchain_mistralai import MistralAIEmbeddings
from sklearn.cluster import DBSCAN
from typing import List
from loguru import logger
from model.contract import Contract


embeddings = MistralAIEmbeddings(
    api_key=config.MISTRAL_API_KEY,
    model="mistral-embed",
)


def cluster(contracts: List[Contract]):
    logger.info(f"cluster | n:{len(contracts)}")

    clauses = []
    clauses_embedded = []

    # Iterate over each contract in contracts
    for contract in contracts:
        # Iterate over each section in contract
        for section in contract.sections:
            # Iterate over each subsection in section
            for subsection in section.subsections:
                # Iterate over each clause in subsection and embed
                for clause in subsection.clauses:
                    ebd = embeddings.embed_query(clause.text)
                    clauses.append(clause.text)
                    clauses_embedded.append(ebd)

            # Iterate over each clause in section and embed
            for clause in section.clauses:
                ebd = embeddings.embed_query(clause.text)
                clauses.append(clause.text)
                clauses_embedded.append(ebd)

    # Cluster clauses using DBSCAN
    dbscan = DBSCAN(eps=0.5, min_samples=2, metric="cosine")
    labels = dbscan.fit_predict(clauses_embedded)

    return [(clause, label) for clause, label in zip(clauses, labels)]

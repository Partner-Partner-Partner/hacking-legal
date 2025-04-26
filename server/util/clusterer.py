import config
from collections import defaultdict
from langchain_mistralai import MistralAIEmbeddings
from sklearn.cluster import DBSCAN
from typing import List
from loguru import logger
from model.contract import Contract
from sentence_transformers import SentenceTransformer


model = SentenceTransformer("all-MiniLM-L6-v2")


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
                    logger.info(f"cluster | clustering clause: {clause}")
                    ebd = model.encode(clause.text)
                    clauses.append(clause.text)
                    clauses_embedded.append(ebd)

            # Iterate over each clause in section and embed
            for clause in section.clauses:
                logger.info(f"cluster | clustering clause: {clause}")
                ebd = model.encode(clause.text)
                clauses.append(clause.text)
                clauses_embedded.append(ebd)

    # Cluster clauses using DBSCAN
    dbscan = DBSCAN(eps=0.5, min_samples=2, metric="cosine")
    labels = dbscan.fit_predict(clauses_embedded)

    # Group clauses by cluster
    clusters = defaultdict(list)
    for clause, label in zip(clauses, labels):
        clusters[int(label)].append(clause)

    logger.info(f"cluster | labels: {labels}")

    return dict(clusters)

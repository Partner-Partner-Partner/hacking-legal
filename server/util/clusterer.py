from collections import defaultdict
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import DBSCAN
from sklearn.neighbors import NearestNeighbors
from typing import List, Dict
from loguru import logger
from model.contract import Contract
import numpy as np
from sentence_transformers import SentenceTransformer
import matplotlib.pyplot as plt

# Lade SentenceTransformer Modell
model = SentenceTransformer("all-MiniLM-L12-v2")

# Kategorien definieren
categories = [
    "Definitionen",
    "Beschreibung Liefergegenstand",
    "Änderungsprozess (Change Management)",
    "Verbindlichkeit von Prognosen",
    "Bestellannahme/-ablehnung",
    "Liefertermine",
    "Incoterms 2020",
    "Gefahrübergang (Risk Transfer)",
    "Eigentumsübergang (Title Transfer)",
    "Preisbasis",
    "Zahlungsziel",
    "Skonto",
    "Qualitätsstandards",
    "Inspektion & Audit",
    "Mängelrüge (§ 377 HGB)",
    "Gewährleistungsumfang",
    "Gewährleistungsfrist",
    "Abwicklung von Gewährleistungsfällen",
    "Haftungsumfang",
    "Freistellung (Indemnification)",
    "Laufzeit",
    "Kündigung aus wichtigem Grund (Termination for Cause)",
    "Geheimhaltung - Umfang & Dauer",
    "Eigentum an Neuentwicklungen (Foreground IP)",
    "Werkzeuge / Betriebsmittel (Tooling)",
    "Definition & Folgen",
    "Rechtswahl, Anwendbares Recht",
    "Gerichtsstand/Streitbeilegung",
    "LkSG-Klauseln",
    "Datenschutz (DSGVO/BDSG)",
    "Unterbeauftragung (Subcontracting)",
    "Schriftformklausel",
    "Salvatorische Klausel",
]

# Kategorien einbetten
categories_embedded = [model.encode(category) for category in categories]


def cluster(contracts: List[Contract]) -> Dict[int, List[str]]:
    clauses = []
    clauses_embedded = []

    for contract in contracts:
        for section in contract.sections:
            for subsection in section.subsections:
                for clause in subsection.clauses:
                    ebd = model.encode(clause.text)
                    clauses.append(clause.text)
                    clauses_embedded.append(ebd)
            for clause in section.clauses:
                ebd = model.encode(clause.text)
                clauses.append(clause.text)
                clauses_embedded.append(ebd)

    # Optional: k-distance plot erstellen
    plot_k_distance(clauses_embedded, min_samples=2, save_path="k_distance_graph.png")

    # Clustering
    dbscan = DBSCAN(eps=0.30, min_samples=2, metric="cosine")
    labels = dbscan.fit_predict(clauses_embedded)

    # Cluster aufbauen
    clusters = defaultdict(list)
    for clause, label in zip(clauses, labels):
        clusters[int(label)].append(clause)

    return dict(clusters)


def plot_k_distance(clauses_embedded, min_samples=2, save_path="k_distance_plot.png"):
    neighbors = NearestNeighbors(n_neighbors=min_samples)
    neighbors_fit = neighbors.fit(clauses_embedded)
    distances, indices = neighbors_fit.kneighbors(clauses_embedded)

    distances = np.sort(distances[:, -1])

    plt.figure(figsize=(8, 4))
    plt.plot(distances)
    plt.title("k-distance Graph")
    plt.xlabel("Points sorted by distance")
    plt.ylabel(f"Distance to {min_samples}th nearest neighbor")
    plt.grid(True)

    plt.savefig(save_path)
    plt.close()

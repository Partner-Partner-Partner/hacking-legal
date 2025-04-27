import xml.etree.ElementTree as ET
from model.playbook import Playbook


def playbook_to_xml(playbook: Playbook) -> ET.ElementTree:
    root = ET.Element("Playbook")

    for section in playbook.sections:
        section_el = ET.SubElement(root, "Section", title=section.title)

        for clause in section.clauses:
            clause_el = ET.SubElement(section_el, "Clause")
            ET.SubElement(clause_el, "Text").text = clause.text

            for variant in clause.variants:
                variant_el = ET.SubElement(
                    clause_el, "Variant", classification=variant.classification
                )
                ET.SubElement(variant_el, "Text").text = variant.text
                ET.SubElement(variant_el, "Description").text = variant.description
                ET.SubElement(variant_el, "Justification").text = variant.justification
                ET.SubElement(
                    variant_el, "NegotiationArgument"
                ).text = variant.negotiation_argument

    return ET.ElementTree(root)

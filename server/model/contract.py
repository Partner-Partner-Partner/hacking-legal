from pydantic import BaseModel


class Clause(BaseModel):
    text: str


class Subsection(BaseModel):
    title: str
    clauses: list[Clause] = []


class SectionRaw(BaseModel):
    title: str
    text: str


class Section(BaseModel):
    title: str
    clauses: list[Clause] = []
    subsections: list[Subsection] = []


class Party(BaseModel):
    name: str


class ContractRaw(BaseModel):
    parties: list[Party] = []
    title: str
    sections: list[SectionRaw] = []


class Contract(BaseModel):
    title: str
    parties: list[Party] = []
    sections: list[Section] = []

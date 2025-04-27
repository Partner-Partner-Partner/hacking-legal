from beanie import Document
from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import uuid4, UUID


class Clause(BaseModel):
    text: str


class Subsection(BaseModel):
    title: str
    clauses: List[Clause] = []


class SectionRaw(BaseModel):
    title: str
    text: str


class Section(BaseModel):
    title: str
    clauses: List[Clause] = []
    subsections: List[Subsection] = []


class Party(BaseModel):
    name: str


class ContractRaw(BaseModel):
    parties: List[Party] = []
    title: str
    sections: List[SectionRaw] = []


class Contract(Document):
    id: Optional[UUID] = Field(default_factory=uuid4, alias="_id")
    title: str
    parties: List[Party] = []
    sections: List[Section] = []

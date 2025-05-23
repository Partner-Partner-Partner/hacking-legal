# Note: The beanie package is required for this code.
# To install: pip install beanie pymongo motor
from beanie import Document
from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import uuid4, UUID


class PlaybookVariant(BaseModel):
    text: str
    favorability: str  # Most Favorable, Balanced, Acceptable, Unacceptable
    internal_justification: str
    external_justification: str


class PlaybookSection(BaseModel):
    title: str
    variants: List[PlaybookVariant]


class Playbook(Document):
    id: Optional[UUID] = Field(default_factory=uuid4, alias="_id")
    sections: List[PlaybookSection]

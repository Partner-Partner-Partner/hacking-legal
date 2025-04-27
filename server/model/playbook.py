from pydantic import BaseModel
from typing import List


class PlaybookVariant(BaseModel):
    text: str
    favorability: str  # Most Favorable, Balanced, Acceptable, Unacceptable
    justification: str


class PlaybookSection(BaseModel):
    title: str
    variants: List[PlaybookVariant]


class Playbook(BaseModel):
    sections: List[PlaybookSection]

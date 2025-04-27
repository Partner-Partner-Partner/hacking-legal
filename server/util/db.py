from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from model.playbook import Playbook


async def init_db():
    client = AsyncIOMotorClient("mongodb://root:example@mongo:27017/")
    db = client["p&p&p"]

    await init_beanie(
        database=db,
        document_models=[Playbook],
    )

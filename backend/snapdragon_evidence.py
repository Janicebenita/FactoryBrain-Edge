import json
from pathlib import Path


EVIDENCE_PATH = Path(
    "models/snapdragon_execution.json"
)


def load_snapdragon_evidence():

    if not EVIDENCE_PATH.exists():
        return {
            "verified": False,
            "status": "NOT_AVAILABLE"
        }

    with open(
        EVIDENCE_PATH,
        "r",
        encoding="utf-8"
    ) as f:
        return json.load(f)
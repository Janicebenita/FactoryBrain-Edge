import os

from inference_provider import (
    CloudInferenceProvider,
    SnapdragonInferenceProvider,
)


def get_inference_provider():
    provider_name = os.getenv("INFERENCE_PROVIDER", "cloud").lower()

    if provider_name == "cloud":
        return CloudInferenceProvider()

    if provider_name == "snapdragon":
        endpoint = os.getenv(
            "SNAPDRAGON_ENDPOINT",
            "http://127.0.0.1:9000"
        )

        return SnapdragonInferenceProvider(endpoint)

    raise ValueError(
        f"Unsupported INFERENCE_PROVIDER: {provider_name}"
    )
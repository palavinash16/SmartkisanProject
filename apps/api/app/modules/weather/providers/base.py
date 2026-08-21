"""Abstract Base Weather Provider Boundary for SmartKisan Weather Module."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict


class BaseWeatherProvider(ABC):
    """Abstract boundary interface for external weather providers."""

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Returns the human-readable identifier of the weather source (e.g. 'Open-Meteo')."""
        pass

    @abstractmethod
    async def fetch_weather_and_forecast(self, lat: float, lon: float) -> Dict[str, Any]:
        """Fetch current weather and 7-day forecast for coordinates (lat, lon)."""
        pass

from pydantic import BaseModel


class OccupancyStatusResponse(BaseModel):
    """Defines the response for current occupancy status."""

    occupied_seats: int
    empty_seats: int
    total_seats: int

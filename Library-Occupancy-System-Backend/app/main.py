import uuid
from datetime import datetime
from typing import List, Optional
import os
import shutil
import tempfile
from pathlib import Path

from fastapi import (
    FastAPI,
    BackgroundTasks,
    Depends,
    Query,
    UploadFile,
    File,
    HTTPException,
)
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from sqlalchemy.orm import joinedload

from app.core.database import SessionLocal, get_db
from app.models import schemas
from app.services.live_occupancy_service import LiveOccupancyService

# Global service instance for accessing latest counts
live_service_instance = [None]

app = FastAPI(title="Library Occupancy System API")

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Library Occupancy System API"}


def run_live_analysis_task(video_path: str, temp_dir: str, service_instance):
    """Background task for live analysis."""
    try:
        service = LiveOccupancyService(video_path=video_path)
        service_instance[0] = service  # Store the instance
        service.run_live_analysis()
    except Exception as e:
        print(f"Error during live analysis: {e}")
    finally:
        # Clean up the temporary directory and its contents
        try:
            shutil.rmtree(temp_dir)
            print(f"Cleaned up temporary directory: {temp_dir}")
        except Exception as e:
            print(f"Error cleaning up temp directory {temp_dir}: {e}")


@app.post("/api/v1/live/start")
def start_live_analysis(
    background_tasks: BackgroundTasks,
    video: UploadFile = File(...),
):
    """
    Starts the live occupancy analysis by uploading a video file.
    The system uses this file in a continuous loop to simulate a live CCTV feed.
    """
    temp_dir = tempfile.mkdtemp()
    video_path = os.path.join(temp_dir, video.filename)

    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    # Global service instance
    global live_service_instance
    live_service_instance = [None]  # Use list to modify in function

    print(f"Live analysis started for video: {video.filename}, path: {video_path}")
    background_tasks.add_task(run_live_analysis_task, video_path, temp_dir, live_service_instance)
    return {
        "message": "Live analysis started in the background.",
        "video_filename": video.filename,
    }


@app.get("/api/v1/status/image")
def get_status_image():
    """
    Returns the latest processed frame as an image with seat statuses overlaid.
    This image is only generated when live analysis is running.
    """
    image_path = "static/latest_status.jpg"
    if not os.path.exists(image_path):
        return {
            "error": "Status image not available. Please start live analysis first."
        }
    # Return a file response that streams the image
    return FileResponse(image_path, media_type="image/jpeg")


@app.get("/api/v1/status", response_model=schemas.OccupancyStatusResponse)
def get_occupancy_status():
    """
    Fetches the current occupancy status.
    """
    if live_service_instance[0] is None:
        return schemas.OccupancyStatusResponse(
            occupied_seats=0,
            empty_seats=0,
            total_seats=0
        )
    service = live_service_instance[0]
    return schemas.OccupancyStatusResponse(
        occupied_seats=service.latest_occupied,
        empty_seats=service.latest_empty,
        total_seats=service.latest_occupied + service.latest_empty
    )




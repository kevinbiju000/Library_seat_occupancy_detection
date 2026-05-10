# Library Seat Occupancy Detection System

This project is a proof-of-concept system that uses computer vision to automatically discover seat locations in a library and track their occupancy in real-time. It's built with Python, FastAPI, a YOLOv8 model fine-tuned for head detection (from Ultralytics Plus), and PostgreSQL.

## Features

- **Seat Auto-Discovery:** Analyzes a video to automatically learn and map seat locations based on where people remain stationary.
- **Real-Time Occupancy Tracking:** Monitors discovered seats using a 3-state logic model (`Available`, `Occupied`, `Away`).
- **RESTful API:** Exposes endpoints to start analysis, view current seat status, and query historical data.
- **Direct Video Upload:** Users can upload videos directly via the API, with no need for server-side file management.
- **Background Processing:** Uses FastAPI's background tasks to handle long-running video analysis without blocking the API.

---

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.9+
- Git
- PostgreSQL (12+)

---

## Setup and Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd library_occupancy_system_backend
```

### 2. Create and Activate a Virtual Environment

It's highly recommended to use a virtual environment to manage project dependencies.

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows:**
```bash
python -m venv venv
.\venv\Scripts\activate
```

### 3. Install Dependencies

Install the required Python packages using pip.

```bash
pip install "fastapi[all]" uvicorn sqlalchemy psycopg2-binary alembic python-dotenv ultralytics ultralyticsplus opencv-python
```
*(Note: You can also freeze these dependencies into a `requirements.txt` file for easier installation: `pip freeze > requirements.txt`)*


### 4. Configure Environment Variables

The application uses a `.env` file to manage configuration settings like database credentials.

- Create a file named `.env` in the project root.
- Add the following content, matching the credentials from your database:

```env
DATABASE_URL="postgresql://admin:password@localhost:5432/library_occupancy"
```

### 5. Run Database Migrations

Alembic is used to manage the database schema. Run the following command to apply all migrations and create the necessary tables.

```bash
alembic upgrade head
```
Your database is now set up and ready.

---

## Running the Application

To start the FastAPI server, run the following command from the project root:

```bash
uvicorn app.main:app --reload
```

The server will be running at `http://127.0.0.1:8000`.

**Note:** CORS is enabled to allow requests from frontend applications. In production, restrict the `allow_origins` to specific domains.

---

## How to Use the System

The system is designed to be operated via its API. You can use the interactive documentation provided by FastAPI to easily test the endpoints.

### Access Interactive API Docs

Once the server is running, navigate to **http://127.0.0.1:8000/docs** in your browser.

---

## Troubleshooting

### PyTorch Model Loading Issues

If you encounter errors related to `WeightsUnpickler` or `weights_only` when loading YOLO models (common with PyTorch 2.6+), the services have been updated with a compatibility fix that temporarily patches `torch.load` to allow loading of the trusted ultralytics models. This should resolve issues on Python 3.13+ or newer PyTorch versions.

If problems persist, ensure your PyTorch and ultralytics versions are compatible with your Python version.

---

## API Endpoints

The system provides the following RESTful API endpoints:

- `GET /` - Welcome message
- `POST /api/v1/training/start` - Start seat auto-discovery (upload video). Runs as a background task.
- `POST /api/v1/live/start` - Start live occupancy analysis (upload video). Runs as a background task.
- `GET /api/v1/status/image` - Get latest status image (only available when live analysis is running)
- `GET /api/v1/status` - Get current status of all seats
- `GET /api/v1/analytics` - Get historical occupancy events (with optional filters)

**Note:** The training and live analysis endpoints start long-running background processes that run indefinitely (looping the uploaded video). There are currently no endpoints to stop these processes or check their running status. To stop them, restart the server.

### Step 1: Train the System to Discover Seats

1.  Expand the `POST /api/v1/training/start` endpoint in the API docs.
2.  Click "Try it out".
3.  Click the "Choose File" button and select a video file that shows the library area. This video should ideally contain people sitting for at least a few seconds (the duration is configurable in the code).
4.  Click "Execute". The system will start analyzing the video in the background to find and save seat locations.

### Step 2: Start Live Occupancy Analysis

1.  Expand the `POST /api/v1/live/start` endpoint.
2.  Click "Try it out".
3.  Upload a video file to be used as the simulated live feed. This can be the same video as the training video or a different one.
4.  Click "Execute". The system will now monitor the seats it discovered and update their status in real-time.

### Step 3: View Real-Time Status

1.  Expand the `GET /api/v1/status` endpoint.
2.  Click "Try it out", then "Execute".
3.  You will see a JSON response listing each seat, its current state (`Available`, `Occupied`, `Away`), and a summary count.

### Step 4: Query Historical Data

1.  Expand the `GET /api/v1/analytics` endpoint.
2.  You can optionally filter by `seat_id`, `start_time`, and `end_time`.
3.  Click "Execute" to retrieve the historical event data.

### Step 5: View the Live Annotated Image

1.  While the live analysis is running, you can view a visual representation of the seat statuses.
2.  Expand the `GET /api/v1/status/image` endpoint.
3.  Click "Execute". This will return the latest processed video frame as a JPEG image, with bounding boxes and status labels drawn on it.
4.  A frontend application can call this endpoint repeatedly to create a live-updating visual feed.


TRAIN THE CUSTOM YOLO

yolo detect train model=yolov8m.pt data=datasets/head_dataset/part_a/data.yaml epochs=100 imgsz=640 batch=4 device=0 workers=2
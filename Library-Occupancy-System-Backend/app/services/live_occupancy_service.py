import cv2
import os
from ultralytics import YOLO


class LiveOccupancyService:
    """
    Manages the real-time analysis of seat occupancy using direct YOLO detection.
    """

    def __init__(self, video_path: str):
        self.video_path = video_path
        self.model = YOLO("runs/detect/train-6/weights/best.pt")

        # Configurable constants
        self.FRAME_SKIP = 3  # Process every 3rd frame
        self.CONFIDENCE_THRESHOLD = 0.5

        # Path for the output status image
        self.output_image_path = "static/latest_status.jpg"
        os.makedirs(os.path.dirname(self.output_image_path), exist_ok=True)

        # Latest counts
        self.latest_occupied = 0
        self.latest_empty = 0

    def run_live_analysis(self):
        """Main loop to process video and update occupancy counts."""
        cap = cv2.VideoCapture(self.video_path)
        if not cap.isOpened():
            raise ValueError(f"Failed to open video source: {self.video_path}")

        video_fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        frame_skip = self.FRAME_SKIP

        print(f"Video opened successfully. FPS: {video_fps}, Frame skip: {frame_skip}")
        print("Starting Live Occupancy Analysis with Direct Seat Detection...")
        print(f"Using model: runs/detect/train-6/weights/best.pt")
        print(f"Video path: {self.video_path}")

        frame_count = 0

        while True:  # Loop indefinitely for live simulation
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)  # Reset video to loop it

            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break

                frame_count += 1
                if frame_count % frame_skip != 0:
                    continue

                # Run YOLO detection
                results = self.model(frame, conf=self.CONFIDENCE_THRESHOLD, verbose=False)

                occupied_count = 0
                empty_count = 0

                if results[0].boxes is not None:
                    for box in results[0].boxes:
                        cls_id = int(box.cls[0])
                        cls_name = self.model.names[cls_id]

                        if cls_name == "occupied_seat":
                            occupied_count += 1
                        elif cls_name == "empty_seat":
                            empty_count += 1

                print(f"Frame {frame_count}: Occupied: {occupied_count}, Empty: {empty_count}")

                # Update latest counts
                self.latest_occupied = occupied_count
                self.latest_empty = empty_count

                # Generate and save the annotated image
                annotated_frame = results[0].plot(
                    line_width=2,
                    font_size=0.5,
                    conf=False
                )
                cv2.imwrite(self.output_image_path, annotated_frame)
                print(f"Saved status image to {self.output_image_path}")

        cap.release()
        print("Live analysis stopped.")

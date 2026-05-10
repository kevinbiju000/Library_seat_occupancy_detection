from glob import glob
from pathlib import Path


def resolve_model_path(model_path: str) -> str:
    """Resolve a model path with optional glob patterns to a concrete file path."""
    if any(char in model_path for char in "*?[]"):
        matches = sorted(glob(model_path, recursive=True))
        if not matches:
            raise FileNotFoundError(
                f"Model weights not found for pattern: {model_path}"
            )
        # Prefer the most recently modified weights file when multiple matches exist.
        matches.sort(key=lambda item: Path(item).stat().st_mtime, reverse=True)
        return str(Path(matches[0]).resolve())
    return str(Path(model_path).resolve())

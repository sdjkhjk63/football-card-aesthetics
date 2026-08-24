from pathlib import Path

import cv2
import numpy as np


PROJECT_ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = PROJECT_ROOT.parents[1] / "inception-ucc-2025-26-images"
OUTPUT_ROOT = PROJECT_ROOT / "public" / "images" / "topps-inception-ucc-2025-26" / "cards"

# Source filename, output slug, source corners (TL, TR, BR, BL), rectified size.
ASSETS = [
    ("01-base-first-xi-yamal-purple-25.webp", "first-xi", [(130, 137), (1082, 138), (1081, 1419), (165, 1419)], (750, 1050)),
    ("02-base-emerging-stars-jobe-bellingham-yellow-150.webp", "emerging-stars", [(300, 215), (925, 215), (925, 1080), (300, 1080)], (750, 1050)),
    ("03-base-succession-rodrigo-mora-purple-25.webp", "succession", [(285, 382), (913, 396), (969, 1240), (246, 1231)], (750, 1050)),
    ("04-base-showman-kvaratskhelia-purple-25.webp", "showman", [(136, 190), (1030, 190), (1080, 1483), (100, 1485)], (750, 1050)),
    ("05-base-star-quality-salah-red-10.webp", "star-quality", [(132, 179), (1068, 165), (1093, 1479), (142, 1482)], (750, 1050)),
    ("06-base-superior-legends-hegerberg-purple-25.webp", "superior-legends", [(128, 122), (999, 122), (999, 1365), (128, 1365)], (750, 1050)),
    ("07-base-worldwide-ronaldo-green-99.webp", "worldwide", [(49, 145), (845, 147), (849, 1240), (48, 1238)], (750, 1050)),
    ("08-insert-dark-flow-ronaldinho-gold-1of1.webp", "dark-flow", [(187, 242), (944, 245), (941, 1315), (174, 1313)], (750, 1050)),
    ("09-auto-first-xi-vitinha-purple-25.webp", "first-xi-autographs", [(98, 112), (1068, 114), (1068, 1490), (97, 1490)], (750, 1050)),
    ("10-auto-emerging-stars-max-dowman-red-10.webp", "emerging-stars-autographs", [(211, 245), (971, 244), (971, 1327), (211, 1329)], (750, 1050)),
    ("11-auto-succession-ibrahim-mbaye-orange-5.webp", "succession-autographs", [(176, 185), (1040, 184), (1008, 1318), (218, 1318)], (750, 1050)),
    ("12-auto-showman-eberechi-eze-purple-25.webp", "showman-autographs", [(139, 137), (810, 146), (803, 992), (154, 991)], (750, 1050)),
    ("13-auto-star-quality-zubimendi-red-10.webp", "star-quality-autographs", [(84, 67), (1123, 67), (1122, 1513), (80, 1510)], (750, 1050)),
    ("14-auto-superior-legends-caroline-graham-hansen.webp", "superior-legends-autographs", [(172, 175), (990, 175), (990, 1319), (172, 1319)], (750, 1050)),
    ("15-auto-worldwide-rafael-marquez-purple-25.webp", "worldwide-autographs", [(243, 280), (846, 302), (846, 1182), (191, 1182)], (750, 1050)),
    ("16-auto-dawn-of-greatness-fernando-torres-red-10.webp", "dawn-of-greatness-autographs", [(65, 42), (1098, 43), (1097, 1515), (66, 1513)], (750, 1050)),
    ("23-relic-inception-patch-oscar-bobb-red-10.webp", "inception-patch", [(184, 239), (1037, 245), (1024, 1287), (188, 1287)], (750, 1050)),
    ("24-relic-match-day-memories-dida-red-10.webp", "match-day-memories-relic", [(257, 208), (1013, 207), (1000, 1278), (254, 1278)], (750, 1050)),
    ("25-relic-uwcl-goal-net-stina-blackstenius-1of1.webp", "uwcl-final-goal-net-relic", [(16, 34), (741, 34), (742, 1023), (17, 1023)], (750, 1050)),
    ("27-auto-relic-inception-patch-vlahovic-purple-25.webp", "inception-autograph-patch", [(388, 553), (1419, 570), (1418, 1275), (384, 1272)], (1050, 750)),
    ("29-auto-relic-match-day-memories-de-bruyne-red-10.webp", "match-day-memories-autograph-relic", [(182, 475), (1007, 461), (1000, 1050), (185, 1052)], (1050, 750)),
    ("33-auto-relic-dual-patch-book-putellas-bonmati-orange-5.webp", "dual-autograph-patch-book", [(112, 290), (1460, 260), (1444, 825), (120, 890)], (1500, 600)),
]


def fit_canvas(image: np.ndarray, canvas_size: tuple[int, int]) -> np.ndarray:
    canvas_width, canvas_height = canvas_size
    height, width = image.shape[:2]
    scale = min(canvas_width / width, canvas_height / height)
    resized = cv2.resize(image, (round(width * scale), round(height * scale)), interpolation=cv2.INTER_LANCZOS4)
    canvas = np.full((canvas_height, canvas_width, 3), (34, 24, 20), dtype=np.uint8)
    y = (canvas_height - resized.shape[0]) // 2
    x = (canvas_width - resized.shape[1]) // 2
    canvas[y:y + resized.shape[0], x:x + resized.shape[1]] = resized
    return canvas


def rectify(source_path: Path, corners: list[tuple[int, int]], rectified_size: tuple[int, int]) -> np.ndarray:
    image = cv2.imread(str(source_path), cv2.IMREAD_COLOR)
    if image is None:
        raise RuntimeError(f"Unable to read {source_path}")
    width, height = rectified_size
    source = np.float32(corners)
    destination = np.float32([(0, 0), (width - 1, 0), (width - 1, height - 1), (0, height - 1)])
    matrix = cv2.getPerspectiveTransform(source, destination)
    return cv2.warpPerspective(image, matrix, (width, height), flags=cv2.INTER_LANCZOS4)


OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
for source_name, slug, corners, rectified_size in ASSETS:
    rectified = rectify(SOURCE_ROOT / source_name, corners, rectified_size)
    canvas_size = (1050, 750) if rectified_size[0] > rectified_size[1] else (750, 1050)
    output = fit_canvas(rectified, canvas_size)
    output_path = OUTPUT_ROOT / f"{slug}.webp"
    if not cv2.imwrite(str(output_path), output, [cv2.IMWRITE_WEBP_QUALITY, 92]):
        raise RuntimeError(f"Unable to write {output_path}")
    print(f"Rectified {slug} -> {canvas_size[0]}x{canvas_size[1]}")

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageOps


PROJECT_ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = PROJECT_ROOT.parents[1] / "research" / "topps-deco-ucc-2025-26" / "images"
OUTPUT_ROOT = PROJECT_ROOT / "public" / "images" / "topps-deco-ucc-2025-26" / "cards"

# Source filename, output slug, physical card corners (TL, TR, BR, BL), output size.
# These six marketplace photos need projective correction; an axis-aligned crop
# leaves the printed card frame visibly skewed or includes the holder/background.
ASSETS = [
    (
        "04-then-now-yamal-ronaldinho.jpg",
        "then-and-now",
        [(190, 82), (819, 84), (878, 986), (135, 985)],
        (750, 1050),
    ),
    (
        "08-lnouvel-esprit-rio-ngumoha.jpg",
        "l-nouvel-esprit",
        [(299, 356), (1099, 357), (1038, 1415), (317, 1415)],
        (750, 1050),
    ),
    (
        "09-joueur-emblematique-baggio.webp",
        "joueur-emblematique",
        [(48, 48), (836, 47), (838, 1149), (50, 1151)],
        (750, 1050),
    ),
    (
        "11-cubist-messi-front-1.webp",
        "cubist",
        [(155, 26), (1450, 25), (1325, 1582), (307, 1582)],
        (750, 1050),
    ),
    (
        "18-dual-auto-musiala-luis-diaz.webp",
        "dual-autographs",
        [(91, 517), (758, 518), (762, 993), (92, 993)],
        (1050, 750),
    ),
    (
        "22-prodigy-auto-reigan-heskey.png",
        "prodigy-autographs",
        [(222, 46), (789, 47), (823, 891), (208, 891)],
        (750, 1050),
    ),
]


def perspective_coefficients(
    output_corners: list[tuple[float, float]],
    source_corners: list[tuple[float, float]],
) -> tuple[float, ...]:
    matrix = []
    targets = []
    for (output_x, output_y), (source_x, source_y) in zip(output_corners, source_corners):
        matrix.append([
            output_x,
            output_y,
            1,
            0,
            0,
            0,
            -source_x * output_x,
            -source_x * output_y,
        ])
        targets.append(source_x)
        matrix.append([
            0,
            0,
            0,
            output_x,
            output_y,
            1,
            -source_y * output_x,
            -source_y * output_y,
        ])
        targets.append(source_y)
    return tuple(np.linalg.solve(np.asarray(matrix), np.asarray(targets)))


def rectify(
    source_path: Path,
    source_corners: list[tuple[int, int]],
    output_size: tuple[int, int],
) -> Image.Image:
    width, height = output_size
    output_corners = [(0, 0), (width - 1, 0), (width - 1, height - 1), (0, height - 1)]
    coefficients = perspective_coefficients(output_corners, source_corners)
    with Image.open(source_path) as source:
        source = ImageOps.exif_transpose(source).convert("RGB")
        return source.transform(
            output_size,
            Image.Transform.PERSPECTIVE,
            coefficients,
            resample=Image.Resampling.BICUBIC,
        ).filter(ImageFilter.UnsharpMask(radius=0.55, percent=45, threshold=3))


OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
for source_name, slug, corners, output_size in ASSETS:
    output = rectify(SOURCE_ROOT / source_name, corners, output_size)
    output_path = OUTPUT_ROOT / f"{slug}.webp"
    output.save(output_path, "WEBP", quality=92, method=6)
    print(f"Rectified {slug} ({output_size[0]}x{output_size[1]})")

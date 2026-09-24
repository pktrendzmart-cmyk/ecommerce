from pathlib import Path
from PIL import Image

sources = [
    (r"C:\Users\USER\AppData\Local\Temp\codex-clipboard-8ab66d61-2509-47b9-a5d6-061a3ce576b3.png", "vintage-t9-trimmer.jpg", (0, 0, 299, 325)),
    (r"C:\Users\USER\AppData\Local\Temp\codex-clipboard-884360d1-a636-4f66-bbde-6e83e4445dee.png", "electric-water-blaster.jpg", (0, 0, 295, 291)),
    (r"C:\Users\USER\AppData\Local\Temp\codex-clipboard-13cac7be-182b-4a3a-959e-dbcecb100e4a.png", "dancing-cactus.jpg", (0, 32, 383, 419)),
    (r"C:\Users\USER\AppData\Local\Temp\codex-clipboard-32d83ed7-2cff-46de-a75b-0b5264ccf082.png", "blackhead-remover.jpg", (0, 0, 293, 287)),
    (r"C:\Users\USER\AppData\Local\Temp\codex-clipboard-bc5ab847-470c-4b70-a935-2126b610ee5c.png", "nova-styler.jpg", (0, 0, 390, 398)),
    (r"C:\Users\USER\AppData\Local\Temp\codex-clipboard-5ee7b00f-2a02-4683-a8de-4c182fc5275e.png", "straightener-brush.jpg", (0, 0, 294, 294)),
]

out = Path("public/imported/ad-products")
out.mkdir(parents=True, exist_ok=True)
for source, name, box in sources:
    image = Image.open(source).convert("RGB").crop(box)
    image.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
    image.save(out / name, quality=92, optimize=True)
print(f"Prepared {len(sources)} product images")

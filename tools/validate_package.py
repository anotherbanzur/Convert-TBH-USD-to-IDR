import json
import sys
import zipfile
from io import BytesIO
from pathlib import Path

from PIL import Image


REQUIRED_FILES = {
    "manifest.json",
    "background.js",
    "content.js",
    "popup.html",
    "popup.css",
    "popup.js",
    "icons/icon16.png",
    "icons/icon32.png",
    "icons/icon48.png",
    "icons/icon128.png",
}


def main() -> int:
    package = Path(sys.argv[1])
    errors: list[str] = []

    with zipfile.ZipFile(package) as archive:
        names = {name.replace("\\", "/") for name in archive.namelist()}
        missing = REQUIRED_FILES - names
        if missing:
            errors.append(f"File wajib tidak ada: {sorted(missing)}")

        manifest = json.loads(archive.read("manifest.json"))
        if manifest.get("manifest_version") != 3:
            errors.append("manifest_version harus bernilai 3")
        if not manifest.get("name") or not manifest.get("version"):
            errors.append("Nama atau versi manifest kosong")

        for size in (16, 32, 48, 128):
            filename = f"icons/icon{size}.png"
            with Image.open(BytesIO(archive.read(filename))) as image:
                if image.format != "PNG":
                    errors.append(f"{filename} bukan PNG")
                if image.size != (size, size):
                    errors.append(
                        f"{filename} berukuran {image.size}, seharusnya {(size, size)}"
                    )

    if errors:
        for error in errors:
            print(f"GAGAL: {error}")
        return 1

    print(f"VALID: {package}")
    print(f"File paket: {len(names)}")
    print("Manifest V3 dan seluruh ukuran ikon valid.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

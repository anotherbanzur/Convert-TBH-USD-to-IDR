from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ICONS = ROOT / "icons"
STORE = ROOT / "store-assets"

BG = "#111318"
PANEL = "#191d24"
PANEL_2 = "#222832"
GREEN = "#55d994"
GREEN_DARK = "#173a2a"
WHITE = "#f5f7f8"
MUTED = "#949ca8"
YELLOW = "#f2b866"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    name = "arialbd.ttf" if bold else "arial.ttf"
    path = Path("C:/Windows/Fonts") / name
    return ImageFont.truetype(str(path), size)


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius, fill=fill, outline=outline, width=width)


def make_icon(size: int) -> None:
    scale = 4
    canvas = Image.new("RGBA", (size * scale, size * scale), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    pad = max(1, round(size * 0.125)) * scale
    rounded(
        draw,
        (pad, pad, size * scale - pad, size * scale - pad),
        round(size * 0.20) * scale,
        GREEN_DARK,
        "#32875e",
        max(scale, round(size * 0.025) * scale),
    )

    if size >= 32:
        label = "Rp"
        label_font = font(round(size * 0.31) * scale, True)
    else:
        label = "R"
        label_font = font(round(size * 0.45) * scale, True)

    bounds = draw.textbbox((0, 0), label, font=label_font)
    x = (size * scale - (bounds[2] - bounds[0])) / 2
    y = (size * scale - (bounds[3] - bounds[1])) / 2 - bounds[1]
    draw.text((x, y), label, font=label_font, fill=GREEN)

    canvas.resize((size, size), Image.Resampling.LANCZOS).save(
        ICONS / f"icon{size}.png", optimize=True
    )


def draw_logo(draw, x, y, size):
    rounded(draw, (x, y, x + size, y + size), size // 5, GREEN_DARK, "#32875e", 2)
    label_font = font(size // 3, True)
    text = "Rp"
    bounds = draw.textbbox((0, 0), text, font=label_font)
    tx = x + (size - (bounds[2] - bounds[0])) / 2
    ty = y + (size - (bounds[3] - bounds[1])) / 2 - bounds[1]
    draw.text((tx, ty), text, font=label_font, fill=GREEN)


def make_screenshot() -> None:
    image = Image.new("RGB", (1280, 800), BG)
    draw = ImageDraw.Draw(image)

    draw.ellipse((875, -280, 1450, 295), fill="#14271f")
    draw.text((70, 70), "Harga Taskbar Hero,", font=font(48, True), fill=WHITE)
    draw.text((70, 126), "langsung dalam Rupiah.", font=font(48, True), fill=GREEN)
    draw.text(
        (72, 198),
        "Konversi otomatis USD ke IDR di halaman Market Wiki.",
        font=font(20),
        fill=MUTED,
    )

    # Mock halaman Market untuk menunjukkan hasil nyata dari fungsi ekstensi.
    rounded(draw, (70, 282, 765, 704), 22, "#151820", "#2a3039", 2)
    draw.text((104, 314), "TASKBAR HERO WIKI  /  MARKET", font=font(14, True), fill=MUTED)
    draw.text((104, 360), "Ethereal Amulet", font=font(29, True), fill=WHITE)
    draw.text((104, 407), "BEYOND  ·  GEAR", font=font(13, True), fill="#a985ff")

    cards = [
        ("LOWEST ASK", "Rp275.893"),
        ("MEDIAN", "Rp263.571"),
        ("BEST BID", "Rp99.308"),
        ("SPREAD", "Rp176.585"),
    ]
    for index, (label, value) in enumerate(cards):
        col = index % 2
        row = index // 2
        x = 104 + col * 314
        y = 462 + row * 100
        rounded(draw, (x, y, x + 284, y + 78), 12, PANEL, "#2b313a")
        draw.text((x + 16, y + 14), label, font=font(11, True), fill=MUTED)
        draw.text((x + 16, y + 35), value, font=font(20, True), fill=GREEN)

    # Popup ekstensi.
    rounded(draw, (835, 242, 1195, 720), 20, "#12151a", "#313741", 2)
    draw_logo(draw, 865, 270, 52)
    draw.text((934, 275), "TBH USD ke IDR", font=font(18, True), fill=WHITE)
    draw.text((934, 300), "Konverter harga Wiki", font=font(11), fill=MUTED)

    rounded(draw, (865, 346, 1165, 416), 12, PANEL, "#2c323b")
    draw.text((883, 363), "Aktifkan konversi", font=font(13, True), fill=WHITE)
    draw.text((883, 386), "Ubah harga dolar pada wiki", font=font(10), fill=MUTED)
    rounded(draw, (1108, 367, 1148, 391), 12, GREEN)
    draw.ellipse((1127, 370, 1145, 388), fill=WHITE)

    draw.text((865, 445), "SUMBER KURS", font=font(10, True), fill=MUTED)
    rounded(draw, (865, 466, 1165, 510), 10, "#0e1115")
    rounded(draw, (869, 470, 1014, 506), 8, PANEL_2)
    draw.text((909, 481), "Otomatis", font=font(11, True), fill=WHITE)
    draw.text((1060, 481), "Manual", font=font(11, True), fill=MUTED)

    rounded(draw, (865, 530, 1165, 604), 10, "#0e1115")
    draw.text((882, 545), "Kurs yang digunakan", font=font(10), fill=MUTED)
    draw.text((882, 568), "Diperbarui hari ini", font=font(10), fill=MUTED)
    draw.text((1043, 555), "Rp17.857", font=font(14, True), fill=GREEN)

    rounded(draw, (865, 624, 1165, 668), 9, PANEL_2, "#363d47")
    button = "Perbarui kurs sekarang"
    bounds = draw.textbbox((0, 0), button, font=font(11, True))
    draw.text((1015 - (bounds[2] - bounds[0]) / 2, 639), button, font=font(11, True), fill=WHITE)

    image.save(STORE / "screenshot-1280x800.png", optimize=True)


def make_promo() -> None:
    image = Image.new("RGB", (440, 280), BG)
    draw = ImageDraw.Draw(image)
    draw.ellipse((285, -140, 560, 135), fill="#163426")
    draw_logo(draw, 35, 34, 58)
    draw.text((35, 116), "USD  →  IDR", font=font(35, True), fill=GREEN)
    draw.text((35, 163), "Harga Taskbar Hero", font=font(23, True), fill=WHITE)
    draw.text((35, 195), "langsung dalam Rupiah", font=font(17), fill=MUTED)
    rounded(draw, (294, 155, 406, 220), 12, PANEL, "#35403b", 2)
    draw.text((311, 170), "$15.45", font=font(13), fill=MUTED)
    draw.text((311, 192), "Rp275.893", font=font(15, True), fill=GREEN)
    image.save(STORE / "promo-440x280.png", optimize=True)


def main() -> None:
    ICONS.mkdir(exist_ok=True)
    STORE.mkdir(exist_ok=True)
    for size in (16, 32, 48, 128):
        make_icon(size)
    make_screenshot()
    make_promo()


if __name__ == "__main__":
    main()

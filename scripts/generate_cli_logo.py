from __future__ import annotations

import argparse
import math
from pathlib import Path
from xml.sax.saxutils import escape

ART_LINES = [
    '█████╗ ███╗   ██╗██╗    ██╗███████╗',
    '██╔══██╗████╗  ██║██║    ██║██╔════╝',
    '███████║██╔██╗ ██║██║ █╗ ██║███████╗',
    '██╔══██║██║╚██╗██║██║███╗██║╚════██║',
    '██║  ██║██║ ╚████║╚███╔███╔╝███████║',
    '╚═╝  ╚═╝╚═╝  ╚═══╝ ╚══╝╚══╝ ╚══════╝',
]
TAGLINE = '‹ Axiom · Nexus · Weave · Sovereignty ›'

PALETTE_DEEP = (31, 34, 38)
PALETTE_BRAND = (127, 181, 182)
PALETTE_MUTED = (159, 166, 174)
PALETTE_INK = (242, 244, 246)
PALETTE_FROST = (242, 244, 246)


def mix_rgb(start: tuple[int, int, int], end: tuple[int, int, int], ratio: float) -> tuple[int, int, int]:
    ratio = max(0.0, min(1.0, ratio))
    return tuple(round(start[index] + (end[index] - start[index]) * ratio) for index in range(3))


def mix_stops(stops: list[tuple[int, int, int]], ratio: float) -> tuple[int, int, int]:
    if not stops:
        return (255, 255, 255)
    if len(stops) == 1:
        return stops[0]
    ratio = max(0.0, min(1.0, ratio))
    scaled = ratio * (len(stops) - 1)
    left_index = math.floor(scaled)
    right_index = min(len(stops) - 1, left_index + 1)
    local_ratio = scaled - left_index
    return mix_rgb(stops[left_index], stops[right_index], local_ratio)


def rgb_to_hex(rgb: tuple[int, int, int]) -> str:
    return '#%02x%02x%02x' % rgb


def char_fill(char: str, index: int, length: int, row_index: int, row_count: int) -> str:
    if char == ' ':
        return 'transparent'
    row_ratio = 0.0 if row_count <= 1 else row_index / (row_count - 1)
    softened_top = math.pow(row_ratio, 1.12)
    row_base = mix_stops([PALETTE_DEEP, PALETTE_BRAND, PALETTE_MUTED, PALETTE_INK], 0.08 + softened_top * 0.8)
    center = length / 2
    distance = abs(index - center) / max(1.0, center)
    highlight = max(0.0, 1.0 - distance)
    horizontal_ratio = 0.0 if length <= 1 else index / (length - 1)
    sweep = mix_stops([PALETTE_DEEP, PALETTE_BRAND, PALETTE_FROST, PALETTE_MUTED, PALETTE_INK], horizontal_ratio)
    brand_lift = mix_rgb(row_base, PALETTE_BRAND, 0.14 + highlight * 0.16)
    cooled = mix_rgb(brand_lift, sweep, 0.4 + highlight * 0.18)
    lower_glow = max(0.0, row_ratio - 0.58) / 0.42
    tone = mix_rgb(cooled, PALETTE_INK, 0.02 + highlight * 0.16 + lower_glow * 0.16)
    return rgb_to_hex(tone)


def tagline_fill(index: int, length: int) -> str:
    ratio = 0.0 if length <= 1 else index / (length - 1)
    wave = abs(ratio - 0.5) * 2
    base = mix_stops([PALETTE_DEEP, PALETTE_BRAND, PALETTE_MUTED, PALETTE_INK], ratio)
    tone = mix_rgb(base, PALETTE_INK, 0.08 + (1 - wave) * 0.18)
    return rgb_to_hex(tone)


def build_svg(include_tagline: bool = False) -> str:
    art_font_size = 28
    tagline_font_size = 15
    char_advance = 16.4
    art_line_height = 37
    left_padding = 28
    top_padding = 28
    gap_after_art = 18 if include_tagline else 0
    bottom_padding = 28
    width = int(left_padding * 2 + max(len(line) for line in ART_LINES) * char_advance)
    height = int(top_padding + len(ART_LINES) * art_line_height + (tagline_font_size if include_tagline else 0) + gap_after_art + bottom_padding)

    elements: list[str] = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" fill="none">',
        '<defs>',
        '<style>',
        '.art{font-family:"JetBrains Mono","SFMono-Regular",Menlo,Consolas,monospace;font-weight:700;dominant-baseline:hanging;}',
        '.tag{font-family:"Inter","Segoe UI",Arial,sans-serif;font-weight:500;letter-spacing:0.18em;dominant-baseline:hanging;}',
        '</style>',
        '</defs>',
    ]

    for row_index, line in enumerate(ART_LINES):
        y = top_padding + row_index * art_line_height
        for char_index, char in enumerate(line):
            if char == ' ':
                continue
            x = left_padding + char_index * char_advance
            fill = char_fill(char, char_index, len(line), row_index, len(ART_LINES))
            elements.append(
                f'<text class="art" x="{x:.1f}" y="{y:.1f}" font-size="{art_font_size}" fill="{fill}">{escape(char)}</text>'
            )

    if include_tagline:
        tagline_y = top_padding + len(ART_LINES) * art_line_height + gap_after_art
        tagline_length = len(TAGLINE)
        tagline_start = (width - tagline_length * 8.4) / 2
        for index, char in enumerate(TAGLINE):
            if char == ' ':
                continue
            x = tagline_start + index * 8.4
            fill = tagline_fill(index, tagline_length)
            elements.append(
                f'<text class="tag" x="{x:.1f}" y="{tagline_y:.1f}" font-size="{tagline_font_size}" fill="{fill}">{escape(char)}</text>'
            )

    elements.append('</svg>')
    return '\n'.join(elements) + '\n'


def write_svg(output_path: Path, include_tagline: bool = False) -> Path:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(build_svg(include_tagline=include_tagline), encoding='utf-8')
    return output_path


def write_png(svg_path: Path, png_path: Path, include_tagline: bool = False) -> Path:
    try:
        from PIL import Image, ImageDraw, ImageFont  # type: ignore
    except Exception as error:
        raise RuntimeError('PNG export requires Pillow. Install it with: pip install pillow') from error

    def load_font(size: int, mono: bool) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
        candidates = (
            ['JetBrainsMono-Bold.ttf', 'DejaVuSansMono.ttf', 'Consola.ttf', 'courbd.ttf']
            if mono
            else ['Inter-Medium.ttf', 'SegoeUI.ttf', 'arial.ttf', 'DejaVuSans.ttf']
        )
        for candidate in candidates:
            try:
                return ImageFont.truetype(candidate, size=size)
            except Exception:
                continue
        return ImageFont.load_default()

    art_font = load_font(34, mono=True)
    tag_font = load_font(18, mono=False)
    char_advance = 19
    art_line_height = 42
    left_padding = 30
    top_padding = 26
    gap_after_art = 18 if include_tagline else 0
    bottom_padding = 30
    width = left_padding * 2 + max(len(line) for line in ART_LINES) * char_advance
    height = top_padding + len(ART_LINES) * art_line_height + gap_after_art + (28 if include_tagline else 0) + bottom_padding

    image = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    for row_index, line in enumerate(ART_LINES):
        y = top_padding + row_index * art_line_height
        for char_index, char in enumerate(line):
            if char == ' ':
                continue
            x = left_padding + char_index * char_advance
            fill = char_fill(char, char_index, len(line), row_index, len(ART_LINES))
            draw.text((x, y), char, font=art_font, fill=fill)

    if include_tagline:
        tagline_char_advance = 9.2
        tagline_width = int(len(TAGLINE) * tagline_char_advance)
        tagline_start_x = int((width - tagline_width) / 2)
        tagline_y = top_padding + len(ART_LINES) * art_line_height + gap_after_art
        for index, char in enumerate(TAGLINE):
            if char == ' ':
                continue
            x = int(tagline_start_x + index * tagline_char_advance)
            fill = tagline_fill(index, len(TAGLINE))
            draw.text((x, tagline_y), char, font=tag_font, fill=fill)

    png_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(png_path)
    return png_path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--svg', default='assets/logo-cli.svg')
    parser.add_argument('--png', default='')
    parser.add_argument('--include-tagline', action='store_true')
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    svg_path = root / args.svg
    write_svg(svg_path, include_tagline=args.include_tagline)
    print(f'SVG written to {svg_path}')

    if args.png:
        png_path = root / args.png
        write_png(svg_path, png_path, include_tagline=args.include_tagline)
        print(f'PNG written to {png_path}')

    return 0


if __name__ == '__main__':
    raise SystemExit(main())

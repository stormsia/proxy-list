import math
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_og_image(output_path="web/public/og-image.png"):
    SCALE = 2
    W = 1200 * SCALE
    H = 630 * SCALE

    img = Image.new("RGBA", (W, H), (9, 13, 22, 255))
    draw = ImageDraw.Draw(img)

    # 1. High-Tech Grid Background
    grid_step = 48 * SCALE
    grid_color = (255, 255, 255, 7)
    for x in range(0, W, grid_step):
        draw.line([(x, 0), (x, H)], fill=grid_color, width=1 * SCALE)
    for y in range(0, H, grid_step):
        draw.line([(0, y), (W, y)], fill=grid_color, width=1 * SCALE)

    # 2. Smooth Radial Glows
    glow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)

    # Top-center emerald glow
    cx1, cy1 = int(W * 0.45), int(H * 0.35)
    r_max1 = int(520 * SCALE)
    for r in range(r_max1, 0, -8 * SCALE):
        alpha = int(45 * (1 - r / r_max1) ** 2)
        glow_draw.ellipse(
            [(cx1 - r, cy1 - int(r * 0.6)), (cx1 + r, cy1 + int(r * 0.6))],
            fill=(16, 185, 129, alpha),
        )

    # Bottom-right cyan glow
    cx2, cy2 = int(W * 0.85), int(H * 0.75)
    r_max2 = int(420 * SCALE)
    for r in range(r_max2, 0, -10 * SCALE):
        alpha = int(32 * (1 - r / r_max2) ** 2)
        glow_draw.ellipse(
            [(cx2 - r, cy2 - int(r * 0.55)), (cx2 + r, cy2 + int(r * 0.55))],
            fill=(6, 182, 212, alpha),
        )

    # Top-right subtle purple ambient
    cx3, cy3 = int(W * 0.9), int(H * 0.15)
    r_max3 = int(300 * SCALE)
    for r in range(r_max3, 0, -10 * SCALE):
        alpha = int(22 * (1 - r / r_max3) ** 2)
        glow_draw.ellipse(
            [(cx3 - r, cy3 - int(r * 0.5)), (cx3 + r, cy3 + int(r * 0.5))],
            fill=(139, 92, 246, alpha),
        )

    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(18 * SCALE))
    img = Image.alpha_composite(img, glow_layer)
    draw = ImageDraw.Draw(img)

    # 3. Outer Card Container
    mx = 32 * SCALE
    my = 26 * SCALE
    card_w = W - 2 * mx
    card_h = H - 2 * my
    corner_r = 24 * SCALE

    draw.rounded_rectangle(
        [mx, my, mx + card_w, my + card_h],
        radius=corner_r,
        fill=(13, 19, 33, 235),
        outline=(30, 41, 59, 255),
        width=int(1.5 * SCALE),
    )

    # Neon Emerald Top Border Accent
    neon_w = int(540 * SCALE)
    neon_x1 = mx + (card_w - neon_w) // 2
    draw.line(
        [(neon_x1, my), (neon_x1 + neon_w, my)],
        fill=(16, 185, 129, 230),
        width=int(2.5 * SCALE),
    )

    # 4. Fonts (Standard Windows Fonts - ASCII safe)
    font_bold_path = "C:/Windows/Fonts/segoeuib.ttf"
    font_regular_path = "C:/Windows/Fonts/segoeui.ttf"
    font_mono_path = "C:/Windows/Fonts/CascadiaCode.ttf"

    font_brand = ImageFont.truetype(font_bold_path, 23 * SCALE)
    font_badge = ImageFont.truetype(font_bold_path, 13 * SCALE)
    font_hero_title = ImageFont.truetype(font_bold_path, 52 * SCALE)
    font_subtitle = ImageFont.truetype(font_regular_path, 22 * SCALE)
    font_tile_label = ImageFont.truetype(font_bold_path, 13 * SCALE)
    font_tile_val = ImageFont.truetype(font_bold_path, 28 * SCALE)
    font_tile_sub = ImageFont.truetype(font_regular_path, 14 * SCALE)
    font_pill_label = ImageFont.truetype(font_bold_path, 13 * SCALE)
    font_code = ImageFont.truetype(font_mono_path, 17 * SCALE)
    font_code_url = ImageFont.truetype(font_mono_path, 15 * SCALE)

    pad_x = mx + 40 * SCALE
    curr_y = my + 30 * SCALE

    # 5. Top Bar: Official Icon + Brand + Tag + Live Badge
    icon_src_path = "web/public/apple-touch-icon.png"
    if os.path.exists(icon_src_path):
        site_icon = Image.open(icon_src_path).convert("RGBA")
        icon_size = 46 * SCALE
        site_icon = site_icon.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
        img.paste(site_icon, (pad_x, curr_y), site_icon)
    else:
        icon_size = 46 * SCALE

    text_x = pad_x + icon_size + 16 * SCALE
    draw.text((text_x, curr_y + 8 * SCALE), "stormsia", fill=(148, 163, 184, 255), font=font_brand)
    w_stormsia = int(draw.textlength("stormsia", font=font_brand))
    draw.text((text_x + w_stormsia + 4 * SCALE, curr_y + 8 * SCALE), "/", fill=(100, 116, 139, 255), font=font_brand)
    w_slash = int(draw.textlength("/", font=font_brand))
    draw.text((text_x + w_stormsia + w_slash + 8 * SCALE, curr_y + 8 * SCALE), "proxy-list", fill=(248, 250, 252, 255), font=font_brand)

    # Version Tag Chip (Pure ASCII)
    w_repo = int(draw.textlength("proxy-list", font=font_brand))
    vtag_x = text_x + w_stormsia + w_slash + w_repo + 20 * SCALE
    vtag_text = "v2026 | OPEN SOURCE"
    vtag_tw = int(draw.textlength(vtag_text, font=font_badge))
    vtag_h = 28 * SCALE
    vtag_w = vtag_tw + 20 * SCALE
    draw.rounded_rectangle(
        [vtag_x, curr_y + 10 * SCALE, vtag_x + vtag_w, curr_y + 10 * SCALE + vtag_h],
        radius=8 * SCALE,
        fill=(16, 185, 129, 25),
        outline=(16, 185, 129, 90),
        width=int(1.2 * SCALE),
    )
    draw.text((vtag_x + 10 * SCALE, curr_y + 14 * SCALE), vtag_text, fill=(52, 211, 153, 255), font=font_badge)

    # Right Side Live Sync Pill (Pure ASCII)
    live_text = "LIVE HYDRA VALIDATION | 60s"
    live_tw = int(draw.textlength(live_text, font=font_badge))
    live_w = live_tw + 44 * SCALE
    live_h = 36 * SCALE
    live_x = mx + card_w - 40 * SCALE - live_w
    live_y = curr_y + 5 * SCALE

    draw.rounded_rectangle(
        [live_x, live_y, live_x + live_w, live_y + live_h],
        radius=18 * SCALE,
        fill=(16, 185, 129, 25),
        outline=(16, 185, 129, 100),
        width=int(1.5 * SCALE),
    )
    dot_cx = live_x + 16 * SCALE
    dot_cy = live_y + live_h // 2
    draw.ellipse(
        [(dot_cx - 5 * SCALE, dot_cy - 5 * SCALE), (dot_cx + 5 * SCALE, dot_cy + 5 * SCALE)],
        fill=(52, 211, 153, 255),
    )
    draw.text((dot_cx + 14 * SCALE, live_y + 9 * SCALE), live_text, fill=(52, 211, 153, 255), font=font_badge)

    # 6. Hero Title & Subtitle
    curr_y += 72 * SCALE
    hero_title_1 = "Free Public Proxy Pool"
    hero_title_2 = " & Realtime API"
    draw.text((pad_x, curr_y), hero_title_1, fill=(255, 255, 255, 255), font=font_hero_title)
    w_ht1 = int(draw.textlength(hero_title_1, font=font_hero_title))
    draw.text((pad_x + w_ht1, curr_y), hero_title_2, fill=(52, 211, 153, 255), font=font_hero_title)

    curr_y += 66 * SCALE
    subtitle_text = "Continuously audited SOCKS5, HTTP, HTTPS & SOCKS4 endpoints verified by Hydra Rust engine."
    draw.text((pad_x, curr_y), subtitle_text, fill=(148, 163, 184, 255), font=font_subtitle)

    # 7. 4 Feature / Metrics Tiles
    curr_y += 48 * SCALE
    tile_w = int((card_w - 80 * SCALE - 3 * 18 * SCALE) / 4)
    tile_h = int(140 * SCALE)
    tile_gap = int(18 * SCALE)

    tiles_data = [
        {
            "tag": "LATENCY",
            "val": "< 280ms",
            "sub": "Sub-second response speed",
            "accent": (234, 179, 8, 255),  # Yellow
            "val_color": (255, 255, 255, 255),
        },
        {
            "tag": "GLOBAL REACH",
            "val": "1,000+ IPs",
            "sub": "Across 190+ sovereign countries",
            "accent": (52, 211, 153, 255),  # Emerald
            "val_color": (255, 255, 255, 255),
        },
        {
            "tag": "PROTOCOLS",
            "val": "SOCKS5 & HTTP",
            "sub": "Elite anonymity & UDP tunnels",
            "accent": (56, 189, 248, 255),  # Cyan
            "val_color": (255, 255, 255, 255),
        },
        {
            "tag": "DEVELOPER API",
            "val": "Zero Auth",
            "sub": "Raw JSON, TXT & llms.txt ready",
            "accent": (168, 85, 247, 255),  # Purple
            "val_color": (52, 211, 153, 255),
        },
    ]

    for i, t in enumerate(tiles_data):
        tx = pad_x + i * (tile_w + tile_gap)
        tile_rect = [tx, curr_y, tx + tile_w, curr_y + tile_h]

        draw.rounded_rectangle(
            tile_rect,
            radius=16 * SCALE,
            fill=(18, 26, 46, 235),
            outline=(30, 41, 59, 255),
            width=int(1.2 * SCALE),
        )

        # Dot + Tag
        dot_x = tx + 18 * SCALE
        dot_y = curr_y + 22 * SCALE
        draw.ellipse(
            [(dot_x - 4 * SCALE, dot_y - 4 * SCALE), (dot_x + 4 * SCALE, dot_y + 4 * SCALE)],
            fill=t["accent"],
        )
        draw.text(
            (dot_x + 10 * SCALE, curr_y + 14 * SCALE),
            t["tag"],
            fill=(100, 116, 139, 255),
            font=font_tile_label,
        )

        # Main Value
        draw.text(
            (tx + 18 * SCALE, curr_y + 46 * SCALE),
            t["val"],
            fill=t["val_color"],
            font=font_tile_val,
        )

        # Subtext
        draw.text(
            (tx + 18 * SCALE, curr_y + 96 * SCALE),
            t["sub"],
            fill=(148, 163, 184, 255),
            font=font_tile_sub,
        )

    # 8. Feature Tags Strip (No emojis, sleek colored mini-dot bullets)
    curr_y += tile_h + 20 * SCALE
    strip_h = int(38 * SCALE)
    strip_tags = [
        {"name": "Sub-second RTT", "color": (234, 179, 8, 255)},
        {"name": "Multi-Protocol", "color": (56, 189, 248, 255)},
        {"name": "Datacenter & Residential", "color": (168, 85, 247, 255)},
        {"name": "AI Agent Ready (llms.txt)", "color": (52, 211, 153, 255)},
        {"name": "Automated 60s Recheck", "color": (16, 185, 129, 255)},
        {"name": "10 Global Locales", "color": (148, 163, 184, 255)},
    ]

    tag_x = pad_x
    for tag_item in strip_tags:
        tname = tag_item["name"]
        tw = int(draw.textlength(tname, font=font_pill_label))
        tag_w = tw + 32 * SCALE
        draw.rounded_rectangle(
            [tag_x, curr_y, tag_x + tag_w, curr_y + strip_h],
            radius=10 * SCALE,
            fill=(22, 32, 54, 235),
            outline=(39, 53, 79, 255),
            width=int(1 * SCALE),
        )
        # Bullet dot
        pdot_cx = tag_x + 13 * SCALE
        pdot_cy = curr_y + strip_h // 2
        draw.ellipse(
            [(pdot_cx - 3 * SCALE, pdot_cy - 3 * SCALE), (pdot_cx + 3 * SCALE, pdot_cy + 3 * SCALE)],
            fill=tag_item["color"],
        )
        draw.text((tag_x + 22 * SCALE, curr_y + 9 * SCALE), tname, fill=(203, 213, 225, 255), font=font_pill_label)
        tag_x += tag_w + 12 * SCALE

    # 9. Bottom Terminal / Quickstart Bar
    curr_y += strip_h + 20 * SCALE
    bar_w = card_w - 80 * SCALE
    bar_h = int(64 * SCALE)
    bar_rect = [pad_x, curr_y, pad_x + bar_w, curr_y + bar_h]

    draw.rounded_rectangle(
        bar_rect,
        radius=14 * SCALE,
        fill=(10, 15, 28, 255),
        outline=(30, 41, 59, 255),
        width=int(1.2 * SCALE),
    )

    # Terminal prompt '$'
    draw.text(
        (pad_x + 22 * SCALE, curr_y + 19 * SCALE),
        "$",
        fill=(52, 211, 153, 255),
        font=font_code,
    )
    cmd_text = "curl -x socks5h://IP:PORT https://api.ipify.org?format=json"
    draw.text(
        (pad_x + 44 * SCALE, curr_y + 19 * SCALE),
        cmd_text,
        fill=(226, 232, 240, 255),
        font=font_code,
    )

    # Right side URL pill
    site_url_text = "https://stormsia.github.io/proxy-list  ->"
    url_w = int(draw.textlength(site_url_text, font=font_code_url))
    url_x = pad_x + bar_w - url_w - 22 * SCALE
    draw.text(
        (url_x, curr_y + 20 * SCALE),
        site_url_text,
        fill=(56, 189, 248, 255),
        font=font_code_url,
    )

    # 10. Downsample with LANCZOS to exact 1200x630 RGB PNG
    final_img = img.resize((1200, 630), Image.Resampling.LANCZOS).convert("RGB")
    final_img.save(output_path, "PNG", optimize=True)
    print(f"High-quality OG Image generated at {output_path} (1200x630)")

if __name__ == "__main__":
    create_og_image()

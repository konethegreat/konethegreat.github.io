"""Process Kone's photos into web-ready WebP + tiny blur placeholders.
- blurs the car number plate (privacy)
- crops bystanders out of the graduation photo
Run:  python3 scripts/process_photos.py <src_dir> <out_dir>
"""
import sys, io, json, base64
from PIL import Image, ImageOps, ImageFilter, ImageDraw

src, out = sys.argv[1], sys.argv[2]

def load(name):
    return ImageOps.exif_transpose(Image.open(f"{src}/{name}")).convert("RGB")

def obscure(im, box, block=14, feather=8):
    """Pixelate + blur a region, feathered into the surroundings."""
    x0, y0, x1, y1 = box
    region = im.crop(box)
    w, h = region.size
    small = region.resize((max(1, w // block), max(1, h // block)), Image.BILINEAR)
    mosaic = small.resize((w, h), Image.NEAREST).filter(ImageFilter.GaussianBlur(5))
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((feather // 2, feather // 2, w - feather // 2, h - feather // 2), radius=feather, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(feather / 2))
    im.paste(mosaic, (x0, y0), mask)
    return im

def save_sizes(im, slug, widths, quality=80):
    meta = {"slug": slug, "w": im.width, "h": im.height, "files": []}
    for w in widths:
        if w > im.width:
            w = im.width
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        fn = f"{slug}-{w}.webp"
        r.save(f"{out}/{fn}", "WEBP", quality=quality, method=6)
        meta["files"].append({"file": fn, "w": w, "h": h})
    # tiny blur placeholder
    t = im.copy(); t.thumbnail((24, 24))
    buf = io.BytesIO(); t.save(buf, "WEBP", quality=40)
    meta["lqip"] = "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()
    meta["ratio"] = round(im.width / im.height, 4)
    return meta

metas = {}

# Hero portrait + alternate portrait (navy blazer)
metas["portrait"] = save_sizes(load("Media (3).jpg"), "portrait", [640, 1000], 82)
metas["portrait-alt"] = save_sizes(load("Media (2).jpg"), "portrait-alt", [640, 1000], 82)

# Convention "cover star"
metas["convention"] = save_sizes(load("Media.jpg"), "convention", [640, 1000], 82)

# Graduation: crop bystanders out (full-body, tall crop)
g = load("Media (5).jpg")
g = g.crop((169, 356, 882, 1628))
metas["graduation"] = save_sizes(g, "graduation", [640, 900], 82)

# Puppies
metas["pups"] = save_sizes(load("Media (4).jpg"), "pups", [640, 1100], 82)

# Car: blur number plate before anything else
c = load("Media (6).jpg")
c = obscure(c, (610, 692, 706, 746), block=12, feather=10)
metas["car"] = save_sizes(c, "car", [640, 1100], 80)

# Casual selfies
metas["cap"] = save_sizes(load("Media (1).jpg"), "cap", [640, 1100], 80)
metas["jersey"] = save_sizes(load("Media (7).jpg"), "jersey", [640, 900], 80)

with open(f"{out}/_photos.json", "w") as f:
    json.dump(metas, f, indent=1)
for k, v in metas.items():
    print(k, v["w"], v["h"], [x["file"] for x in v["files"]])

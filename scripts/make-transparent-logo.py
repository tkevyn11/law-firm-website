from PIL import Image
import numpy as np
from pathlib import Path

src = Path(r"C:\Users\USER\.cursor\projects\d-law-firm-website\assets")
logo_src = list(src.glob("*ChatGPT_Image_Jul_20*"))[0]
img = Image.open(logo_src).convert("RGBA")
arr = np.array(img)
r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]

mx = np.maximum(np.maximum(r, g), b).astype(np.int16)
mn = np.minimum(np.minimum(r, g), b).astype(np.int16)
sat = mx - mn
val = mx

# Checkerboard: high brightness, low saturation
is_bg = (val >= 180) & (sat <= 35)
is_bg |= (val >= 150) & (sat <= 25)

arr[:, :, 3] = np.where(is_bg, 0, 255).astype(np.uint8)

alpha = arr[:, :, 3]
ys, xs = np.where(alpha > 0)
pad = 8
y0, y1 = max(0, ys.min() - pad), min(arr.shape[0], ys.max() + pad + 1)
x0, x1 = max(0, xs.min() - pad), min(arr.shape[1], xs.max() + pad + 1)
cropped = Image.fromarray(arr[y0:y1, x0:x1], "RGBA")

out = Path(r"D:\law firm website\public\logo.png")
cropped.save(out, "PNG", optimize=True)
cropped.save(Path(r"D:\law firm website\public\favicon.png"), "PNG", optimize=True)
print("saved", out, cropped.size, out.stat().st_size)
print("opaque", int((np.array(cropped)[:, :, 3] > 0).sum()))

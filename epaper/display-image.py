#!/usr/bin/env python3
from PIL import Image, ImageOps
from inky.auto import auto

inky = auto()

PHOTO_PATH = 'react_app_screenshot.png'
BORDER_COLOR = inky.WHITE
RESAMPLING = Image.BICUBIC

image = Image.open(PHOTO_PATH)
resizedimage = ImageOps.pad(image, inky.resolution, RESAMPLING, BORDER_COLOR)
inky.set_image(resizedimage)
inky.set_border(BORDER_COLOR)
inky.show()
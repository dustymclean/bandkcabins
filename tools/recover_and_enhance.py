"""Download public original Wix media and apply restrained photographic enhancements.
Outputs both unaltered originals and edited JPEGs. Nonphotographic artwork is kept original.
"""
import csv, io, os, pathlib, urllib.request, time
from PIL import Image,ImageEnhance,ImageOps,ImageFilter
ROOT=pathlib.Path(__file__).resolve().parents[1]
photos=list(csv.DictReader(open(ROOT/'assets/image-manifest.csv',encoding='utf-8')))
originals=ROOT/'assets'/'originals'; originals.mkdir(exist_ok=True)
processed=ROOT/'assets'/'restored';processed.mkdir(exist_ok=True)
for i,entry in enumerate(photos,1):
 u=entry['source_original_media_url']; stem=entry['asset_id']
 try:
  req=urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0 (compatible; BKCabinsSiteMigration/1.0)'})
  with urllib.request.urlopen(req,timeout=25) as response:
   data=response.read(18_000_000)
  im=Image.open(io.BytesIO(data));im.load();im=ImageOps.exif_transpose(im)
  fmt=im.format or 'JPEG'
  ext='.png' if fmt=='PNG' else '.jpg'
  (originals/(stem+ext)).write_bytes(data)
  if entry['category']=='Guest artwork':
   print('preserved artwork',stem);continue
  rgb=im.convert('RGB')
  # Conservative enhancement: original details retained; no AI-generated replacement elements.
  rgb=ImageEnhance.Color(rgb).enhance(1.07)
  rgb=ImageEnhance.Contrast(rgb).enhance(1.05)
  rgb=ImageEnhance.Sharpness(rgb).enhance(1.15)
  rgb=rgb.filter(ImageFilter.UnsharpMask(radius=1.35,percent=85,threshold=3))
  rgb.save(processed/(stem+'.jpg'),'JPEG',quality=89,optimize=True,progressive=True,subsampling=0)
  print(f'{i}/{len(photos)} saved {stem}: {im.size}')
 except Exception as e:
  print(f'{i}/{len(photos)} WARNING {stem}: {e}')
 time.sleep(.1)

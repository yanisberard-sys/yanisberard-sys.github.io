"""Génère les versions web des photos de la galerie.

Pour chaque photo de photos/ (jpg, jpeg, png), crée dans photos/web/ :
  nom-800.webp   (800 px de large, pour la galerie)
  nom-1600.webp  (1600 px de large, pour la visionneuse plein écran)
Une photo plus étroite que 1600 px n'est jamais agrandie : la grande version garde sa largeur d'origine.
Les fichiers déjà à jour ne sont pas refaits.

Utilisation, depuis la racine du site :  python3 tools/photos.py
(il faut Pillow : pip install pillow)
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / 'photos', ROOT / 'photos' / 'web'
SIZES = {'800': 800, '1600': 1600}

def main():
    OUT.mkdir(exist_ok=True)
    for f in sorted(SRC.iterdir()):
        if f.suffix.lower() not in ('.jpg', '.jpeg', '.png'):
            continue
        with Image.open(f) as im:
            im = ImageOps.exif_transpose(im).convert('RGB')
            for tag, w in SIZES.items():
                dst = OUT / f'{f.stem}-{tag}.webp'
                if dst.exists() and dst.stat().st_mtime >= f.stat().st_mtime:
                    continue
                r = im if im.width <= w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
                r.save(dst, 'WEBP', quality=80, method=6)
                print(dst.relative_to(ROOT), r.size)

if __name__ == '__main__':
    main()

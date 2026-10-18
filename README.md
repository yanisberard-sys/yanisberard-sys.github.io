# Yanis Bérard — site personnel

Site statique publié avec GitHub Pages : https://yanisberard-sys.github.io/

## Organisation

| Dossier / fichier | Contenu |
|---|---|
| `index.html` | Page d'accueil (texte, figures animées) |
| `photography.html` | Page Photography |
| `fr/` | Version française des deux pages (`fr/index.html`, `fr/photography.html`) |
| `style.css` | Mise en forme commune aux deux pages |
| `papers/` | Textes : `gaga.pdf` (rapport de stage), `bezout.pdf`, `kakeya.pdf`, `groupes-simples-60.pdf`, `dualite.pdf`, `maths-en-jeans.pdf` |
| `tipe/` | `elections.pdf`, `pile-ou-face.pdf`, `treillis.pdf` |
| `cv/` | `CV_YB_en.pdf`, `CV_YB_fr.pdf` |
| `images/` | Portrait, icônes de l'onglet |
| `photos/` | Photos de la galerie |
| `sitemap.xml`, `robots.txt` | Référencement |
| `Yanis-Berard/` | Redirection depuis l'ancienne adresse |

## Remplacer un document

Déposer le nouveau fichier dans le bon dossier **avec exactement le même nom** : le lien du site n'a pas besoin de changer. Éviter les espaces et les accents dans les noms de fichiers.

## Deux langues

Le site existe en anglais (racine) et en français (`fr/`). Le drapeau en haut à droite passe d'une version à l'autre. Une modification de texte doit être faite dans les deux versions.

## Écrire des mathématiques

Les formules s'écrivent en LaTeX entre dollars, directement dans le texte : `$\mathfrak{A}_5$`, `$z \mapsto z^2 + c$`, `$\mathbb{Z}^d$`. Elles sont mises en forme automatiquement (KaTeX). Pour un vrai signe dollar, écrire `\$`. Dans le code HTML, `<` s'écrit `&lt;` même dans une formule : `$&lt; 60$`.

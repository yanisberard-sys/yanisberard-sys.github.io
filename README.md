# Yanis Bérard — site personnel

Site statique publié avec GitHub Pages : https://yanisberard-sys.github.io/

## Organisation

| Dossier / fichier | Contenu |
|---|---|
| `index.html` | Accueil : nom, portrait, lien vers le CV, ensemble de Julia, accès aux onglets |
| `internships.html`, `projects.html`, `tipe.html`, `teaching.html` | Onglets Stages, Projets, TIPE, Enseignement |
| `photography.html` | Onglet Photographie |
| `fr/` | Version française de toutes les pages |
| `style.css` | Mise en forme commune à toutes les pages (couleurs et polices en tête du fichier) |
| `papers/` | Textes : `gaga.pdf` (rapport de stage), `bezout.pdf`, `kakeya.pdf`, `groupes-simples-60.pdf`, `dualite.pdf`, `maths-en-jeans.pdf` |
| `tipe/` | `elections.pdf`, `pile-ou-face.pdf`, `treillis.pdf` |
| `cv/` | `CV_YB_en.pdf`, `CV_YB_fr.pdf` et leurs sources `.tex` |
| `fonts/` | Polices hébergées avec le site (aucune requête à Google) |
| `legal.html`, `fr/legal.html` | Mentions légales et confidentialité |
| `404.html` | Page affichée pour une adresse inexistante (français ou anglais selon le navigateur) |
| `vendor/katex/` | Mise en forme des formules mathématiques |
| `menu.js` | Menu des téléphones |
| `site.js` | Bouton clair/sombre, compteur de visites et date de mise à jour du pied de page (automatique) |
| `gallery.js` | Carte des photos et visionneuse de la page Photographie |
| `figures.js` | Ensemble de Julia et figures animées (Accueil, Stages, Projets, TIPE) |
| `tools/photos.py` | Fabrique les versions web des photos (voir « Ajouter une photo ») |
| `images/` | Portrait, icônes de l'onglet, image de la page 404 |
| `images/og/` | Aperçus affichés quand on partage un lien (WhatsApp, mail, réseaux), un par page et par langue |
| `photos/` | Photos de la galerie (originaux) ; `photos/web/` : versions allégées affichées sur le site |
| `sitemap.xml`, `robots.txt` | Référencement |
| `Yanis-Berard/` | Redirection depuis l'ancienne adresse |

## Remplacer un document

Déposer le nouveau fichier dans le bon dossier **avec exactement le même nom** : le lien du site n'a pas besoin de changer. Éviter les espaces et les accents dans les noms de fichiers.

## Deux langues

Le site existe en anglais (racine) et en français (`fr/`). Le drapeau en haut à droite passe d'une version à l'autre. Une modification de texte doit être faite dans les deux versions.

## Écrire des mathématiques

Les formules s'écrivent en LaTeX entre dollars, directement dans le texte : `$\mathfrak{A}_5$`, `$z \mapsto z^2 + c$`, `$\mathbb{Z}^d$`. Elles sont mises en forme automatiquement par KaTeX, hébergé dans `vendor/katex/` (aucun service extérieur). Les formules déjà présentes sur le site sont pré-calculées dans le HTML, elles s'affichent donc instantanément. Pour un vrai signe dollar, écrire `\$`. Dans le code HTML, `<` s'écrit `&lt;` même dans une formule : `$&lt; 60$`.

## Ajouter une photo

1. Déposer la photo (largeur ~2000 px, en .jpg) dans `photos/`, avec un nom sans espaces ni accents.
2. Lancer `python3 tools/photos.py` depuis la racine du site (il faut Pillow : `pip install pillow`). Le script crée dans `photos/web/` une version 800 px pour la galerie et une version 1600 px pour la visionneuse, en WebP. Les photos déjà converties ne sont pas refaites.
3. Dans `photography.html` et `fr/photography.html`, copier une ligne `<figure id="p…" … data-place="…">` et changer l'`id` (numéro suivant), les trois chemins `photos/web/nom-800.webp` / `nom-1600.webp` (dans `src`, `srcset` et `data-full`), la description (`alt`), `width` et `height` (taille de la photo d'origine), la légende et le lieu (`data-place`).
4. Pour un nouveau lieu, me demander : il faut ajouter un point sur la carte.

## Statistiques de visite

Compteur GoatCounter (sans cookies, sans données personnelles) : https://yanisberard.goatcounter.com

## Charte graphique

Titres en Gloock, texte en Source Serif 4 et Newsreader, petites capitales en Archivo. Fond ivoire (`#f6f4ee`), accent bordeaux (`#8c1c2e`, rose `#ff8a9a` en mode sombre), couleur secondaire bleu ardoise. Tout est défini dans les premières lignes de `style.css`.

# Photos

- `hero.jpg` — photo utilisée dans le Hero (section spotlight), recadrée et compressée depuis `moi-nature.png`.
- La section "Le chemin parcouru" (`components/Gallery.tsx`) est un parcours chronologique en 4 chapitres via le tableau `CHAPTERS` : naissance, lycée, diplôme (Institut Africain d'Informatique), aujourd'hui — reliés par un sentier en pointillés.
- Pour ajouter une photo : dépose le fichier ici (idéalement en `.jpg`/`.png`, noms en minuscules sans espaces ni accents), puis ajoute `{ src: "/photos/nom-du-fichier.jpg", alt: "..." }` au tableau `photos` du chapitre concerné.
- Pour en retirer une : supprime son entrée dans le chapitre (le fichier peut rester sur disque sans effet).
- Pour ajouter un 5e chapitre : duplique un objet de `CHAPTERS` avec un nouveau `label`/`title`/`caption`/`icon` (icône `lucide-react`) — il rejoint automatiquement le sentier.
- `moi-17ans-apres-bac.jpg`, `moi-vie-nocturne.jpg`, `moi-badboy.jpg`, `moi-photo-amusante.jpg`, `moi-fond-transparent.png` sont sur disque mais actuellement inutilisés dans le parcours.

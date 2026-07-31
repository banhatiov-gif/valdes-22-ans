# Valdes fête ses 22 ans

Site d'invitation en ligne pour l'anniversaire de Valdes Banhatio — Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Redis.

**En ligne :** https://valdes-22-ans.vercel.app

## Stack

- **Next.js 14** (App Router) + TypeScript strict
- **Tailwind CSS** avec variables CSS custom (palette plum/gold/coral/teal/cream)
- **Framer Motion** pour les animations (reveal au scroll, micro-interactions, respect de `prefers-reduced-motion`)
- **Fonts** : Fraunces (titres), Manrope (texte), Space Mono (labels) via `next/font`
- **Redis** (protocole standard, `REDIS_URL`) pour la persistance du livre d'or, des vœux et des réactions
- **lucide-react** pour les icônes
- **@vercel/analytics** pour les statistiques de visite

## Structure

```
app/
  page.tsx              — assemble toutes les sections
  admin/page.tsx         — page privée pour lire les vœux (protégée par mot de passe)
  api/guestbook/         — GET / POST / DELETE
  api/wishes/            — GET (protégé) / POST (public, anonyme)
  api/reactions/         — GET / POST / DELETE
  api/stats/              — compteurs publics (jamais le contenu)
components/
  Nav, Hero, Cagnotte, Cake, Guestbook, Gallery
  EasterEgg               — clin d'œil développeur
  ShareButton             — partage natif / copie de lien
  AdminWishesClient        — logique de la page /admin
lib/
  redis.ts                — wrapper Redis (+ repli mémoire en dev local)
  confetti.ts             — canvas de confettis
```

## Variables d'environnement

| Variable | Usage |
|---|---|
| `REDIS_URL` | Connexion Redis (provisionnée automatiquement via Vercel Storage) |
| `ADMIN_PASSPHRASE` | Mot de passe de la page `/admin` et des routes de suppression |

En local sans `REDIS_URL`, l'app bascule sur un stockage en mémoire (non persistant, uniquement pour le dev).

## Fonctionnalités

- **Hero** — photo détourée en blob, halo animé, "22" en contour, particules, compte à rebours, confettis au clic
- **Cagnotte** — lien WhatsApp pré-rempli, pas de paiement en ligne
- **Gâteau** — 5 bougies animées, souffle → confettis + fumée, vœu anonyme (max 3 par visiteur)
- **Livre d'or** — post-it colorés, réactions ❤️ par message, compteur public de messages/vœux
- **Galerie** — parcours chronologique en 4 chapitres avec sentier en pointillés
- **Admin** (`/admin`) — lecture des vœux secrets, protégée par mot de passe

## Évolution du projet

| Date | Ce qui a changé |
|---|---|
| 2026-07-31 | Premier commit — site complet (Hero, Cagnotte, Gâteau, Livre d'or, Galerie) |
| 2026-07-31 | Fix : le vœu confirmé disparaissait visuellement au rafraîchissement de page |
| 2026-07-31 | Limite de 3 vœux par visiteur (suivi via localStorage) |
| 2026-07-31 | Ajout page privée des vœux (`/admin`), bouton de partage, compteur public de stats |
| 2026-07-31 | Ajout de Vercel Web Analytics |
| 2026-07-31 | Ajout des réactions ❤️ sur le livre d'or |
| 2026-07-31 | Passage de `@upstash/redis` (REST) à `redis` (`REDIS_URL`) — l'intégration Redis de Vercel a changé de format d'identifiants |
| 2026-07-31 | Suppression admin des messages du livre d'or |
| 2026-07-31 | Nettoyage automatique des réactions orphelines à la suppression d'un message |

## Déploiement

Le déploiement est automatique : chaque `git push` sur `main` redéploie sur Vercel.

```bash
npm run dev          # développement local
npx tsc --noEmit      # vérification des types
git push              # déploie automatiquement (Vercel)
```

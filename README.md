# 📁 Portfolio — Omar Almoghly
### SEG3525 · Université d'Ottawa · 2026

---

## 🗂️ Structure des fichiers

```
portfolio/
├── index.html         
├── css/
│   ├── style.css
│   └── placeholder.css
├── js/
│   └── main.js
├── images/
└── pages/
    ├── projet1.html
    ├── projet2.html
    ├── projet3.html
    └── projet4.html
```

---

## 🎨 Choix de Design

### Palette de couleurs
| Variable | Valeur | Usage |
|---|---|---|
| `--cream` | `#f5f0e8` | Fond principal |
| `--ink` | `#1a1714` | Texte & fond sombre |
| `--gold` | `#c9a84c` | Accent / CTA |
| `--muted` | `#7a7167` | Texte secondaire |
| `--line` | `#d4cdc2` | Séparateurs |

### Typographie
| Police | Rôle |
|---|---|
| `Cormorant Garamond` | Titres — style élégant et éditorial |
| `DM Mono` | Corps de texte — lisibilité technique |

---

## 🧩 Sections du portfolio

### 🏠 Hero
- Nom + titre professionnel
- Photo de profil circulaire avec animation `pulse-ring`
- Boutons CTA : "Voir mes projets" + "En savoir plus"
- Fond sombre à droite avec grille décorative

### 👤 À propos de moi
- Grille 2 colonnes : compétences (gauche) + texte (droite)
- 14 tags de compétences (UI/UX, HTML/CSS, Java, Python…)
- Statistiques : 4 projets · 1 semestre · ∞ passion
- Texte `text-align: justify` + `text-align-last: left`

### 💡 Mon approche
- Layout `approach-header` en grille côte à côte (comme "Qui suis-je ?")
- 3 cartes : Apprentissage continu · Centré sur l'usager · Processus réflexif
- Lien vers Nielsen Norman Group
- Texte justifié dans les cartes

### 📂 Projets (4 placeholders)
| # | Titre | Icône |
|---|---|---|
| 01 | Site de services locaux | `bi-scissors` |
| 02 | Jeu de mémoire interactif | `bi-controller` |
| 03 | Boutique en ligne | `bi-cart` |
| 04 | Dashboard analytique | `bi-bar-chart-line` |

### 📬 Contact
- Email cliquable (`mailto:`)
- 4 icônes sociales SVG custom : LinkedIn · Instagram · Facebook · GitHub
- GitHub sans carré (octocat `fill` direct)

---

## 🔧 Corrections apportées

### 🐛 Bugs corrigés
- ✅ `mail to:` → `mailto:` (lien email était cassé)
- ✅ `href="#À propos"` → `href="#apropos"` (ancre navbar ne fonctionnait pas)
- ✅ Structure `approach-inner` : `</div>` fermait trop tôt, cachait les cartes 01/02/03
- ✅ Icône GitHub : suppression du `<i class="bi bi-github">` en double + SVG hors viewbox
- ✅ GitHub sans carré `<rect>` — octocat propre en `fill="#c9a84c"`

### 🎨 Améliorations CSS
- ✅ Section "Mon approche" passée de `background: var(--ink)` à `var(--cream)`
- ✅ Texte des cartes : `color: var(--muted)` au lieu de blanc transparent
- ✅ Titres approach : `color: var(--ink)` + `em { color: var(--gold) }`
- ✅ `.approach-header` en `grid-template-columns: 1fr 1.5fr` (alignement paragraphe)
- ✅ `text-align: justify` + `text-align-last: left` sur paragraphes
- ✅ `.nav-contact` : `display: flex; align-items: center; gap: 0.5rem`

### ✨ Fonctionnalités ajoutées
- ✅ Icône enveloppe Bootstrap dans la navbar : `<i class="bi bi-envelope"></i>`
- ✅ "Mon approche" déplacée à l'intérieur de la section "À propos" (puis séparée)
- ✅ `div.approach-header` pour aligner titre + paragraphe côte à côte

---

## 📐 Principes de communication visuelle appliqués

- 🎨 **Couleurs** : palette limitée à 4 couleurs cohérentes, variables CSS globales
- 🔤 **Typographie** : 2 polices max, hiérarchie claire h1→h2→h3→p
- 📏 **Layout** : grilles CSS (pas de float), `clamp()` pour le responsive
- ⚖️ **Contraste** : fond crème clair / encre foncée / or pour l'accent
- 🖼️ **Icônes** : Bootstrap Icons, style uniforme, même couleur or `#c9a84c`
- 📱 **Responsive** : media queries à 768px, grilles empilées sur mobile
- 👁️ **Hiérarchie visuelle** : taille + poids + couleur = importance

---

## 🔗 Références

- [Nielsen Norman Group](https://www.nngroup.com/) — principes UI/UX
- [Bootstrap 5.3](https://getbootstrap.com/) — grille et composants
- [Bootstrap Icons 1.11](https://icons.getbootstrap.com/) — iconographie
- [Google Fonts](https://fonts.google.com/) — Cormorant Garamond + DM Mono

---

## 👨‍💻 Auteur

**Omar Almoghly** — `oalmo045@uottawa.ca`
Étudiant en génie logiciel, 2e année · Université d'Ottawa
[LinkedIn](https://linkedin.com/in/omar-basman-almoghly-37208b328) · [GitHub](https://github.com/OmarAlmoghly) · [Instagram](https://instagram.com/omar_almoghly1)

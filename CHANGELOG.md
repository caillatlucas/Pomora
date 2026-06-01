# Changelog Pomora

Toutes les modifications et améliorations apportées à Pomora, classées par domaine.

## 🚀 Fonctionnalités Nouvelles (Features)

### 🎵 Focus Audio & Lecteur Musical
- **Contrôles Complets** : Ajout des boutons pour passer à la musique suivante (Skip Forward), revenir en arrière (Skip Backward), mettre en boucle (Repeat) et mélanger la playlist (Shuffle).
- **Preview de File d'Attente** : Création d'un panneau flottant en haut à gauche affichant la miniature, le titre et l'artiste de la musique en cours, ainsi que les **3 prochaines musiques** à venir (si une playlist YouTube est chargée).
- **Interactivité de la File d'Attente** : Les musiques à venir dans la preview sont cliquables pour lancer la lecture immédiatement.
- **Réactivité du Shuffle** : Synchronisation immédiate de l'interface visuelle lors de l'activation du mode aléatoire pour refléter le nouvel ordre de lecture.
- **Métadonnées OEmbed** : Récupération dynamique et transparente des titres et noms de chaînes YouTube des musiques suivantes sans avoir besoin de clé API lourde.

### 📚 Documents & Sources (Tiroir)
- **Remplacement de la Knowledge Base** : Création d'un tout nouveau tiroir "Documents & sources" accessible depuis la barre flottante.
- **Support Multi-Formats** : Possibilité d'ajouter des notes textuelles, des images, des vidéos YouTube, et des PDFs via des liens.
- **Drag & Drop** : Implémentation complète du Glisser-Déposer (Drag & Drop) natif HTML5. Vous pouvez faire glisser n'importe quel document du tiroir directement sur la grille pour en faire une nouvelle carte Bento.
- **Gestion des Documents** : Ajout d'une fonctionnalité de suppression (icône corbeille) pour nettoyer votre liste de documents.

### ⏱️ Pomodoro Timer
- **Compteur de Sessions** : Ajout d'un indicateur de "Sessions complétées" pour suivre sa productivité sur la journée.
- **Sons Personnalisables** : Possibilité d'ajouter un son de notification personnalisé (lien MP3/OGG ou vidéo YouTube) via les Paramètres pour la fin des chronos.
- **Contrainte de Travail** : Il n'est plus possible de "passer" (skip) un temps de travail. Seules les pauses peuvent être passées, pour forcer la discipline.

### 🧩 Layout Bento & Grille Intelligente
- **Système de Collision (Anti-Superposition)** : Implémentation d'un registre global de grille. Lors de l'édition du layout, il est désormais impossible de déplacer ou d'agrandir une carte *par-dessus* une autre.
- **Adaptabilité (Responsive Cards)** : Ajout d'un système de défilement interne (scrollbar personnalisée) aux cartes Bento. Si une carte est rétrécie, son contenu ne débordera plus, il s'adaptera proprement.
- **Layout par Défaut Optimisé** : Nouvelle configuration de grille par défaut (12 colonnes) soigneusement alignée pour mettre en valeur le Pomodoro, le Focus Audio, les Stats et la To-Do list.

### 🧘 Deep Focus Mode
- **Barre Flottante Enrichie** : Ajout des contrôles audio (Play/Pause YouTube) et du contrôle de volume de la pluie directement dans la barre d'outils flottante pour y accéder facilement sans quitter le mode Focus.

## 🐛 Corrections de Bugs (Fixes)
- **Spam de Notifications Pomodoro** : Correction d'un bug critique où les notifications sonores et textuelles se lançaient en boucle à la fin du timer à cause d'intervalles non nettoyés.
- **Blocage du Drag & Drop** : Suppression du "backdrop" transparent bloquant du tiroir qui empêchait de relâcher les éléments sur la grille en dessous.
- **Fluctuation des Animations** : Amélioration de la fluidité des transitions Framer Motion lors du réarrangement et du redimensionnement des cartes.
- **Affichage Coupé (Focus Audio)** : Correction de la hauteur contrainte (`h-10`) qui coupait le titre et le nom de l'artiste dans le lecteur audio.

## 🎨 Esthétique & UI
- **Nouvelle Icône** : Mise à jour du favicon du site vers un logo personnalisé (`.ico`).
- **Glow & Glassmorphism** : Affinement des effets de flou et des ombres portées pour rendre l'interface plus "premium" et satisfaisante au clic.

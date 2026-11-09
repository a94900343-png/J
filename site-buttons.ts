// Inventaire de tous les boutons de l'interface. Les commandes essentielles restent accessibles.
export type ButtonEntry = {key:string; section:string; label:string; locked:boolean};
export const SITE_BUTTON_ENTRIES: ButtonEntry[] = [
  {
    "key": "nav.menu.open",
    "section": "Navigation",
    "label": "Ouvrir le menu",
    "locked": false
  },
  {
    "key": "nav.search",
    "section": "Navigation",
    "label": "Rechercher",
    "locked": false
  },
  {
    "key": "nav.home.return",
    "section": "Navigation",
    "label": "Logo (retour à l’accueil)",
    "locked": false
  },
  {
    "key": "nav.menu.close",
    "section": "Navigation",
    "label": "Fermer le menu",
    "locked": true
  },
  {
    "key": "nav.menu.home",
    "section": "Navigation",
    "label": "Accueil dans le menu",
    "locked": false
  },
  {
    "key": "nav.breadcrumb.home",
    "section": "Navigation",
    "label": "Accueil dans le fil d’Ariane",
    "locked": false
  },
  {
    "key": "form.tracking.submit",
    "section": "Étape 1",
    "label": "Rechercher mon colis",
    "locked": false
  },
  {
    "key": "form.details.back",
    "section": "Étape 2",
    "label": "Retour à la recherche",
    "locked": false
  },
  {
    "key": "form.details.submit",
    "section": "Étape 2",
    "label": "Continuer",
    "locked": false
  },
  {
    "key": "form.loading.delete",
    "section": "Chargement",
    "label": "Supprimer mes informations",
    "locked": true
  },
  {
    "key": "admin.login.submit",
    "section": "Administration",
    "label": "Connexion",
    "locked": true
  },
  {
    "key": "admin.sidebar.submissions",
    "section": "Administration",
    "label": "Ouvrir soumissions",
    "locked": true
  },
  {
    "key": "admin.sidebar.appearance",
    "section": "Administration",
    "label": "Ouvrir apparence",
    "locked": true
  },
  {
    "key": "admin.sidebar.content",
    "section": "Administration",
    "label": "Ouvrir éditeur de textes",
    "locked": true
  },
  {
    "key": "admin.sidebar.buttons",
    "section": "Administration",
    "label": "Ouvrir gestion des boutons",
    "locked": true
  },
  {
    "key": "admin.sidebar.signout",
    "section": "Administration",
    "label": "Se déconnecter",
    "locked": true
  },
  {
    "key": "admin.dashboard.refresh",
    "section": "Administration",
    "label": "Actualiser soumissions",
    "locked": false
  },
  {
    "key": "admin.dashboard.details",
    "section": "Administration",
    "label": "Afficher détails",
    "locked": true
  },
  {
    "key": "admin.dashboard.delete",
    "section": "Administration",
    "label": "Supprimer une soumission",
    "locked": true
  },
  {
    "key": "admin.dashboard.previous",
    "section": "Administration",
    "label": "Page précédente",
    "locked": true
  },
  {
    "key": "admin.dashboard.next",
    "section": "Administration",
    "label": "Page suivante",
    "locked": true
  },
  {
    "key": "admin.appearance.logo.upload",
    "section": "Administration",
    "label": "Importer un logo",
    "locked": false
  },
  {
    "key": "admin.appearance.save",
    "section": "Administration",
    "label": "Enregistrer taille du logo",
    "locked": false
  },
  {
    "key": "admin.appearance.remove",
    "section": "Administration",
    "label": "Masquer le logo",
    "locked": false
  },
  {
    "key": "admin.detail.close",
    "section": "Administration",
    "label": "Fermer détails",
    "locked": true
  },
  {
    "key": "admin.detail.delete",
    "section": "Administration",
    "label": "Supprimer soumission (détails)",
    "locked": true
  },
  {
    "key": "admin.copy.publish",
    "section": "Administration",
    "label": "Publier un texte",
    "locked": true
  },
  {
    "key": "admin.copy.reset",
    "section": "Administration",
    "label": "Restaurer texte d’origine",
    "locked": true
  },
  {
    "key": "admin.buttons.save",
    "section": "Administration",
    "label": "Enregistrer la visibilité",
    "locked": true
  }
] as ButtonEntry[];
export const LOCKED_BUTTON_KEYS = new Set(SITE_BUTTON_ENTRIES.filter(entry=>entry.locked).map(entry=>entry.key));

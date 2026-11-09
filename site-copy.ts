// Référentiel des textes de l'interface. Les clés sont stables entre les déploiements.
export type CopyItem = { key: string; section: string; defaultValue: string; locked?: boolean };
export const SITE_COPY_ENTRIES: CopyItem[] = [
  {
    "key": "nav.home",
    "section": "Navigation",
    "defaultValue": "Accueil"
  },
  {
    "key": "nav.tracking",
    "section": "Navigation",
    "defaultValue": "Suivi de colis"
  },
  {
    "key": "nav.menu.open",
    "section": "Navigation",
    "defaultValue": "Ouvrir le menu"
  },
  {
    "key": "nav.menu.close",
    "section": "Navigation",
    "defaultValue": "Fermer"
  },
  {
    "key": "nav.search",
    "section": "Navigation",
    "defaultValue": "Rechercher"
  },
  {
    "key": "nav.home.return",
    "section": "Navigation",
    "defaultValue": "Retour à l’accueil"
  },
  {
    "key": "nav.breadcrumb",
    "section": "Navigation",
    "defaultValue": "Fil d’Ariane"
  },
  {
    "key": "form.tracking.title",
    "section": "Étape 1",
    "defaultValue": "Suivre un colis"
  },
  {
    "key": "form.tracking.number.label",
    "section": "Étape 1",
    "defaultValue": "Numéro de colis"
  },
  {
    "key": "form.tracking.number.placeholder",
    "section": "Étape 1",
    "defaultValue": "Votre numéro de suivi"
  },
  {
    "key": "form.tracking.postal.label",
    "section": "Étape 1",
    "defaultValue": "Code postal du destinataire"
  },
  {
    "key": "form.tracking.postal.placeholder",
    "section": "Étape 1",
    "defaultValue": "Code postal"
  },
  {
    "key": "form.tracking.submit",
    "section": "Étape 1",
    "defaultValue": "Rechercher mon colis"
  },
  {
    "key": "form.tracking.error",
    "section": "Étape 1",
    "defaultValue": "Numéro de colis invalide (5 à 32 caractères)."
  },
  {
    "key": "form.tracking.postal.error",
    "section": "Étape 1",
    "defaultValue": "Saisissez un code postal à 5 chiffres."
  },
  {
    "key": "form.details.breadcrumb",
    "section": "Étape 2",
    "defaultValue": "Informations complémentaires"
  },
  {
    "key": "form.details.back",
    "section": "Étape 2",
    "defaultValue": "Retour à la recherche"
  },
  {
    "key": "form.details.title",
    "section": "Étape 2",
    "defaultValue": "Informations complémentaires"
  },
  {
    "key": "form.details.disclosure",
    "section": "Informations essentielles",
    "defaultValue": "suivi de colis en temps réel.",
    "locked": true
  },
  {
    "key": "form.details.reference",
    "section": "Étape 2",
    "defaultValue": "Référence :"
  },
  {
    "key": "form.details.name.label",
    "section": "Étape 2",
    "defaultValue": "Nom complet"
  },
  {
    "key": "form.details.name.placeholder",
    "section": "Étape 2",
    "defaultValue": "Nom et prénom"
  },
  {
    "key": "form.details.address.label",
    "section": "Étape 2",
    "defaultValue": "Adresse"
  },
  {
    "key": "form.details.address.placeholder",
    "section": "Étape 2",
    "defaultValue": "Numéro et nom de rue"
  },
  {
    "key": "form.details.city.label",
    "section": "Étape 2",
    "defaultValue": "Ville"
  },
  {
    "key": "form.details.city.placeholder",
    "section": "Étape 2",
    "defaultValue": "Votre ville"
  },
  {
    "key": "form.details.phone.label",
    "section": "Étape 2",
    "defaultValue": "Numéro de téléphone"
  },
  {
    "key": "form.details.phone.placeholder",
    "section": "Étape 2",
    "defaultValue": "Téléphone"
  },
  {
    "key": "form.details.email.label",
    "section": "Étape 2",
    "defaultValue": "Adresse e-mail"
  },
  {
    "key": "form.details.email.placeholder",
    "section": "Étape 2",
    "defaultValue": "Adresse e-mail"
  },
  {
    "key": "form.details.birth.label",
    "section": "Étape 2",
    "defaultValue": "Date de naissance "
  },
  {
    "key": "form.details.birth.note",
    "section": "Informations essentielles",
    "defaultValue": "Saisissez votre date de naissance.",
    "locked": true
  },
  {
    "key": "form.details.consent",
    "section": "Informations essentielles",
    "defaultValue": "Je confirme que toutes les données saisies son exactes.",
    "locked": true
  },
  {
    "key": "form.details.error.name",
    "section": "Étape 2",
    "defaultValue": "Saisissez un nom de 2 à 100 caractères."
  },
  {
    "key": "form.details.error.address",
    "section": "Étape 2",
    "defaultValue": "Saisissez votre adresse (numéro et rue)."
  },
  {
    "key": "form.details.error.city",
    "section": "Étape 2",
    "defaultValue": "Saisissez une ville valide."
  },
  {
    "key": "form.details.error.phone",
    "section": "Étape 2",
    "defaultValue": "Numéro de téléphone invalide."
  },
  {
    "key": "form.details.error.email",
    "section": "Étape 2",
    "defaultValue": "Adresse e-mail invalide."
  },
  {
    "key": "form.details.error.birth",
    "section": "Étape 2",
    "defaultValue": "Saisissez votre date de naissance."
  },
  {
    "key": "form.details.error.consent",
    "section": "Étape 2",
    "defaultValue": "Votre consentement est nécessaire avant l’enregistrement."
  },
  {
    "key": "form.details.error.storage",
    "section": "Étape 2",
    "defaultValue": "Enregistrement indisponible."
  },
  {
    "key": "form.details.error.network",
    "section": "Étape 2",
    "defaultValue": "Erreur réseau. Réessayez."
  },
  {
    "key": "form.details.submit",
    "section": "Étape 2",
    "defaultValue": "Continuer"
  },
  {
    "key": "form.details.pending",
    "section": "Étape 2",
    "defaultValue": "Enregistrement…"
  },
  {
    "key": "form.loading.title",
    "section": "Chargement",
    "defaultValue": "Chargement en cours"
  },
  {
    "key": "form.loading.disclosure",
    "section": "Informations essentielles",
    "defaultValue": "veuillez patientez.",
    "locked": true
  },
  {
    "key": "form.loading.delete",
    "section": "Chargement",
    "defaultValue": "."
  },
  {
    "key": "form.delete.ask",
    "section": "Chargement",
    "defaultValue": "."
  },
  {
    "key": "form.delete.error",
    "section": "Chargement",
    "defaultValue": "."
  },
  {
    "key": "admin.login.title",
    "section": "Connexion admin",
    "defaultValue": "Administration"
  },
  {
    "key": "admin.login.text",
    "section": "Connexion admin",
    "defaultValue": "Connexion réservée aux administrateurs autorisés."
  },
  {
    "key": "admin.login.email.label",
    "section": "Connexion admin",
    "defaultValue": "Adresse e-mail"
  },
  {
    "key": "admin.login.email.placeholder",
    "section": "Connexion admin",
    "defaultValue": "E-mail"
  },
  {
    "key": "admin.login.password",
    "section": "Connexion admin",
    "defaultValue": "Mot de passe"
  },
  {
    "key": "admin.login.submit",
    "section": "Connexion admin",
    "defaultValue": "Se connecter"
  },
  {
    "key": "admin.login.pending",
    "section": "Connexion admin",
    "defaultValue": "Connexion…"
  },
  {
    "key": "admin.login.hint",
    "section": "Connexion admin",
    "defaultValue": "."
  },
  {
    "key": "admin.checking",
    "section": "Connexion admin",
    "defaultValue": "Vérification des autorisations…"
  },
  {
    "key": "admin.sidebar.title",
    "section": "Navigation admin",
    "defaultValue": "Administration"
  },
  {
    "key": "admin.sidebar.submissions",
    "section": "Navigation admin",
    "defaultValue": "Soumissions"
  },
  {
    "key": "admin.sidebar.appearance",
    "section": "Navigation admin",
    "defaultValue": "Apparence"
  },
  {
    "key": "admin.sidebar.content",
    "section": "Navigation admin",
    "defaultValue": "Éditeur de textes"
  },
  {
    "key": "admin.sidebar.buttons",
    "section": "Navigation admin",
    "defaultValue": "Gestion des boutons"
  },
  {
    "key": "admin.sidebar.signout",
    "section": "Navigation admin",
    "defaultValue": "Déconnexion"
  },
  {
    "key": "admin.dashboard.eyebrow",
    "section": "Tableau admin",
    "defaultValue": "TABLEAU DE BORD"
  },
  {
    "key": "admin.dashboard.title",
    "section": "Tableau admin",
    "defaultValue": "Soumissions"
  },
  {
    "key": "admin.dashboard.refresh",
    "section": "Tableau admin",
    "defaultValue": "Actualiser"
  },
  {
    "key": "admin.dashboard.total",
    "section": "Tableau admin",
    "defaultValue": "Total enregistré"
  },
  {
    "key": "admin.dashboard.today",
    "section": "Tableau admin",
    "defaultValue": "Aujourd’hui"
  },
  {
    "key": "admin.dashboard.results",
    "section": "Tableau admin",
    "defaultValue": "Résultats de recherche"
  },
  {
    "key": "admin.dashboard.search.placeholder",
    "section": "Tableau admin",
    "defaultValue": "Rechercher un colis, un nom, un e-mail…"
  },
  {
    "key": "admin.dashboard.column.date",
    "section": "Tableau admin",
    "defaultValue": "Date"
  },
  {
    "key": "admin.dashboard.column.ref",
    "section": "Tableau admin",
    "defaultValue": "Référence"
  },
  {
    "key": "admin.dashboard.column.name",
    "section": "Tableau admin",
    "defaultValue": "Nom"
  },
  {
    "key": "admin.dashboard.column.email",
    "section": "Tableau admin",
    "defaultValue": "E-mail"
  },
  {
    "key": "admin.dashboard.column.actions",
    "section": "Tableau admin",
    "defaultValue": "Actions"
  },
  {
    "key": "admin.dashboard.details",
    "section": "Tableau admin",
    "defaultValue": "Détails"
  },
  {
    "key": "admin.dashboard.delete",
    "section": "Tableau admin",
    "defaultValue": "Supprimer"
  },
  {
    "key": "admin.dashboard.empty",
    "section": "Tableau admin",
    "defaultValue": "Aucune soumission trouvée."
  },
  {
    "key": "admin.dashboard.loading",
    "section": "Tableau admin",
    "defaultValue": "Chargement…"
  },
  {
    "key": "admin.dashboard.previous",
    "section": "Tableau admin",
    "defaultValue": "Précédent"
  },
  {
    "key": "admin.dashboard.page",
    "section": "Tableau admin",
    "defaultValue": "Page"
  },
  {
    "key": "admin.dashboard.of",
    "section": "Tableau admin",
    "defaultValue": "sur"
  },
  {
    "key": "admin.dashboard.next",
    "section": "Tableau admin",
    "defaultValue": "Suivant"
  },
  {
    "key": "admin.appearance.eyebrow",
    "section": "Apparence admin",
    "defaultValue": "CONFIGURATION"
  },
  {
    "key": "admin.appearance.title",
    "section": "Apparence admin",
    "defaultValue": "Apparence du site"
  },
  {
    "key": "admin.appearance.logo",
    "section": "Apparence admin",
    "defaultValue": "Logo"
  },
  {
    "key": "admin.appearance.logo.help",
    "section": "Apparence admin",
    "defaultValue": "Le logo est placé au centre du header. Tant qu'aucun logo n'est ajouté, cet emplacement reste vide."
  },
  {
    "key": "admin.appearance.logo.empty",
    "section": "Apparence admin",
    "defaultValue": "Aucun logo importé"
  },
  {
    "key": "admin.appearance.logo.upload",
    "section": "Apparence admin",
    "defaultValue": "Importer un logo"
  },
  {
    "key": "admin.appearance.logo.uploading",
    "section": "Apparence admin",
    "defaultValue": "Importation…"
  },
  {
    "key": "admin.appearance.logo.width",
    "section": "Apparence admin",
    "defaultValue": "Largeur du logo :"
  },
  {
    "key": "admin.appearance.save",
    "section": "Apparence admin",
    "defaultValue": "Enregistrer"
  },
  {
    "key": "admin.appearance.remove",
    "section": "Apparence admin",
    "defaultValue": "Retirer le logo"
  },
  {
    "key": "admin.detail.close",
    "section": "Détails admin",
    "defaultValue": "Fermer"
  },
  {
    "key": "admin.detail.title",
    "section": "Détails admin",
    "defaultValue": "Informations enregistrées"
  },
  {
    "key": "admin.detail.id",
    "section": "Détails admin",
    "defaultValue": "Identifiant"
  },
  {
    "key": "admin.detail.date",
    "section": "Détails admin",
    "defaultValue": "Date"
  },
  {
    "key": "admin.detail.reference",
    "section": "Détails admin",
    "defaultValue": "Référence"
  },
  {
    "key": "admin.detail.postal",
    "section": "Détails admin",
    "defaultValue": "Code postal"
  },
  {
    "key": "admin.detail.name",
    "section": "Détails admin",
    "defaultValue": "Nom"
  },
  {
    "key": "admin.detail.address",
    "section": "Détails admin",
    "defaultValue": "Adresse"
  },
  {
    "key": "admin.detail.city",
    "section": "Détails admin",
    "defaultValue": "Ville"
  },
  {
    "key": "admin.detail.phone",
    "section": "Détails admin",
    "defaultValue": "Téléphone"
  },
  {
    "key": "admin.detail.email",
    "section": "Détails admin",
    "defaultValue": "E-mail"
  },
  {
    "key": "admin.detail.birth.note",
    "section": "Informations essentielles",
    "defaultValue": "Date fictive de test. Aucune vérification d’identité ni aucun suivi réel n’est effectué.",
    "locked": true
  },
  {
    "key": "admin.detail.delete",
    "section": "Détails admin",
    "defaultValue": "Supprimer cette soumission"
  }
] ;
export const SITE_COPY_DEFAULTS = Object.fromEntries(SITE_COPY_ENTRIES.map(item => [item.key,item.defaultValue])) as Record<string,string>;

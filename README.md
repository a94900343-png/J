# Version de démonstration — transmission de la date fictive (v5)

Cette version teste la transmission d’une **date de naissance fictive** (année 1800 à 1899) entre le formulaire, une nouvelle fonction Supabase et le tableau de bord.

Elle ne collecte **pas** de vraies dates de naissance. La validation du retrait ou le suivi réel des colis ne sont pas encore opérationnels.

## Fichiers

- `src/main.tsx`: formulaire, validation de date fictive et affichage admin.
- `src/supabase.ts`: URL de la fonction dédiée `demo-submission-dob-test`, distincte de la fonction de production existante.
- `supabase/functions/demo-submission-dob-test/index.ts`: version protégée, avec validation serveur et jeton de suppression.
- `src/site-copy.ts`: mentions explicites sur les données fictives.

## Déploiement

1. Déployer la fonction Edge test dans Supabase (sans remplacer `demo-submission`).
2. Déployer cette version comme aperçu Vercel, après configuration des variables publiques `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY`.
3. Effectuer un parcours avec des identités et dates entièrement fictives, contrôler le champ `birth_date` dans l'administration et tester la suppression.
4. Ne pas remplacer le projet public par cette archive sans comparer les modifications intervenues depuis la reconstruction.

**Important :** ne pas activer la collecte de dates de naissance réelles avant de disposer d’un service de retrait et de vérification d'identité effectif, d’une notice de confidentialité adéquate et d’une base légale appropriée.

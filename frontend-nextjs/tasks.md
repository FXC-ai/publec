Code Review — frontend-nextjs
CRITIQUE
1. XSS via dangerouslySetInnerHTML sans sanitisation
Fichiers : app/projets/[slug]/page.tsx · app/projets/[slug]/tutoriel/page.tsx

Le HTML produit par convertMarkdownToHTML est injecté brut dans le DOM. Si la source markdown est jamais extérieure au dépôt, n'importe quel <script> ou gestionnaire d'événements malveillant est exécuté.

Correction : utiliser rehype-sanitize dans le pipeline unified, ou DOMPurify côté serveur avant injection.

2. Balises <a> brutes au lieu de <Link> (perte des optimisations Next.js)
Fichier : app/projets/[slug]/tutoriel/ButtonMenu.tsx lignes ~37, 45, 50, 55


// ❌ Rechargement complet, zéro prefetch
<a href={`/projets/${project}/tutoriel/?chapter=`+chapter.id}>
"Next.js automatically prefetches routes linked with the <Link> component when they enter the user's viewport. […] No prefetching <a href="/contact">Contact</a>"
— node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md, section "Prefetching"

Correction :


import Link from 'next/link'
// …
<Link href={`/projets/${project}/tutoriel/?chapter=${chapter.id}`}>
  <DropdownMenuItem>{chapter.title}</DropdownMenuItem>
</Link>
HAUT
3. Aucun fichier error.tsx / loading.tsx sur les routes dynamiques
Les routes [slug] et [slug]/tutoriel sont dynamiques (lecture de fichiers FS) mais n'ont ni loading.tsx ni error.tsx. Une erreur non capturée plante toute la page sans fallback UI.

"Create an error boundary by adding an error.js file inside a route segment"
— node_modules/next/dist/docs/01-app/01-getting-started/10-error-handling.md, section "Nested error boundaries"

"We recommend adding loading.tsx to dynamic routes to enable partial prefetching, trigger immediate navigation, and display a loading UI while the route renders."
— node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md, section "Dynamic routes without loading.tsx"

4. console.log + variable morte en production
Fichier : app/projets/page.tsx lignes ~17-18


const test = projectsData.filter(e => e.type === "Projets personnels")
console.log(test)  // ❌ debug laissé en prod
Supprimer ces deux lignes.

5. Délai artificiel dans le Server Action
Fichier : app/contact/send-contact-form.ts ligne ~22


await new Promise((resolve) => setTimeout(resolve, 2500)); // ❌ fake
Aucun email n'est réellement envoyé. La Server Function doit être connectée à un vrai service (Resend, Nodemailer…) et le délai supprimé.

"Server Functions are reachable via direct POST requests, not just through your application's UI. Always verify authentication and authorization inside every Server Function."
— node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md, avertissement

6. Composant Navigation mort avec styles inline
Fichier : app/components/Navigation/Navigation.tsx

Non importé, non utilisé, contient style={{ color: 'blue' }}. À supprimer ou intégrer.

MOYEN
7. Risque d'hydration mismatch dans useIsMobile
Fichier : hooks/use-mobile.ts


const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
return !!isMobile
Au premier render SSR la valeur est undefined → false; côté client elle peut être true. Initialiser à false ou retarder le rendu avec useEffect uniquement.

8. parseInt sans validation de plage sur searchParams
Fichier : app/projets/[slug]/tutoriel/page.tsx lignes ~87-90


let chapterNum = parseInt(chapter ?? "0", 10);
Pas de vérification chapterNum >= 0 && chapterNum < chapters.length.

9. Type-cast unsafe as Record<string, string>
Fichier : app/page.tsx lignes ~32, 34, 129, 165

Remplacer par un type guard : if (tech in listLogos).

BAS
#	Fichier	Problème
10	app/components/Footer/Footer.tsx	URL LinkedIn pointe vers john-doe (placeholder)
11	app/projets/page.tsx	Le tableau projectsData est parcouru 3 fois; cacher les résultats filtrés
12	Plusieurs fichiers	Mélange camelCase / snake_case (subjectPath, const test) — activer ESLint + Prettier
13	Projet entier	Pas de fichier .env.example; les variables d'environnement requises ne sont pas documentées
14	app/globals.css	Les règles .prose-custom sont volumineuses; supprimer celles inutilisées après audit
Résumé des priorités
Immédiat — sanitiser le HTML markdown (XSS), remplacer les <a> par <Link>
Court terme — ajouter error.tsx + loading.tsx sur [slug] et [slug]/tutoriel, connecter le formulaire de contact à un vrai service, supprimer le console.log
Améliorations — corriger le hook useIsMobile, valider chapterNum, nettoyer le composant Navigation mort
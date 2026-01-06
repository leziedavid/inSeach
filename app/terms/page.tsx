"use client";

import { useEffect, useState } from "react"
import Link from "next/link"
import WhatsAppButton from "@/components/home/WhatsAppButton";

export default function Page() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Format de date : JJ/MM/AAAA
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#ffffff] relative overflow-hidden">
      <div className="bg-[#ffffff] w-full max-w-md h-screen flex flex-col rounded-3xl overflow-hidden">

        {/* HEADER PERSONNALISÉ avec retour + titre */}
        <div className="flex items-center justify-between w-full px-6 pt-6 pb-3 shrink-0">
          {/* Partie gauche : Retour + Titre */}
          <Link href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left w-5 h-5 text-slate-800" >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            <h1 className="text-slate-800 font-semibold text-md">Conditions Générales d'Utilisation</h1>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-24 hide-scrollbar border-t border-slate-200 shadow-md">
          <div className="text-sm text-slate-500 mb-2">
            Date de mise à jour : {currentDate}
          </div>

          <p className="text-sm text-slate-600">
            Bienvenue sur InSeach, la plateforme de mise en relation entre particuliers et
            professionnels des services à domicile (électriciens, plombiers, artisans, etc.).
          </p>

          <p className="text-sm text-slate-600">
            En accédant ou en utilisant les services de InSeach, vous acceptez pleinement et
            sans réserve les présentes Conditions Générales d'Utilisation (ci-après les « CGU »).
            Si vous n'êtes pas en accord avec ces conditions, veuillez ne pas utiliser nos services.
          </p>

          <h2 className="text-sm font-medium text-slate-800 mt-4">1. Objet des CGU</h2>
          <p className="text-sm text-slate-600">
            Les présentes CGU régissent l'accès et l'utilisation de la plateforme InSeach qui met en relation des particuliers (ci-après « Clients ») avec des professionnels des services à domicile (ci-après « Professionnels » ou « Prestataires »). La plateforme facilite la recherche, la réservation, le paiement et l'évaluation de services.
          </p>

          <h2 className="text-sm font-medium text-slate-800 mt-4">2. Acceptation des CGU</h2>
          <p className="text-sm text-slate-600">
            L'accès à InSeach implique votre acceptation sans condition des présentes CGU. En utilisant nos services, vous certifiez avoir pris connaissance des CGU et acceptez de les respecter. Si vous utilisez la plateforme en tant que représentant d'une entreprise, vous garantissez avoir l'autorité pour engager cette dernière.
          </p>

          <h2 className="text-sm font-medium text-slate-800 mt-4">3. Inscription et accès aux services</h2>

          <h3 className="text-md font-medium text-slate-800">3.1 Conditions d'inscription</h3>
          <p className="text-sm text-slate-600">
            L'inscription est gratuite et ouverte aux personnes physiques majeures ou aux personnes morales représentées par une personne majeure et habilitée. Les Professionnels doivent fournir les justificatifs nécessaires à la vérification de leurs qualifications, assurances et autorisations d'exercer.
          </p>

          <h3 className="text-md font-medium text-slate-800">3.2 Création de compte</h3>
          <p className="text-sm text-slate-600">
            Vous devez créer un compte en fournissant des informations véridiques, exactes et à jour. Vous êtes seul responsable de la sécurité de vos identifiants et devez immédiatement informer InSeach en cas d'utilisation non autorisée de votre compte.
          </p>

          <h3 className="text-md font-medium text-slate-800">3.3 Vérification des Professionnels</h3>
          <p className="text-sm text-slate-600">
            InSeach procède à une vérification des documents fournis par les Professionnels (diplômes, assurances, statuts, etc.). Cette vérification ne constitue pas une garantie de la qualité des prestations, et InSeach ne saurait être tenue responsable des actes ou omissions des Professionnels.
          </p>

          <h2 className="text-sm font-medium text-slate-800 mt-4">4. Services proposés</h2>
          <p className="text-sm text-slate-600">InSeach offre aux utilisateurs les services suivants :</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
            <li>Pour les Clients : Recherche, mise en relation, réservation et paiement sécurisé de services auprès de Professionnels vérifiés.</li>
            <li>Pour les Professionnels : Accès à une clientèle, outils de gestion des demandes, de planning et de facturation.</li>
            <li>Système d'évaluation et de notation mutuelle après chaque prestation.</li>
            <li>Service de médiation en cas de litige (sous conditions définies).</li>
          </ul>

          <h2 className="text-sm font-medium text-slate-800 mt-4">5. Nature de la plateforme</h2>
          <p className="text-sm text-slate-600">
            InSeach est un intermédiaire technique. La plateforme ne fournit pas directement les services à domicile et n'est pas partie au contrat de prestation de services qui est conclu directement entre le Client et le Professionnel. InSeach n'est pas un employeur des Professionnels, qui agissent en toute indépendance.
          </p>

          <h2 className="text-sm font-medium text-slate-800 mt-4">6. Obligations des utilisateurs</h2>

          <h5 className="text-sm font-medium text-slate-800">6.1 Obligations du Client</h5>
          <p className="text-sm text-slate-600">Le Client s'engage à :</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
            <li>Fournir une description claire et exacte du besoin.</li>
            <li>Respecter les rendez-vous pris et prévenir en cas d'empêchement.</li>
            <li>Mettre à disposition les éléments nécessaires à la bonne exécution de la prestation.</li>
            <li>Régler le prix convenu via les moyens de paiement proposés par la plateforme.</li>
            <li>Évaluer la prestation de manière objective et proportionnée.</li>
          </ul>

          <h3 className="text-sm font-medium text-slate-800">6.2 Obligations du Professionnel</h3>
          <p className="text-sm text-slate-600">Le Professionnel s'engage à :</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
            <li>Posséder les qualifications, assurances (RC Pro, décennale le cas échéant) et autorisations légales requises pour exercer.</li>
            <li>Respecter les rendez-vous et les délais convenus.</li>
            <li>Fournir une prestation conforme aux règles de l'art, aux normes en vigueur et à la description acceptée.</li>
            <li>Facturer uniquement via les outils de la plateforme.</li>
            <li>Ne pas entrer en contact direct avec un Client rencontré sur la plateforme pour contourner celle-ci (prohibition du débauchage).</li>
          </ul>

          <p className="mt-2 text-sm text-slate-600">Toute violation peut entraîner la suspension ou la résiliation immédiate du compte.</p>

          <h2 className="text-sm font-medium text-slate-800 mt-4 ">7. Tarifs, paiement et facturation</h2>
          <p className="mt-2 text-sm text-slate-600">
            Les tarifs sont librement fixés par le Professionnel et indiqués sur la plateforme. Ils doivent être TTC et inclure tous les coûts (main d'œuvre, déplacement, fournitures si incluses). Le paiement est sécurisé et peut être débité à la réservation (acompte) ou après la prestation, selon le service. InSeach perçoit une commission sur chaque transaction réussie, dont le taux est communiqué aux Professionnels.
          </p>

          <h2 className="text-sm font-medium text-slate-800 mt-4">8. Responsabilités</h2>

          <h3 className="text-sm font-medium text-slate-800">8.1 Responsabilité de la plateforme</h3>
          <p className="mt-2 text-sm text-slate-600">
            InSeach s'engage à mettre en œuvre tous les moyens raisonnables pour assurer la disponibilité et la sécurité technique de la plateforme. Sa responsabilité est limitée au fonctionnement de l'outil de mise en relation. InSeach décline toute responsabilité concernant :
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
            <li>La qualité, la légalité ou la sécurité des prestations réalisées par les Professionnels.</li>
            <li>Les dommages causés lors des prestations (responsabilité du Professionnel et/ou de son assurance).</li>
            <li>Les litiges directs entre Clients et Professionnels concernant l'exécution du service.</li>
            <li>L'exactitude des informations publiées par les Professionnels sur leur profil.</li>
          </ul>

          <h3 className="text-sm font-medium text-slate-800">8.2 Responsabilité des Professionnels</h3>
          <p className="mt-2 text-sm text-slate-600">
            Le Professionnel est seul responsable de l'exécution de ses prestations et des dommages qui pourraient en résulter. Il doit être couvert par une assurance responsabilité civile professionnelle adaptée à son activité.
          </p>

          <h3 className="text-sm font-medium text-slate-800">8.3 Responsabilité des Clients</h3>
          <p className="mt-2 text-sm text-slate-600">Le Client est responsable des informations qu'il fournit et des conditions d'accueil du Professionnel sur son lieu d'intervention.</p>

          <h2 className="text-sm font-medium text-slate-800 mt-4">9. Protection des données personnelles</h2>
          <p className="mt-2 text-sm text-slate-600">
            InSeach collecte et traite vos données conformément à sa Politique de Confidentialité et au Règlement Général sur la Protection des Données (RGPD). Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et de portabilité de vos données en contactant notre DPO à dpo@[votredomaine].com.
          </p>

          <h2 className="text-sm font-medium text-slate-800 mt-4">10. Propriété intellectuelle</h2>
          <p className="mt-2 text-sm text-slate-600">
            Tous les contenus de la plateforme (logos, marques, design, base de données, logiciels) sont la propriété exclusive de InSeach ou de ses concédants. Toute reproduction ou utilisation non autorisée est interdite.
          </p>

          <h2 className="text-sm font-medium text-slate-800 mt-4">11. Modification des CGU</h2>
          <p className="mt-2 text-sm text-slate-600">
            InSeach se réserve le droit de modifier ces CGU. Les utilisateurs en seront informés par email ou via une notification sur la plateforme au moins 15 jours avant leur entrée en vigueur. L'utilisation continue des services vaut acceptation des nouvelles CGU.
          </p>

          <h2 className="text-sm font-medium text-slate-800 mt-4">12. Médiation et litiges</h2>
          <p className="mt-2 text-sm text-slate-600">
            En cas de litige, les parties s'engagent à rechercher une solution amiable. InSeach peut offrir un service de médiation. À défaut, les tribunaux du lieu du siège social de InSeach seront compétents, sous réserve des règles impératives de compétence.
          </p>

          <h2 className="text-sm font-medium text-slate-800 mt-4">13. Résiliation</h2>
          <p className="mt-2 text-sm text-slate-600">
            Vous pouvez fermer votre compte à tout moment via les paramètres ou en nous contactant. InSeach peut suspendre ou résilier un compte en cas de violation des CGU, avec notification préalable sauf urgence.
          </p>

          <h2 className="text-sm font-medium text-slate-800 mt-4">14. Contact</h2>
          <p className="mt-2 text-sm text-slate-600">Pour toute question concernant les présentes CGU : support@[votredomaine].com</p>

          <div className="mt-6 p-4 border-2 border-slate-100 rounded-lg">
            <h3 className="text-sm font-medium text-slate-800 mb-2">Informations sur l'entreprise</h3>
            <p className="text-sm text-slate-600">
              <strong>RAISON SOCIALE :</strong> [VOTRE RAISON SOCIALE]<br />
              <strong>FORME JURIDIQUE :</strong> [SARL/SAS/etc.]<br />
              <strong>CAPITAL SOCIAL :</strong> [Montant] [Devise]<br />
              <strong>ADRESSE DU SIÈGE :</strong> [Votre adresse complète]<br />
              <strong>SIRET :</strong> [Votre numéro SIRET]<br />
              <strong>RCS :</strong> [Ville du RCS] [Numéro RCS]
            </p>
          </div>
        </div>

      </div>

      <WhatsAppButton />
    </main>
  );
}
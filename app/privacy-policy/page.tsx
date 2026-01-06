"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import WhatsAppButton from "@/components/home/WhatsAppButton";

export default function Page() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Format de date : JJ/MM/AAAA
    const today = new Date();
    const formattedDate = `${today
      .getDate()
      .toString()
      .padStart(2, "0")}/${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${today.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#ffffff] relative overflow-hidden">
      <div className="bg-[#ffffff] w-full max-w-md h-screen flex flex-col rounded-3xl overflow-hidden">
        {/* HEADER PERSONNALISÉ avec retour + titre */}
        <div className="flex items-center justify-between w-full px-6 pt-6 pb-3 shrink-0">
          {/* Partie gauche : Retour + Titre */}
          <Link href="/" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left w-5 h-5 text-slate-800"
            >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            <h1 className="text-slate-800 font-semibold text-md">
              Conditions Générales d'Utilisation
            </h1>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-24 hide-scrollbar border-t border-slate-200 shadow-md">
          <div className="space-y-4 text-slate-700">
            <div className="text-sm text-slate-500">
              Date de mise à jour : {currentDate}
            </div>
            <p className="font-medium">[NOM DE VOTRE ENTREPRISE]</p>
            <p>
              [NOM DE VOTRE ENTREPRISE] (« InSeach »), [forme juridique] au
              capital de [montant], met un point d'honneur à protéger vos
              données personnelles et à respecter votre vie privée. La
              présente Politique de Confidentialité explique comment nous
              recueillons, utilisons, conservons et partageons vos données
              lorsque vous utilisez nos services.
            </p>
            <p>
              Cette politique s'applique à l'ensemble de nos services,
              y compris l'application mobile InSeach (iOS et Android), le site
              internet et tout service accessible depuis notre plateforme de
              mise en relation entre particuliers et professionnels des
              services à domicile.
            </p>

            <h2 className="text-lg font-medium text-slate-800 mt-4">
              1. Informations que nous recueillons
            </h2>
            <p>
              Nous collectons différentes informations en fonction de votre
              utilisation d'InSeach, afin d'assurer le bon fonctionnement de
              notre plateforme et de vous fournir une expérience utilisateur
              optimale.
            </p>

            <h3 className="text-md font-medium text-slate-800">
              A. Données personnelles que vous fournissez directement
            </h3>
            <p>
              Lorsque vous vous inscrivez sur InSeach ou utilisez nos services,
              nous pouvons recueillir les informations suivantes :
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Données d'identification : nom, prénom, numéro de téléphone, e-mail, adresse.</li>
              <li>Vérification de profil : pièces d'identité, qualifications professionnelles, certifications pour les artisans et professionnels.</li>
              <li>Données de profil : photo, description des services, zones d'intervention, avis et évaluations.</li>
              <li>Données transactionnelles : devis, factures, historique des prestations.</li>
              <li>Données de connexion : identifiants de connexion, adresses IP, journaux de connexion.</li>
            </ul>

            <h3 className="text-md font-medium text-slate-800">
              B. Données collectées indirectement
            </h3>
            <p>
              Nous collectons également des données via des partenaires et des
              services tiers, notamment :
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Données de navigation via des cookies (le cas échéant).</li>
              <li>Informations provenant des systèmes de paiement pour faciliter les transactions.</li>
              <li>Données de géolocalisation pour proposer des professionnels à proximité.</li>
            </ul>

            <h2 className="text-lg font-medium text-slate-800 mt-4">
              2. Utilisation de vos données
            </h2>
            <p>
              Vos données personnelles sont collectées et traitées dans le cadre des objectifs suivants :
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gestion de votre compte : création de votre profil, mise en relation avec des professionnels/particuliers.</li>
              <li>Vérification des profils : afin de garantir la qualité et la sécurité des services proposés sur notre plateforme.</li>
              <li>Amélioration du service : analyse des données pour optimiser l'expérience utilisateur et ajuster nos services.</li>
              <li>Respect des obligations légales : conformité avec les lois en vigueur en matière de protection des données.</li>
              <li>Communications opérationnelles : informations relatives à vos demandes de service, rendez-vous, évaluations.</li>
              <li>Communications marketing : avec votre consentement, nous pouvons vous informer concernant nos nouveaux services et promotions.</li>
            </ul>

            <h3 className="text-md font-medium text-slate-800 mt-3">
              Communications et notifications
            </h3>
            <p>
              En utilisant nos services, vous acceptez de recevoir des communications relatives à votre compte, aux demandes de service et aux mises en relation. Avec votre consentement explicite, nous pourrons également vous notifier concernant d'autres services InSeach qui pourraient vous intéresser.
            </p>
            <p className="mt-2">
              Vous pouvez à tout moment vous désinscrire des communications marketing en nous contactant à [adresse email de support] ou en utilisant le lien de désinscription présent dans nos emails.
            </p>

            {/* Suite des sections ... */}
            <div className="mt-6 p-4 border-2 border-slate-100 rounded-lg">
              <h3 className="text-md font-medium text-slate-800 mb-2">Informations sur l'entreprise</h3>
              <p className="text-sm">
                <strong>RAISON SOCIALE :</strong> [À COMPLÉTER]<br />
                <strong>FORME JURIDIQUE :</strong> [À COMPLÉTER]<br />
                <strong>CAPITAL SOCIAL :</strong> [À COMPLÉTER]<br />
                <strong>ADRESSE DU SIÈGE :</strong> [À COMPLÉTER]<br />
                <strong>N° RCCM :</strong> [À COMPLÉTER]<br />
                <strong>EMAIL DE CONTACT :</strong> [À COMPLÉTER]
              </p>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </main>
  );
}

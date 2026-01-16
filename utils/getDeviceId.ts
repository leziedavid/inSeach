/**
 * Génère un identifiant unique pour l'appareil
 * Utilise crypto.randomUUID() si disponible, sinon génère un UUID v4 manuel
 */
function generateDeviceId(): string {
	// Méthode 1: Utiliser crypto.randomUUID() (moderne)
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return crypto.randomUUID();
	}

	// Méthode 2: Générer un UUID v4 manuellement (fallback)
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

/**
 * Récupère le deviceId depuis le localStorage
 * Si aucun deviceId n'existe, en génère un nouveau et le sauvegarde
 * 
 * @returns {string} Le deviceId unique pour cet appareil
 */
export function getDeviceId(): string {
	const STORAGE_KEY = 'deviceId';

	try {
		// Vérifier si on est côté client
		if (typeof window === 'undefined') {
			console.warn('getDeviceId appelé côté serveur');
			return '';
		}

		// Essayer de récupérer le deviceId existant
		let deviceId = localStorage.getItem(STORAGE_KEY);

		// Si pas de deviceId, en créer un nouveau
		if (!deviceId) {
			deviceId = generateDeviceId();
			localStorage.setItem(STORAGE_KEY, deviceId);
			console.log('Nouveau deviceId généré:', deviceId);
		}

		return deviceId;
	} catch (error) {
		console.error('Erreur lors de la récupération/génération du deviceId:', error);
		// En cas d'erreur (ex: localStorage bloqué), générer un ID temporaire
		return generateDeviceId();
	}
}

/**
 * Réinitialise le deviceId (utile pour le logout ou reset)
 * 
 * @returns {string} Le nouveau deviceId généré
 */
export function resetDeviceId(): string {
	const STORAGE_KEY = 'deviceId';

	try {
		const newDeviceId = generateDeviceId();
		localStorage.setItem(STORAGE_KEY, newDeviceId);
		console.log('DeviceId réinitialisé:', newDeviceId);
		return newDeviceId;
	} catch (error) {
		console.error('Erreur lors de la réinitialisation du deviceId:', error);
		return generateDeviceId();
	}
}

/**
 * Vérifie si un deviceId existe déjà
 * 
 * @returns {boolean} True si un deviceId existe
 */
export function hasDeviceId(): boolean {
	try {
		if (typeof window === 'undefined') return false;
		return !!localStorage.getItem('deviceId');
	} catch (error) {
		return false;
	}
}

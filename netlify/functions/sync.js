// Variable globale simple pour stocker les effectifs en mémoire
let cachedStaff = [];

exports.handler = async function(event, context) {
    // Si le bot Discord envoie les données (Méthode POST)
    if (event.httpMethod === "POST") {
        try {
            const authHeader = event.headers['x-admin-password'];
            const ADMIN_SECRET = process.env.ADMIN_PASSWORD; // Récupéré depuis Netlify

            // Vérification de sécurité du mot de passe
            if (authHeader !== ADMIN_SECRET) {
                return { statusCode: 403, body: JSON.stringify({ error: "Accès refusé : Mot de passe incorrect" }) };
            }

            const data = JSON.parse(event.body);
            cachedStaff = data.staff || []; // Sauvegarde des effectifs

            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, message: "Effectifs synchronisés avec succès !" })
            }
        } catch (error) {
            return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
        }
    }

    // Si le site web demande la liste pour l'afficher (Méthode GET)
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cachedStaff)
        };
    }

    return { statusCode: 405, body: "Méthode non autorisée" };
};
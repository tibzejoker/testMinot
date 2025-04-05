const http = require('http');
const fs = require('fs');
const path = require('path');

// --- Configuration ---
const PORT = 3000; // Port sur lequel le serveur écoutera
const HOSTNAME = '127.0.0.1'; // Adresse locale (localhost)
const HTML_FILE = 'minotheisme.html'; // Nom de votre fichier HTML
const IMAGE_FILE = 'minot.png'; // Nom de votre image
// --------------------

// Fonction pour déterminer le Content-Type basé sur l'extension
function getContentType(filePath) {
    const extname = path.extname(filePath).toLowerCase();
    switch (extname) {
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'application/javascript';
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.gif':
            return 'image/gif';
        case '.svg':
            return 'image/svg+xml';
        default:
            return 'application/octet-stream'; // Type binaire par défaut
    }
}

// Création du serveur HTTP
const server = http.createServer((req, res) => {
    console.log(`Requête reçue pour : ${req.url}`);

    let filePath;
    let contentType;

    // Routage simple
    if (req.url === '/' || req.url === `/${HTML_FILE}`) {
        // Servir la page HTML par défaut ou si elle est demandée explicitement
        filePath = path.join(__dirname, HTML_FILE);
        contentType = 'text/html';
    } else if (req.url === `/${IMAGE_FILE}`) {
        // Servir l'image si elle est demandée
        filePath = path.join(__dirname, IMAGE_FILE);
        contentType = 'image/png'; // On sait que c'est un png
    } else {
        // Si ce n'est ni l'HTML ni l'image connue, on cherche le fichier
        // (Utile si vous ajoutez CSS ou JS plus tard, mais attention à la sécurité)
        // Pour ce cas simple, on peut juste renvoyer 404 pour tout le reste
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return; // Important de sortir ici pour ne pas lire de fichier

        // Code plus permissif (mais moins sûr pour un exemple simple) :
        // filePath = path.join(__dirname, req.url);
        // contentType = getContentType(filePath);
    }

    // Lire le fichier demandé
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // Si erreur de lecture (ex: fichier non trouvé)
            if (err.code === 'ENOENT') {
                console.error(`Erreur: Fichier non trouvé - ${filePath}`);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                // Autre erreur serveur
                console.error(`Erreur serveur lors de la lecture de ${filePath}: ${err}`);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
            }
        } else {
            // Si fichier lu avec succès
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content); // Envoyer le contenu du fichier
            console.log(`Fichier servi: ${filePath} (${contentType})`);
        }
    });
});

// Démarrage du serveur
server.listen(PORT, HOSTNAME, () => {
    console.log(`--- Serveur Minothéisme (pour la blague) démarré ---`);
    console.log(`Accédez au site via : http://${HOSTNAME}:${PORT}/`);
    console.log(`Assurez-vous que les fichiers ${HTML_FILE} et ${IMAGE_FILE} sont dans le même dossier que server.js.`);
    console.log(`Dans ${HTML_FILE}, l'image doit avoir src="/${IMAGE_FILE}"`);
    console.log(`Appuyez sur CTRL+C pour arrêter le serveur.`);
});
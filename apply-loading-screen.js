const fs = require('fs');
const path = require('path');

// Configuration de l'écran de chargement TMC
const loadingScreenCSS = `
    /* Loading Screen Styles */
    .loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #068953, #0a57a4);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.5s ease-out, visibility 0.5s ease-out;
    }
    
    .loading-screen.hidden {
        opacity: 0;
        visibility: hidden;
    }
    
    .loading-content {
        text-align: center;
        color: white;
    }
    
    .loading-logo {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        margin-bottom: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: logo-pulse 2s ease-in-out infinite;
    }
    
    @keyframes logo-pulse {
        0%, 100% {
            transform: scale(1);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        50% {
            transform: scale(1.05);
            box-shadow: 0 15px 40px rgba(0,0,0,0.4);
        }
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255,255,255,0.3);
        border-top: 3px solid white;
        border-radius: 50%;
        margin: 20px auto;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .loading-text {
        font-size: 18px;
        font-weight: 600;
        margin-top: 15px;
        opacity: 0.9;
        animation: text-fade 2s ease-in-out infinite;
    }
    
    @keyframes text-fade {
        0%, 100% { opacity: 0.9; }
        50% { opacity: 0.6; }
    }
`;

const loadingScreenHTML = `
    <!-- Loading Screen avec Logo TMC -->
    <div id="loading-screen" class="loading-screen">
        <div class="loading-content">
            <img src="Assetstmc/tmclogo/toglogo.jpg" alt="TMC Logo" class="loading-logo">
            <div class="loading-spinner"></div>
            <p class="loading-text">Chargement...</p>
        </div>
    </div>
`;

const loadingScreenJS = `
    <!-- Script pour l'écran de chargement -->
    <script>
        // Gestion de l'écran de chargement
        document.addEventListener('DOMContentLoaded', function() {
            const loadingScreen = document.getElementById('loading-screen');
            
            // Masquer l'écran de chargement après 2 secondes
            setTimeout(function() {
                loadingScreen.classList.add('hidden');
                
                // Supprimer complètement l'élément après l'animation
                setTimeout(function() {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 2000);
            
            // Masquer immédiatement si la page est déjà chargée
            if (document.readyState === 'complete') {
                loadingScreen.classList.add('hidden');
                setTimeout(function() {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        });
        
        // Masquer l'écran de chargement quand la page est complètement chargée
        window.addEventListener('load', function() {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
                loadingScreen.classList.add('hidden');
                setTimeout(function() {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        });
    </script>
`;

// Fonction pour appliquer l'écran de chargement sur un fichier HTML
function applyLoadingScreen(filePath) {
    try {
        console.log(`📄 Traitement de: ${filePath}`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Vérifier si l'écran de chargement est déjà présent
        if (content.includes('loading-screen')) {
            console.log(`⚠️  ${filePath} - Écran de chargement déjà présent`);
            return;
        }
        
        // Ajouter le CSS dans le head
        if (content.includes('</head>')) {
            content = content.replace('</head>', `    <style>${loadingScreenCSS}</style>\n</head>`);
            console.log(`✅ CSS ajouté dans ${filePath}`);
        }
        
        // Remplacer le preloader existant ou ajouter après <body>
        if (content.includes('preloader')) {
            // Remplacer le preloader existant
            content = content.replace(/<!--\s*preloader[^>]*-->\s*<div[^>]*id="preloader"[^>]*>[\s\S]*?<\/div>\s*<!--\s*preloader[^>]*-->/gi, loadingScreenHTML);
            console.log(`✅ Preloader remplacé dans ${filePath}`);
        } else {
            // Ajouter après l'ouverture de <body>
            content = content.replace('<body', `<body>\n${loadingScreenHTML}`);
            console.log(`✅ HTML ajouté dans ${filePath}`);
        }
        
        // Ajouter le JavaScript avant la fermeture de </body>
        if (content.includes('</body>')) {
            content = content.replace('</body>', `${loadingScreenJS}\n</body>`);
            console.log(`✅ JavaScript ajouté dans ${filePath}`);
        }
        
        // Écrire le fichier modifié
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${filePath} - Écran de chargement TMC ajouté avec succès`);
        
    } catch (error) {
        console.error(`❌ Erreur lors du traitement de ${filePath}:`, error.message);
    }
}

// Fonction pour trouver tous les fichiers HTML
function findHTMLFiles(dir) {
    const files = [];
    
    function scanDirectory(currentDir) {
        try {
            const items = fs.readdirSync(currentDir);
            
            for (const item of items) {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                    scanDirectory(fullPath);
                } else if (item.endsWith('.html')) {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            console.error(`❌ Erreur lors du scan du répertoire ${currentDir}:`, error.message);
        }
    }
    
    scanDirectory(dir);
    return files;
}

// Application principale
function main() {
    console.log('🚀 Démarrage de l\'application de l\'écran de chargement TMC...');
    
    const htmlFiles = findHTMLFiles('.');
    
    console.log(`🎯 Trouvé ${htmlFiles.length} fichiers HTML:`);
    htmlFiles.forEach(file => console.log(`   - ${file}`));
    
    console.log('\n📝 Application de l\'écran de chargement TMC...\n');
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (const file of htmlFiles) {
        try {
            const originalContent = fs.readFileSync(file, 'utf8');
            
            // Vérifier si l'écran de chargement est déjà présent
            if (originalContent.includes('loading-screen')) {
                console.log(`⚠️  ${file} - Écran de chargement déjà présent`);
                skipCount++;
                continue;
            }
            
            applyLoadingScreen(file);
            successCount++;
            
        } catch (error) {
            console.error(`❌ Erreur avec ${file}:`, error.message);
            errorCount++;
        }
    }
    
    console.log('\n📊 Résumé:');
    console.log(`   ✅ Succès: ${successCount}`);
    console.log(`   ⚠️  Ignorés: ${skipCount}`);
    console.log(`   ❌ Erreurs: ${errorCount}`);
    console.log('\n✨ Application terminée !');
}

// Exécuter le script
if (require.main === module) {
    main();
}

module.exports = { applyLoadingScreen, findHTMLFiles };

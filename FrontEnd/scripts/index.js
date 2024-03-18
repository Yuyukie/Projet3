// Fonction de récupération des données depuis l'API
async function recuperationDonnees() {
    // Récupération des projets
    const responseProjet = await fetch("http://localhost:5678/api/works");
    const projets = await responseProjet.json();

    // Récupération des catégories
    const responseCategorie = await fetch("http://localhost:5678/api/categories");
    const categories = await responseCategorie.json();

    // Utilisation d'un Set pour stocker les identifiants des projets
    const idProjets = new Set();

    // Ajoute un identifiants à chaque projet
    for (let i = 0; i < projets.length; i++) {
        idProjets.add(projets[i].id);
    }
    // Génération des projets avec les données récupérées
    genererProjets(projets, categories);
    // Vérification projets avec un id respectifs et sa categories attitré
    console.log(projets, categories);

    // Ajout des écouteurs d'événements aux boutons de filtre
    const filtresButtons = document.querySelectorAll('.filtres-button');
    for (let i = 0; i < filtresButtons.length; i++) {
        filtresButtons[i].addEventListener('click', function() {
            filtrerProjets(this.value, projets, categories); //grace a this.value on pointe sur la valeur du bouton sur lequel on a cliqué pour ensuite le compare au categorie d'objet. 
        });
    }
}

// Fonction de génération des projets dans le DOM
function genererProjets(projets, categories) {
    // Récupération de l'élément du DOM qui accueillera les projets
    const sectionProjet = document.querySelector(".gallery");
    // Supprimer tous les projets existants dans la galerie
    sectionProjet.innerHTML = '';
    // Vérification si sectionProjet est null avant d'ajouter des éléments
    if (sectionProjet) {
        // Création des éléments pour chaque projet
        for (let i = 0; i < projets.length; i++) {
            const projet = projets[i];

            // Création d’une balise dédiée à un projet
            const projetElement = document.createElement("div");
            projetElement.dataset.id = projet.id;

            // Création des balises pour les informations du projet
            const nomElement = document.createElement("h2");
            nomElement.innerText = projet.title;

            const imageElement = document.createElement("img");
            imageElement.src = projet.imageUrl;

            // Récupération de la catégorie du projet à partir de son identifiant
            const categorie = categories.find(cat => cat.id === projet.categoryId);

            // Ajout des balises au projet
            projetElement.appendChild(nomElement);
            projetElement.appendChild(imageElement);

            // Ajout du projet à la section
            sectionProjet.appendChild(projetElement);
        }
    }
}

// Fonction de filtrage des projets
function filtrerProjets(categorie, projets, categories) {
    const sectionProjet = document.querySelector('.gallery');
    if (sectionProjet) {
        // Afficher tous les projets
        const projetElements = document.querySelectorAll('.gallery > div');
        for (let i = 0; i < projetElements.length; i++) {
            projetElements[i].style.display = 'block';
        }

        // Cacher les projets qui ne correspondent pas à la catégorie sélectionnée
        if (categorie !== 'Tous') {
            for (let i = 0; i < projets.length; i++) {
                const projet = projets[i];
                const projetElement = document.querySelector(`[data-id="${projet.id}"]`);
                const categorieProjet = categories.find(cat => cat.id === projet.categoryId);
                if (categorieProjet && categorieProjet.name !== categorie) {
                    projetElement.style.display = 'none';
                }
            }
        }
    }
}

recuperationDonnees();
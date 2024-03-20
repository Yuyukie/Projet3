// Récupération des projets depuis l'API
const responseProjet = await fetch("http://localhost:5678/api/works");
const projets = await responseProjet.json();

// Récupération des catégories depuis l'API
const responseCategorie = await fetch("http://localhost:5678/api/categories");
const categories = await responseCategorie.json();
 
// Utilisation d'un Set pour stocker les identifiants uniques des projets
const idProjets = new Set();
// Ajout des identifiants de chaque projet dans le Set
for (let i = 0; i < projets.length; i++) {
    idProjets.add(projets[i].id);
}

function genererProjet(){
    let area1 = document.querySelector(".gallery")
    creerItemProjets(projets, categories, area1);
}

// Fonction de génération des projets dans le DOM
function creerItemProjets(projets, categories, area) {
    // Récupération de l'élément du DOM qui accueillera les projets
    const sectionProjet = area;
    // Supprimer tous les projets existants dans la galerie
    sectionProjet.innerHTML = '';
    // Vérification si sectionProjet n'est pas null avant d'ajouter des éléments
    if (sectionProjet) {
        // Création des éléments pour chaque projet
        for (let i = 0; i < projets.length; i++) {
            const projet = projets[i];

            // Création d’un élément pour chaque projet
            const projetElement = document.createElement("div");
            projetElement.dataset.id = projet.id;

            // Création des balises pour les informations du projet
            const imageElement = document.createElement("img");
            imageElement.src = projet.imageUrl;
            const nomElement = document.createElement("p");
            nomElement.innerText = projet.title;
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
function gestionFiltre() {
     // Ajout des écouteurs d'événements aux boutons de filtre
     const filtresButtons = document.querySelectorAll('.filtres-button');
     for (let i = 0; i < filtresButtons.length; i++) {
         filtresButtons[i].addEventListener('click', function() {
             // Appel de la fonction pour filtrer les projets en fonction de la catégorie sélectionnée
             filtrerProjets(this.value, projets, categories);
         });
     }
}
// Fonction de filtrage des projets
function filtrerProjets(categorie, projets, categories) {
    // Récupération de la section contenant les projets
    const sectionProjet = document.querySelector('.gallery');
    if (sectionProjet) {
        // Affichage de tous les projets
        const projetElements = document.querySelectorAll('.gallery > div');
        for (let i = 0; i < projetElements.length; i++) {
            projetElements[i].style.display = 'block';
        }

        // Masquage des projets qui ne correspondent pas à la catégorie sélectionnée
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

function modeEditeur () {
    const utilisateurAuthentifier = window.localStorage.getItem("token");
    if(utilisateurAuthentifier){

        const editBar = document.querySelector(".edit-bar")
        editBar.style.display ="flex";

        const logOutLink = document.getElementById("logLink");
        logOutLink.innerText = "logout";
        logOutLink.href = "";

        const elementsFiltres = document.querySelector(".filtres");
        elementsFiltres.style.display = 'none';

        const elementsModal = document.querySelector(".button-modal");
        elementsModal.style.display = 'flex';
    }
    const logOutLink = document.getElementById("logLink");
    logOutLink.addEventListener ("click", logout);
    
        function logout(){
        window.localStorage.removeItem("token");
        location.reload("index.html");
}
}


function gestionModal(){
    fermerModal();
    afficherModal();
    chargerContenuModal();

}
function afficherModal (){
    const modal = document.querySelector(".modal");
    const btnModal= document.getElementById("open-modal");
    btnModal.addEventListener("click", () => {    
        modal.style.display = "flex";
    })
}

function fermerModal(){
    const modal = document.querySelector(".modal");
    const btnModal= document.getElementById("close-modal");
    btnModal.addEventListener("click", () => {    
        modal.style.display = "none";
    })
}

function chargerContenuModal() {
    // Récupérer l'élément contenant le contenu de la galerie
    const contenuGalerie = document.querySelector("#gallery");
    // Récupérer l'élément où le contenu sera chargé dans la modale
    const contenuModal = document.querySelector(".gallery-modal");
    // Charger le contenu de la galerie dans la modale
    contenuModal.innerHTML = contenuGalerie.innerHTML;
    console.log(contenuModal) 
}


// Actions principales
genererProjet();
gestionFiltre();
gestionModal();
modeEditeur();




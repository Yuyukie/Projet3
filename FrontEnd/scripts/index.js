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

// Actions principales
genererProjet();
gestionFiltre();
gestionModal();
modeEditeur();



function genererProjet(){
    let area = document.querySelector(".gallery")
    creerItemProjets(area);
}

// Fonction de génération des projets dans le DOM
function creerItemProjets(area) {
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
    afficherModalVue1();
    creerContenuModal();
    afficherModalVue2 ();
    retourModalVue1 ();
    supprimerProjetParId();
}
function afficherModalVue1 (){
    const modal = document.querySelector(".modal");
    const btnModal= document.getElementById("open-modal");
    btnModal.addEventListener("click", () => {    
        modal.style.display = "flex";  
    })
}

function afficherModalVue2 (){
    const btnModal = document.getElementById("add-photo");
    btnModal.addEventListener("click", () => {    
        const titleModalVue2 = document.getElementById("title-modal-vue1");
        titleModalVue2.innerText = "Ajout photo";
        const areaModalVue2 = document.querySelector(".gallery-modal");
        areaModalVue2.style.display = "none"
        const validerPhoto = document.getElementById("add-photo");
        validerPhoto.innerText = "Valider";
        const uploadForm = document.getElementById("uploadForm");
        uploadForm.style.display = "flex"
        const iconeRetour = document.getElementById("retour");
        iconeRetour.style.display = "flex"
    })
}

function retourModalVue1 (){
    const btnModal = document.getElementById("retour");
    btnModal.addEventListener("click", () => {    
        const titleModalVue2 = document.getElementById("title-modal-vue1");
        titleModalVue2.innerText = "Gallerie photo";
        const areaModalVue2 = document.querySelector(".gallery-modal");
        areaModalVue2.style.display = "flex"
        const validerPhoto = document.getElementById("add-photo");
        validerPhoto.innerText = "Ajouter photo";
        const uploadForm = document.getElementById("uploadForm");
        uploadForm.style.display = "none"
        const iconeRetour = document.getElementById("retour");
        iconeRetour.style.display = "none"
    })
}

function fermerModal(){
    const modal = document.querySelector(".modal");
    const btnModal= document.getElementById("close-modal");
    btnModal.addEventListener("click", () => {    
        modal.style.display = "none";
    })
}

function creerContenuModal() {
    let area = document.querySelector(".gallery-modal");
    creerItemProjets(area);
    
    const elementsInternes = area.querySelectorAll('div');

        for (let i = 0; i < elementsInternes.length; i++) {
            const elementInterne = elementsInternes[i];
            elementInterne.style.position = 'relative';
        }
    
        const projetElements = document.querySelectorAll('.gallery-modal > div');
        
        for (let i = 0; i < projetElements.length; i++) {
            const elementProjet = projetElements[i];
            const paragraphe = elementProjet.querySelector('p');
            const image = elementProjet.querySelector('img');
            
            if (paragraphe) {
                paragraphe.remove();
            }
            
            if (image) {
                image.style.width = "78.12px";
                image.style.height = "104.08px";
                
                const iconeElement = document.createElement("button");
                iconeElement.classList.add("button-trash")
                const deleteIcon = document.createElement('i');
                deleteIcon.classList.add('fas', 'fa-trash-alt'); // Ajouter les classes pour l'icône de poubelle
                // Ajouter l'icône poubelle à l'élément projet
                elementProjet.appendChild(iconeElement);
                iconeElement.appendChild(deleteIcon);
            }
        }
}

function supprimerProjetParId() {
    const aSupprimer = document.querySelector(".button-trash");
    aSupprimer.addEventListener("click", (event) => {
        event.preventDefault();
        const parentID = event.target.parentNode.getAttribute('data-id');    
        const urlApi = "http://localhost:5678/api/works/{id}";
        const tokenAuth = window.localStorage.getItem("token");
        const url = `${urlApi}`;
        // Options de la requête DELETE
        const options = {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${tokenAuth}` }
        };
        // Envoi de la requête DELETE
        fetch(url, options)
            .then(response => {
                if (response.ok) {
                    console.log('Le projet a été supprimé avec succès.');
                } else {
                    console.error('Erreur lors de la suppression du projet:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Une erreur s\'est produite lors de la connexion à l\'API:', error);
            });
    })
    
}








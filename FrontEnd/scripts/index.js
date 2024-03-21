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

// Utilisation d'un Set pour stocker les identifiants uniques des categories
const idCategories = new Set();
// Ajout des identifiants de chaque categories dans le Set
for (let i = 0; i < categories.length; i++) {
    idCategories.add(categories[i].id);
}

// Actions principales
genererProjetDom();
gestionFiltre();
gestionModal();
modeEditeur();



function genererProjetDom(){
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
    genererProjetModal();
    afficherModalVue2 ();
    retourModalVue1 ();
    supprimerProjetParId();
    genererOptionsCategorie(categories);
   // gestionFormAjoutProjet();   
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
    btnModal.addEventListener("click", (event) => { 
        event.preventDefault();   
        const titleModalVue2 = document.getElementById("title-modal-vue1");
        titleModalVue2.innerText = "Ajout photo";
        const areaModalVue2 = document.querySelector(".gallery-modal");
        areaModalVue2.style.display = "none"
        const validerPhoto = document.getElementById("add-photo");
        validerPhoto.style.display = "none";
        const validerNon = document.getElementById("valider");
        validerNon.style.display = "flex";
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
        validerPhoto.innerText = "Ajout photo";
        validerPhoto.style.backgroundColor = "#1D6154";
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

function genererProjetModal() {
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
    // Récupérer tous les boutons de suppression
    const boutonsSuppression = document.querySelectorAll(".button-trash");

    // Boucle for pour parcourir les boutons de suppression et ajouter des écouteurs d'événements à chacun d'eux
    for (let i = 0; i < boutonsSuppression.length; i++) {
        const bouton = boutonsSuppression[i];
        bouton.addEventListener("click", (event) => {
            event.preventDefault();
            const parentID = event.currentTarget.parentNode.getAttribute('data-id');
            const urlApi = `http://localhost:5678/api/works/${parentID}`;
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
                        // Supprimer l'élément du DOM
                        event.currentTarget.parentNode.remove();
                        // Empêcher la fermeture de la modal
                        event.stopPropagation();
                    } else {
                        console.error('Erreur lors de la suppression du projet:', response.statusText);
                    }
                })
                .catch(error => {
                    console.error('Une erreur s\'est produite lors de la connexion à l\'API:', error);
                });     
        });
    }
}



async function gestionFormAjoutProjet() {
    try {
        // Récupérer l'élément input de type fichier
        const inputFichier = document.getElementById('fichier');
        // Récupérer la valeur du champ titre
        const titre = document.getElementById('titre').value;
        // Récupérer la valeur de la catégorie sélectionnée
        const categorie = document.getElementById('selectCategorie').value;
        // Sélectionner le bouton "Valider" avec l'ID "valider-oui"
        const boutonValiderOui = document.getElementById('valider-oui');
        // Ajouter un gestionnaire d'événements sur le click du bouton "Valider"
        boutonValiderOui.addEventListener('click', async (event) => {
        // Attendre la vérification du fichier
        const fichierValide = await verifierFichierUpload(inputFichier);
        if (!fichierValide) {
            return false; // Arrête l'exécution de la fonction si la vérification du fichier échoue
        }

        // Attendre la vérification du titre
        const titreValide = verifierTitreUpload(titre);
        if (!titreValide) {
            return false; // Arrête l'exécution de la fonction si la vérification du titre échoue
        }

        // Attendre la vérification de la catégorie
        const categorieValide = verifierCategorie(categorie);
        if (!categorieValide) {
            return false; // Arrête l'exécution de la fonction si la vérification de la catégorie échoue
        }

        // Si toutes les vérifications sont réussies, continuer avec l'ajout du nouveau projet
        const validerNon = document.getElementById("valider-non");
        validerNon.style.display= "none"
        const validerOui = document.getElementById("valider-oui");
        validerOui.style.display= "flex"
        
        ajoutNouveauProjet(inputFichier,titre,categorie);

        
            // Empêcher le comportement par défaut du lien
            event.preventDefault();
        });
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la gestion du formulaire :', error);
    }
}

function verifierFichierUpload(inputFichier) {
    // Vérifier si un fichier a été sélectionné
    if (inputFichier.files.length === 0) {
        alert('Veuillez sélectionner un fichier à télécharger.');
        return false; // Aucun fichier sélectionné
    } else {
        // Vérifier la taille du fichier
        var fichier = inputFichier.files[0];
        var tailleFichierMo = fichier.size / (1024 * 1024); // Convertir la taille en Mo
        if (tailleFichierMo > 4) {
            alert('Le fichier sélectionné dépasse la taille maximale autorisée (4 Mo).');
            return false; // La taille du fichier dépasse 4 Mo
        }
        return true; // Un fichier a été sélectionné et sa taille est valide
    }
}

function verifierTitreUpload(titre) {
    // Vérifier si le champ titre est vide
    if (titre=== '') { 
        alert('Veuillez saisir un titre.');
        return false; // Le champ titre est vide
    } else {
        return true; // Le champ titre est rempli
    }
}

function verifierCategorie(categorie) {
    // Vérifier si une catégorie a été sélectionnée
    if (categorie === 'option1') { 
        alert('Veuillez sélectionner une catégorie.');
        return false; // Aucune catégorie sélectionnée
    } else {
        return true; // Une catégorie a été sélectionnée
    }
}

async function ajoutNouveauProjet(inputFichier,titre,categorie) {
    // Crée un objet contenant l'image le titre et la categorie
    const nouveauProjet = {
        imageUrl: inputFichier,
        title: titre,
        categoryId : categorie
    };
    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(nouveauProjet);
    try {
        // Envoie une requête POST pour l'authentification de l'utilisateur
        const response = await fetch("http://localhost:5678/api/works", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: chargeUtile
        });
        // Vérifie si la réponse est OK
        if (!response.ok) {
            throw new Error('Échec de l\'ajout d\'un nouveau projet');
        }
        // Récupère les données de la réponse au format JSON
        const data = await response.json();
        // Affiche un message en cas d'authentification réussie
        console.log('Projet ajouté');
    } catch (error) {
        // Affiche une erreur en cas d'échec de l'authentification
        console.error('echec de la requete', error.message);
    }
}


// Fonction pour générer dynamiquement les options du menu déroulant
function genererOptionsCategorie(categories) {
    // Récupérer l'élément select
    const selectCategorie = document.getElementById('selectCategorie');
    // Réinitialiser le contenu du menu déroulant
    selectCategorie.innerHTML = '';
    // Ajouter une option vide par défaut
    const optionVide = document.createElement('option');
    selectCategorie.appendChild(optionVide);

    // Générer dynamiquement les options pour chaque catégorie
    categories.forEach(function(categorie) {
        var option = document.createElement('option');
        option.value = categorie.id; //  Utilisation de l'identifiant unique de chaque catégorie
        option.textContent = categorie.name; // Utilisation le nom de la catégorie comme libellé
        selectCategorie.appendChild(option);
    });
}


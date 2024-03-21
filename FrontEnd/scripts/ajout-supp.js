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

supprimerProjetParId();
genererOptionsCategorie(categories);
gestionFormAjoutProjet();  

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
        const boutonValider = document.getElementById('valider');
        // Ajouter un gestionnaire d'événements sur le click du bouton "Valider"
        boutonValider.addEventListener('click', async (event) => {
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

async function ajoutNouveauProjet(inputFichier, titre, categorie) {
    // Crée un objet FormData
    const formData = new FormData();
    // Ajoute les champs du formulaire à FormData
    formData.append('image', inputFichier.files); // Input de type fichier
    formData.append('title', titre);
    formData.append('category', categorie);

    try {
        // Envoie une requête POST à l'API avec FormData comme corps de la requête
        const response = await fetch("http://localhost:5678/api/works", {
            method: 'POST',
            body: formData // Utilisation de FormData comme corps de la requête
        });

        // Vérifie si la réponse est OK
        if (!response.ok) {
            throw new Error('Échec de l\'ajout d\'un nouveau projet');
        }

        // Récupère les données de la réponse au format JSON
        const data = await response.json();
        // Affiche un message en cas d'ajout réussi du projet
        console.log('Projet ajouté');
    } catch (error) {
        // Affiche une erreur en cas d'échec de l'ajout du projet
        console.error('Échec de la requête', error.message);
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
        const option = document.createElement('option');
        option.value = categorie.id; //  Utilisation de l'identifiant unique de chaque catégorie
        option.textContent = categorie.name; // Utilisation le nom de la catégorie comme libellé
        selectCategorie.appendChild(option);
    });
}

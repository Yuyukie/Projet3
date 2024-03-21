const responseProjet = await fetch("http://localhost:5678/api/works");
const projets = await responseProjet.json();

const responseCategorie = await fetch("http://localhost:5678/api/categories");
const categories = await responseCategorie.json();
// Récupérer l'élément input de type fichier
const inputFile = document.getElementById('fichier');
const titre = document.getElementById('titre').value;

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


function verifierFichierUpload(inputFile) {
    // Vérifier si un fichier a été sélectionné
    if (inputFile.files === 0) {
        alert('Veuillez sélectionner un fichier à télécharger.');
        return false; // Aucun fichier sélectionné
    } else {
        // Vérifier la taille du fichier
        const fichier = inputFile.files[0]; // Utiliser inputFile au lieu de inputFichier
        const tailleFichierMo = fichier.size / (1024 * 1024); // Convertir la taille en Mo
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

function verifierCategorie() {
    // Sélectionner l'élément du menu déroulant de catégories
    const selectCategorie = document.getElementById('selectCategorie');

    // Ajouter un écouteur d'événements pour le changement de sélection dans le menu déroulant
    selectCategorie.addEventListener('change', () => {
        // Récupérer la valeur de la catégorie sélectionnée
        const categorie = selectCategorie.value;
        console.log(categorie);
        
        // Vérifier si la catégorie sélectionnée a une valeur de '0'
        if (categorie === '0') { 
            alert('Veuillez sélectionner une catégorie.');
            return false; // Aucune catégorie sélectionnée
        } else {
            return true; // Une catégorie a été sélectionnée
        }
    });
}

async function gestionFormAjoutProjet(titre, inputFile) {
    try {
        // Sélectionner le bouton "Valider" avec l'ID "valider"
        const boutonValider = document.getElementById('valider');
        // Ajouter un gestionnaire d'événements sur le click du bouton "Valider"
        boutonValider.addEventListener('click', async (event) => {
            event.preventDefault();
            // Attendre la vérification du fichier
            const fichierValide = await verifierFichierUpload(inputFile);
            if (!fichierValide) {
                return false; // Arrête l'exécution de la fonction si la vérification du fichier échoue
            }
            // Attendre la vérification du titre
            const titreValide = verifierTitreUpload(titre);
            if (!titreValide) {
                return false; // Arrête l'exécution de la fonction si la vérification du titre échoue
            }
            // Attendre la vérification de la catégorie
            const categorieValide = verifierCategorie();
            if (!categorieValide) {
                return false; // Arrête l'exécution de la fonction si la vérification de la catégorie échoue
            }

            // Appeler ajoutNouveauProjet avec les paramètres appropriés
            ajoutNouveauProjet(titre, inputFile, document.getElementById('selectCategorie'));
        });
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la gestion du formulaire :', error);
    }
}


async function ajoutNouveauProjet(titre, inputFile, categoryInput) {
    // Récupérer l'ID de la catégorie sélectionnée
    const categoryId = categoryInput.options[categoryInput.selectedIndex].id;

    // Créer un objet FormData
    const formData = new FormData();
    // Ajouter les champs du formulaire à FormData
    formData.append('image', inputFile.files[0]); // Récupérer le fichier à partir de inputFile
    formData.append('title', titre);
    formData.append('category', categoryId);

    try {
        // Envoyer une requête POST à l'API avec FormData comme corps de la requête
        const response = await fetch("http://localhost:5678/api/works", {
            method: 'POST',
            body: formData // Utilisation de FormData comme corps de la requête
        });

        // Vérifier si la réponse est OK
        if (!response.ok) {
            throw new Error('Échec de l\'ajout d\'un nouveau projet');
        }

        // Récupérer les données de la réponse au format JSON
        const data = await response.json();
        // Afficher un message en cas d'ajout réussi du projet
        console.log('Projet ajouté :', data);
    } catch (error) {
        // Afficher une erreur en cas d'échec de l'ajout du projet
        console.error('Échec de la requête', error.message);
    }
}


supprimerProjetParId();
gestionFormAjoutProjet(titre, inputFile); 
// Fonction qui recupere les projets depuis l'API
async function fetchDataWorks() {
    const responseProjet = await fetch("http://localhost:5678/api/works");
    const works = await responseProjet.json();
    return works;
    }

async function fetchDataCategory() {
    const responseProjet = await fetch("http://localhost:5678/api/categories");
    const category = await responseProjet.json();
    return category;
    }
// Fonction qui supprime le contenue d'une zone
function cleanArea (area){
    area.innerHTML = "";
    }


///////////////////////////////////////////////////////////////////////////////////////////
//                                                                                       //
//                              Gestion DOM tous utilisateurs                            //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////


function createWorks() {
    // Vérification si areaProject n'est pas null avant d'ajouter des éléments
    const areaProject = document.querySelector(".gallery");
    if (areaProject) {
        // Assurez-vous de nettoyer correctement l'élément avant d'ajouter de nouveaux éléments
        cleanArea(areaProject);

        // Utilisation de forEach pour parcourir les données des projets
        fetchDataWorks()
            .then(works => {
                works.forEach(work => {
                    // Création d'un élément figure pour représenter le projet
                    const figure = document.createElement("figure");
                    figure.classList.add(`figure-category-${work.category.id}`); // Utilisation de l'ID de la catégorie
                    figure.dataset.id = work.id;

                    // Création d'un élément img pour afficher l'image du projet
                    const imgWorks = document.createElement("img");
                    imgWorks.src = work.imageUrl;

                    // Création d'un élément figcaption pour afficher le titre du projet
                    const figcaption = document.createElement("figcaption");
                    figcaption.innerText = work.title;

                    // Attache des éléments img et figcaption à l'élément figure
                    figure.appendChild(imgWorks); 
                    figure.appendChild(figcaption);

                    // Ajout de l'élément figure à l'élément areaProject dans le DOM
                    areaProject.appendChild(figure);
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    } 

}

function gestionFilter() {
    // Récupérer l'élément parent filter-container
    const filterContainer = document.querySelector('.filter-container');

    // Effacer les anciens boutons de filtre s'ils existent
    filterContainer.innerHTML = '';

    // Récupérer les données des projets
    fetchDataWorks()
        .then(works => {
            // Créer un ensemble pour stocker les IDs de catégories uniques
            const uniqueCategoryIds = new Set();
            works.forEach(work => {
                uniqueCategoryIds.add(work.category.id);
            });

            // Créer un bouton pour afficher tous les projets
            const allButton = document.createElement('button');
            allButton.classList.add('filter-button');
            allButton.textContent = 'Tous';
            allButton.value = 'Tous'; // La valeur 'Tous' pour afficher tous les projets
            allButton.addEventListener('click', function() {
                filterByCategory('Tous', works);
            });
            filterContainer.appendChild(allButton);

            // Créer les boutons de filtre pour chaque catégorie unique
            uniqueCategoryIds.forEach(categoryId => {
                const button = document.createElement('button');
                button.classList.add('filter-button');
                
                // Récupérer le nom de la catégorie associée à l'ID
                const categoryName = works.find(work => work.category.id === categoryId).category.name;
                
                button.textContent = categoryName;
                button.value = categoryId; // Utiliser l'ID de la catégorie comme valeur du bouton
                button.addEventListener('click', function() {
                    filterByCategory(categoryId, works);
                });
                filterContainer.appendChild(button);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function filterByCategory(categoryId, works) {
    // Récupération de la section contenant les projets
    const sectionProjet = document.querySelector('.gallery');
    if (sectionProjet) {
        // Affichage de tous les projets
        const projetElements = document.querySelectorAll('.gallery > figure');
        projetElements.forEach(element => {
            element.style.display = 'none';
        });

        // Affichage des projets de la catégorie sélectionnée
        works.forEach(work => {
            if (work.category.id === categoryId || categoryId === 'Tous') { // Modification ici
                const projetElement = document.querySelector(`[data-id="${work.id}"]`);
                if (projetElement) {
                    projetElement.style.display = 'block';
                }
            }
        });
    }
}

function editorMode () {
    const utilisateurAuthentifier = window.localStorage.getItem("token");
    if(utilisateurAuthentifier){

        const editBar = document.querySelector(".logged-user-head-bar")
        editBar.style.display ="flex";

        const logOutLink = document.getElementById("logLink");
        logOutLink.innerText = "logout";
        logOutLink.href = "";

        const elementsFiltres = document.querySelector(".filter-container");
        elementsFiltres.style.display = 'none';

        const elementsModal = document.querySelector(".btn-open-modal");
        elementsModal.style.display = 'flex';
    }
    const logOutLink = document.getElementById("logLink");
    logOutLink.addEventListener ("click", logout);
    
        function logout(){
        window.localStorage.removeItem("token");
        location.reload("index.html");
}
}


/// Actions principales

createWorks();
gestionFilter();
editorMode();

///////////////////////////////////////////////////////////////////////////////////////////
//                                                                                       //
//                                    Gestion Admin                                      //
//                                  Gestion de la modale                                 //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////

function gestionModal(){
    openModal1();
    closeModal();
    createWorksModal();
    openModal2 ();
    returnModal1 ();
    postNewWork();
    createOptionsCategory();  
}

function openModal1 (){
    const modal = document.querySelector(".modal");
    const btnModal= document.querySelector(".btn-open-modal");
    btnModal.addEventListener("click", () => {    
        modal.style.display = "flex";  
    })
}

function closeModal() {
    const modal = document.querySelector(".modal");
    const btnModal = document.getElementById("close-modal");
    const modalContent = document.querySelector(".modal-wrapper");

    // Fermer la modal lorsque le bouton est cliqué
    btnModal.addEventListener("click", () => {    
        modal.style.display = "none";
    });

    // Fermer la modal lorsque l'utilisateur clique en dehors du contenu
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

function createWorksModal() {
    // Vérification si areaProject n'est pas null avant d'ajouter des éléments
    const areaProject = document.querySelector(".gallery-modal");
    if (areaProject) {
        // Assurez-vous de nettoyer correctement l'élément avant d'ajouter de nouveaux éléments
        cleanArea(areaProject);
        // Utilisation de forEach pour parcourir les données des projets
        fetchDataWorks()
            .then(works => {
                works.forEach(work => {
                    // Création d'un élément figure pour représenter le projet
                    const figure = document.createElement("figure");
                    figure.classList.add(`figure-${work.id}`); // Utilisation de work.id au lieu de worksId
                    figure.dataset.id = work.id;

                    // Création d'un élément img pour afficher l'image du projet
                    const imgWorks = document.createElement("img");
                    imgWorks.src = work.imageUrl;
                    
                    // Création de l'icône de poubelle
                    const trashIcon = document.createElement("div");
                    trashIcon.classList.add("trash-icon");
                    trashIcon.innerHTML= `<i class="fa-solid fa-trash-can" id="${work.id}"></i>`;

                    // Attache des éléments img et figcaption à l'élément figure
                    figure.appendChild(imgWorks); 
                    figure.appendChild(trashIcon); 
                    // Ajout de l'élément figure à l'élément areaProject dans le DOM
                    areaProject.appendChild(figure);

                    trashIcon.addEventListener('click', (event) => {
                        event.preventDefault();
                        deleteWorks(event, work.id); // Utilisation de work.id pour l'ID du travail
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
}

async function createOptionsCategory() {
    try {
        // Récupérer les données des catégories en utilisant la fonction fetchDataCategory
        const categories = await fetchDataCategory();
        
        // Récupérer l'élément select
        const selectCategory = document.getElementById('category');
        // Réinitialiser le contenu du menu déroulant
        selectCategory.innerHTML = '';
        // Ajouter une option vide par défaut
        const optionVide = document.createElement('option');
        selectCategory.appendChild(optionVide);

        // Générer dynamiquement les options pour chaque catégorie
        categories.forEach(function(category) {
            const option = document.createElement('option');
            option.value = category.id; // Utilisation de l'identifiant unique de chaque catégorie comme valeur
            option.textContent = category.name; // Utilisation du nom de la catégorie comme libellé
            selectCategory.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors de la génération des options de catégorie :', error);
    }
}


function openModal2 (){
    const btnModal = document.getElementById("add-photo");
    btnModal.addEventListener("click", (event) => { 
        event.preventDefault();   
        const titleModalVue2 = document.getElementById("title-modal-vue1");
        titleModalVue2.innerText = "Ajout photo";
        const areaModalVue2 = document.querySelector(".gallery-modal");
        areaModalVue2.style.display = "none"
        const validerPhoto = document.getElementById("add-photo");
        validerPhoto.style.display = "none";
        const valider = document.getElementById("btn-validate");
        valider.style.display = "flex";
        const uploadForm = document.getElementById("add-work");
        uploadForm.style.display = "flex"
        const iconeRetour = document.getElementById("return");
        iconeRetour.style.display = "flex"
    })
}

function returnModal1 (){
    const btnModal = document.getElementById("return");
    btnModal.addEventListener("click", () => {    
        const titleModalVue2 = document.getElementById("title-modal-vue1");
        titleModalVue2.innerText = "Gallerie photo";
        const areaModalVue2 = document.querySelector(".gallery-modal");
        areaModalVue2.style.display = "flex"
        const validerPhoto = document.getElementById("add-photo");
        validerPhoto.style.display = "flex";
        const valider = document.getElementById("btn-validate");
        valider.style.display = "none";
        validerPhoto.style.backgroundColor = "#1D6154";
        const uploadForm = document.getElementById("add-work");
        uploadForm.style.display = "none"
        const iconeRetour = document.getElementById("return");
        iconeRetour.style.display = "none"
    })
}

///////////////////////////////////////////////////////////////////////////////////////////
//                                                                                       //
//                                    Gestion Admin                                      //
//                         Gestion de la ajout/sup nouveaux projets                      //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////




async function deleteWorks(event, worksId) {
    let monToken = window.localStorage.getItem('token');
     const valideDelete = confirm("Confirmer la suppresion ?")
     // Si confirmation :
     if (valideDelete) {
       try {
         const fetchDelete = await fetch(`http://localhost:5678/api/works/${worksId}`,
           {
             method: "DELETE",
             headers: {Authorization: `Bearer ${monToken}`,
             },
           }
         );
         // Si suppresion ok
         if (fetchDelete.ok) {
           document.querySelectorAll(`.figure-${worksId}`)
           .forEach((figure) => figure.remove());
           event.preventDefault();
         }
       } catch (error) {
         alert('Suppression impossible, une erreur est survenue')
       }
   }
 }



 async function postNewWork() {
    const btnValidate = document.getElementById('btn-validate');
    const inputFile = document.getElementById('fileInput');
    const title = document.getElementById('title').value; 
    const selectCategory = document.getElementById('category');
    const selectedOption = selectCategory.options[selectCategory.selectedIndex];
    const categoryValue = selectedOption.value;

    btnValidate.addEventListener('click', async (event) => {
        event.preventDefault(); // Empêcher le comportement par défaut du lien

        
        // Valider le fichier sélectionné
        if (inputFile.files.length === 0) {
            alert('Veuillez sélectionner un fichier à télécharger.');
            return;
        }

        const file = inputFile.files[0];
        const size = file.size / (1024 * 1024); // Convertir la taille en Mo
        const allowedFormats = ['image/jpg', 'image/jpeg', 'image/png'];
        const fileReader = new FileReader();
        //Lecture et traitement du nouveau fichier
        fileReader.onload = () => { 
          const imagePreview = document.querySelector('.image-preview')
          const iconEditFile = document.querySelector('.fa-image')
          const labelAddPhoto = document.querySelector('.label-add-photo')
          const textInputFile = document.querySelector('.add-file p')
          //Affichage du nouveau fichier
          iconEditFile.style.display = 'none';
          labelAddPhoto.style.display = 'none';
          textInputFile.style.display = 'none';
          
          imagePreview.src = fileReader.result
          imagePreview.style.display = 'flex';
        }
        fileReader.readAsDataURL(file)

        if (size > 4 || !allowedFormats.includes(file.type)) {
            alert('Le fichier sélectionné dépasse la taille maximale autorisée (4 Mo) ou le format n\'est pas pris en charge.');
            return;
        }

        // Valider le titre
        if (title === '') {
            alert('Veuillez saisir un titre.');
            return;
        }

        // Valider la catégorie
        if (categoryValue === 'option1') {
            alert('Veuillez sélectionner une catégorie.');
            return;
        }
        
        const postConfirmation = confirm("Voulez-vous importer votre projet ?");

        if (postConfirmation) {
            // Créer le FormData avec les informations du nouveau travail
            const formData = new FormData();
            formData.append('category', categoryValue);
            formData.append('fileInput', inputFile.files[0]); // Utilisation de inputFile directement
            formData.append('title', title);

            const monToken = window.localStorage.getItem('token'); 

            try {
                const response = await fetch("http://localhost:5678/api/works", {
                    method: "POST",
                    headers: { accept: "application/json", Authorization: `Bearer ${monToken}` },
                    body: formData,
                });

                if (response.ok) {
                    console.log(title, " ajouté !");
                    const newWorkData = await response.json();
                    createWorks();
                    createWorksModal();
                    alert('Création du travail réussie !');
                }
            } catch (error) {
                console.error('Une erreur s\'est produite lors de l\'envoi du nouveau travail :', error);
                alert('Erreur lors de l\'envoi du nouveau travail. Veuillez réessayer.');
            }
        } 
    });

    // Ajouter un événement change à l'élément input de type fichier pour prévisualiser l'image
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const imagePreview = document.getElementById('image-preview');
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block'; // Afficher l'élément img
        };
        reader.readAsDataURL(file);
    });
}


// Actions principales

gestionModal();



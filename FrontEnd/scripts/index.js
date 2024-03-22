// Fonction qui recupere les projets depuis l'API
export async function fetchDataWorks() {
            const responseProjet = await fetch("http://localhost:5678/api/works");
            const works = await responseProjet.json();
            return works;
            }

// Fonction qui supprime le contenue d'une zone
export function cleanArea (area){
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
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////

function gestionModal(){
    openModal1();
    closeModal();
    createWorksModal();
    openModal2 ();
    returnModal1 ();
    // genererOptionsCategorie(categories);
    // gestionFormAjoutProjet();   
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
        const uploadForm = document.getElementById("add-project");
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
        const uploadForm = document.getElementById("add-project");
        uploadForm.style.display = "none"
        const iconeRetour = document.getElementById("return");
        iconeRetour.style.display = "none"
    })
}

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


// Actions principales

gestionModal();



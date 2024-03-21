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

function gestionModal(){
    fermerModal();
    afficherModalVue1();
    genererProjetModal();
    afficherModalVue2 ();
    retourModalVue1 (); 
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
        const valider = document.getElementById("valider");
        valider.style.display = "flex";
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





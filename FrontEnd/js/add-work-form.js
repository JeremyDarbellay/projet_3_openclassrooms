import { buildGallery } from "./gallery.js";
import { works, categories } from "./sets.js"
import { closeModal, openModal } from "./modale.js"

export { openAddWorkForm }

/**
 * function to replace
 * gallery modal by
 * add work form
 */
async function openAddWorkForm() {

    let modal = document.querySelector('.modal');

    // remove previous modal
    let originalModalWrapper = document.querySelector('.modal-wrapper');
    modal.removeChild(originalModalWrapper);
        
    // create addWorkForm
    await createAddWorkForm();

    // populate categories
    addCategoriesToAddWorkForm();

    // then add events to this form
    addAddWorkFormEvents();
}

/**
 * create add work form
 * then append it and return it
 */
async function createAddWorkForm() {


    let modal = document.querySelector('.modal');


    modal.insertAdjacentHTML('afterbegin', `
        <div class="modal-wrapper">
            <h3>Ajout photo</h3>
            <button class="close-modal">
                <img 
                    src="assets/icons/close-svgrepo-com.svg"
                    alt="une croix pour fermer" 
                    width="24">
            </button>
            <button class="back-modal">
                <img 
                    src="assets/icons/back-svgrepo-com.svg" 
                    alt="une flèche pour revenir en arrière" 
                    width="21">
            </button>
            <form id="add-work">
                <div class="img-input">
                    <img 
                        src="assets/icons/picture-svgrepo-com.svg" 
                        class="placeholder"
                        alt="une icône d'image">
                    <label for="image-input">+ Ajouter photo</label>
                    <p>png, jpg: 4mo max</p>
                    <input type="file" name="image" id="image-input" accept=".jpg, .png" required>
                    <img src="" class="preview">
                </div>
                <label for="titre">
                    Titre
                    <input type="text" name="title" id="title-input" required>
                </label>
                <label for="category">
                    Catégorie
                    <select name="category" id="category-input" required>
                    </select>
                </label>
                <hr>
                <input type="submit" value="Valider" class="js-submit" disabled>
            </form>
    `);
}

/**
 * function which add events
 * Listener to add work form
 */
async function addAddWorkFormEvents() {


    document.getElementById('add-work').addEventListener("submit", (e) => {

        e.preventDefault();
        e.stopPropagation();

        postNewWork(e);

    });

    // document.getElementById('title-input').addEventListener('submit', (e) => {e.preventDefault(); e.stopPropagation(); })

    document.querySelector('button.close-modal').addEventListener('click', closeModal);

    document.querySelector('button.back-modal').addEventListener('click', openModal);

    // custom validity for image input
    document.querySelector('input#image-input').addEventListener('change', (e) => {
        for (const file of e.currentTarget.files ) {

            // size > 4Mb
            if ( file.size > 4194304 ) {
                e.currentTarget.setCustomValidity('Votre fichier est trop lourd.');
                e.currentTarget.reportValidity();
            } else if ( file.type !== "image/png" && file.type !== "image/jpeg" ) { 
                e.currentTarget.setCustomValidity("Votre fichier n'est pas au bon format.");
                e.currentTarget.reportValidity();
            } else {
                // if validity is ok preview image
                document.querySelector('.img-input > img.preview').setAttribute('src', URL.createObjectURL(file));
                // set opacity to 0 for others child
                document.querySelector('.img-input').classList.add('preview');
            }
        };
    })

    document.querySelectorAll('#add-work input, #add-work select').forEach( (input) => {
        input.addEventListener('change', validateForm)
    })

}

// @TODO document
async function addCategoriesToAddWorkForm(modal) {

    let categoryInputSelect = document.getElementById('category-input');
    // add default option (nothing)
    let defaultOption = new Option();
    categoryInputSelect.appendChild(defaultOption);

    categories.forEach( (category) => {

        let option = new Option(category.name, category.id);
        categoryInputSelect.add(option);

    });

}
/** 
 * @TODO document
*/
function postNewWork(e) {
    
    const form = e.currentTarget;
    var formData = new FormData(form);

    const token = sessionStorage.getItem('token');
    
    let request = new XMLHttpRequest();
    request.open("POST", "http://localhost:5678/api/works");
    request.responseType = 'json';
    request.setRequestHeader('Authorization', `Bearer ${token}`);
    request.send(formData);
    request.onload = function() {

        if (request.status == 201) {

            let data = request.response;
    
            let categoryName;
            categories.forEach( (category) => { if (category.id == data.categoryId) categoryName = category.name} );
    
            let newWork = {
                "id": data.id,
                "title": data.title,
                "imageUrl": data.imageUrl,
                "categoryId": parseInt(data.categoryId),
                "userId": data.userId,
                "category": {
                    "id": parseInt(data.categoryId),
                    "name": categoryName
                }
    
            }
    
            works.add(newWork);
            
            buildGallery();
    
            closeModal();

        } else {
            console.log('request error : '+request.status);
        }

    };

}

/**
 * validate form submitted
 */
function validateForm() {

    let formInputs = document.querySelectorAll('#add-work input, #add-work select');

    var valid = true;

    for (let input of formInputs) {
        valid &= input.reportValidity();
        if (!valid) {break;}
    };

    if (valid) document.querySelector('#add-work input[type="submit"]').disabled = false;
    else document.querySelector('#add-work input[type="submit"]').disabled = true;

}

// @TODO accessibility
// @TODO test delete + send work
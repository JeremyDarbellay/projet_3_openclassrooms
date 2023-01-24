import { works } from "./sets.js"

import { openAddWorkForm } from "./add-work-form.js"

/**
 * function to show admin functionalities
 * on page, like adding or removing
 * works.
 */
export async function createEditionElts() {


    // insert admin bar
    document.body.insertAdjacentHTML('afterbegin', `
    <div class="admin-bar">
        <div>
            <img src="assets/icons/edit-svgrepo-com-white.svg" alt="une icône d'un crayon sur du papier" width="19">
            Mode édition
            <button>publier les changements</button>
        </div>
    </div>
    `);

    // button for edition
    const editButton = `
        <button class="edit-button">
            <img src="assets/icons/edit-svgrepo-com.svg" alt="une icône d'un crayon sur du papier" width="18">
            modifier
        </button>
    `;

    // button above main article
    document.querySelector('#introduction>article')
        .insertAdjacentHTML('afterbegin', editButton);

    // button under figure
    document.querySelector('#introduction>figure')
        .insertAdjacentHTML(`beforeend`, editButton);

    // portfolio button
    await document.querySelector('section#portfolio>h2')
        .insertAdjacentHTML(`beforeend`, editButton);

    // event for modal
    document.querySelector('#portfolio .edit-button')
        .addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });

}

/**
 * construct modal
 * if modal exist delete it before
 */
export async function openModal() {

    closeModal();

    let modal = await createModal();

    document.body.appendChild(modal);

}

/** 
 * close modal from close button 
 */
export async function closeModal() {

    let modal = document.querySelector('.modal');

    if (modal != undefined) document.body.removeChild(document.querySelector('.modal'));

}

/**
 * create the modal
 * insert html
 * add events to buttons
 * then call addWorksToModal
 * to populate works container
 * @return {Node} the modal
 */
async function createModal() {

    let modal = document.createElement('aside');
    modal.classList.add('modal');

    modal.insertAdjacentHTML('afterbegin', `
        <div class="modal-wrapper">
            <button class="close-modal">
                <img src="assets/icons/close-svgrepo-com.svg"
                    alt="une croix pour fermer" width="24">
            </button>
            <h3>Galerie photo</h3>
            <div class="works">
            </div>
            <hr>
            <button class="button-primary js-open-add-form">Ajouter une photo</button>
            <button class="danger">Supprimer la galerie</button>
        </div>
    `);

    modal.querySelector('button.close-modal').addEventListener('click', closeModal );
    modal.querySelector('button.js-open-add-form').addEventListener('click', openAddWorkForm );

    modal = addWorksToModal(modal);

    return modal;
}

/**
 * function which take works from works
 * and append them in workContainer
 * @param {Node} modal the modal
 * @return {Node}
 */
async function addWorksToModal(modal) {

    // reset works' div
    document.querySelectorAll(".works>.edit-work").forEach( (work) => work.remove())

    works.forEach( (work) => {

        modal.querySelector('.works').insertAdjacentHTML('beforeend', `
            <div class="edit-work" data-workId="${work.id}">
                <img src="${work.imageUrl}" alt="${work.name}">
                <button>éditer</button>
                <button class="icon-button js-delete-work">
                    <img src="assets/icons/bin-svgrepo-com.svg" alt="une icône de 4 flèches dans toutes les directions" width="9">
                </button>
                <button class="icon-button">
                    <img src="assets/icons/arrow-4-way-svgrepo-com.svg" width="12">
                </button>
            </div>
        `)

    });

    // add event listeners for each work
    modal.querySelectorAll("button.js-delete-work")
        .forEach((button) => button.addEventListener('click',  (e) => deleteWork(e)))

    return modal;
}


/**
 * Function to send post request
 * to delete work from db
 * @param {Event} e the event
 * @param {String} id the work id
 */
async function deleteWork(e) {

    let id = e.currentTarget.getAttribute('data-workId');
    
    // use authentification token stored in cookie
    const token = sessionStorage.getItem('token');

    const options = {
        method: "DELETE",

        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
    };

    await fetch(`http://localhost:5678/api/works/${id}`, options)
        .then( (res) => {
            if (res.ok) {

                    // remove this work from our set
                    works.forEach( (work) => {
                        if (work.id == id) works.delete(work)
                    });

                    openModal();

                    // then rebuild gallery
                    buildGallery();

            } else {

                throw new Error("Quelque chose s'est mal passé");

            }
        });
}

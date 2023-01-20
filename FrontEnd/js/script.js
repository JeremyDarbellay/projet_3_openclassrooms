/* Script chargé de l'import des projets */

/* call our function to build non filtered gallery */
document.body.onload = buildPage;

/* Create our main set, to use it later */
let worksSet = new Set();


/** 
* make an api call to retrieve all works 
* and adds it to worksSet
* @return {object} All works
*/
async function getAllWorks() {

    return fetch('http://localhost:5678/api/works')
        .then( data => data.json() )
        .then( works => works.forEach( (work) => worksSet.add(work)) );

}

/**
 * Make an api call to retrieve categories
 * @return {object}
 */
async function getAllCategories() {

    return fetch('http://localhost:5678/api/categories')
        .then( categories => categories.json() );

}

/**
* add all works to gallery
* iterate over works 
* create a figure element for each work
*/ 
async function buildGallery() {

    /* select gallery to add theses elements */
    const galleryContainer = document.querySelector('div.gallery');

    // reset gallery
    if (galleryContainer.children) {
        /* reset all subnodes */
        for (let child of galleryContainer.children) {
            galleryContainer.removeChild(child);
        }
    }

    worksSet.forEach((work) => {

        let figureElt = createWorkElt(work);
        figureElt = galleryContainer.appendChild(figureElt);

    });
}

/**
 * Create a work element
 * for a given work
 * @param {Object} work The work containing informations
 * @return {Node} The work figure
 */
function createWorkElt(work) {

        /* create figure container */
        let figureElt = document.createElement('figure');

        /* create image */
        let imgElt = document.createElement('img');
        imgElt.setAttribute('src', work.imageUrl);
        imgElt.setAttribute('alt', work.title);

        /* create caption */
        let captionElt = document.createElement('figcaption');
        captionElt.appendChild(document.createTextNode(work.title));

        /* add subelements to figure */
        figureElt.appendChild(imgElt);
        figureElt.appendChild(captionElt);

        return figureElt;
}

/* 
* call necessary function to add dynamic elements
* to this page
*/
async function buildPage() {

    // retrieve works
    await getAllWorks();

    buildCategories();

    buildGallery();

    showEditionElts();
}

/* 
* main function to build category bar 
* and attach events listeners
*/
async function buildCategories() {


    let filterBarElt = await createFilterBar();

    filterBarElt = await addAllWorkFilter(filterBarElt);

    await getAllCategories()
        .then((categories) => {

            categories.forEach((category) => {
        
                // create category element
                createCategoryElt(category, filterBarElt);

            });

        });

    // add Event listener to categories
    for (let category of filterBarElt.childNodes) {
        category.addEventListener('click', (e) => filterWorks(e));
    }

}

/**
* build a filter element and return it
* @param {object} category The category
* @param {Node} filterBar The filterBar element
* @return {Node} the category element
*/
function createCategoryElt(category, filterBar) {

    // create our element
    let categoryElt = document.createElement('button');

    // add category name inside button
    categoryElt.appendChild(document.createTextNode(category.name));
    categoryElt.setAttribute('data-categoryid', category.id)

    // add our element to it's parent (filterBar)
    categoryElt = filterBar.appendChild(categoryElt);

    return categoryElt;
}

/**
 * create div which contains categories
 * then return it
 * @return {Node}
 */
async function createFilterBar() {

    // create category bar, add style
    let filtersDiv = document.createElement('div');
    filtersDiv.classList.add('categories');

    // select section and gallery to insert our div
    const portfolio = document.getElementById('portfolio');
    const galleryContainer = document.querySelector('div.gallery');
    
    filtersDiv = portfolio.insertBefore(filtersDiv, galleryContainer);

    return filtersDiv;

}

/**
 * add "All" filter to filter bar
 * @param {Node} filterBar The filter div
 * @return {Node} the filter div with "all" filter
 */
async function addAllWorkFilter(filterBar) {

    // create default filter
    let allWorksFilter = document.createElement('button');
    // add default style
    allWorksFilter.classList.add('active');
    allWorksFilter.setAttribute('data-categoryid', 'default');
    // then add text
    allWorksFilter.appendChild(document.createTextNode('Tous'));

    // attach it to filterBar
    filterBar.appendChild(allWorksFilter);

    return filterBar;
}

/**
 * hide works if not in category provided
 * if no category provided show all works
 * @param {Event} e the event propagated
 */
async function filterWorks(e) {


    /* select categories div, then remove active class */
    const categoriesButtons = document.querySelectorAll('div.categories>button');
    categoriesButtons.forEach( (categoryButton) => {
        categoryButton.classList.remove('active');
    });

    /* Then add active class */
    e.currentTarget.classList.add('active');

    /* select gallery */
    const galleryContainer = document.querySelector('div.gallery');
    const worksElts = document.querySelectorAll('div.gallery>figure');

    /* reset all subnodes */
    for (let figure of worksElts) {
        galleryContainer.removeChild(figure);
    }

    worksSet.forEach( (work) => {
        if (e.currentTarget.getAttribute('data-categoryid') == work.categoryId || e.currentTarget.getAttribute('data-categoryid') == 'default') {

            galleryContainer.appendChild(createWorkElt(work));
        }
    });

}

/**
 * function to show admin functionalities
 * on page, like adding or removing
 * works.
 * @TODO all admins elts please ....
 */
async function showEditionElts() {


    let editGalleryButton = document.querySelector('section#portfolio>h2').appendChild(createEditButton());

    document.querySelector('#introduction>figure').appendChild(createEditButton());

    document.querySelector('#introduction>article')
        .insertBefore(createEditButton(), document.querySelector('#introduction>article>h2'));


    editGalleryButton.addEventListener("click", openModal);
}

/**
 * Create an edit button
 * then return it
 * (don't place it in DOM)
 * @return {Node} the edit button
 */
function createEditButton() {

    let button = document.createElement('button');
    button.classList.add('edit-button');
    let icon = document.createElement('img');
    icon.setAttribute('src', 'assets/icons/edit-svgrepo-com.svg');
    icon.setAttribute('alt', "une icône d'un crayon sur du papier");
    button.appendChild(icon);
    button.appendChild(document.createTextNode('modifier'));

    return button;
}

/**
 * construct modal
 * if modal exist delete it before
 */
async function openModal() {

    closeModal();

    let modal = await createModal();

    modal = await addWorksToModal(modal);

    document.body.appendChild(modal);


}

// close modal from close button
async function closeModal() {

    if (document.querySelector('.modal')) document.body.removeChild(document.querySelector('.modal'));

}

/**
 * create the modal
 */
async function createModal() {

    let modal = document.createElement('aside');
    modal.classList.add('modal');

    let modalWrapper = document.createElement('div');
    modalWrapper.classList.add('modal-wrapper');
    modal.appendChild(modalWrapper);

    let closeButton = document.createElement('button');
    closeButton.classList.add('close-modal');
    let closeBtnIcon = document.createElement('img');
    closeBtnIcon.setAttribute('src', 'assets/icons/close-svgrepo-com.svg'); 
    closeBtnIcon.setAttribute('alt', 'une croix pour fermer'); 
    closeBtnIcon.setAttribute('width', '24'); 
    closeButton.appendChild(closeBtnIcon);
    closeButton.addEventListener('click', (e) => closeModal(e));

    let title = document.createElement('h3');
    title.appendChild(document.createTextNode('Galerie photo'));

    let worksContainer = document.createElement('div');
    worksContainer.classList.add('works');

    let hr = document.createElement('hr');

    let addWorkButton = document.createElement('button');
    addWorkButton.appendChild(document.createTextNode('Ajouter une photo'));
    addWorkButton.classList.add('button-primary');
    addWorkButton.addEventListener('click', openAddWorkModal);

    let deleteGalleryButton = document.createElement('button');
    deleteGalleryButton.appendChild(document.createTextNode('Supprimer la galerie'));
    deleteGalleryButton.classList.add('danger');
    deleteGalleryButton.addEventListener('click', deleteAllWorks);

    modalWrapper.appendChild(closeButton);
    modalWrapper.appendChild(title);
    modalWrapper.appendChild(worksContainer);
    modalWrapper.appendChild(hr);
    modalWrapper.appendChild(addWorkButton);
    modalWrapper.appendChild(deleteGalleryButton);

    return modal;
}

/**
 * function which take works from worksSet
 * and append them in workContainer
 * @param {Node} modal the modal
 */
async function addWorksToModal(modal) {

    let worksContainer = modal.querySelector('div.works');
    // reset works
    if (worksContainer.children) {
        /* reset all subnodes */
        for (let child of worksContainer.children) {
            worksContainer.removeChild(child);
        }
    }

    worksSet.forEach( (work) => {

        let element = createEditableWorkElt(work);
        worksContainer.appendChild(element);

    });

    return modal;
}

/**
 * create a work element
 * attach button and related events
 * to modify content
 * @param {Object} work the work with necessary informations
 * @return {Node} the div to add.
 */
function createEditableWorkElt(work) {
    
    let workDiv = document.createElement('div');
    workDiv.classList.add('edit-work');

    /* create image */
    let imgElt = document.createElement('img');
    imgElt.setAttribute('src', work.imageUrl);
    imgElt.setAttribute('alt', work.title);

    /* create buttons */

    // "éditer" under work
    let editButton = document.createElement('button');
    editButton.appendChild(document.createTextNode('éditer'));
    editButton.addEventListener('click', (e) => editWork(e, work.id))

    // add delete button
    let deleteButton = document.createElement('button');
    deleteButton.classList.add('icon-button');
    let deleteIcon = document.createElement('img');
    deleteIcon.setAttribute('src', 'assets/icons/bin-svgrepo-com.svg');
    deleteIcon.setAttribute('alt', 'une icône de poubelle');
    deleteIcon.setAttribute('width', '9');
    deleteButton.appendChild(deleteIcon);
    deleteButton.addEventListener('click', (e) => deleteWork(e, work.id))

    // add resize button
    let resizeButton = document.createElement('button');
    resizeButton.classList.add('icon-button');
    let resizeIcon = document.createElement('img');
    resizeIcon.setAttribute('src', 'assets/icons/arrow-4-way-svgrepo-com.svg');
    deleteIcon.setAttribute('alt', 'une icône de 4 flèches dans toutes les directions');
    resizeIcon.setAttribute('width', '12');
    resizeButton.appendChild(resizeIcon);
    resizeButton.addEventListener('click', (e) => resizeWork(e, work.id))

    workDiv.appendChild(imgElt);
    workDiv.appendChild(editButton);
    workDiv.appendChild(deleteButton);
    workDiv.appendChild(resizeButton);

    return workDiv;

}

/**
 * To do later
 */
function resizeWork(e, id) {}

/**
 * To do later
 */
function editWork(e, id) {}

/**
 * Function to send post request
 * to delete work from db
 * @param {Event} e the event
 * @param {String} id the work id
 */
async function deleteWork(e, id) {

    // use authentification token stored in cookie
    const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];

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
                    worksSet.forEach( (work) => {
                        if (work.id == id) worksSet.delete(work)
                    });

                    // then close modal
                    // closeModal();
                    /* or */
                    openModal();

                    // then rebuild gallery
                    buildGallery();

            } else {

                throw new Error("Quelque chose s'est mal passé");

            }
        });
}

function openAddWorkModal() {
    let modal = document.querySelector('.modal')
    let originalModalWrapper = document.querySelector('.modal-wrapper');
    modal.removeChild(originalModalWrapper);

    let addWorkForm = document.createElement('form');
    addWorkForm.setAttribute('id', 'add-work');
    addWorkForm.setAttribute('method', 'post');
}
function deleteAllWorks() {}
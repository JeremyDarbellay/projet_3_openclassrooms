
import { works, categories } from "./sets.js"

/**
* reset gallery
* iterate over works 
* create a figure element for each work
* if filter provided, only show corresponding works
* @param {String|Number} [categoryId=default] optional filter
*/ 
async function buildGallery(categoryId = 'default') {

    // reset gallery
    removeWorksFromGallery();

    /* select gallery to add theses elements */
    const galleryContainer = document.querySelector('div.gallery');

    works.forEach((work) => {

        if( categoryId == work.categoryId || categoryId == 'default' ) {

            // add figure containing this work before the end of gallery
            galleryContainer.insertAdjacentHTML('beforeend', `
                <figure>
                    <img src="${work.imageUrl}" alt="${work.title}">
                    <figcaption>${work.title}</figcaption>
                </figure>
            `);

        }
    });
}

/**
 * remove all figures elements
 * from div.gallery
 */
function removeWorksFromGallery() {

    /* select gallery to add theses elements */
    const figures = document.querySelectorAll('div.gallery>figure');

    figures.forEach( (figure) => figure.remove() )

}

/** 
* main function to build category bar 
* and attach events listeners
*/
async function buildCategories() {

    let filterBarElt = await createFilterBar();

    // manually add "all" filter
    filterBarElt.insertAdjacentHTML('afterbegin', `<button class="active" data-categoryid="default">Tous</button>`);

    categories.forEach((category) => {

        // create category button
        filterBarElt.insertAdjacentHTML('beforeend', `<button data-categoryid="${category.id}">${category.name}</button>`);

    });

    // add Event listener to categories
    for (let category of filterBarElt.childNodes) {
        category.addEventListener('click', (e) => filterWorks(e));
    }

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
 * hide works if not in category provided
 * if no category provided show all works
 * @param {Event} e the event propagated
 */
async function filterWorks(e) {

    if (e.currentTarget.classList.contains('active')) return

    // remove active class from all filters
    for (let button of document.querySelectorAll('div.categories>button')) button.classList.remove('active');
    // then add active to current target
    e.currentTarget.classList.add('active');

    // rebuild gallery with correct filter
    buildGallery(e.currentTarget.getAttribute('data-categoryid'));

}

/**
 * custom function to add a paragraph
 * containing an error message for users
 */
async function showErrorElt() {

    // if there's already an error, do nothing
    if (document.querySelector('#portfolio .error')) return

    /* select gallery to add theses elements */
    const portfolio = document.getElementById("portfolio");

    // create an error to show to user
    let errorElt = document.createElement('p');
    errorElt.classList.add('error');
    errorElt.appendChild(document.createTextNode('Une erreur est survenue, veuillez nous excuser pour le désagrément'));

    // replace elements gallery with
    portfolio.appendChild(errorElt);
    
}

export { buildCategories, buildGallery, showErrorElt }
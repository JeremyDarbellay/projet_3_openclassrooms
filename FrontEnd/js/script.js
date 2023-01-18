/* Script chargé de l'import des projets */

/* TODOLIST
 */

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
        .then( works => works.forEach( (work) => worksSet.add(work)) )

}

/**
 * Make an api call to retrieve categories
 * @return {object}
 */
async function getAllCategories() {

    return fetch('http://localhost:5678/api/categories')
        .then( categories => categories.json() )

}

/*
* add all works to gallery
* iterate over works 
* create a figure element for each work
*/ 
async function addGallery() {

    /* select gallery to add theses elements */
    const galleryContainer = document.querySelector('div.gallery');

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

        return figureElt
}

/* 
* call necessary function to add dynamic elements
* to this page
*/
async function buildPage() {

    // retrieve works
    await getAllWorks();

    buildCategories();

    addGallery();

    showWorksBar();
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
    })

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
 */
async function showWorksBar() {

}
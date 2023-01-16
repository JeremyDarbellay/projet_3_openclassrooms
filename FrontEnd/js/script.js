/* Script chargé de l'import des projets */

/* call our function to build non filtered gallery */
document.body.onload = buildGallery;


/* make an api call to retrieve all projects and return it */
async function getAllProject() {

    /* define our options */
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    /* use this url */
    const projectsUrl = 'http://localhost:5678/api/works';

    /* effectively fetch projects */
    const response = await fetch(projectsUrl, options);

    /* to Json for ease of use */
    const projects = await response.json();

    /* finally return projects */
    return projects;

}

/*
* add all projects to gallery on page load
* iterate over projects 
* create a figure element for each project
*/ 
async function buildGallery() {

    const projects = await importProject();

    projects.forEach((project) => {


        /* init our vars */
        let figureElt;
        let imgElt;
        let captionElt;
        let captionText;
        let galleryContainer;

        /* select gallery to add theses elements */
        galleryContainer = document.querySelector('div.gallery');

        /* create figure container */
        figureElt = document.createElement('figure');

        figureElt = galleryContainer.appendChild(figureElt);

        /* create image */
        imgElt = document.createElement('img');
        imgElt.setAttribute('src', project.imageUrl);
        imgElt.setAttribute('alt', project.title);

        /* add image to figure */
        figureElt.appendChild(imgElt);

        /* create caption */
        captionElt = document.createElement('figcaption');

        /* add figcaption to figure */
        captionElt = figureElt.appendChild(captionElt);
        captionText = document.createTextNode(project.title);

        /* add text to caption */
        captionElt.appendChild(captionText);
    
    });
}


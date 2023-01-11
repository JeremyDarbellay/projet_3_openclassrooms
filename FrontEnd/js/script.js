/* Script chargé de l'import des projets */

async function importProject() {

    /* define our options */
    const options = {
        method: 'GET',
        mode: 'cors',
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
        // imgElt.setAttribute('src', project.imageUrl);

        // cors not enabled, test with clean url
        imgElt.setAttribute('src', 'https://place-hold.it/900');
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

document.body.onload = buildGallery;


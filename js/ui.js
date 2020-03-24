const url = 'https://cmgt.hr.nl:8000/api/projects/'

function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

function appendImg(parent, el) {
    parent.appendChild(el).style.width = '100%';
    parent.appendChild(el).style.height = 'auto';

    return parent
}

function appendName(parent, el) {
    return parent.appendChild(el);
}


function createDiv(parent, li) {
    return parent.appendChild(li).className = 'card-panel white row center'
}

const div = document.getElementById('projects');

fetch(url)
    .then(r => {
        if (r.ok) {
            return r
        }

        throw new Error('Error Invalid Status Code')
    })
    .then(response => (response.json()))
    .then((data) => {
        const projects = data.projects
        localforage.setItem('projects', projects)
        return projects.map((project) => {
            let projectDiv = createNode('div')
            let textDiv = createNode('div')
            let img = createNode('img')
            let span = createNode('span')
            img.src = 'https://cmgt.hr.nl:8000/' + project.headerImage
            span.innerHTML = `${project.title} - ${project.author}`
            appendImg(projectDiv, img);
            appendName(textDiv, span);
            if (project && project.tags[0]) {
                let tagsDiv = createNode('div')
                project.tags.map(tag => {
                    let spanTags = createNode('span')
                    spanTags.innerHTML = `${tag} `
                    appendName(tagsDiv, spanTags)
                })
                appendName(textDiv, tagsDiv)
            }
            appendName(projectDiv, textDiv);
            append(div, projectDiv);

            createDiv(div, projectDiv);
        })
    })
    .catch((e) => {
        console.error('Error while fetching, trying indexDB')
        try {
            localforage.getItem('projects').then(projects => {
            return projects.map((project) => {
                let projectDiv = createNode('div')
                let textDiv = createNode('div')
                let img = createNode('img')
                let span = createNode('span')
                img.src = 'https://cmgt.hr.nl:8000/' + project.headerImage
                span.innerHTML = `${project.title} - ${project.author}`
                appendImg(projectDiv, img);
                appendName(textDiv, span);
                if (project && project.tags[0]) {
                    let tagsDiv = createNode('div')
                    project.tags.map(tag => {
                        let spanTags = createNode('span')
                        spanTags.innerHTML = `${tag} `
                        appendName(tagsDiv, spanTags)
                    })
                    appendName(textDiv, tagsDiv)
                }
                appendName(projectDiv, textDiv);
                append(div, projectDiv);
    
                createDiv(div, projectDiv);
            })
        })
    } catch (e) {console.error(e)}
    })


const tagsUrl = 'https://cmgt.hr.nl:8000/api/projects/tags'
const tagsPageDiv = document.getElementById('side-menu');

fetch(tagsUrl)
    .then(r => {
        if (r.ok) {
            return r
        }

        throw new Error('Error Invalid Status Code')
    })
    .then(response => response.json())
    .then(data => {
        // Remove offline 
        tagsPageDiv.removeChild(tagsPageDiv.childNodes[3])
        data.tags.map(item => {
            let node = document.createElement('li')
            let linkNode = document.createElement('a')
            let textNode = document.createTextNode(item)
            linkNode.appendChild(textNode).className = 'test'
            node.appendChild(linkNode)
            tagsPageDiv.appendChild(node)
        })
    })
    .catch(e => console.error(e))


document.addEventListener('DOMContentLoaded', () => {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, { edge: 'right' });
});

const offlineDiv = document.getElementById('offline-msg')

// init online check
if (navigator.onLine) {
    offlineDiv.style.display = 'none'
} else {
    offlineDiv.style.display = 'inline'
}

// Offline/ Online notification listener
window.addEventListener('load', () => {
    function handleNetworkChange(event) {
        if (navigator.onLine) {
            offlineDiv.style.display = 'none'
        } else {
            offlineDiv.style.display = 'inline'
        }
    }

    window.addEventListener("online", handleNetworkChange)
    window.addEventListener("offline", handleNetworkChange)
})

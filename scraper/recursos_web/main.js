const axios = require('axios');
const jsdom = require('jsdom');
const sanitize = require("sanitize-filename");
const fs = require("fs");
const { mkdir } = require("fs/promises");
const { Readable } = require('stream');
const { finished } = require('stream/promises');
const path = require("path");
const { log } = require('console');



EngWebLink = "https://epl.di.uminho.pt/~jcr/AULAS/EngWeb2023/aulas2023.html"
baseEngWebLink = "https://epl.di.uminho.pt/~jcr/AULAS/EngWeb2023/"







function strip(string) {
    return string.replace(/^\s+|\s+$/g, '');
}


async function f() {
    try {
        const r = await axios.get(EngWebLink);

        const dom = new jsdom.JSDOM(r.data);
        const document = dom.window.document;
        containers = [...document.getElementsByClassName('w3-container')]
        pratical_classes = containers.filter((e) => e.id.match(/P\d/))
        classes = []

        for (let index = 0; index < pratical_classes.length; index++) {
            p_class = {}
            const dom_class = pratical_classes[index]
            p_class.title = dom_class.getElementsByTagName('h6')[0].textContent
            p_class.desc = strip(dom_class.textContent)
            const anchorTags = dom_class.getElementsByTagName('a');
            p_class.files = [...anchorTags].map((a) => (
                {
                    title: strip(a.textContent),
                    url: baseEngWebLink + a.href.slice(2),
                    fileName: a.href.split("/").slice(-1).pop()
                })
            )
            classes.push(p_class)
        }
        return classes
    }


    catch (e) {
        console.error(e)
        return []
    }
}


// https://stackoverflow.com/questions/37614649/how-can-i-download-and-save-a-file-using-the-fetch-api-node-js
const downloadFile = (async (url, path_to_save, fileName) => {
    const res = await fetch(url);
    path_to_save = sanitize(path_to_save)
    path_to_save = path_to_save.replace(/[ &\/\\#,+()$~%.'":*?<>{}]/g, "")
    path_to_save="./downloads/"+path_to_save
    console.log(path_to_save)
    if (!fs.existsSync("./downloads")) await mkdir("./downloads");
    if (!fs.existsSync(path_to_save)) await mkdir(path_to_save); //Optional if you already have downloads directory
    const destination = path.resolve(path_to_save, fileName);
    const fileStream = fs.createWriteStream(destination, { flags: 'wx' });
    await finished(Readable.fromWeb(res.body).pipe(fileStream));
});


async function download_class(class_) {
    for (file of class_.files)
        downloadFile(file.url, class_.title,file.fileName)
}


const JSONToFile = (obj, filename) =>
    fs.writeFileSync(`${filename}.json`, JSON.stringify(obj, null, 2));
  

async function main() {

    classes = await f()

    JSONToFile(classes, "recursos_eng_web")

    for (class_ of classes) {
        download_class(class_)
    }

}

main()
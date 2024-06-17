const axios = require('axios');

const uri = (id) =>
  `https://www.uminho.pt/PT/ensino/oferta-educativa/Cursos-Conferentes-a-Grau/_layouts/15/UMinho.PortalUM.UI/Pages/CatalogoCursoDetail.aspx?itemId=${id}&catId=15`;
// estimo que haja IDs entre 4847 e 5212

const jsdom = require('jsdom');

async function getCourse(courseId, print) {
  try {
    const r = await axios.get(uri(courseId));
    const dom = new jsdom.JSDOM(r.data);
    const document = dom.window.document;
    const curso = document.getElementById('ctl00_PlaceHolderMain_lblCurso');

    let i = 1;
    let list = [];
    while (1) {
      const i_s = String(i).padStart(2, '0');
      try {
        const id = `ctl00_PlaceHolderMain_ctlPlanosCurso_linhas_ctl${i_s}_lbNome`;
        list.push(document.getElementById(id).innerHTML);
        i++;
      } catch (err) {
        const id = `ctl00_PlaceHolderMain_ctlPlanosCurso_linhas_ctl${i_s}_lblNome`;
        if (!document.getElementById(id)) break;
        else {
          i++;
        }
      }
    }
    return new Promise((resolve, reject) => {
      resolve({ name: curso.innerHTML, id: courseId, classes: list });
    });
  } catch (err) {
    console.log(err);
  }
}

async function f() {
  let res = {};

  if (process.argv.length > 2) {
    getCourse(process.argv[2], true);
  } else {
    // 5212

    for (let index = 4847; index <= 5212; index++) {
      const course = await getCourse(index, index == 5212);
      res[course.name] = { id: course.id, classes: course.classes };
      console.error(course.id, course.name);
    }
  }
  console.log(JSON.stringify(res));
  return res;
}

f();

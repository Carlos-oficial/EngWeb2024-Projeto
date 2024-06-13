axios = require("axios");
res = {};

uri = (id) =>
  `https://www.uminho.pt/PT/ensino/oferta-educativa/Cursos-Conferentes-a-Grau/_layouts/15/UMinho.PortalUM.UI/Pages/CatalogoCursoDetail.aspx?itemId=${id}&catId=15`;
// estimo que haja IDs entre 4847 e 5212

const jsdom = require("jsdom");

for (let index = 4847; index <= 5212; index++) {
  axios
    .get(uri(index))
    .then((r) => {
      const dom = new jsdom.JSDOM(r.data);
      document = dom.window.document;
      const curso = document.getElementById("ctl00_PlaceHolderMain_lblCurso");
      const main_table = document.getElementById(
        "ctl00_PlaceHolderMain_ctlPlanosCurso_pnlPlano"
      );
      i = 1;
      list = [];
      while (1) {
        i_s = String(i).padStart(2, "0");
        try {
          id = `ctl00_PlaceHolderMain_ctlPlanosCurso_linhas_ctl${i_s}_lbNome`;
          list.push(document.getElementById(id).innerHTML);
          i++;
        } catch (err) {
          break;
        }
      }
      res[curso.innerHTML] = { id: index, classes: list };
      console.error(index);
      if (index == 5212) console.log(res);
    })
    .catch((err) => console.log(err));
}

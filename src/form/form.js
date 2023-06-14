import "../assets/styles/styles.scss";
import "./form.scss";
import { openModal } from "../assets/javascripts/modal";

const form = document.querySelector("form");
const errorElement = document.querySelector("#errors");
const btnCancel = document.querySelector(".btn-secondary");
let articleId;
let errors = [];

const fillForm = article => { /* on crer une methode pour recuperer les element de notre formulaire, cest a dire quand on clique sur modifier larticle, tous les champs du formulaire sont preremplis comme a la base */
  const author = document.querySelector('input[name="author"]');
  const img = document.querySelector('input[name="img"]');
  const category = document.querySelector('input[name="category"]');
  const title = document.querySelector('input[name="title"]');
  const content = document.querySelector("textarea");/*maintenant que l'on a toute nos valeurs, on va ecraser les valeurs */
  author.value = article.author || "";
  img.value = article.img || "";
  category.value = article.category || "";
  title.value = article.title || "";
  content.value = article.content || "";
};

const initForm = async () => {
  const params = new URL(location.href);
  articleId = params.searchParams.get("id");
  if (articleId) {
    const response = await fetch(`https://restapi.fr/api/article/${articleId}`);
    if (response.status < 300) {
      const article = await response.json();
      fillForm(article); /*on passe l'article en parametre, donc la quand on clique sur modifier, le formu.aire est preremplis dans la page formualire pour etre changer */
    }
  }
};

initForm();

btnCancel.addEventListener("click", async () => {
  const result = await openModal( /* quand je creer un article dans formulaire, et au lieu de sauvegarder, j'annule, la popup "Si vous quittez la page, vous allez perdre votre article" apparait.  */
    "Si vous quittez la page, vous allez perdre votre article"
  );
  if (result) {
    location.assign("/index.html");
  }
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  const formData = new FormData(form);
  const article = Object.fromEntries(formData.entries());
  if (formIsValid(article)) {
    try {
      const json = JSON.stringify(article);
      let response;
      if (articleId) {
        response = await fetch(`https://restapi.fr/api/article/${articleId}`, { /*on utilise une requete de type PATCH, pour mofier l'article completement */
          method: "PATCH",
          body: json,
          headers: {
            "Content-Type": "application/json"
          }
        });
      } else {
        response = await fetch("https://restapi.fr/api/article", {
          method: "POST",
          body: json,
          headers: {
            "Content-Type": "application/json"
          }
        }); /* donc la, si je clique sur modifier l'article, et je change le nom par exemple et clique sur sauvegarder : on renvoie a la page d'accueil et le nom est bien modifier */
      }
      if (response.status < 299) {
        location.assign("/index.html");
      }
    } catch (e) {
      console.error("e : ", e);
    }
  }
});

const formIsValid = article => {
  errors = [];
  if (
    !article.author ||
    !article.category ||
    !article.content ||
    !article.img ||
    !article.title
  ) {
    errors.push("Vous devez renseigner tous les champs");
  } else {
    errors = [];
  }
  if (errors.length) {
    let errorHTML = "";
    errors.forEach(e => {
      errorHTML += `<li>${e}</li>`;
    });
    errorElement.innerHTML = errorHTML;
    return false;
  } else {
    errorElement.innerHTML = "";
    return true;
  }
};
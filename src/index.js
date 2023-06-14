import './assets/styles/styles.scss';
import './index.scss';
import { openModal } from './assets/javascripts/modal';/* on recupere notre fichier modal.js, cette methode evite de configurer webpack.cinfig.js */

const articleContainerElement = document.querySelector('.articles-container');
const categoriesContainerElement = document.querySelector('.categories');
const selectElement = document.querySelector('select'); /* mise en place du javascript pour la barre select */
let filter;
let articles;
let sortBy = 'desc';

selectElement.addEventListener('change', () => { /* ecouter le changement qund je clique sur l'une des 2 options */
  sortBy = selectElement.value; /* recupere la valeur de notre input */
  fetchArticle();
});

const createArticles = () => { /* filtre les articles par category */
  const articlesDOM = articles
    .filter((article) => {
      if (filter) {
        return article.category === filter;
      } else {
        return true;  /* sinon oui, on recupere les articles histoire par exemple */
      }
    })
    .map((article) => {
      const articleDOM = document.createElement('div');
      articleDOM.classList.add('article');
      articleDOM.innerHTML = `
<img
  src="${article.img}"
  alt="profile"
/>
<h2>${article.title}</h2>
<p class="article-author">${article.author} - ${new Date(
        article.createdAt
      ).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })}</p>
<p class="article-content">
  ${article.content}
</p>
<div class="article-actions">
  <button class="btn btn-danger" data-id=${article._id} >Supprimer</button>
  <button class="btn btn-primary" data-id=${article._id} >Modifier</button>
</div>
`;
      return articleDOM;
    });
  articleContainerElement.innerHTML = '';
  articleContainerElement.append(...articlesDOM);
  const deleteButtons = articleContainerElement.querySelectorAll('.btn-danger');
  const editButtons = articleContainerElement.querySelectorAll('.btn-primary');
  editButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const target = event.target;
      const articleId = target.dataset.id;
      location.assign(`/form.html?id=${articleId}`);
    });
  });
  deleteButtons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      const result = await openModal(  /* pop up quand je clique sur supprimer */
        'Etes vous sur de vouloir supprimer votre article ?'
      );
      if (result === true) { /* si il valide la suppression d'article */
        try {
          const target = event.target;
          const articleId = target.dataset.id;
          const response = await fetch(
            `https://restapi.fr/api/article/${articleId}`,
            {
              method: 'DELETE',  /* article supprimer */
            }
          );
          const body = await response.json();
          fetchArticle();
        } catch (e) {    /* sinon, non, on supprime pas */
          console.log('e : ', e);
        }
      }
    });
  });
};

const displayMenuCategories = (categoriesArr) => {
  const liElements = categoriesArr.map((categoryElem) => {
    const li = document.createElement('li');
    li.innerHTML = `${categoryElem[0]} ( <strong>${categoryElem[1]}</strong> )`;
    if (categoryElem[0] === filter) { 
      li.classList.add('active'); /* class active, pour lorsque qu'on clique sur une categorie, elle reste en couleur et en gras, si on la parcoure du plus recent au plus ancien, elle reste colorer */
    }
    li.addEventListener('click', () => {
      if (filter === categoryElem[0]) { /* filtre a deja ete selectionner ici, */
        filter = null;                   /* reasigne pour deselectionner, quqnd je reclique sur longlet de la category une 2eme fois, cela le deselectionne */
        li.classList.remove('active'); /* deselectionne la class active lorsque je click sur une autre category */
        createArticles();
      } else {
        filter = categoryElem[0];
        liElements.forEach((li) => {
          li.classList.remove('active');
        });
        li.classList.add('active');
        createArticles();
      }
    });
    return li;
  });

  categoriesContainerElement.innerHTML = '';
  categoriesContainerElement.append(...liElements);
};

const createMenuCategories = () => {
  const categories = articles.reduce((acc, article) => {
    if (acc[article.category]) {
      acc[article.category]++;
    } else {
      acc[article.category] = 1;
    }
    return acc;
  }, {});

  const categoriesArr = Object.keys(categories)
    .map((category) => {
      return [category, categories[category]];
    })
    .sort((c1, c2) => c1[0].localeCompare(c2[0])); /* pour creer le tri du plus recent au plus ancien, pour inverser, on change c1 a la place de c2 */
  displayMenuCategories(categoriesArr);
};

const fetchArticle = async () => {
  try {
    const response = await fetch(
      `https://restapi.fr/api/article?sort=createdAt:${sortBy}` /* Api pour le tri de l'onglet select via SortBy */
    );
    articles = await response.json();
    if (!Array.isArray(articles)) {
      articles = [articles];
    }
    createArticles();
    createMenuCategories();
  } catch (e) {
    console.log('e : ', e);
  }
};

fetchArticle();
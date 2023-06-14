const body = document.querySelector("body");
let calc;
let modal;
let cancel; /* reference a annuler*/
let confirm; /* reference a confirmer*/

const createCalc = () => { /* methode creation du calque */
  calc = document.createElement("div");
  calc.classList.add("calc");
};

const createModal = question => { /* methode creation de la modal, pour creer notre popup elle prends en parametres une question */
  modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <p>${question}</p>
  `;
  cancel = document.createElement("button"); /*choix de vouloir annuler ou supprimer la demande de suppression d'articles */
  cancel.innerText = "Annuler";
  cancel.classList.add("btn", "btn-secondary");
  confirm = document.createElement("button");
  confirm.classList.add("btn", "btn-primary");
  confirm.innerText = "Confirmer";
  modal.addEventListener("click", event => {
    event.stopPropagation(); /* eviter la propagation */
  });
  modal.append(cancel, confirm);
};

export function openModal(question) {
  createCalc();
  createModal(question);
  calc.append(modal);
  body.append(calc);
  return new Promise((resolve, reject) => { /* methode de notre promesse: reponse de l'utilisateur, si il veut ou pas supprimer l'article */
    calc.addEventListener("click", () => {
      resolve(false);
      calc.remove(); /* quand on clique sur la page, le calque et la popup disparait */
    });

    cancel.addEventListener("click", () => {
      resolve(false); /* non, je ne veux pas supprimer l'article */
      calc.remove();/* quand on clique sur la page, la popup disparait */
    });

    confirm.addEventListener("click", () => {
      resolve(true); /* oui, je veux supprimer l'article */
      calc.remove(); /* quand on clique sur la page, la popup disparait */
    });
  });
}
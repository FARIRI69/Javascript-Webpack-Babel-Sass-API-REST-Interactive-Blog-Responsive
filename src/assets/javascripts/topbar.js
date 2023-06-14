/* reglage de la barre mobile */
const iconMobile = document.querySelector(".header-menu-icon");
const headerMenu = document.querySelector(".header-menu");
let isMenuOpen = false;
let mobileMenuDOM;
const closeMenu = () =>{
    mobileMenuDOM.classList.remove("open");

}

const createMobileMenu = () =>{
    mobileMenuDOM = document.createElement("div");
    mobileMenuDOM.classList.add("mobile-menu");
    mobileMenuDOM.addEventListener("click", event => {

    })
    mobileMenuDOM.append(headerMenu.querySelector('ul').cloneNode(true));
    headerMenu.append(mobileMenuDOM);
}

const openMenu = () =>{
    if(mobileMenuDOM){
        
    }else{
        createMobileMenu();
    }
    mobileMenuDOM.classList.add("open");
};
const toggleMobileMenu =  event => {
    event.stopPropagation();
    console.log(event);
    if(isMenuOpen){
 closeMenu();
    }else{
     openMenu();
    }
    isMenuOpen =!isMenuOpen; /* quand je clique aur la page, le menu mobile disparait */
 }; /* toogle, pour quand je clique sur la page du format mobile, le menu de la barre mobile disparait */
iconMobile.addEventListener("click",(event) =>{
    event.stopPropagation(); /* configuration, suite pour la disparition des onglets en format mobile, quand je clique sur la page */
    toggleMobileMenu();
});

window.addEventListener("click", () =>{
    if(isMenuOpen){
        toggleMobileMenu();
    }
});

window.addEventListener("resize", (event) =>{
if(window.innerWidth >480 && isMenuOpen) { /* si on est dans ce cas, on va toogle le menu */
  toggleMobileMenu();

}
});
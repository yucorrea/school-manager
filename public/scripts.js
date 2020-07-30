const currentPage = location.pathname;
const links = document.querySelectorAll(".nav__link");

links.forEach(link => {
  if(currentPage.includes(link.getAttribute("href"))){
    link.classList.add("active");
  }
})
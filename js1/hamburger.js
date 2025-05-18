document.addEventListener("DOMContentLoaded", function() {
  const hamburger = document.querySelector(".menu-btn");
  const divBar = document.querySelector(".DivBar");

  hamburger.addEventListener("click", () => {
    divBar.classList.toggle("active"); // This toggles the sliding menu
  });
});

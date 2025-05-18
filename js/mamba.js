 
let nav = document.querySelector("nav");
let scrollBtn = document.querySelector(".scroll-button a");

 
window.onscroll = function () {
  if (document.documentElement.scrollTop > 20) {
    nav.classList.add("sticky");
    scrollBtn.style.display = "block";
  } else {
    nav.classList.remove("sticky");
    scrollBtn.style.display = "none";
  }
};

function toggleFolder(folder) {
  folder.classList.toggle('open');
  const label = folder.querySelector('.folder-label');
  if (folder.classList.contains('open')) {
      label.style.display = 'none';
  } else {
      label.style.display = 'flex';
  }
}
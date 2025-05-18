 
let elementsToAnimate = document.querySelectorAll('.scroll-animation');

 
function checkVisibility() {
  elementsToAnimate.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const viewportHeight = window.innerHeight;
    
    if (elementPosition < viewportHeight - 100) {  
      element.classList.add('visible');  
    } else {
      element.classList.remove('visible');  
    }
  });
}

 
window.addEventListener('scroll', checkVisibility);

 
window.addEventListener('load', checkVisibility);

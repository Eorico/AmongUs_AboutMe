document.addEventListener("DOMContentLoaded", () => {
    const artistBox = document.getElementById("artistBox");
    const music = document.getElementById("music");

   
    let userInteracted = false;
    document.addEventListener("click", () => {
        userInteracted = true;
    });

    artistBox.addEventListener("mouseenter", () => {
        if (userInteracted) {
            music.play().catch(error => console.log("Playback error:", error));
        }
    });

    artistBox.addEventListener("mouseleave", () => {
        music.pause();
        music.currentTime = 0;  
    });
});
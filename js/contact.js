document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();

    if (name === "" || email === "" || message === "") {
        alert("Please fill out all fields before submitting.");
    } else {
        // Prepare data to send
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("message", message);

        // Send AJAX request to PHP
        fetch("php/sendmail.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(result => {
            if (result === "success") {
                alert("Your message has been sent successfully!");
                document.getElementById("contactForm").reset();
            } else {
                alert("Failed to send message. Please try again later.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Something went wrong.");
        });
    }
});

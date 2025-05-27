window.onload = function() {
  emailjs.init('vgVTRh34_bhrc0gWa');

  document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    emailjs.sendForm('service_68l42ds', 'template_pyxfxb9', this)
      .then(function() {
        alert('Message sent successfully!');
        this.reset();
      }.bind(this), function(error) {
        alert('Failed to send the message, please try again.');
        console.error('EmailJS error:', error);
      });
  });
};

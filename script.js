document.addEventListener("DOMContentLoaded", function() {
    // Mobile menu toggle
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');

    menuIcon.onclick = () => {
        menuIcon.classList.toggle('active');
        navbar.classList.toggle('active');
    }

    // Close mobile menu when clicking a nav link
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            menuIcon.classList.remove('active');
            navbar.classList.remove('active');
        });
    });

    emailjs.init("pxMeZnYhCPCs8V3ir"); // Replace with your Public Key

    document.getElementById("contact-form").addEventListener("submit", function(event) {
        event.preventDefault();

        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let message = document.getElementById("message").value.trim();
        let statusMessage = document.getElementById("status-message");
        let submitBtn = document.querySelector("#contact-form button");

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        if (name === "" || email === "" || message === "") {
            statusMessage.innerText = "⚠️ Please fill in all fields.";
            statusMessage.style.color = "red";
            return;
        }

        if (!isValidEmail(email)) {
            statusMessage.innerText = "⚠️ Please enter a valid email address.";
            statusMessage.style.color = "red";
            return;
        }

        submitBtn.disabled = true;
        statusMessage.innerText = "⏳ Sending...";
        statusMessage.style.color = "blue";

        emailjs.send("vivek_git5", "template_h3r3gob", {
            from_name: name,
            reply_to: email,
            message: message
        }).then(
            function(response) {
                console.log("SUCCESS!", response.status, response.text);
                statusMessage.innerText = "✅ Message sent successfully!";
                statusMessage.style.color = "green";
                document.getElementById("contact-form").reset();
                submitBtn.disabled = false;
            },
            function(error) {
                console.log("FAILED...", error);
                statusMessage.innerText = "❌ Failed to send message. Try again.";
                statusMessage.style.color = "red";
                submitBtn.disabled = false;
            }
        );
    });
});
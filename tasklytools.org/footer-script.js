// Function to load navbar and footer
document.addEventListener("DOMContentLoaded", function () {
    fetch("navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
        })
        .catch(error => console.error("Error loading the navbar:", error));
    
    fetch("page-navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container-page").innerHTML = data;
        })
        .catch(error => console.error("Error loading the navbar:", error));
    
    fetch("related-post.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("relatedpost-container-page").innerHTML = data;
        })
        .catch(error => console.error("Error loading the navbar:", error));

    fetch("sponsored.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("sponsored-container").innerHTML = data;
        })
        .catch(error => console.error("Error loading the navbar:", error));
    
    fetch("sidebar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("sidebar-container-page").innerHTML = data;
        })
        .catch(error => console.error("Error loading the navbar:", error));
    fetch("sidebar-top.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("sidebar-container-page-head").innerHTML = data;
        })
        .catch(error => console.error("Error loading the Sidebar Top:", error));

    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-container").innerHTML = data;
        })
        .catch(error => console.error("Error loading the footer:", error));
});
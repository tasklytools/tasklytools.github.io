// Function to load navbar, sidebar, footer, etc.
document.addEventListener("DOMContentLoaded", function () {
    const basePath = window.location.origin; // e.g. https://tasklytools.org

    fetch(basePath + "/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
        })
        .catch(error => console.error("Error loading the navbar:", error));
    
    fetch(basePath + "/page-navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container-page").innerHTML = data;
        })
        .catch(error => console.error("Error loading the page-navbar:", error));
    
    fetch(basePath + "/related-post.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("relatedpost-container-page").innerHTML = data;
        })
        .catch(error => console.error("Error loading related post:", error));

    fetch(basePath + "/sponsored.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("sponsored-container").innerHTML = data;
        })
        .catch(error => console.error("Error loading sponsored:", error));
    
    fetch(basePath + "/sidebar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("sidebar-container-page").innerHTML = data;
        })
        .catch(error => console.error("Error loading sidebar:", error));

    fetch(basePath + "/sidebar-top.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("sidebar-container-page-head").innerHTML = data;
        })
        .catch(error => console.error("Error loading the Sidebar Top:", error));

    fetch(basePath + "/footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-container").innerHTML = data;
        })
        .catch(error => console.error("Error loading the footer:", error));
});

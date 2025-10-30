document.addEventListener("DOMContentLoaded", function () {
  const basePath = window.location.origin;

  // --- Load Preloader ---
  fetch(basePath + "/pre-load.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("pre-load-animation").innerHTML = data;

      // ✅ Now that pre-load.html is injected, run loader logic here
      const siteLogo = "/wp-content/uploads/2025/05/taskly-tools.png"; // your logo
      const dynamicLogo = document.getElementById('dynamic-logo');
      if (dynamicLogo) dynamicLogo.src = siteLogo;

      window.addEventListener('load', () => {
        const loader = document.getElementById('app-boot-bg-loader');
        if (loader) {
          setTimeout(() => {
            loader.classList.add('hide');
            document.body.style.overflow = 'auto';
          }, 800);
        }
      });
    })
    .catch(error => console.error("Error loading preloader:", error));

  // --- Load Other Layout Components ---
  fetch(basePath + "/navbar.html")
    .then(r => r.text())
    .then(data => document.getElementById("navbar-container").innerHTML = data)
    .catch(error => console.error("Navbar load error:", error));

  fetch(basePath + "/page-navbar.html")
    .then(r => r.text())
    .then(data => document.getElementById("navbar-container-page").innerHTML = data)
    .catch(error => console.error("Page Navbar load error:", error));

  fetch(basePath + "/related-post.html")
    .then(r => r.text())
    .then(data => document.getElementById("relatedpost-container-page").innerHTML = data)
    .catch(error => console.error("Related post load error:", error));

  fetch(basePath + "/sponsored.html")
    .then(r => r.text())
    .then(data => document.getElementById("sponsored-container").innerHTML = data)
    .catch(error => console.error("Sponsored load error:", error));

  fetch(basePath + "/socialandauthor.html")
    .then(r => r.text())
    .then(data => document.getElementById("socialandauthor").innerHTML = data)
    .catch(error => console.error("Social & Author load error:", error));

  fetch(basePath + "/sidebar.html")
    .then(r => r.text())
    .then(data => document.getElementById("sidebar-container-page").innerHTML = data)
    .catch(error => console.error("Sidebar load error:", error));

  fetch(basePath + "/sidebar-top.html")
    .then(r => r.text())
    .then(data => document.getElementById("sidebar-container-page-head").innerHTML = data)
    .catch(error => console.error("Sidebar Top load error:", error));

  fetch(basePath + "/footer.html")
    .then(r => r.text())
    .then(data => document.getElementById("footer-container").innerHTML = data)
    .catch(error => console.error("Footer load error:", error));
});

const basePath = ''; // set if needed

function initStickyHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  // Offset for body padding
  function setOffset() {
    const h = header.offsetHeight || 72;
    document.documentElement.style.setProperty('--header-h', h + 'px');
    document.body.classList.add('has-fixed-header');
  }
  setOffset();
  window.addEventListener('resize', setOffset);

  let lastY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const goingDown = y > lastY;

    if (y > 10) header.classList.add('is-stuck');
    else header.classList.remove('is-stuck');

    if (y > 80 && goingDown) {
      header.classList.add('is-hidden'); // hide on scroll down
    } else {
      header.classList.remove('is-hidden'); // show on scroll up
    }

    lastY = y <= 0 ? 0 : y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
}

function initNavbarInteractions() {
  const searchIcon = document.getElementById("searchIcon");
  const searchForm = document.getElementById("searchForm");
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarMenu = document.getElementById("navbarSupportedContent");
  const myBtn = document.getElementById("myBtn");

  // Mobile menu toggle
  navbarToggler?.addEventListener("click", function() {
    navbarMenu?.classList.toggle("show");
  });

  // Scroll-to-top button
  function scrollFunction() {
    if (document.documentElement.scrollTop > 20) {
      myBtn.style.display = "block";
    } else {
      myBtn.style.display = "none";
    }
  }

  myBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", scrollFunction);

  // Smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Load navbar, then init scripts
fetch(basePath + "/navbar.html")
  .then(r => r.text())
  .then(html => {
    document.getElementById("navbar-container").innerHTML = html;

    initStickyHeader();       // sticky + scroll behavior
    initNavbarInteractions(); // search toggle + mobile toggle + scroll-to-top
  })
  .catch(err => console.error("Error loading navbar:", err));

  // Search toggle
  document.getElementById("searchIcon").addEventListener("click", function() {
    window.location.href = "search.html"; // works everywhere
});
const basePath = '';

function initStickyHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

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
      header.classList.add('is-hidden');
    } else {
      header.classList.remove('is-hidden');
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
  const myBtn = document.getElementById("myBtn");

  if (myBtn) {
    function scrollFunction() {
      if (document.documentElement.scrollTop > 20) {
        myBtn.style.display = "block";
      } else {
        myBtn.style.display = "none";
      }
    }

    myBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", scrollFunction);
  }

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

fetch(basePath + "/navbar.html")
  .then(r => r.text())
  .then(html => {
    document.getElementById("navbar-container").innerHTML = html;
    initStickyHeader();
    initNavbarInteractions();
  })
  .catch(err => console.error("Error loading navbar:", err));

const searchIcon = document.getElementById("searchIcon");
if (searchIcon) {
  searchIcon.addEventListener("click", function() {
    window.location.href = "search.html";
  });
}
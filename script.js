/* Apparition des sections au défilement */
(function () {
  function maj() {
    reveler();
  }
  var blocs = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  function montrer(el) {
    el.classList.add("visible");
    Array.prototype.forEach.call(el.children, function (enfant, i) {
      enfant.style.opacity = 0;
      enfant.style.transform = "translateY(12px)";
      enfant.style.transition =
        "opacity .6s cubic-bezier(.2,.7,.2,1) " +
        i * 0.09 +
        "s, transform .6s cubic-bezier(.2,.7,.2,1) " +
        i * 0.09 +
        "s";
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          enfant.style.opacity = 1;
          enfant.style.transform = "none";
        });
      });
    });
  }
  function reveler() {
    if (!blocs.length) return;
    var vh = window.innerHeight || 800;
    blocs = blocs.filter(function (el) {
      if (el.getBoundingClientRect().top < vh * 0.92) {
        montrer(el);
        return false;
      }
      return true;
    });
  }
  document.addEventListener("scroll", maj, {
    capture: true,
    passive: true,
  });
  window.addEventListener("resize", maj, { passive: true });
  maj();
  /* Observateur complémentaire, si le défilement n'émet pas d'événement */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entrees) {
        entrees.forEach(function (e) {
          if (e.isIntersecting) {
            montrer(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    blocs.forEach(function (el) {
      io.observe(el);
    });
  }
  /* Filet de sécurité : rien ne doit rester invisible */
  setTimeout(function () {
    blocs.forEach(function (el) {
      if (!el.classList.contains("visible")) montrer(el);
    });
    blocs = [];
  }, 1500);
})();

/* Formulaire de contact (envoi réel via Formspree) */
(function () {
  var form = document.getElementById("formulaire");
  var merci = document.getElementById("merci");
  var bouton = form.querySelector(".envoyer");
  var champs = {
    nom: function (v) {
      return v.trim().length > 0;
    },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    },
    message: function (v) {
      return v.trim().length >= 5;
    },
  };
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    Object.keys(champs).forEach(function (id) {
      var valide = champs[id](document.getElementById(id).value);
      document.getElementById("err-" + id).classList.toggle("cache", valide);
      if (!valide) ok = false;
    });
    if (!ok) return;

    bouton.disabled = true;
    bouton.textContent = "Envoi…";

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    })
      .then(function (reponse) {
        if (!reponse.ok) throw new Error("Échec de l'envoi");
        form.classList.add("cache");
        merci.classList.remove("cache");
      })
      .catch(function () {
        alert(
          "Une erreur est survenue lors de l'envoi. Merci de réessayer ou de m'écrire directement à decodtscloe@gmail.com.",
        );
      })
      .finally(function () {
        bouton.disabled = false;
        bouton.textContent = "Envoyer";
      });
  });
  document.getElementById("rejouer").addEventListener("click", function () {
    form.reset();
    Object.keys(champs).forEach(function (id) {
      document.getElementById("err-" + id).classList.add("cache");
    });
    merci.classList.add("cache");
    form.classList.remove("cache");
  });
})();

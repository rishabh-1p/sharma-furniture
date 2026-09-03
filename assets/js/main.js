// Sharma Furniture — small progressive-enhancement script.
// Everything on this page works without JavaScript; this just adds
// a couple of nice-to-haves.

(function () {
  "use strict";

  // Keep "years in business" and the footer year current automatically.
  try {
    var established = 2021;
    var now = new Date().getFullYear();
    var years = Math.max(1, now - established);

    var yearsEl = document.getElementById("yearsInBusiness");
    if (yearsEl) yearsEl.textContent = years + "+";

    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = now;
  } catch (e) {
    /* non-critical */
  }

  // Mobile nav toggle: shows/hides the main nav links as a simple dropdown.
  try {
    var toggle = document.getElementById("navToggle");
    var links = document.querySelector("nav.links");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var isOpen = links.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        if (isOpen) {
          links.style.display = "flex";
          links.style.flexDirection = "column";
          links.style.position = "absolute";
          links.style.top = "100%";
          links.style.left = "0";
          links.style.right = "0";
          links.style.background = "var(--surface)";
          links.style.borderBottom = "1px solid var(--line)";
          links.style.padding = "16px 24px";
          links.style.gap = "16px";
        } else {
          links.removeAttribute("style");
        }
      });
    }
  } catch (e) {
    /* non-critical */
  }

  // Showroom Highlights 3D coverflow carousel (Home page).
  // Degrades to a plain scrollable row (see CSS) if this never runs.
  try {
    var cfStage = document.getElementById("cfStage");
    var cfTrack = document.getElementById("cfTrack");

    if (cfStage && cfTrack) {
      var cfCards = Array.prototype.slice.call(cfTrack.querySelectorAll(".cf-card"));
      var cfTotal = cfCards.length;

      if (cfTotal > 0) {
        var cfIndex = 0;
        var cfDotsWrap = document.getElementById("cfDots");
        var cfBg = document.getElementById("cfBgImg");
        var cfPrevBtn = document.getElementById("cfPrev");
        var cfNextBtn = document.getElementById("cfNext");
        var cfTimer = null;
        var cfReduceMotion =
          window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // Build one pagination dot per card.
        var cfDots = [];
        if (cfDotsWrap) {
          cfCards.forEach(function (card, i) {
            var dot = document.createElement("button");
            dot.type = "button";
            dot.className = "cf-dot";
            dot.setAttribute("aria-label", "Go to highlight " + (i + 1));
            dot.addEventListener("click", function () {
              cfGoTo(i);
            });
            cfDotsWrap.appendChild(dot);
            cfDots.push(dot);
          });
        }

        // Offsets scale with the card's own width, but at the component's
        // default 330px card they land exactly on the reference's fixed
        // 285px / 510px steps — so desktop matches pixel-for-pixel while
        // smaller cards (mobile) don't overshoot the viewport.
        function cfPosition() {
          var cardW = cfCards[0].getBoundingClientRect().width || 330;
          var step1 = cardW * 0.8636; // 285 / 330
          var step2 = cardW * 1.5455; // 510 / 330

          cfCards.forEach(function (card, i) {
            var diff = i - cfIndex;
            if (diff > cfTotal / 2) diff -= cfTotal;
            if (diff < -cfTotal / 2) diff += cfTotal;

            card.classList.remove("is-center", "is-adjacent", "is-far");

            var transform, opacity, z, filter;
            if (diff === 0) {
              transform = "translateX(0) scale(1) rotateY(0deg)";
              opacity = 1;
              z = 30;
              filter = "brightness(1)";
              card.classList.add("is-center");
            } else if (diff === -1 || diff === 1) {
              transform =
                "translateX(" + diff * step1 + "px) scale(.84) rotateY(" +
                diff * -24 + "deg)";
              opacity = 0.65;
              z = 20;
              filter = "brightness(.75)";
              card.classList.add("is-adjacent");
            } else if (diff === -2 || diff === 2) {
              transform =
                "translateX(" + diff * step2 + "px) scale(.68) rotateY(" +
                diff * -38 + "deg)";
              opacity = 0.38;
              z = 10;
              filter = "brightness(.55) blur(1px)";
              card.classList.add("is-far");
            } else {
              transform = "translateX(0) scale(.4) rotateY(0deg)";
              opacity = 0;
              z = 0;
              filter = "brightness(.4) blur(2px)";
            }

            card.style.transform = transform;
            card.style.opacity = opacity;
            card.style.zIndex = z;
            card.style.filter = filter;
            card.setAttribute("aria-hidden", diff === 0 ? "false" : "true");
            card.tabIndex = diff === 0 ? 0 : -1;
          });

          cfDots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === cfIndex);
          });

          if (cfBg) {
            var activeImg = cfCards[cfIndex].querySelector(".cf-img");
            if (activeImg && cfBg.src !== activeImg.src) {
              cfBg.src = activeImg.src;
            }
          }
        }

        function cfGoTo(i) {
          cfIndex = ((i % cfTotal) + cfTotal) % cfTotal;
          cfPosition();
        }
        function cfNext() {
          cfGoTo(cfIndex + 1);
        }
        function cfPrev() {
          cfGoTo(cfIndex - 1);
        }

        if (cfPrevBtn) cfPrevBtn.addEventListener("click", cfPrev);
        if (cfNextBtn) cfNextBtn.addEventListener("click", cfNext);

        cfCards.forEach(function (card, i) {
          card.addEventListener("click", function () {
            if (i !== cfIndex) cfGoTo(i);
          });
        });

        // Keyboard arrows, scoped to the carousel itself.
        cfStage.setAttribute("tabindex", "0");
        cfStage.addEventListener("keydown", function (e) {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            cfPrev();
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            cfNext();
          }
        });

        // Touch swipe.
        var cfTouchX = null;
        cfTrack.addEventListener(
          "touchstart",
          function (e) {
            cfTouchX = e.changedTouches[0].clientX;
          },
          { passive: true }
        );
        cfTrack.addEventListener(
          "touchend",
          function (e) {
            if (cfTouchX === null) return;
            var dx = e.changedTouches[0].clientX - cfTouchX;
            if (Math.abs(dx) > 45) {
              if (dx < 0) cfNext();
              else cfPrev();
            }
            cfTouchX = null;
          },
          { passive: true }
        );

        // Autoplay — paused on hover/focus, skipped for reduced-motion users.
        function cfStart() {
          if (cfReduceMotion || cfTimer) return;
          cfTimer = setInterval(cfNext, 5000);
        }
        function cfStop() {
          if (cfTimer) {
            clearInterval(cfTimer);
            cfTimer = null;
          }
        }
        cfStage.addEventListener("mouseenter", cfStop);
        cfStage.addEventListener("mouseleave", cfStart);
        cfStage.addEventListener("focusin", cfStop);
        cfStage.addEventListener("focusout", cfStart);

        var cfResizeT;
        window.addEventListener("resize", function () {
          clearTimeout(cfResizeT);
          cfResizeT = setTimeout(cfPosition, 120);
        });

        // Switch on the absolutely-positioned coverflow layout (see CSS
        // fallback for .coverflow-stage:not(.is-ready)) and go.
        cfStage.classList.add("is-ready");
        cfPosition();
        cfStart();
      }
    }
  } catch (e) {
    /* non-critical */
  }
})();

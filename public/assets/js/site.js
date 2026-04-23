document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', function () {
    var expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    if (!expanded) {
      nav.style.display = 'block';
      btn.classList.add('open');
    } else {
      nav.style.display = '';
      btn.classList.remove('open');
    }
  });

  function onResize() {
    if (window.innerWidth >= 900) {
      nav.style.display = '';
      btn.setAttribute('aria-expanded', 'false');
    }
  }
  window.addEventListener('resize', onResize);
  onResize();
});

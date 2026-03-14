// Compute language-aware paths and navigate
(function(){
  function switchTo(lang){
    var p = window.location.pathname;
    // strip leading /de or /sv
    p = p.replace(/^\/(de|sv)(?=\/|$)/, '');
    if(lang === 'en'){
      window.location.pathname = p || '/';
    } else {
      window.location.pathname = '/' + lang + (p || '/');
    }
  }
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-lang-link]');
    if(!btn) return;
    e.preventDefault();
    var lang = btn.getAttribute('data-lang');
    switchTo(lang);
  });
})();

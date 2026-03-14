(function(){
  function setLang(lang){
    lang = (lang === 'de') ? 'de' : 'en';
    document.documentElement.lang = (lang === 'de') ? 'de' : 'en';
    document.querySelectorAll('.lang-en').forEach(el => el.classList.toggle('hidden', lang !== 'en'));
    document.querySelectorAll('.lang-de').forEach(el => el.classList.toggle('hidden', lang !== 'de'));
    localStorage.setItem('siteLang', lang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('bg-sky-50', btn.dataset.lang === lang);
      btn.classList.toggle('text-sky-700', btn.dataset.lang === lang);
    });
  }
  function init(){
    const stored = localStorage.getItem('siteLang') || 'en';
    setLang(stored);
    document.addEventListener('click', function(e){
      const btn = e.target.closest('.lang-btn');
      if(!btn) return;
      setLang(btn.dataset.lang);
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

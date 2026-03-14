// Inject a simple language selector into the header nav (desktop + mobile)
(function(){
  function makeButton(lang,label){
    var a = document.createElement('a');
    a.href = '#';
    a.setAttribute('data-lang-link','1');
    a.setAttribute('data-lang', lang);
    a.className = 'ml-2 text-sm font-medium text-gray-600 hover:text-gray-900';
    a.textContent = label;
    return a;
  }
  function inject(){
    var nav = document.getElementById('site-nav');
    if(!nav) return;
    var container = document.createElement('div');
    container.className = 'hidden md:flex items-center space-x-2';
    container.style.marginLeft = '12px';
    container.appendChild(makeButton('en','EN'));
    container.appendChild(makeButton('de','DE'));
    container.appendChild(makeButton('sv','SV'));
    // append to nav's first .hidden.md:flex if exists, else to nav
    var target = nav.querySelector('.hidden.md\:flex.items-center.space-x-10');
    if(target) target.parentNode.insertBefore(container, target.nextSibling);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject); else inject();
})();

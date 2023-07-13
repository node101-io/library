const NEW_WRITING_LOAD_SCROLL_DISTANCE = 400;

let SOCIAL_MEDIA_ICONS;
let QUERY;

function createSearchResult(writing) {
  const eachSearchResult = document.createElement('a');
  eachSearchResult.classList.add('all-header-each-search-input-result');
  eachSearchResult.href = writing.link;

  const eachSearchResultImage = document.createElement('img');
  eachSearchResultImage.classList.add('all-header-each-search-input-result-image');
  eachSearchResultImage.src = writing.logo;
  eachSearchResultImage.alt = writing.title;
  eachSearchResult.appendChild(eachSearchResultImage);

  const eachSearchResultText = document.createElement('span');
  eachSearchResultText.classList.add('all-header-each-search-input-result-text');
  eachSearchResultText.innerText = writing.title;
  eachSearchResult.appendChild(eachSearchResultText);

  const wrappers = document.querySelectorAll('.all-header-search-input-results-wrapper');

  for (let i = 0; i < wrappers.length; i++) {
    const cloneSearchResult = eachSearchResult.cloneNode(true);
    wrappers[i].appendChild(cloneSearchResult);
  }
};

function loadSearchResults(search) {
  serverRequest('/filter', 'POST', {
    search
  }, res => {
    if (!res.success)
      return throwError(res.error);

    const wrappers = document.querySelectorAll('.all-header-search-input-results-wrapper');

    for (let i = 0; i < wrappers.length; i++) {
      wrappers[i].innerHTML = '';
      if (res.writings?.length)
        wrappers[i].parentNode.style.overflow = 'visible';
      else
        wrappers[i].parentNode.style.overflow = 'hidden';
    }

    for (let i = 0; i < res.writings.length; i++)
      createSearchResult(res.writings[i]);
  })
};

function setColorTheme(theme) {
  const root = document.documentElement;

  if (theme == 'light') {
    root.style.setProperty('--box-color', 'rgba(212, 212, 212, 1)');
    root.style.setProperty('--background-color', 'rgba(256, 256, 256, 1)');
    root.style.setProperty('--background-color-two', 'rgba(248, 248, 248, 1)');
    root.style.setProperty('--border-color', 'rgba(136, 136, 136, 0.2)');
    root.style.setProperty('--hover-color', 'rgba(196, 196, 196, 0.2)');
    root.style.setProperty('--hover-color-light', 'rgba(188, 188, 188, 0.8)');
    root.style.setProperty('--button-text-color', 'rgba(12, 12, 16, 1)');
    root.style.setProperty('--text-color', 'rgba(4, 4, 15, 1)');
    root.style.setProperty('--text-color-two', 'rgba(6, 6, 12, 1)');
    root.style.setProperty('--placeholder-color', 'rgba(6, 6, 8, 0.6)');
    root.style.setProperty('--footer-bottom-color', 'rgba(224, 224, 224, 1)');
    root.style.setProperty('--navbar-each-empty-line-background-color', 'rgba(248, 248, 248, 1)');
    root.style.setProperty('--code-color', 'rgba(64, 64, 64, 1)');
  } else {
    root.style.setProperty('--box-color', 'rgba(6, 6, 9, 1)');
    root.style.setProperty('--background-color', 'rgba(13, 13, 15, 1)');
    root.style.setProperty('--background-color-two', 'rgba(8, 8, 10, 1)');
    root.style.setProperty('--border-color', 'rgba(248, 248, 248, 0.2)');
    root.style.setProperty('--hover-color', 'rgba(148, 148, 148, 0.2)');
    root.style.setProperty('--hover-color-light', 'rgba(254, 254, 254, 0.8)');
    root.style.setProperty('--button-text-color', 'rgba(250, 250, 250, 1)');
    root.style.setProperty('--text-color', 'rgba(254, 254, 254, 1)');
    root.style.setProperty('--text-color-two', 'rgba(236, 236, 236, 1)');
    root.style.setProperty('--placeholder-color', 'rgba(248, 248, 248, 0.6)');
    root.style.setProperty('--footer-bottom-color', 'rgba(1, 1, 2, 1)');
    root.style.setProperty('--navbar-each-empty-line-background-color', 'rgba(30, 30, 30, 1)');
    root.style.setProperty('--code-color', 'rgba(136, 136, 136, 1)');
  }

  const darkButtons = document.querySelectorAll('.all-header-change-theme-button-text-dark');
  const lightButtons = document.querySelectorAll('.all-header-change-theme-button-text-light');

  for (let i = 0; i < darkButtons.length; i++)
    darkButtons[i].style.display = (theme == 'dark' ? 'none' : 'unset'); 
  for (let i = 0; i < lightButtons.length; i++)
    lightButtons[i].style.display = (theme == 'light' ? 'none' : 'unset'); 
};

window.addEventListener('load', () => {
  let theme = JSON.parse(document.getElementById('theme').value);

  SOCIAL_MEDIA_ICONS = JSON.parse(document.getElementById('social-media-account-json').value);
  QUERY = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
  });

  const allHeaderLanguageWrapperList = document.querySelectorAll('.all-header-language-wrapper');

  document.addEventListener('mouseover', event => {
    if (ancestorWithClassName(event.target, 'all-header-language-wrapper')) {
      for (let i = 0; i < allHeaderLanguageWrapperList.length; i++)
        allHeaderLanguageWrapperList[i].style.overflow = 'visible';
    } else {
      for (let i = 0; i < allHeaderLanguageWrapperList.length; i++)
        allHeaderLanguageWrapperList[i].style.overflow = 'hidden';
    }
  });

  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'all-header-each-language-button')) {
      const target = ancestorWithClassName(event.target, 'all-header-each-language-button');
      const lang = target.id.replace('all-header-', '');

      let url = window.location.href.split('?')[0] + '?';

      Object.keys(QUERY).forEach(key => {
        if (key != 'lang')
          url = `${url}${key}=${QUERY[key]}&`;
      });
      url = `${url}lang=${lang}`;

      window.location.href = url;
    }

    if (event.target.closest('.all-header-change-theme-button')) {
      theme = (theme == 'dark' ? 'light' : 'dark');

      serverRequest('/theme', 'POST', {
        theme
      }, res => {
        if (!res.success)
          return throwError(res.error);

        setColorTheme(theme);
      });
    }
  });

  const allHeaderAnimationMaxHeight = 100;
  const allHeaderWrapper = document.querySelector('.all-header-wrapper');
  const allHeaderResponsiveWrapper = document.querySelector('.all-header-responsive-wrapper');

  document.querySelector('.all-wrapper').addEventListener('scroll', event => {
    allHeaderWrapper.style.borderBottomColor = `rgba(148, 148, 148, ${0.2 * Math.min(event.target.scrollTop, allHeaderAnimationMaxHeight) / allHeaderAnimationMaxHeight})`;
    allHeaderWrapper.style.boxShadow = `0 0 3px rgba(148, 148, 148, ${0.2 * Math.min(event.target.scrollTop, allHeaderAnimationMaxHeight) / allHeaderAnimationMaxHeight})`;
    allHeaderResponsiveWrapper.style.borderBottomColor = `rgba(148, 148, 148, ${0.2 * Math.min(event.target.scrollTop, allHeaderAnimationMaxHeight) / allHeaderAnimationMaxHeight})`;
    allHeaderResponsiveWrapper.style.boxShadow = `0 0 3px rgba(148, 148, 148, ${0.2 * Math.min(event.target.scrollTop, allHeaderAnimationMaxHeight) / allHeaderAnimationMaxHeight})`;
  });

  document.addEventListener('keyup', event => {
    if (event.target.classList.contains('all-header-search-input')) {
      if (
        event.key == 'Enter' &&
        event.target.value &&
        event.target.value.trim().length
      ) {
        window.location = `/search?${QUERY.lang ? 'lang=' + QUERY.lang + '&' : ''}search=${event.target.value.trim()}`
      }
    }
  });

  document.addEventListener('input', event => {
    if (ancestorWithClassName(event.target, 'all-header-search-input')) {
      const target = ancestorWithClassName(event.target, 'all-header-search-input');
      const value = target.value.trim();

      if (!value || !value.length) {
        const wrappers = document.querySelectorAll('.all-header-search-input-results-wrapper');
        for (let i = 0; i < wrappers.length; i++) {
          wrappers[i].innerHTML = '';
          wrappers[i].parentNode.style.overflow = 'hidden';
        }
        return;
      }

      loadSearchResults(value);
    }
  });

  document.addEventListener('click', event => {
    if (!ancestorWithClassName(event.target, 'all-header-search-outer-wrapper')) {
      const wrappers = document.querySelectorAll('.all-header-search-input-results-wrapper');
      for (let i = 0; i < wrappers.length; i++) {
        wrappers[i].parentNode.style.overflow = 'hidden';
      }
    }
  });

  document.addEventListener('click', event => {
    if (event.target.classList.contains('all-header-search-input')) {
      event.target.focus();
      event.target.select();
    }
  });
});
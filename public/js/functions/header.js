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

window.addEventListener('load', () => {
  const theme = JSON.parse(document.getElementById('theme').value);

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
      serverRequest('/theme', 'POST', {
        theme: theme == 'dark' ? 'light' : 'dark'
      }, res => {
        if (!res.success)
          return throwError(res.error);

        window.location.reload();
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
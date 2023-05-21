let SOCIAL_MEDIA_ICONS;
let QUERY;

window.addEventListener('load', () => {
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

  document.addEventListener('click', event => {
    if (event.target.classList.contains('all-header-search-input')) {
      event.target.focus();
      event.target.select();
    }
  })
});
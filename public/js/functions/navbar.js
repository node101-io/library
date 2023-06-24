const NAVBAR_DISPLAY_NONE_WIDTH = 950;
const NAVBAR_RELOAD_TIME = 5 * 60 * 1000; // 5 minutes

let allHeaderHeight;

function checkNavbarPosition() {
  if (window.innerWidth <= NAVBAR_DISPLAY_NONE_WIDTH) return;

  const allWrapper = document.querySelector('.all-wrapper');
  
  const contentWrapper = document.querySelector('.general-inner-content-outer-wrapper');
  const navbar = document.querySelector('.general-navbar-wrapper');
  const navbarHeight = navbar.offsetHeight - (window.document.body.offsetHeight);

  const scrollHeight = allWrapper.scrollTop - allHeaderHeight;

  if (scrollHeight >= navbarHeight) {
    const contentWrapperHeight = contentWrapper.scrollHeight - (window.document.body.offsetHeight);

    if (scrollHeight >= contentWrapperHeight) {
      document.querySelector('.general-navbar-wrapper').style.marginTop = 'auto';
      document.querySelector('.general-navbar-scrolled-wrapper').style.display = 'none';
    } else
      document.querySelector('.general-navbar-scrolled-wrapper').style.display = 'unset';
  } else {
    document.querySelector('.general-navbar-wrapper').style.marginTop = 'unset';
    document.querySelector('.general-navbar-scrolled-wrapper').style.display = 'none';
  }
};

function createNavbarEditorsPick(writings) {
  const wrappers = document.querySelectorAll('.general-navbar-editors-pick-wrapper');

  for (let i = 0; i < writings.length; i++)  {
    const writing = writings[i];

    const eachEditorPickWrapper = document.createElement('a');
    eachEditorPickWrapper.classList.add('general-navbar-each-short-writing-wrapper');
    eachEditorPickWrapper.href = writing.link;

    const eachEditorPickImage = document.createElement('img');
    eachEditorPickImage.classList.add('general-navbar-each-short-writing-image');
    eachEditorPickImage.src = writing.logo;
    eachEditorPickImage.alt = writing.title;
    eachEditorPickWrapper.appendChild(eachEditorPickImage);

    const eachEditorPickTitle = document.createElement('h2');
    eachEditorPickTitle.classList.add('general-navbar-each-short-writing-title');
    eachEditorPickTitle.innerHTML = writing.title;
    eachEditorPickWrapper.appendChild(eachEditorPickTitle);

    for (let i = 0; i < wrappers.length; i++)
      wrappers[i].appendChild(eachEditorPickWrapper.cloneNode(true));
  }
};

function createNavbarTags(tags) {
  const wrappers = document.querySelectorAll('.general-navbar-tags-inner-wrapper');

  for (let i = 0; i < tags.length; i++)  {
    const tag = tags[i];

    const eachNavbarTag = document.createElement('a');
    eachNavbarTag.classList.add('general-navbar-each-tag');
    eachNavbarTag.href = tag.url;
    eachNavbarTag.innerHTML = tag.name;

    for (let i = 0; i < wrappers.length; i++)
      wrappers[i].appendChild(eachNavbarTag.cloneNode(true));
  }
};

function createNavbarExclusive(writings) {
  const wrappers = document.querySelectorAll('.general-navbar-exclusive-wrapper');

  for (let i = 0; i < writings.length; i++)  {
    const writing = writings[i];

    const eachExclusiveWrapper = document.createElement('a');
    eachExclusiveWrapper.classList.add('general-navbar-each-writing-wrapper');
    eachExclusiveWrapper.href = writing.link;

    const eachExclusiveImage = document.createElement('img');
    eachExclusiveImage.classList.add('general-navbar-each-writing-image');
    eachExclusiveImage.src = writing.logo;
    eachExclusiveImage.alt = writing.title;
    eachExclusiveWrapper.appendChild(eachExclusiveImage);

    const eachExclusiveContent = document.createElement('div');
    eachExclusiveContent.classList.add('general-navbar-each-writing-content-wrapper');

    const eachExclusiveTitle = document.createElement('h2');
    eachExclusiveTitle.classList.add('general-navbar-each-writing-title');
    eachExclusiveTitle.innerHTML = writing.title;
    eachExclusiveContent.appendChild(eachExclusiveTitle);

    const eachExclusiveSubtitle = document.createElement('h2');
    eachExclusiveSubtitle.classList.add('general-navbar-each-writing-subtitle');
    eachExclusiveSubtitle.innerHTML = writing.subtitle;
    eachExclusiveContent.appendChild(eachExclusiveSubtitle);

    eachExclusiveWrapper.appendChild(eachExclusiveContent);

    for (let i = 0; i < wrappers.length; i++)
      wrappers[i].appendChild(eachExclusiveWrapper.cloneNode(true));
  }
};

function loadNavbarContent() {
  serverRequest('/navbar/editors-pick', 'GET', {}, res => {
    if (!res.success) throwError(res.error);

    createNavbarEditorsPick(res.writings);

    serverRequest('/navbar/tags', 'GET', {}, res => {
      if (!res.success) throwError(res.error);
  
      createNavbarTags(res.tags);
  
      serverRequest('/navbar/exclusive', 'GET', {}, res => {
        if (!res.success) throwError(res.error);

        createNavbarExclusive(res.writings);
    
        const navbarEmptyWrapper = document.querySelectorAll('.general-navbar-inner-empty-wrapper');
        const navbarInnerWrapper = document.querySelectorAll('.general-navbar-inner-wrapper');

        for (let i = 0; i < navbarEmptyWrapper.length; i++)
          navbarEmptyWrapper[i].style.display = 'none';
        for (let i = 0; i < navbarEmptyWrapper.length; i++)
          navbarInnerWrapper[i].style.display = 'flex';
      });
    });
  });
};

window.addEventListener('load', () => {
  if (
    !document.getElementById('navbar-loaded') ||
    !JSON.parse(document.getElementById('navbar-loaded').value)
  )
    loadNavbarContent();

  allHeaderHeight = document.querySelector('.general-inner-content-outer-wrapper').getBoundingClientRect().top;

  const allWrapper = document.querySelector('.all-wrapper');

  allWrapper.addEventListener('scroll', () => {
    checkNavbarPosition();
  });
});
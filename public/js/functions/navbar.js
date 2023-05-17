function checkNavbarPosition() {
  const allWrapper = document.querySelector('.all-wrapper');
  const allHeaderHeight = document.querySelector('.general-inner-content-outer-wrapper').getBoundingClientRect().top;
  const contentWrapper = document.querySelector('.general-inner-content-outer-wrapper');
  const navbar = document.querySelector('.general-navbar-wrapper');
  const navbarHeight = navbar.scrollHeight - (window.document.body.offsetHeight - allHeaderHeight);

  const scrollHeight = allWrapper.scrollTop;

  if (scrollHeight >= navbarHeight) {
    const contentWrapperHeight = contentWrapper.scrollHeight - (window.document.body.offsetHeight - allHeaderHeight)

    if (scrollHeight >= contentWrapperHeight) {
      document.querySelector('.general-navbar-wrapper').style.marginTop = 'auto';
      document.querySelector('.general-navbar-scrolled-wrapper').style.display = 'none';
    } else
      document.querySelector('.general-navbar-scrolled-wrapper').style.display = 'unset';
  } else {
    document.querySelector('.general-navbar-wrapper').style.marginTop = 'unset';
    document.querySelector('.general-navbar-scrolled-wrapper').style.display = 'none';
  }
}

window.addEventListener('load', () => {
  const navbarDisplayNoneWidth = 900;

  const allWrapper = document.querySelector('.all-wrapper');

  if (window.innerWidth > navbarDisplayNoneWidth) 
    allWrapper.addEventListener('scroll', () => {
      checkNavbarPosition();
    });
});
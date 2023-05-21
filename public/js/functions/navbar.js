const NAVBAR_DISPLAY_NONE_WIDTH = 950;

let allHeaderHeight;

function checkNavbarPosition() {
  if (window.innerWidth <= NAVBAR_DISPLAY_NONE_WIDTH) return;

  const allWrapper = document.querySelector('.all-wrapper');
  
  const contentWrapper = document.querySelector('.general-inner-content-outer-wrapper');
  const navbar = document.querySelector('.general-navbar-wrapper');
  const navbarHeight = navbar.offsetHeight - (window.document.body.offsetHeight);

  const scrollHeight = allWrapper.scrollTop - allHeaderHeight;

  if (scrollHeight >= navbarHeight) {
    const contentWrapperHeight = contentWrapper.scrollHeight - (window.document.body.offsetHeight)

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
  allHeaderHeight = document.querySelector('.general-inner-content-outer-wrapper').getBoundingClientRect().top;

  const allWrapper = document.querySelector('.all-wrapper');

  allWrapper.addEventListener('scroll', () => {
    checkNavbarPosition();
  });
});
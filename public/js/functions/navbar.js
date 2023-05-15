window.addEventListener('load', () => {
  const navbarDisplayNoneWidth = 900;

  const allWrapper = document.querySelector('.all-wrapper');
  const allWrapperHeight = allWrapper.offsetHeight;
  const allHeaderHeight = document.querySelector('.general-inner-content-outer-wrapper').getBoundingClientRect().top;
  const contentWrapper = document.querySelector('.general-inner-content-wrapper');
  const navbar = document.querySelector('.general-navbar-wrapper');
  const navbarHeight = navbar.scrollHeight - (window.document.body.offsetHeight - allHeaderHeight);

  console.log(navbarHeight)

  if (window.innerWidth > navbarDisplayNoneWidth)
    allWrapper.addEventListener('scroll', event => {
      const scrollHeight = event.target.scrollTop;

      console.log(scrollHeight)

      if (scrollHeight >= navbarHeight) {
        contentWrapper.classList.add('general-inner-content-wrapper-sticky');
        navbar.classList.add('general-navbar-sticky');
      } else {
        contentWrapper.classList.remove('general-inner-content-wrapper-sticky');
        navbar.classList.remove('general-navbar-sticky');
      }
    });
});
window.addEventListener('load', () => {
  const navbarDisplayNoneWidth = 900;

  const allWrapper = document.querySelector('.all-wrapper');
  const allWrapperHeight = allWrapper.offsetHeight;
  const allHeaderWrapper = document.querySelector('.all-header-wrapper');
  const allHeaderHeight = allHeaderWrapper.offsetHeight;
  const navbar = document.querySelector('.general-navbar-wrapper');
  const navbarHeight = navbar.offsetHeight + allHeaderHeight;

  if (window.innerWidth > navbarDisplayNoneWidth)
    allWrapper.addEventListener('scroll', event => {
      const scrollHeight = allWrapperHeight + event.target.scrollTop;

      if (scrollHeight > navbarHeight)
        navbar.style.paddingTop = (scrollHeight - navbarHeight) + 'px';
      else
        navbar.style.paddingTop = '0px';
    });
});
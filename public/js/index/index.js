window.addEventListener('load', () => {
  document.addEventListener('mouseover', event => {
    if (ancestorWithClassName(event.target, 'each-slide-content-wrapper')) {
      const target = ancestorWithClassName(event.target, 'each-slide-content-wrapper');
      target.querySelector('.each-slide-title').classList.add('each-slide-title-hovered');
    } else if (document.querySelector('.each-slide-title-hovered')) {
      document.querySelector('.each-slide-title-hovered').classList.remove('each-slide-title-hovered');
    }
  })
})
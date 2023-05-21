window.addEventListener('load', () => {
  document.addEventListener('mouseover', event => {
    if (ancestorWithClassName(event.target, 'each-project-wrapper')) {
      const target = ancestorWithClassName(event.target, 'each-project-wrapper');
      const title = target.querySelector('.each-project-title');

      if (title.classList.contains('each-project-title-hovered')) return;

      if (document.querySelector('.each-project-title-hovered'))
        document.querySelector('.each-project-title-hovered').classList.remove('each-project-title-hovered');

      title.classList.add('each-project-title-hovered');
    } else if (document.querySelector('.each-project-title-hovered')) {
      document.querySelector('.each-project-title-hovered').classList.remove('each-project-title-hovered');
    }
  });
});
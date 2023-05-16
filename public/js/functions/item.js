window.addEventListener('load', () => {
  document.addEventListener('mouseover', event => {
    if (ancestorWithClassName(event.target, 'general-each-item-wrapper')) {
      const target = ancestorWithClassName(event.target, 'general-each-item-wrapper');
      const title = target.querySelector('.general-each-item-title');

      if (title.classList.contains('general-each-item-title-hovered')) return;

      if (document.querySelector('.general-each-item-title-hovered'))
        document.querySelector('.general-each-item-title-hovered').classList.remove('general-each-item-title-hovered');

      title.classList.add('general-each-item-title-hovered');
    } else if (document.querySelector('.general-each-item-title-hovered')) {
      document.querySelector('.general-each-item-title-hovered').classList.remove('general-each-item-title-hovered');
    }
  });
});
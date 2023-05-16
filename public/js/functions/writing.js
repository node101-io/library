window.addEventListener('load', () => {
  document.addEventListener('mouseover', event => {
    if (ancestorWithClassName(event.target, 'general-each-writing-wrapper')) {
      const target = ancestorWithClassName(event.target, 'general-each-writing-wrapper');
      const title = target.querySelector('.general-each-writing-title');

      if (title.classList.contains('general-each-writing-title-hovered')) return;

      if (document.querySelector('.general-each-writing-title-hovered'))
        document.querySelector('.general-each-writing-title-hovered').classList.remove('general-each-writing-title-hovered');

      title.classList.add('general-each-writing-title-hovered');
    } else if (document.querySelector('.general-each-writing-title-hovered')) {
      document.querySelector('.general-each-writing-title-hovered').classList.remove('general-each-writing-title-hovered');
    }
  });
});
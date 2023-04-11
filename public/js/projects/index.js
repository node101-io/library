window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'general-each-item-wrapper')) {
      if (ancestorWithClassName(event.target, 'general-each-item-social-media-account-wrapper'))
        return;
      const target = ancestorWithClassName(event.target, 'general-each-item-wrapper');
      window.location.href = target.id;
    }
  });
});
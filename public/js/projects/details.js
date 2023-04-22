window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'general-each-writing-wrapper')) {
      if (ancestorWithClassName(event.target, 'general-each-writing-social-media-account-wrapper'))
        return;
      const target = ancestorWithClassName(event.target, 'general-each-writing-wrapper');
      window.location.href = target.id;
    }
  });
});
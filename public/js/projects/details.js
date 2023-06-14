window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'general-each-writing-wrapper')) {
      if (ancestorWithClassName(event.target, 'general-each-writing-social-media-account-wrapper'))
        return;
      const link = ancestorWithClassName(event.target, 'general-each-writing-wrapper').id;
      window.open(link, '_blank').focus();
    }
  });
});
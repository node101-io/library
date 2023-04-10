window.addEventListener('load', () => {
  const allHeader = document.querySelector('.all-header-wrapper');

  document.addEventListener('mouseover', event => {
    if (ancestorWithClassName(event.target, 'all-header-each-button-visible-wrapper')) {
      const target = ancestorWithClassName(event.target, 'all-header-each-button-visible-wrapper');
      const item = target.nextElementSibling;
      const alreadySelectedItem = document.querySelector('.all-header-each-button-hidden-wrapper-hovered');

      if (alreadySelectedItem) {
        if (alreadySelectedItem == item)
          return;
        else
          alreadySelectedItem.classList.remove('all-header-each-button-hidden-wrapper-hovered');
      }

      allHeader.classList.add('all-header-wrapper-hovered');
      item.classList.add('all-header-each-button-hidden-wrapper-hovered');
    } else if (!ancestorWithClassName(event.target, 'all-header-each-button-wrapper') && document.querySelector('.all-header-each-button-hidden-wrapper-hovered')) {
      document.querySelector('.all-header-each-button-hidden-wrapper-hovered').classList.remove('all-header-each-button-hidden-wrapper-hovered');
      allHeader.classList.remove('all-header-wrapper-hovered');
    }
  });
});
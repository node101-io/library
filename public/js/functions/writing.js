function createWriting(writing) {
  const newWritingSeperator = document.createElement('div');
  newWritingSeperator.classList.add('general-each-writing-seperator');

  document.querySelector('.general-writings-wrapper').appendChild(newWritingSeperator);

  const newWriting = document.createElement('a');
  newWriting.classList.add('general-each-writing-wrapper');
  newWriting.href = writing.link;

  const newWritingContentWrapper = document.createElement('div');
  newWritingContentWrapper.classList.add('general-each-writing-content-wrapper');

  const newWritingContentHeaderWrapper = document.createElement('div');
  newWritingContentHeaderWrapper.classList.add('general-each-writing-content-header-wrapper');

  const newWritingBlogWrapper = document.createElement('div');
  newWritingBlogWrapper.classList.add('general-each-writing-blog-wrapper');
  newWritingBlogWrapper.id = writing.blog.link;

  const newWritingBlogImage = document.createElement('img');
  newWritingBlogImage.classList.add('general-each-writing-blog-image');
  newWritingBlogImage.src = writing.blog.image;
  newWritingBlogImage.alt = writing.blog.title;
  newWritingBlogWrapper.appendChild(newWritingBlogImage);

  const newWritingBlogTitle = document.createElement('h2');
  newWritingBlogTitle.classList.add('general-each-writing-blog-title');
  newWritingBlogTitle.innerHTML = writing.blog.title;
  newWritingBlogWrapper.appendChild(newWritingBlogTitle);

  newWritingContentHeaderWrapper.appendChild(newWritingBlogWrapper);

  const newWritingDate = document.createElement('div');
  newWritingDate.classList.add('general-each-writing-date');
  newWritingDate.innerHTML = `• ${writing.created_at.split('.')[0]} ${MONTHS[parseInt(writing.created_at.split('.')[1]) - 1]} ${writing.created_at.split('.')[2]}`;

  newWritingContentHeaderWrapper.appendChild(newWritingDate);
  newWritingContentWrapper.appendChild(newWritingContentHeaderWrapper);

  const newWritingTitle = document.createElement('h1');
  newWritingTitle.classList.add('general-each-writing-title');
  newWritingTitle.innerHTML = writing.title;

  newWritingContentWrapper.appendChild(newWritingTitle);

  const newWritingSubtitle = document.createElement('h2');
  newWritingSubtitle.classList.add('general-each-writing-subtitle');
  newWritingSubtitle.innerHTML = writing.subtitle;

  newWritingContentWrapper.appendChild(newWritingSubtitle);
  newWriting.appendChild(newWritingContentWrapper);

  const newWritingImage = document.createElement('img');
  newWritingImage.classList.add('general-each-writing-image');
  newWritingImage.src = writing.logo;
  newWritingImage.alt = writing.title;
  newWritingImage.height = '100%';
  newWritingImage.loading = 'lazy';

  newWriting.appendChild(newWritingImage);

  document.querySelector('.general-writings-wrapper').appendChild(newWriting);
};

window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'general-each-writing-blog-wrapper')) {
      event.preventDefault();
      const link = ancestorWithClassName(event.target, 'general-each-writing-blog-wrapper').id;
      window.location = link;
    }
  });

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
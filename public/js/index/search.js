let MONTHS;
const NEW_WRITING_LOAD_SCROLL_DISTANCE = 300;

let search;
let isWritingEndReached = false;
let isWritingsLoading = false;
let writings = [];
let writingsPageCount = 1;

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

function loadNewWritings() {
  if (isWritingsLoading) return;

  isWritingsLoading = true;

  serverRequest('/filter', 'POST', {
    page: writingsPageCount,
    search
  }, res => {
    if (!res.success || res.error) return alert(res.error);

    writingsPageCount++;

    let isLastWritingInArray = true;
    const lastTenWritings = writings.slice(writings.length - 10);

    for (let i = 0; i < res.writings.length; i++)
      if (!isLastWritingInArray || !lastTenWritings.find(any => any._id.toString() == res.writings[i]._id.toString())) {
        isLastWritingInArray = false;
        createWriting(res.writings[i])
      }

    checkNavbarPosition();

    if (!res.writings.length) {
      isWritingEndReached = true;
      if (document.getElementById('writings-loading-icon'))
        document.getElementById('writings-loading-icon').style.display = 'none';
    }

    isWritingsLoading = false;
  });
};

window.addEventListener('load', () => {
  MONTHS = JSON.parse(document.getElementById('MONTHS').value);
  writings = JSON.parse(document.getElementById('writings-json').value);
  search = JSON.parse(document.getElementById('search-json').value);

  const allWrapper = document.querySelector('.all-wrapper');

  allWrapper.addEventListener('scroll', () => {
    if (
      !isWritingEndReached &&
      !isWritingsLoading &&
      (allWrapper.scrollHeight - (allWrapper.scrollTop + window.document.body.offsetHeight)) < NEW_WRITING_LOAD_SCROLL_DISTANCE
    ) {
      loadNewWritings();
    }
  });
});
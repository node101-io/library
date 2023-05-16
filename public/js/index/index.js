let MONTHS;
const NEW_WRITING_LOAD_SCROLL_DISTANCE = 300;
const SLIDE_CHANGE_DURATION_IN_MS = 3 * 1000;

let currentSlide = 0;
let isSlideMoving = false;
let isWritingEndReached = false;
let isWritingsLoading = false;
let onSlide = false;
let writings = [];
let writingsPageCount = 1;

function moveToNextSlide() {
  if (isSlideMoving) return;
  isSlideMoving = true;

  const wrapper = document.querySelector('.slider-wrapper');
  const element = wrapper.childNodes[0];

  const duplicate = element.cloneNode(true);
  
  wrapper.appendChild(duplicate);
  element.remove();

  isSlideMoving = false;
};

function moveToPrevSlide() {
  if (isSlideMoving) return;
  isSlideMoving = true;

  const wrapper = document.querySelector('.slider-wrapper');
  const element = wrapper.childNodes[wrapper.childNodes.length - 1];

  const duplicate = element.cloneNode(true);
  
  wrapper.insertBefore(duplicate, wrapper.childNodes[0]);
  element.remove();

  isSlideMoving = false;
};

function changeSlide() {
  setTimeout(() => {
    if (!onSlide)
      moveToNextSlide();
    changeSlide();
  }, SLIDE_CHANGE_DURATION_IN_MS)
};

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
    page: writingsPageCount
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

    if (!res.writings.length) {
      isWritingEndReached = true;
      document.getElementById('writings-loading-icon').style.display = 'none';
    }

    isWritingsLoading = false;
  });
};

window.addEventListener('load', () => {
  MONTHS = JSON.parse(document.getElementById('MONTHS').value);
  writings = JSON.parse(document.getElementById('writings-json').value);
  changeSlide();

  document.addEventListener('mouseover', event => {
    if (ancestorWithClassName(event.target, 'each-slide-content-wrapper')) {
      const target = ancestorWithClassName(event.target, 'each-slide-content-wrapper');
      target.querySelector('.each-slide-title').classList.add('each-slide-title-hovered');
    } else if (document.querySelector('.each-slide-title-hovered')) {
      document.querySelector('.each-slide-title-hovered').classList.remove('each-slide-title-hovered');
    }

    if (ancestorWithClassName(event.target, 'each-slide-wrapper')) {
      onSlide = true;
    } else if (onSlide) {
      onSlide = false;
    }
  });

  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'move-next-slide-button')) moveToNextSlide();
    if (ancestorWithClassName(event.target, 'move-previous-slide-button')) moveToPrevSlide();
  });

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
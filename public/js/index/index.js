let MONTHS;
const SLIDE_CHANGE_DURATION_IN_MS = 5 * 1000;

let currentSlide = 0;
let isSlideMoving = false;
let isWritingEndReached = false;
let isWritingsLoading = false;
let onSlide = false;
let slider = [];
let writings = [];
let writingsPageCount = 1;

function moveToNextSlide() {
  if (isSlideMoving) return;
  isSlideMoving = true;

  const allWrapper = document.querySelector('.all-wrapper');
  const wrapper = document.querySelector('.slider-wrapper');
  const element = wrapper.childNodes[0];

  const duplicate = element.cloneNode(true);

  const allWrapperScrollTop = allWrapper.scrollTop;

  wrapper.appendChild(duplicate);
  element.remove();

  allWrapper.scrollTop = allWrapperScrollTop;

  currentSlide = (currentSlide + 1) % slider.length;

  isSlideMoving = false;
};

function moveToPrevSlide() {
  if (isSlideMoving) return;
  isSlideMoving = true;

  const allWrapper = document.querySelector('.all-wrapper');
  const wrapper = document.querySelector('.slider-wrapper');
  const element = wrapper.childNodes[wrapper.childNodes.length - 1];

  const duplicate = element.cloneNode(true);

  const allWrapperScrollTop = allWrapper.scrollTop;

  wrapper.insertBefore(duplicate, wrapper.childNodes[0]);
  element.remove();

  allWrapper.scrollTop = allWrapperScrollTop;

  currentSlide = (currentSlide + slider.length - 1) % slider.length;

  isSlideMoving = false;
};

function changeSlide() {
  setTimeout(() => {
    if (!onSlide)
      moveToNextSlide();
    changeSlide();
  }, SLIDE_CHANGE_DURATION_IN_MS)
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
  slider = JSON.parse(document.getElementById('slider-json').value);
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

    if (event.target.classList.contains('each-slide-bullet')) {
      const index = event.target.id.replace('each-slide-bullet-', '');
      for (let i = 0; i < slider.length && index != currentSlide; i++)
        moveToNextSlide();
    }
  });

  const allWrapper = document.querySelector('.all-wrapper');
  const allFooterHeight = document.querySelector('.all-footer-wrapper').offsetHeight;

  allWrapper.addEventListener('scroll', () => {
    if (
      !isWritingEndReached &&
      !isWritingsLoading &&
      (allWrapper.scrollHeight - (allWrapper.scrollTop + window.document.body.offsetHeight + allFooterHeight)) < NEW_WRITING_LOAD_SCROLL_DISTANCE
    ) {
      loadNewWritings();
    }
  });
});
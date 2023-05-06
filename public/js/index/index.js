let SLIDE_CHANGE_DURATION_IN_MS = 3 * 1000;

let onSlide = false;
let currentSlide = 0;
let isSlideMoving = false;

function moveToNextSlide() {
  if (isSlideMoving) return;
  isSlideMoving = true;

  const wrapper = document.querySelector('.slider-wrapper');
  const element = wrapper.childNodes[0];

  const duplicate = element.cloneNode(true);
  element.remove();

  wrapper.appendChild(duplicate);

  isSlideMoving = false;
};

function moveToPrevSlide() {
  if (isSlideMoving) return;
  isSlideMoving = true;

  const wrapper = document.querySelector('.slider-wrapper');
  const element = wrapper.childNodes[wrapper.childNodes.length - 1];

  const duplicate = element.cloneNode(true);
  element.remove();

  wrapper.insertBefore(duplicate, wrapper.childNodes[0]);

  isSlideMoving = false;
};

function changeSlide() {
  setTimeout(() => {
    if (!onSlide)
      moveToNextSlide();
    changeSlide();
  }, SLIDE_CHANGE_DURATION_IN_MS)
};

window.addEventListener('load', () => {
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
});
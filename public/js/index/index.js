let MONTHS;
const SLIDE_CHANGE_DURATION_IN_MS = 5 * 1000;

let currentSlide = 0;
let isWritingEndReached = false;
let isWritingsLoading = false;
let onSlide = false;
let slider = [];
let writings = [];
let writingsPageCount = 1;

const sliderObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      currentSlide = Number(entry.target.getAttribute('data-index'));
      const slideBullets = document.querySelectorAll('.slide-bullet');
      const filledBullet = document.querySelector('.slide-bullet-filled');

      if (filledBullet) {
        filledBullet.classList.remove('slide-bullet-filled');
      }

      slideBullets[currentSlide].classList.add('slide-bullet-filled');
    }
  })
}, { threshold: 0.5 });

function changeSlide() {
  const sliderWrapper = document.querySelector('.slider-wrapper');

  setTimeout(() => {
    if (!onSlide) {
      currentSlide = (Number(currentSlide) + 1) % slider.length;

      sliderWrapper.scrollTo({
        left: sliderWrapper.clientWidth * currentSlide, behavior: 'smooth'
      });
    }
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

  const sliderWrapper = document.querySelector('.slider-wrapper');

  document.querySelectorAll('.each-slide-wrapper').forEach(each => {
    sliderObserver.observe(each);
  });

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

  document.addEventListener('touchstart', event => {
    if (ancestorWithClassName(event.target, 'each-slide-wrapper')) {
      onSlide = true;
    }
  });

  document.addEventListener('touchend', event => {
    onSlide = false;
  });

  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'move-previous-slide-button')) {
      sliderWrapper.scrollTo({ left: sliderWrapper.clientWidth * ((currentSlide - 1) % slider.length), behavior: 'smooth' });
    } else if (ancestorWithClassName(event.target, 'move-next-slide-button')) {
      sliderWrapper.scrollTo({ left: sliderWrapper.clientWidth * ((currentSlide + 1) % slider.length), behavior: 'smooth' });
    } else if (event.target.classList.contains('slide-bullet')) {
      currentSlide = Number(event.target.getAttribute('data-index'));
      sliderWrapper.scrollTo({ left: sliderWrapper.clientWidth * currentSlide, behavior: 'smooth' });
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
let MONTHS;
const NEW_WRITING_LOAD_SCROLL_DISTANCE = 300;
const WRITING_COUNT = 5;

let writing;
let isWritingEndReached = false;
let isWritingsLoading = false;
let writings = [];
let writingsPageCount = 0;

function loadNewWritings() {
  if (isWritingsLoading) return;

  isWritingsLoading = true;

  serverRequest('/filter', 'POST', {
    page: writingsPageCount,
    n_id: writing._id,
    parent_id: writing.blog._id,
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
  writing = JSON.parse(document.getElementById('writing-json').value);

  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'writing-end-writer-social-media-account-wrapper')) {
      event.preventDefault();
      const link = ancestorWithClassName(event.target, 'writing-end-writer-social-media-account-wrapper').id;
      window.open(link, '_blank').focus();
    }
  });

  const allWrapper = document.querySelector('.all-wrapper');
  const allFooterHeight = document.querySelector('.all-footer-wrapper').offsetHeight;

  allWrapper.addEventListener('scroll', _ => {
    if (
      !isWritingEndReached &&
      !isWritingsLoading &&
      (allWrapper.scrollHeight - (allWrapper.scrollTop + window.document.body.offsetHeight + allFooterHeight)) < NEW_WRITING_LOAD_SCROLL_DISTANCE
    ) {
      loadNewWritings();
    }
  });
});
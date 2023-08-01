let MONTHS;

let search;
let isWritingEndReached = false;
let isWritingsLoading = false;
let writings = [];
let writingsPageCount = 1;

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
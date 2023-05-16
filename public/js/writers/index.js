const NEW_WRITER_LOAD_SCROLL_DISTANCE = 300;

let isWriterEndReached = false;
let isWritersLoading = false;
let writers = [];
let writersPageCount = 1;

function createWriter(writer) {
  const newItemSeperator = document.createElement('div');
  newItemSeperator.classList.add('general-each-item-seperator');

  document.querySelector('.general-items-wrapper').appendChild(newItemSeperator);

  const newItem = document.createElement('a');
  newItem.classList.add('general-each-item-wrapper');
  newItem.href = writer.link;

  const newItemContentWrapper = document.createElement('div');
  newItemContentWrapper.classList.add('general-each-item-content-wrapper');

  const newItemTitle = document.createElement('h1');
  newItemTitle.classList.add('general-each-item-title');
  newItemTitle.innerHTML = writer.title;

  newItemContentWrapper.appendChild(newItemTitle);
  const newItemSubtitle = document.createElement('h2');
  newItemSubtitle.classList.add('general-each-item-subtitle');
  newItemSubtitle.innerHTML = writer.subtitle;

  newItemContentWrapper.appendChild(newItemSubtitle);

  const newItemFooterWrapper = document.createElement('div');
  newItemFooterWrapper.classList.add('general-each-item-footer-wrapper');

  Object.keys(writer.social_media_accounts).forEach(account => {
    const newItemSocialMediaAccountWrapper = document.createElement('div');
    newItemSocialMediaAccountWrapper.classList.add('general-each-item-social-media-account-wrapper');
    newItemSocialMediaAccountWrapper.id = writer.social_media_accounts[account];
    newItemSocialMediaAccountWrapper.target = '_blank';

    const newItemSocialMediaAccountIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    newItemSocialMediaAccountIcon.viewBox = SOCIAL_MEDIA_ICONS[account].view_box;

    const newItemSocialMediaAccountIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    newItemSocialMediaAccountIconPath.d = SOCIAL_MEDIA_ICONS[account].d;

    newItemSocialMediaAccountIcon.appendChild(newItemSocialMediaAccountIconPath);
    newItemSocialMediaAccountWrapper.appendChild(newItemSocialMediaAccountIcon);
    newItemFooterWrapper.appendChild(newItemSocialMediaAccountWrapper);
  });

  newItemContentWrapper.appendChild(newItemFooterWrapper);
  newItem.appendChild(newItemContentWrapper);

  const newItemImage = document.createElement('img');
  newItemImage.classList.add('general-each-item-image');
  newItemImage.src = writer.image;
  newItemImage.alt = writer.title;
  newItemImage.height = '100%';
  newItemImage.loading = 'lazy';

  newItem.appendChild(newItemImage);

  document.querySelector('.general-items-wrapper').appendChild(newItem);
};

function loadNewWriters() {
  if (isWritersLoading) return;

  isWritersLoading = true;

  serverRequest('/writers/filter', 'POST', {
    page: writersPageCount
  }, res => {
    if (!res.success || res.error) return alert(res.error);

    writersPageCount++;

    let isLastItemInArray = true;
    const lastTenItems = writers.slice(writers.length - 10);

    for (let i = 0; i < res.writers.length; i++)
      if (!isLastItemInArray || !lastTenItems.find(any => any._id.toString() == res.writers[i]._id.toString())) {
        isLastItemInArray = false;
        createWriter(res.writers[i])
      }

    if (!res.writers.length) {
      isWriterEndReached = true;
      document.getElementById('writers-loading-icon').style.display = 'none';
    }

    isWritersLoading = false;
  });
};

window.addEventListener('load', () => {
  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'general-each-item-social-media-account-icon')) {
      const target = ancestorWithClassName(event.target, 'general-each-item-social-media-account-icon');
      window.location.href = target.id;
    }
  });

  const allWrapper = document.querySelector('.all-wrapper');

  allWrapper.addEventListener('scroll', (_) => {
    if (
      !isWriterEndReached &&
      !isWritersLoading &&
      (allWrapper.scrollHeight - (allWrapper.scrollTop + window.document.body.offsetHeight)) < NEW_WRITER_LOAD_SCROLL_DISTANCE
    ) {
      loadNewWriters();
    }
  });
});
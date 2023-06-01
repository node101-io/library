const NEW_PROJECT_LOAD_SCROLL_DISTANCE = 300;

let isProjectEndReached = false;
let isProjectsLoading = false;
let projects = [];
let projectsPageCount = 1;

function createProject(project) {
  const newProject = document.createElement('a');
  newProject.classList.add('each-project-wrapper');
  newProject.href = project.link;

  const newProjectContentWrapper = document.createElement('div');
  newProjectContentWrapper.classList.add('general-each-item-content-wrapper');

  const newProjectTitle = document.createElement('h1');
  newProjectTitle.classList.add('each-project-title');
  newProjectTitle.innerHTML = project.title;

  newProjectContentWrapper.appendChild(newProjectTitle);

  const newProjectSubtitle = document.createElement('h2');
  newProjectSubtitle.classList.add('each-project-subtitle');
  newProjectSubtitle.innerHTML = project.subtitle;

  newProjectContentWrapper.appendChild(newProjectSubtitle);

  const newProjectSocialMediaAccountsWrapper = document.createElement('div');
  newProjectSocialMediaAccountsWrapper.classList.add('each-project-social-media-accounts-wrapper');

  Object.keys(project.social_media_accounts).forEach(account => {
    const newProjectSocialMediaAccountWrapper = document.createElement('div');
    newProjectSocialMediaAccountWrapper.classList.add('each-project-social-media-account-wrapper');
    newProjectSocialMediaAccountWrapper.id = project.social_media_accounts[account];

    const newProjectSocialMediaAccountIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    newProjectSocialMediaAccountIcon.classList.add('each-project-social-media-account-icon');
    newProjectSocialMediaAccountIcon.setAttributeNS(null, 'viewBox', SOCIAL_MEDIA_ICONS[account].view_box);

    const newProjectSocialMediaAccountIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    newProjectSocialMediaAccountIconPath.setAttributeNS(null, 'd', SOCIAL_MEDIA_ICONS[account].d);

    newProjectSocialMediaAccountIcon.appendChild(newProjectSocialMediaAccountIconPath);
    newProjectSocialMediaAccountWrapper.appendChild(newProjectSocialMediaAccountIcon);
    newProjectSocialMediaAccountsWrapper.appendChild(newProjectSocialMediaAccountWrapper);
  });

  newProjectContentWrapper.appendChild(newProjectSocialMediaAccountsWrapper);
  newProject.appendChild(newProjectContentWrapper);

  const newProjectImage = document.createElement('img');
  newProjectImage.classList.add('general-each-item-image');
  newProjectImage.src = project.image;
  newProjectImage.alt = project.title;
  newProjectImage.loading = 'lazy';

  newProject.appendChild(newProjectImage);

  document.querySelector('.projects-wrapper').appendChild(newProject);
};

function loadNewProjects() {
  if (isProjectsLoading) return;

  isProjectsLoading = true;

  serverRequest('/projects/filter', 'POST', {
    page: projectsPageCount
  }, res => {
    if (!res.success || res.error) return alert(res.error);

    projectsPageCount++;

    let isLastItemInArray = true;
    const lastTenItems = projects.slice(projects.length - 10);

    for (let i = 0; i < res.projects.length; i++)
      if (!isLastItemInArray || !lastTenItems.find(any => any._id.toString() == res.projects[i]._id.toString())) {
        isLastItemInArray = false;
        createProject(res.projects[i])
      }

    if (!res.projects.length) {
      isProjectEndReached = true;
      document.getElementById('projects-loading-icon').style.display = 'none';
    }

    checkNavbarPosition();
    isProjectsLoading = false;
  });
};

window.addEventListener('load', () => {
  document.addEventListener('mouseover', event => {
    if (ancestorWithClassName(event.target, 'each-project-wrapper')) {
      const target = ancestorWithClassName(event.target, 'each-project-wrapper');
      const title = target.querySelector('.each-project-title');

      if (title.classList.contains('each-project-title-hovered')) return;

      if (document.querySelector('.each-project-title-hovered'))
        document.querySelector('.each-project-title-hovered').classList.remove('each-project-title-hovered');

      title.classList.add('each-project-title-hovered');
    } else if (document.querySelector('.each-project-title-hovered')) {
      document.querySelector('.each-project-title-hovered').classList.remove('each-project-title-hovered');
    }
  });

  document.addEventListener('click', event => {
    if (ancestorWithClassName(event.target, 'each-project-social-media-account-wrapper')) {
      event.preventDefault();
      const target = ancestorWithClassName(event.target, 'each-project-social-media-account-wrapper');
      window.open(target.id, '_blank');
    }
  });

  const allWrapper = document.querySelector('.all-wrapper');
  const allFooterHeight = document.querySelector('.all-footer-wrapper').offsetHeight;

  allWrapper.addEventListener('scroll', (_) => {
    if (
      !isProjectEndReached &&
      !isProjectsLoading &&
      (allWrapper.scrollHeight - (allWrapper.scrollTop + window.document.body.offsetHeight + allFooterHeight)) < NEW_PROJECT_LOAD_SCROLL_DISTANCE
    ) {
      loadNewProjects();
    }
  });
});
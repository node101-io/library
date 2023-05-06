function fixContent() {
  const links = document.querySelectorAll('.writing-text-url');

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    let url = link.getAttribute('link').substring(6);
    if (url.substring(0, 8) != 'https://')
      url = 'https://' + url;
    const newLink = document.createElement('a');
    newLink.classList.add('writing-text-url');
    newLink.href = url;
    newLink.target = '_blank';
    newLink.innerHTML = link.innerHTML;
    link.parentElement.insertBefore(newLink, link);
    link.remove();
  }
}

window.addEventListener('load', () => {
  fixContent();
});
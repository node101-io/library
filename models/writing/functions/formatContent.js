function formatContent(_content) {
  if (typeof _content != 'string' || !_content.length)
    return '';

  let content = _content.trim();

  let newContent = '';
  const openTags = [];
  const openStrings = [];

  let i = 0;
  
  while (i < content.length && content[i] != '>')
    newContent += content[i++];

  newContent += content[i++];
  
  for (; i < content.length - 6;) {
    if (content.substring(i, i + 5) == '<span') {
      let tag = '';

      while (content[i] != '>')
        tag += content[i++]
      
      tag += content[i++];

      if (tag.includes('writing-text-bold'))
        tag = tag.replace('span', 'b');
      if (tag.includes('writing-text-italic'))
        tag = tag.replace('span', 'i');
      if (tag.includes('writing-text-underline'))
        tag = tag.replace('span', 'u');
      if (tag.includes('writing-text-url')) {
        tag = tag.replace('span', 'a');
        tag = tag.replace('link="empty-', 'href="');
        tag = tag.replace('link=', 'href=');
        tag = tag.replace('>', ' target=\'_blank\'>')
      }

      newContent += openStrings.length ? openStrings.pop() : '';
      newContent += tag;

      openTags.push(tag);
      openStrings.push('');
    } else if (content.substring(i, i + 7) == '</span>') {
      newContent += openStrings.pop();
      const tag = openTags.pop();
      
      if (tag && tag.includes('writing-text-bold'))
        newContent += '</b>';
      if (tag && tag.includes('writing-text-italic'))
        newContent += '</i>';
      if (tag && tag.includes('writing-text-underline'))
        newContent += '</u>';
      if (tag && tag.includes('writing-text-url'))
        newContent += '</a>';
      else
        newContent += '</span>';

      i += 7;
    } else {
      if (!openStrings.length)
        openStrings.push('');

      openStrings[openStrings.length - 1] += content[i++];
    }
  }

  if (openStrings.length)
    newContent += openStrings.pop();

  newContent += '</div>';

  return newContent;
};

module.exports = content => {
  if (!content || !Array.isArray(content))
    return [];

  return content.map(each => formatContent(each));
};
let query_lang = null;

function serverRequest (_url, method, data, callback) {
  const METHOD_VALUES = ['FILE', 'GET', 'POST'];

  const query_lang = QUERY?.lang ? QUERY.lang : null;

  if (!_url || typeof _url != 'string' || !_url.trim().length)
    return callback({ success: false, error: 'bad_request' });

  const url = _url.includes('?lang=') ? _url.trim() : _url.trim() + ((_url.includes('?') ? '&lang=' : '?lang=') + query_lang)

  if (!method || !METHOD_VALUES.includes(method))
    return callback({ success: false, error: 'bad_request' });

  if (!data || typeof data != 'object')
    return callback({ success: false, error: 'bad_request' });

  const xhr = new XMLHttpRequest();

  if (method == 'FILE') {
    xhr.open('POST', url);
    const formdata = new FormData();

    Object.keys(data).forEach(key => {
      formdata.append(key, data[key]);
    });

    xhr.send(formdata);
  } else if (method == 'POST') {
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(data));
  } else if (method == 'GET') {
    xhr.open('GET', url);
    xhr.send();
  }

  xhr.onreadystatechange = function () {
    try {
      if (xhr.readyState == 4 && xhr.status != 200)
        return callback({ success: false, error: 'network_error' })
      else if (xhr.readyState == 4 && xhr.response) {
        const data = JSON.parse(xhr.response);
        return callback(data);
      }
    } catch (err) {
      console.log(err);
      return callback({ success: false, error: 'network_error' });
    }
  };
};
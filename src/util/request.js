


function fetchData(url, data, method) {

  function formatUrl(data){
    let params = url.indexOf('?')!==-1 ? '' : '?';
    for(let i in data){
      params += i + '=' + data[i] + '&';
    }
    return params.slice(0,params.length-1);
  }

  // 登录 token
  let Authorization = localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '';

  method = method ? method :'GET';

  if(method.toLowerCase()=='get'){

    url = url + formatUrl(data)

    // Default options are marked with *
    return fetch(url, {
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, same-origin, *omit
      headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json',
        'token':Authorization
      },
      method: method, // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // *client, no-referrer
    }).then(response => response.json()) // parses response to JSON

  }else{

    // Default options are marked with *
    return fetch(url, {
      body: JSON.stringify(data), // must match 'Content-Type' header
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, same-origin, *omit
      headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json',
        'token':Authorization
      },
      method: method, // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // *client, no-referrer
    }).then(response => response.json()) // parses response to JSON
  }

}

export default fetchData





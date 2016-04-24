'use strict';

module.exports = function ajaxRequest (method, url, data, callback) {
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
     if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        callback(xmlhttp.response);
     }
  };

  xmlhttp.open(method, url, true);

  if(method === "POST") {
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(data);
  }
  else {
    xmlhttp.send();
  }
}

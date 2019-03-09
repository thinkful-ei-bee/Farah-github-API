'use strict';
/*global $*/

/*========================================================================================
 REQUIREMENTS:
The user must be able to search for a GitHub user handle.
The search must trigger a call to GitHub's API.
The repos associated with that handle must be displayed on the page.
You must display the repo name and link to the repo URL.
The user must be able to make multiple searches and see only the results for the current search.
========================================================================================*/

function formatQueryParams(params){
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayResults(responseJson){
  console.log(responseJson);
  // if there are any results, remove them
  $('#results-list').empty();

  $('.js-error-message').empty();
  const userName = responseJson.map((data) => `<li><p>${data.name}</p><p><a href="${data.html_url}">See repo</a></p></li>`);
  $('#results-list').html(userName.join(''));
}

function getUserRepos(username, type){
  const URL = `https://api.github.com/users/${username}/repos`;
  const params = {
    type,
  };
  const queryString = formatQueryParams(params);
  const url = URL + '?' + queryString;

  fetch(url)
    .then (response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error (response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch (err => {
      $('.js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

//<h3>"${responseJson.full_name[i]}"</h3>
function watchForm(){
  $('form').on('submit', event => {
    event.preventDefault();
    console.log('Go button clicked');

    const userInput = $('#js-search-user').val();
    getUserRepos(userInput);

  });
}

$(watchForm);


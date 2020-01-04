// Backend API URL
const API_URL = 'http://localhost:5000/tweets';

// Element selections
const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const tweetsElement = document.querySelector('.tweets');

// Show loading spinner
loadingElement.style.display = '';

// Get all tweets from database
listAllTweets();

// Listen for form submissions
form.addEventListener('submit', event => {
  // Stop default form submission & redirect
  event.preventDefault();

  // Collect form data
  const formData = new FormData(form);
  const name = formData.get('name');
  const content = formData.get('content');

  // Construct tweet
  const tweet = {
    name,
    content
  };

  // Hide tweet form and show loading spinner
  form.style.display = 'none';
  loadingElement.style.display = '';

  // Post data to API
  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(tweet),
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(createdTweet => {
      console.log(createdTweet);
      // Clear form values
      form.reset();
      setTimeout(() => {
        // Show form again
        form.style.display = '';
        // Timer before form appears again & helpful to match up with server rate limit
      }, 100);
      // Refresh list of tweets with new tweet included
      listAllTweets();
    });
});

// Get all tweets from database
function listAllTweets() {
  // Clear existing tweets if loaded previously
  tweetsElement.innerHTML = '';

  // Get all tweets from API
  fetch(API_URL)
    .then(response => response.json())
    .then(tweets => {
      // Reverse order to most recent first
      tweets.reverse();

      //Construct HTML object for each tweet
      tweets.forEach(tweet => {
        const div = document.createElement('div');

        const header = document.createElement('p');
        header.textContent = tweet.name;

        const content = document.createElement('h3');
        content.textContent = tweet.content;

        const date = document.createElement('small');
        // Format date
        const formattedDate = new Date(tweet.created);
        date.textContent =
          'Posted on: ' +
          formattedDate.getDate() +
          '/' +
          (formattedDate.getMonth() + 1) +
          '/' +
          formattedDate.getFullYear();

        div.appendChild(header);
        div.appendChild(content);
        div.appendChild(date);

        // Append tweet to the page
        tweetsElement.appendChild(div);
      });

      // Hide loading spinner
      loadingElement.style.display = 'none';
    });
}

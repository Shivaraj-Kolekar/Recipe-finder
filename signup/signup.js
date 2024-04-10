var SUPABASE_URL = 'https://chzaizregriqzueqdsnf.supabase.co'
var SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoemFpenJlZ3JpcXp1ZXFkc25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk0NDg1MjgsImV4cCI6MjAyNTAyNDUyOH0.qzX1fVjkYfaFtq-6QzdasJsDyQB00CslprrHPQU5QC8'

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
window.userToken = null

document.addEventListener('DOMContentLoaded', function (event) {
  var signUpForm = document.querySelector('#sign-up')
  signUpForm.onsubmit = signUpSubmitted.bind(signUpForm)

  var logInForm = document.querySelector('#log-in')
  logInForm.onsubmit = logInSubmitted.bind(logInForm)

  var userDetailsButton = document.querySelector('#user-button')
  userDetailsButton.onclick = fetchUserDetails.bind(userDetailsButton)

  var logoutButton = document.querySelector('#logout-button')
  logoutButton.onclick = logoutSubmitted.bind(logoutButton)
})

// Redirect after signup and signin
/*
document.addEventListener('DOMContentLoaded', function (event) {
  // Your existing initialization code

  // Listen for Supabase authentication state changes
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      // Redirect to user form if the user has signed in
      window.location.href = 'https://recipe-finder-pbl.netlify.app/userpage/userform';
    } else if (event === 'PASSWORD_RECOVERY') {
      console.log('Please check your email to reset your password.');
    } else if (event === 'USER_UPDATED') {
      setTimeout(() => {
        const user = supabase.auth.user();
        if (user.confirmed_at) {
          // Redirect if the user's email address has been confirmed
          window.location.href = 'https://recipe-finder-pbl.netlify.app/userpage/userform';
        }
      }, 1000); // Wait a bit before checking if the user is confirmed to ensure the Supabase object updates
    }
  });
});

*/

const signUpSubmitted = (event) => {
  event.preventDefault()
  const email = event.target[0].value
  const password = event.target[1].value

  supabase.auth
    .signUp({ email, password })
    .then((response) => {
      response.error ? alert(response.error.message) : setToken(response)
    })
    .catch((err) => {
      alert(err)
    })
}
/*
const signUpSubmitted = (event) => {
  event.preventDefault();
  const email = event.target[0].value;
  const password = event.target[1].value;

  supabase.auth
    .signUp({ email, password })
    .then((response) => {
      if (response.error) {
        alert(response.error.message);
      } else {
        // Assuming the signup was successful and we want to redirect the user to fill their info
        window.location.href = "/userform.html"; // Redirect to user info page
      }
    })
    .catch((err) => {
      alert(err.message);
    });
};
*/

const logInSubmitted = (event) => {
  event.preventDefault()
  const email = event.target[0].value
  const password = event.target[1].value

  supabase.auth
    .signIn({ email, password })
    .then((response) => {
      response.error ? alert(response.error.message) : setToken(response)
      //alert('Logged in as ' + response.user.email)  this is commented beacuase the alert for token already works
    })
    .catch((err) => {
      alert(err.response.text)
    })
}

const fetchUserDetails = () => {
  alert(JSON.stringify(supabase.auth.user()))
}

/*
const logInSubmitted = (event) => {
  event.preventDefault();
  const email = event.target[0].value;
  const password = event.target[1].value;

  supabase.auth
    .signIn({ email, password })
    .then((response) => {
      if (response.error) {
        alert(response.error.message);
      } else {
        // Redirect on successful login is handled by the auth state change listener
      }
    })
    .catch((err) => {
      alert(err.message);
    });
};*/


const logoutSubmitted = (event) => {
  event.preventDefault()

  supabase.auth
    .signOut()
    .then((_response) => {
      document.querySelector('#access-token').value = ''
      document.querySelector('#refresh-token').value = ''
      alert('Logout successful')
    })
    .catch((err) => {
      alert(err.response.text)
    })
}





function setToken(response) {
  if (response.user.confirmation_sent_at && !response?.session?.access_token) {
    alert('Confirmation Email Sent')
  } else {
    document.querySelector('#access-token').value = response.session.access_token
    document.querySelector('#refresh-token').value = response.session.refresh_token
    alert('Logged in as ' + response.user.email)
  }
}
/*
document.addEventListener('DOMContentLoaded', function() {
  // Other initializations...

  // Listen for authentication state changes
  supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
          // User has signed in, check if email is confirmed
          checkEmailConfirmation(session.user);
      }
  });
});

const checkEmailConfirmation = (user) => {
  if (user.confirmed_at) {
      // The user's email has been confirmed, redirect them
      window.location.href = "/userform.html";
  } else {
      // You might want to handle this case differently,
      // For example, show a message asking the user to check their email for a confirmation link
      console.log("Please confirm your email address.");
  }
};
*/
function toggleForms() {
  const signupForm = document.getElementById('sign-up');
  const loginForm = document.getElementById('log-in');

  if (signupForm.style.display === 'none') {
      signupForm.style.display = 'block';
      loginForm.style.display = 'none';
  } else {
      signupForm.style.display = 'none';
      loginForm.style.display = 'block';
  }
}
// Google auth
async function signInWithGoogle() {
  try {
    const { user, session, error } = await supabase.auth.signIn({
      provider: 'google',
    });
    if (error) throw error;
    console.log(user, session);
  } catch (error) {
    console.error('Error signing in with Google:', error.message);
  }
}

// Add click event listener to the Google Sign-In button
document.getElementById('google-sign-in1').addEventListener('click', signInWithGoogle);
document.getElementById('google-sign-in2').addEventListener('click', signInWithGoogle);

// github auth
async function signInWithGithub() {
  try {
    const { user, session, error } = await supabase.auth.signIn({
      provider: 'github',
      clientId: '669ba9c06e0f3664cbd4',
    });
    if (error) throw error;
    console.log(user, session);
  } catch (error) {
    console.error('Error signing in with github:', error.message);
  }
}

// Add click event listener to the Google Sign-In button
document.getElementById('github-sign-in1').addEventListener('click', signInWithGithub);
document.getElementById('github-sign-in2').addEventListener('click', signInWithGithub);
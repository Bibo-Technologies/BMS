import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase, ref,remove, push,get, onValue,child,set } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getAuth, onAuthStateChanged,sendPasswordResetEmail , signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyCi_hufIZTzsYtdPGQtvtmKmAkkrydmn_A",
authDomain: "abbah-83a7b.firebaseapp.com",
databaseURL: "https://abbah-83a7b-default-rtdb.firebaseio.com",
projectId: "abbah-83a7b",
storageBucket: "abbah-83a7b.appspot.com",
messagingSenderId: "379729759051",
appId: "1:379729759051:web:e75528d61b02d1e4f536ce",
measurementId: "G-H41J2WMR6S"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app); // Initialize Firebase Authentication



     
// Ensure that authToken is defined in the global scope
let authToken;
let tokenExpiryTime;

// Function to generate a token valid for 24 hours
function generateToken() {
authToken = Math.random().toString(36).substring(2);
const currentTime = new Date();
const tokenExpiryTime = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000); // Token valid for 24 hours

// Store token and expiry time in local storage
localStorage.setItem('authToken', authToken);
localStorage.setItem('tokenExpiryTime', tokenExpiryTime.toString());
}


// Function to retrieve token and its expiry time from local storage
function retrieveTokenFromLocalStorage() {
authToken = localStorage.getItem('authToken');
const storedExpiryTime = localStorage.getItem('tokenExpiryTime');
if (authToken && storedExpiryTime) {
  tokenExpiryTime = new Date(storedExpiryTime);
}
}

// Function to check if the token is still valid
function isTokenValid() {
const currentTime = new Date();
return tokenExpiryTime > currentTime;
}

// Function to display the login overlay on page load based on token validity
window.addEventListener('load', function() {
retrieveTokenFromLocalStorage(); // Retrieve token from local storage
// Check if token is valid, if not, display login overlay
if (!isTokenValid()) {
  document.getElementById('loginoverlay').style.display = 'block';
  document.getElementById('loginpopup').style.display = 'block';
  generateToken(); // Generate a new token on login overlay display
  console.log(authToken + tokenExpiryTime)
}
});

// Rest of your code...


// Disable right-click when the popup is displayed
document.addEventListener('contextmenu', function(event) {
if (document.getElementById('loginpopup').style.display === 'block') {
  event.preventDefault();
}
document.addEventListener('keydown', function(event) {
if (event.keyCode === 123) {
  event.preventDefault();
}
});

});
const allowedEmails = ['biboofficial256@gmail.com']; // Add the allowed email addresses here

// Show a loader inside the submit button when it's clicked
document.getElementById('loginForm').addEventListener('submit', function(event) {
event.preventDefault(); // Prevent default form submission

// Show loader inside the submit button
const submitBtn = document.getElementById('submitBtn');
submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting';

// Get user credentials from the form
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

// Update the login success block to generate a new token and store it
signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
  // Check if the user's email is allowed
  if (allowedEmails.includes(email)) {
    // Login successful, hide the login overlay and popup
    document.getElementById('loginoverlay').style.display = 'none';
    document.getElementById('loginpopup').style.display = 'none';
    generateToken(); // Generate a new token on successful login
    } else {
      // Login not allowed, show an error message
      const errorContainer = document.getElementById('errorContainer');
      errorContainer.textContent = 'Access denied. You are not authorized.';
      errorContainer.style.display = 'block'; // Show the message
      // Log out the user since they are not authorized
      signOut(auth)
        .then(() => {
          // Reset the submit button text after a short delay (e.g., 2 seconds)
          setTimeout(function() {
            submitBtn.innerHTML = 'Submit';
          }, 2000);
        })
        .catch((error) => {
          console.error('Error signing out:', error);
        });
    }
  })
  .catch((error) => {
    // Login failed, display error message
    const errorMessage = error.message;
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = errorMessage;
    errorContainer.style.display = 'block'; // Show the message

    // Reset the submit button text after a short delay (e.g., 2 seconds)
    setTimeout(function() {
      submitBtn.innerHTML = 'Submit';
    }, 2000);
  });
});



// Event listener for the "Forgot Password" link
document.getElementById('forgotPasswordLink').addEventListener('click', function(event) {
event.preventDefault();

// Get the email entered by the user
const email = document.getElementById('email').value;

// Use Firebase sendPasswordResetEmail method with auth object
sendPasswordResetEmail(auth, email)
  .then(() => {
    // Password reset email sent successfully
    showMessage(' A password reset email has been sent. Please check your inbox.');
  })
  .catch((error) => {
    // Password reset email failed to send
    const errorMessage = error.message;
    alert('Password reset email failed to send. ' + errorMessage);
  });
});
// Function to display a message with optional retry button and success flag
function displayMessage(title, message, isSuccess = false) {
// Clear existing messages
const existingMessages = document.querySelectorAll('.retry-message');
existingMessages.forEach(function (message) {
  message.remove();
});

// Create a div element for the message
const messageDiv = document.createElement('div');
messageDiv.classList.add('retry-message'); // Add the class for styling

// Set background color to green for success message
if (isSuccess) {
  messageDiv.style.backgroundColor = '#4caf50';
}

// Create close button element
const closeButton = document.createElement('button');
closeButton.classList.add('close-btn');
closeButton.innerHTML = '<i class="fa fa-times"></i>';
closeButton.addEventListener('click', function () {
  messageDiv.remove();
});

// Create title element
const titleElement = document.createElement('h2');
titleElement.textContent = title;

// Create message element
const messageElement = document.createElement('p');
messageElement.textContent = message;

// Append title, message, and close button to the message div
messageDiv.appendChild(titleElement);
messageDiv.appendChild(messageElement);
//messageDiv.appendChild(closeButton);

// Append the message div to the document body
document.body.appendChild(messageDiv);

// Automatically remove the message after 5 seconds (5000 milliseconds)
setTimeout(function () {
  messageDiv.remove();
}, 1500);
}
// Function to display user information
function displayUserInformation(user) {
// Set the h2 element text to the user's display name
const profileName = document.querySelector('.profile_info h2');
profileName.textContent = user.displayName;

// Set the profile image source to the user's profile photo URL
const profileImage = document.querySelector('.profile_pic img');
profileImage.src = user.photoURL;

// Set the profile image in the dropdown menu
const dropdownProfileImage = document.querySelector('.user-profile img');
dropdownProfileImage.src = user.photoURL;

// Display success message
displayMessage('', `Welcome, ${user.displayName}.`, true); // Pass true for success message

// Reload the page content or perform any necessary actions for an authenticated user
}

// Function to handle sign-in success
function handleSignInSuccess(user) {
// Display user information
displayUserInformation(user);
}

// Function to handle sign-in error
function handleSignInError(error) {
console.error('Error signing in:', error);
// Display access denied message
displayMessage('Access Denied. Please sign in with a valid email.');
}

// Function to sign in with Google
function signInWithGoogle() {
var provider = new GoogleAuthProvider();
signInWithPopup(auth, provider)
  .then(function (result) {
    const user = result.user;
    handleSignInSuccess(user);
  })
  .catch(function (error) {
    handleSignInError(error);
  });
}

// Display the email sign-in popup on page load
window.addEventListener('load', function() {
auth.onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in
    displayUserInformation(user);
  } else {
    // User is not signed in, display the sign-in popup
    signInWithGoogle();
  }
});
});

// Function to retry the sign-in process
function retryCallback() {
signInWithGoogle();
}







displayMessage('Signing in...', 'Please wait...', false); // Pass false for error message

// Get the "Log Out" button element
const logoutButton = document.getElementById("logoutButton");

// Add event listener to the "Log Out" button
logoutButton.addEventListener("click", function(event) {
event.preventDefault();
logOut();

// Trigger the sign-in popup to appear again
var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().signInWithPopup(provider)
  .then(function(result) {
    // Handle sign-in success
    var user = result.user;
    console.log('User signed in:', user.email);
  })
  .catch(function(error) {
    // Handle sign-in error
    console.error('Error signing in:', error);
  });
});

// Function to log out
function logOut() {
auth.signOut()
  .then(function() {
    console.log('User signed out');
    // Refresh the page
    location.reload();
  })
  .catch(function(error) {
    console.error('Error signing out:', error);
  });
}

const form = document.querySelector('.popup-form');
const submitButton = document.querySelector('.popup-form button');
const successMessage = document.createElement('p');
successMessage.textContent = 'Medicine details uploaded successfully!';
successMessage.style.color = 'green';
const errorMessage = document.createElement('p');
errorMessage.textContent = 'Error uploading patient details. Please try again.';
errorMessage.style.color = 'red';
const patientsContainer = document.getElementById('patients');
let patients = []; // Declare patients variable outside the event listener



function renderPatients(patients) {
// Code to render patients goes here
// ...
}

const salesContainer = document.getElementById('salesContainer');

// Function to delete a sale from Firebase
function deleteSale(patientKey, saleKey) {
// Prompt the user for confirmation
const confirmation = confirm('Are you sure you want to delete this sale?');

if (confirmation) {
  // Get a reference to the sale node in the database
  const saleRef = ref(database, `medicine/${patientKey}/sales/${saleKey}`);

  // Remove the sale data from the database
  return remove(saleRef)
    .then(() => {
      alert('Sale deleted successfully!');
    })
    .catch((error) => {
      console.error('Error deleting sale:', error);
      alert('Error deleting sale. Please try again.');
    });
}
}


// Function to render the sales table
function renderSalesTable(sales) {


// Sort the sales array by date and time in descending order
sales.sort((a, b) => {
const dateA = new Date(`${a.saleData.date} ${a.saleData.time}`);
const dateB = new Date(`${b.saleData.date} ${b.saleData.time}`);
return dateB - dateA;
});
// Create a table element
const table = document.createElement('table');
table.classList.add('sales-table');

// Create the table header row
const headerRow = document.createElement('tr');
headerRow.innerHTML = `
  <th>Medicine</th>
  <th>Quantity</th>
  <th>Date</th>
  <th>Time</th>
  <th>Action</th>
`;
table.appendChild(headerRow);

// Loop through each sale
sales.forEach(sale => {
  const patientName = sale.patientName;
  const saleData = sale.saleData;

  // Create a row element for each sale
  const row = document.createElement('tr');

  // Create and append the patient name cell
  const patientNameCell = document.createElement('td');
  patientNameCell.textContent = patientName;
  row.appendChild(patientNameCell);

  // Create and append the sale quantity cell
  const quantityCell = document.createElement('td');
  quantityCell.textContent = saleData.quantity + ' pcs';
  row.appendChild(quantityCell);

  // Create and append the sale date cell
  const dateCell = document.createElement('td');
  dateCell.textContent = saleData.date;
  row.appendChild(dateCell);

  // Create and append the sale time cell
  const timeCell = document.createElement('td');
  timeCell.textContent = saleData.time;
  row.appendChild(timeCell);

// Create and append the delete button cell
const deleteCell = document.createElement('td');
const deleteButton = document.createElement('button');
deleteButton.classList.add('delete-button');
deleteButton.innerHTML = '<i class="fa fa-trash"></i>';

// Get the sale ID
const saleId = sale.saleId; // Assuming you have the sale ID available in the sale object

// Add the sale ID as a data attribute to the delete button
deleteButton.dataset.saleId = saleId;

deleteButton.addEventListener('click', function() {
// Get the patient name and sale ID from the data attributes
const patientName = sale.patientName;
const saleId = this.dataset.saleId;

// Call the deleteSale function to delete the sale from Firebase
deleteSale(patientName, saleId)
  .then(() => {
    // Delete successful
    row.remove();

    // Update the chart and total amount after deleting a sale
    updateChart();
    updateTotalAmount();
  })
  .catch(error => {
    console.log('Error deleting sale:', error);
  });
});


deleteCell.appendChild(deleteButton);
row.appendChild(deleteCell);


// Function to delete a sale from Firebase
function deleteSale(patientName, saleId) {
console.log('Deleting sale for patient:', patientName);
console.log('Sale ID:', saleId);

// Prompt the user for confirmation
const confirmation = confirm('Are you sure you want to delete this sale?');

if (confirmation) {
  // Prompt the user for password
  const password = prompt('Please enter your password to confirm the deletion:');

  // Check if the password is correct
  if (password === 'mm') { // Replace 'your_password' with the actual password
    // Create a reference to the specific sale in the patient's sales node
    const saleRef = ref(database, `medicine/${patientName}/sales/${saleId}`);

    // Remove the sale node from the database
    return remove(saleRef)
      .then(() => {
        alert('Sale deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting sale:', error);
        alert('Error deleting sale. Please try again.');
      });
  } else {
    alert('Wrong password. Deletion cancelled.');
  }
}
}




  // Append the row to the table
  table.appendChild(row);
  
});

// Clear the sales container
salesContainer.innerHTML = '';

// Append the table to the sales container
salesContainer.appendChild(table);

}
// Function to fetch all sales data
function fetchAllSalesData() {
// Show the loader
loaderElement.classList.remove('hidden');

// Clear the sales container
salesContainer.innerHTML = '';

// Search through Firebase for patient names by key
const patientsRef = ref(database, 'medicine');
onValue(patientsRef, (snapshot) => {
  const patientsData = snapshot.val();
  const allSales = [];

  if (patientsData) {
    const patients = Object.values(patientsData);

    // Loop through all patients and collect sales data
    patients.forEach(patient => {
      if (patient.hasOwnProperty('sales')) {
        const salesNode = patient.sales;

        for (const saleKey in salesNode) {
          const saleData = salesNode[saleKey];
          const saleId = saleKey; // Set the saleId as the key
          allSales.push({
            patientName: patient.name,
            saleData: saleData,
            saleId: saleId, // Include the saleId property
          });
        }
      }
    });
  }

  // Pass the allSales array to the renderSalesTable function
  renderSalesTable(allSales);

  // Hide the loader
  loaderElement.classList.add('hidden');
});
}

// Function to search sales by medicine
function searchByMedicine() {
const medicineInput = document.getElementById('medicineInput');
const medicineKeyword = medicineInput.value.toLowerCase();

// Show the loader
loaderElement.classList.remove('hidden');

// Clear the sales container
salesContainer.innerHTML = '';

// Search through Firebase for patient names by key
const patientsRef = ref(database, 'medicine');
onValue(patientsRef, (snapshot) => {
  const patientsData = snapshot.val();
  const searchResults = [];

  if (patientsData) {
    const patients = Object.values(patientsData);

    // Filter patients based on the search term
    patients.forEach(patient => {
      const medicineMatch = patient.name.toLowerCase().includes(medicineKeyword);

      // Check if the patient has sales data
      if (patient.hasOwnProperty('sales')) {
        const salesNode = patient.sales;

        // Loop through each sale in the sales node
        for (const saleKey in salesNode) {
          const saleData = salesNode[saleKey];

          if (medicineKeyword === '' || medicineMatch) {
            searchResults.push({
              patientName: patient.name,
              saleData: saleData
            });
          }
        }
      }
    });
  }

  // Hide the loader
  loaderElement.classList.add('hidden');

  // Display search results
  if (searchResults.length > 0) {
    renderSalesTable(searchResults);
  } else {
    salesContainer.innerHTML = '<p class="no-results">Oops... No sales found.</p>';
  }
});
}

// Add event listener to search medicine button
const searchMedicineButton = document.getElementById('searchMedicineButton');
searchMedicineButton.addEventListener('click', searchByMedicine);

// Fetch all sales data on page load
window.addEventListener('load', fetchAllSalesData);


const loaderElement = document.getElementById('loader');

// Retrieve and render patients
const patientsRef = ref(database, 'medicine');

// Show the loader
loaderElement.classList.remove('hidden');

onValue(patientsRef, (snapshot) => {
const patientsData = snapshot.val();

if (patientsData) {
  patients = Object.values(patientsData); // Update the patients variable
  renderPatients(patients);
}

// Hide the loader
loaderElement.classList.add('hidden');
});


// Get the online status element
const onlineStatusElement = document.getElementById('onlineStatus');
const overlayElement = document.getElementById('overlay');

// Function to update the online status indicator
function updateOnlineStatus() {
if (navigator.onLine) {
  onlineStatusElement.innerHTML = '<i class="fa fa-wifi"></i>';
  onlineStatusElement.classList.remove('offline');
  onlineStatusElement.classList.add('online');
  overlayElement.style.display = 'none';
} else {
  onlineStatusElement.innerHTML = '<i class="fa fa-exclamation-triangle"></i>';
  onlineStatusElement.classList.remove('online');
  onlineStatusElement.classList.add('offline');
  overlayElement.style.display = 'block';
}
}

// Initial update of online status
updateOnlineStatus();

// Add event listeners for online and offline events
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
window.addEventListener('load', function () {
    const splashScreen = document.getElementById('splashScreen');
    splashScreen.style.opacity = '0';
    setTimeout(function () {
      splashScreen.style.display = 'none';
    }, 500); // Change this duration to control how long the splash screen is shown (in milliseconds)
  });
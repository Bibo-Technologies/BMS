import{initializeApp}from"https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";import{getDatabase,ref,remove,push,get,onValue,child,set}from"https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";import{getAuth,onAuthStateChanged,sendPasswordResetEmail,signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup}from"https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";const firebaseConfig={apiKey:"AIzaSyCi_hufIZTzsYtdPGQtvtmKmAkkrydmn_A",authDomain:"abbah-83a7b.firebaseapp.com",databaseURL:"https://abbah-83a7b-default-rtdb.firebaseio.com",projectId:"abbah-83a7b",storageBucket:"abbah-83a7b.appspot.com",messagingSenderId:"379729759051",appId:"1:379729759051:web:e75528d61b02d1e4f536ce",measurementId:"G-H41J2WMR6S"};const app=initializeApp(firebaseConfig);const database=getDatabase(app);const auth=getAuth(app);window.addEventListener("load",function(){document.getElementById("loginoverlay").style.display="block";document.getElementById("loginpopup").style.display="block"});document.addEventListener("contextmenu",function(event){if(document.getElementById("loginpopup").style.display==="block"){event.preventDefault()}document.addEventListener("keydown",function(event){if(event.keyCode===123){event.preventDefault()}})});const allowedEmails=["biboofficial256@gmail.com"];document.getElementById("loginForm").addEventListener("submit",function(event){event.preventDefault();const submitBtn=document.getElementById("submitBtn");submitBtn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Submit';const email=document.getElementById("email").value;const password=document.getElementById("password").value;signInWithEmailAndPassword(auth,email,password).then(userCredential=>{if(allowedEmails.includes(email)){document.getElementById("loginoverlay").style.display="none";document.getElementById("loginpopup").style.display="none"}else{const errorContainer=document.getElementById("errorContainer");errorContainer.textContent="Access denied. You are not authorized to log in.";errorContainer.style.display="block";signOut(auth).then(()=>{setTimeout(function(){submitBtn.innerHTML="Submit"},2e3)})["catch"](error=>{console.error("Error signing out:",error)})}})["catch"](error=>{const errorMessage=error.message;const errorContainer=document.getElementById("errorContainer");errorContainer.textContent=errorMessage;errorContainer.style.display="block";setTimeout(function(){submitBtn.innerHTML="Submit"},2e3)})});document.getElementById("forgotPasswordLink").addEventListener("click",function(event){event.preventDefault();const email=document.getElementById("email").value;sendPasswordResetEmail(auth,email).then(()=>{showMessage(" A password reset email has been sent. Please check your inbox.")})["catch"](error=>{const errorMessage=error.message;alert("Password reset email failed to send. "+errorMessage)})});function displayMessage(title,message,isSuccess=false){const existingMessages=document.querySelectorAll(".retry-message");existingMessages.forEach(function(message){message.remove()});const messageDiv=document.createElement("div");messageDiv.classList.add("retry-message");if(isSuccess){messageDiv.style.backgroundColor="#4caf50"}const closeButton=document.createElement("button");closeButton.classList.add("close-btn");closeButton.innerHTML='<i class="fa fa-times"></i>';closeButton.addEventListener("click",function(){messageDiv.remove()});const titleElement=document.createElement("h2");titleElement.textContent=title;const messageElement=document.createElement("p");messageElement.textContent=message;messageDiv.appendChild(titleElement);messageDiv.appendChild(messageElement);messageDiv.appendChild(closeButton);document.body.appendChild(messageDiv)}window.addEventListener("load",function(){auth.onAuthStateChanged(function(user){if(user){console.log("User signed in:",user.email);const profileName=document.querySelector(".profile_info h2");profileName.textContent=user.displayName;const profileImage=document.querySelector(".profile_pic img");profileImage.src=user.photoURL;const dropdownProfileImage=document.querySelector(".user-profile img");dropdownProfileImage.src=user.photoURL;displayMessage("Success",`Welcome, ${user.displayName}! You are authenticated.`,true)}else{var provider=new GoogleAuthProvider;signInWithPopup(auth,provider).then(function(result){var user=result.user;const profileName=document.querySelector(".profile_info h2");profileName.textContent=user.displayName;const profileImage=document.querySelector(".profile_pic img");profileImage.src=user.photoURL;const dropdownProfileImage=document.querySelector(".user-profile img");dropdownProfileImage.src=user.photoURL;displayMessage("Success",`Welcome, ${user.displayName}! You are authenticated.`,true)})["catch"](function(error){console.error("Error signing in:",error);displayMessage("Access Denied","You are not authenticated. Please sign in with a valid email.")})}})});function retryCallback(){var provider=new GoogleAuthProvider;signInWithPopup(auth,provider).then(function(result){var user=result.user;const profileName=document.querySelector(".profile_info h2");profileName.textContent=user.displayName;const profileImage=document.querySelector(".profile_pic img");profileImage.src=user.photoURL;const dropdownProfileImage=document.querySelector(".user-profile img");dropdownProfileImage.src=user.photoURL;displayMessage("Success",`Welcome, ${user.displayName}! You are authenticated.`,true)})["catch"](function(error){console.error("Error signing in:",error)})}displayMessage("Signing in...","Please wait...",false);const logoutButton=document.getElementById("logoutButton");logoutButton.addEventListener("click",function(event){event.preventDefault();logOut();var provider=new firebase.auth.GoogleAuthProvider;firebase.auth().signInWithPopup(provider).then(function(result){var user=result.user;console.log("User signed in:",user.email)})["catch"](function(error){console.error("Error signing in:",error)})});function logOut(){auth.signOut().then(function(){console.log("User signed out");location.reload()})["catch"](function(error){console.error("Error signing out:",error)})}const form=document.querySelector(".popup-form");const submitButton=document.querySelector(".popup-form button");const successMessage=document.createElement("p");successMessage.textContent="Medicine details uploaded successfully!";successMessage.style.color="green";const errorMessage=document.createElement("p");errorMessage.textContent="Error uploading patient details. Please try again.";errorMessage.style.color="red";const patientsContainer=document.getElementById("patients");let patients=[];function renderPatients(patients){}const salesContainer=document.getElementById("salesContainer");function deleteSale(patientKey,saleKey){const confirmation=confirm("Are you sure you want to delete this sale?");if(confirmation){const saleRef=ref(database,`medicine/${patientKey}/sales/${saleKey}`);return remove(saleRef).then(()=>{alert("Sale deleted successfully!")})["catch"](error=>{console.error("Error deleting sale:",error);alert("Error deleting sale. Please try again.")})}}function renderSalesTable(sales){sales.sort((a,b)=>{const dateA=new Date(`${a.saleData.date} ${a.saleData.time}`);const dateB=new Date(`${b.saleData.date} ${b.saleData.time}`);return dateB-dateA});const table=document.createElement("table");table.classList.add("sales-table");const headerRow=document.createElement("tr");headerRow.innerHTML=`
    <th>Medicine</th>
    <th>Quantity</th>
    <th>Date</th>
    <th>Time</th>
    <th>Action</th>
  `;table.appendChild(headerRow);sales.forEach(sale=>{const patientName=sale.patientName;const saleData=sale.saleData;const row=document.createElement("tr");const patientNameCell=document.createElement("td");patientNameCell.textContent=patientName;row.appendChild(patientNameCell);const quantityCell=document.createElement("td");quantityCell.textContent=saleData.quantity+" pcs";row.appendChild(quantityCell);const dateCell=document.createElement("td");dateCell.textContent=saleData.date;row.appendChild(dateCell);const timeCell=document.createElement("td");timeCell.textContent=saleData.time;row.appendChild(timeCell);const deleteCell=document.createElement("td");const deleteButton=document.createElement("button");deleteButton.classList.add("delete-button");deleteButton.innerHTML='<i class="fa fa-trash"></i>';const saleId=sale.saleId;deleteButton.dataset.saleId=saleId;deleteButton.addEventListener("click",function(){const patientName=sale.patientName;const saleId=this.dataset.saleId;deleteSale(patientName,saleId).then(()=>{row.remove();updateChart();updateTotalAmount()})["catch"](error=>{console.log("Error deleting sale:",error)})});deleteCell.appendChild(deleteButton);row.appendChild(deleteCell);function deleteSale(patientName,saleId){console.log("Deleting sale for patient:",patientName);console.log("Sale ID:",saleId);const confirmation=confirm("Are you sure you want to delete this sale?");if(confirmation){const password=prompt("Please enter your password to confirm the deletion:");if(password==="mm"){const saleRef=ref(database,`medicine/${patientName}/sales/${saleId}`);return remove(saleRef).then(()=>{alert("Sale deleted successfully!")})["catch"](error=>{console.error("Error deleting sale:",error);alert("Error deleting sale. Please try again.")})}else{alert("Wrong password. Deletion cancelled.")}}}table.appendChild(row)});salesContainer.innerHTML="";salesContainer.appendChild(table)}function fetchAllSalesData(){loaderElement.classList.remove("hidden");salesContainer.innerHTML="";const patientsRef=ref(database,"medicine");onValue(patientsRef,snapshot=>{const patientsData=snapshot.val();const allSales=[];if(patientsData){const patients=Object.values(patientsData);patients.forEach(patient=>{if(patient.hasOwnProperty("sales")){const salesNode=patient.sales;for(const saleKey in salesNode){const saleData=salesNode[saleKey];const saleId=saleKey;allSales.push({patientName:patient.name,saleData:saleData,saleId:saleId})}}})}renderSalesTable(allSales);loaderElement.classList.add("hidden")})}function searchByMedicine(){const medicineInput=document.getElementById("medicineInput");const medicineKeyword=medicineInput.value.toLowerCase();loaderElement.classList.remove("hidden");salesContainer.innerHTML="";const patientsRef=ref(database,"medicine");onValue(patientsRef,snapshot=>{const patientsData=snapshot.val();const searchResults=[];if(patientsData){const patients=Object.values(patientsData);patients.forEach(patient=>{const medicineMatch=patient.name.toLowerCase().includes(medicineKeyword);if(patient.hasOwnProperty("sales")){const salesNode=patient.sales;for(const saleKey in salesNode){const saleData=salesNode[saleKey];if(medicineKeyword===""||medicineMatch){searchResults.push({patientName:patient.name,saleData:saleData})}}}})}loaderElement.classList.add("hidden");if(searchResults.length>0){renderSalesTable(searchResults)}else{salesContainer.innerHTML='<p class="no-results">Oops... No sales found.</p>'}})}const searchMedicineButton=document.getElementById("searchMedicineButton");searchMedicineButton.addEventListener("click",searchByMedicine);window.addEventListener("load",fetchAllSalesData);const loaderElement=document.getElementById("loader");const patientsRef=ref(database,"medicine");loaderElement.classList.remove("hidden");onValue(patientsRef,snapshot=>{const patientsData=snapshot.val();if(patientsData){patients=Object.values(patientsData);renderPatients(patients)}loaderElement.classList.add("hidden")});const onlineStatusElement=document.getElementById("onlineStatus");const overlayElement=document.getElementById("overlay");function updateOnlineStatus(){if(navigator.onLine){onlineStatusElement.innerHTML='<i class="fa fa-wifi"></i>';onlineStatusElement.classList.remove("offline");onlineStatusElement.classList.add("online");overlayElement.style.display="none"}else{onlineStatusElement.innerHTML='<i class="fa fa-exclamation-triangle"></i>';onlineStatusElement.classList.remove("online");onlineStatusElement.classList.add("offline");overlayElement.style.display="block"}}updateOnlineStatus();window.addEventListener("online",updateOnlineStatus);window.addEventListener("offline",updateOnlineStatus);window.addEventListener("load",function(){const splashScreen=document.getElementById("splashScreen");splashScreen.style.opacity="0";setTimeout(function(){splashScreen.style.display="none"},500)});
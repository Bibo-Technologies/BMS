import{initializeApp}from"https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";import{getDatabase,ref,remove,push,get,onValue,child,set}from"https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";import{getAuth,onAuthStateChanged,sendPasswordResetEmail,signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup}from"https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";const firebaseConfig={apiKey:"AIzaSyCi_hufIZTzsYtdPGQtvtmKmAkkrydmn_A",authDomain:"abbah-83a7b.firebaseapp.com",databaseURL:"https://abbah-83a7b-default-rtdb.firebaseio.com",projectId:"abbah-83a7b",storageBucket:"abbah-83a7b.appspot.com",messagingSenderId:"379729759051",appId:"1:379729759051:web:e75528d61b02d1e4f536ce",measurementId:"G-H41J2WMR6S"};const app=initializeApp(firebaseConfig);const database=getDatabase(app);const auth=getAuth(app);window.addEventListener("load",function(){document.getElementById("loginoverlay").style.display="block";document.getElementById("loginpopup").style.display="block"});document.addEventListener("contextmenu",function(event){if(document.getElementById("loginpopup").style.display==="block"){event.preventDefault()}document.addEventListener("keydown",function(event){if(event.keyCode===123){event.preventDefault()}})});const allowedEmails=["biboofficial256@gmail.com"];document.getElementById("loginForm").addEventListener("submit",function(event){event.preventDefault();const submitBtn=document.getElementById("submitBtn");submitBtn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Submit';const email=document.getElementById("email").value;const password=document.getElementById("password").value;signInWithEmailAndPassword(auth,email,password).then(userCredential=>{if(allowedEmails.includes(email)){document.getElementById("loginoverlay").style.display="none";document.getElementById("loginpopup").style.display="none"}else{const errorContainer=document.getElementById("errorContainer");errorContainer.textContent="Access denied. You are not authorized to log in.";errorContainer.style.display="block";signOut(auth).then(()=>{setTimeout(function(){submitBtn.innerHTML="Submit"},2e3)})["catch"](error=>{console.error("Error signing out:",error)})}})["catch"](error=>{const errorMessage=error.message;const errorContainer=document.getElementById("errorContainer");errorContainer.textContent=errorMessage;errorContainer.style.display="block";setTimeout(function(){submitBtn.innerHTML="Submit"},2e3)})});document.getElementById("forgotPasswordLink").addEventListener("click",function(event){event.preventDefault();const email=document.getElementById("email").value;sendPasswordResetEmail(auth,email).then(()=>{showMessage(" A password reset email has been sent. Please check your inbox.")})["catch"](error=>{const errorMessage=error.message;alert("Password reset email failed to send. "+errorMessage)})});function displayMessage(title,message,isSuccess=false){const existingMessages=document.querySelectorAll(".retry-message");existingMessages.forEach(function(message){message.remove()});const messageDiv=document.createElement("div");messageDiv.classList.add("retry-message");if(isSuccess){messageDiv.style.backgroundColor="#4caf50"}const closeButton=document.createElement("button");closeButton.classList.add("close-btn");closeButton.innerHTML='<i class="fa fa-times"></i>';closeButton.addEventListener("click",function(){messageDiv.remove()});const titleElement=document.createElement("h2");titleElement.textContent=title;const messageElement=document.createElement("p");messageElement.textContent=message;messageDiv.appendChild(titleElement);messageDiv.appendChild(messageElement);messageDiv.appendChild(closeButton);document.body.appendChild(messageDiv)}window.addEventListener("load",function(){auth.onAuthStateChanged(function(user){if(user){console.log("User signed in:",user.email);const profileName=document.querySelector(".profile_info h2");profileName.textContent=user.displayName;const profileImage=document.querySelector(".profile_pic img");profileImage.src=user.photoURL;const dropdownProfileImage=document.querySelector(".user-profile img");dropdownProfileImage.src=user.photoURL;displayMessage("Success",`Welcome, ${user.displayName}! You are authenticated.`,true)}else{var provider=new GoogleAuthProvider;signInWithPopup(auth,provider).then(function(result){var user=result.user;const profileName=document.querySelector(".profile_info h2");profileName.textContent=user.displayName;const profileImage=document.querySelector(".profile_pic img");profileImage.src=user.photoURL;const dropdownProfileImage=document.querySelector(".user-profile img");dropdownProfileImage.src=user.photoURL;displayMessage("Success",`Welcome, ${user.displayName}! You are authenticated.`,true)})["catch"](function(error){console.error("Error signing in:",error);displayMessage("Access Denied","You are not authenticated. Please sign in with a valid email.")})}})});function retryCallback(){var provider=new GoogleAuthProvider;signInWithPopup(auth,provider).then(function(result){var user=result.user;const profileName=document.querySelector(".profile_info h2");profileName.textContent=user.displayName;const profileImage=document.querySelector(".profile_pic img");profileImage.src=user.photoURL;const dropdownProfileImage=document.querySelector(".user-profile img");dropdownProfileImage.src=user.photoURL;displayMessage("Success",`Welcome, ${user.displayName}! You are authenticated.`,true)})["catch"](function(error){console.error("Error signing in:",error)})}displayMessage("Signing in...","Please wait...",false);const logoutButton=document.getElementById("logoutButton");logoutButton.addEventListener("click",function(event){event.preventDefault();logOut();var provider=new firebase.auth.GoogleAuthProvider;firebase.auth().signInWithPopup(provider).then(function(result){var user=result.user;console.log("User signed in:",user.email)})["catch"](function(error){console.error("Error signing in:",error)})});function logOut(){auth.signOut().then(function(){console.log("User signed out");location.reload()})["catch"](function(error){console.error("Error signing out:",error)})}const form=document.querySelector(".popup-form");const submitButton=document.querySelector(".popup-form button");const patientsContainer=document.getElementById("patients");let patients=[];form.addEventListener("submit",function(e){e.preventDefault();const name=document.getElementById("name").value;const dob=document.getElementById("dob").value;const parents=document.getElementById("parents").value;const dos=document.getElementById("dos").value;const price=document.getElementById("price").value;const pricepergram=document.getElementById("pricepergram").value;const patientData={name:name,dob:dob,parents:parents,dos:dos,price:price,pricepergram:pricepergram};const patientsRef=ref(database,"medicine");const newPatientRef=child(patientsRef,name);set(newPatientRef,patientData).then(()=>{form.reset();showMessage("Medicine details uploaded successfully!")})["catch"](()=>{showMessage("Error uploading medicine details. Please try again.")})});searchButton.addEventListener("click",()=>{const searchTerm=searchInput.value.trim();loaderElement.classList.remove("hidden");patientsContainer.innerHTML="";const patientsRef=ref(database,"medicine");onValue(patientsRef,snapshot=>{const patientsData=snapshot.val();const searchResults=[];if(patientsData){const patients=Object.values(patientsData);if(searchTerm!==""){patients.forEach(patient=>{if(patient.name.toLowerCase().includes(searchTerm.toLowerCase())){searchResults.push(patient)}})}else{searchResults.push(...patients)}}loaderElement.classList.add("hidden");if(searchResults.length>0){renderPatients(searchResults)}else{patientsContainer.innerHTML='<p class="no-results">No medicine found.</p>'}})});const popupContainer=document.getElementById("popupContainer");const closeButton=document.getElementById("closeButton");closeButton.addEventListener("click",hidePopup);function showPopup(message){const popupMessage=document.getElementById("popupMessage");popupMessage.textContent=message;popupContainer.style.display="flex"}function hidePopup(){popupContainer.style.display="none"}const popupContainer2=document.getElementById("popupContainer2");const closeButton2=document.getElementById("closeButton2");closeButton2.addEventListener("click",hidePopup2);function showPopup2(message){const popupMessage2=document.getElementById("popupMessage2");popupMessage2.textContent=message;popupContainer2.style.display="flex"}function hidePopup2(){popupContainer2.style.display="none"}function filterPatients(patients,searchTerm){const filteredPatients=patients.filter(patient=>{const patientName=patient.name.toLowerCase();return patientName.includes(searchTerm.toLowerCase())});renderPatients(filteredPatients)}searchInput.addEventListener("input",()=>{const searchTerm=searchInput.value.trim();const patientsRef=ref(database,"medicine");onValue(patientsRef,snapshot=>{const patientsData=snapshot.val();const patients=patientsData?Object.values(patientsData):[];filterPatients(patients,searchTerm)})});patientsContainer.innerHTML="";const sellProductForm=document.getElementById("sellProductForm2");function renderPatients(patients){const table=document.createElement("table");table.classList.add("patient-table");const headers=["Name","Rmg Stock","Expiry","Stock lvl","D.O.S","Price @pc","Price @gram","Initial Stock","Est. Revenue","Actions"];const headerRow=document.createElement("tr");headers.forEach(headerText=>{const th=document.createElement("th");th.textContent=headerText;headerRow.appendChild(th)});table.appendChild(headerRow);const alertMessages=[];const alertCategories=[{categoryName:"Expiring Medicines",messages:[]},{categoryName:"Out of Stock Medicines",messages:[]},{categoryName:"Expired Medicines",messages:[]}];patients.forEach(patient=>{const row=document.createElement("tr");const nameCell=document.createElement("td");nameCell.textContent=patient.name;row.appendChild(nameCell);const initialStock=parseInt(patient.parents);let remainingStock;if(patient.hasOwnProperty("sales")){const salesNode=patient.sales;let totalSalesQuantity=0;for(const saleKey in salesNode){const saleQuantity=parseInt(salesNode[saleKey].quantity);if(!isNaN(saleQuantity)){totalSalesQuantity+=saleQuantity}}remainingStock=initialStock-totalSalesQuantity}else{remainingStock=initialStock}const remainingStockCell=document.createElement("td");remainingStockCell.textContent=`${remainingStock} pcs`;row.appendChild(remainingStockCell);const expiryDate=new Date(patient.dob);const currentDate=new Date;const daysRemaining=Math.floor((expiryDate-currentDate)/(1e3*60*60*24));const expiryCell=document.createElement("td");if(daysRemaining>=0){expiryCell.textContent=`${daysRemaining}`;if(daysRemaining<5){const alertMessage=`${patient.name} is almost expiring! Days remaining: ${daysRemaining}`;alertCategories[0].messages.push(alertMessage)}}else{expiryCell.textContent="Expired";expiryCell.style.backgroundColor="red";expiryCell.style.color="white";const alertMessage=`${patient.name} has expired!`;alertCategories[2].messages.push(alertMessage)}row.appendChild(expiryCell);if(remainingStock===0){const outOfStockCell=document.createElement("td");outOfStockCell.textContent="Out of Stock";outOfStockCell.style.backgroundColor="red";outOfStockCell.style.color="white";row.appendChild(outOfStockCell);const alertMessage=`${patient.name} is out of stock!`;alertMessages.push(alertMessage);alertCategories[1].messages.push(alertMessage)}else{const stockLevelCell=document.createElement("td");if(remainingStock<20){stockLevelCell.textContent="Low Stock";stockLevelCell.style.backgroundColor="yellow"}else{stockLevelCell.textContent="In Stock"}row.appendChild(stockLevelCell)}const dosCell=document.createElement("td");dosCell.textContent=patient.dos;row.appendChild(dosCell);const priceCell=document.createElement("td");priceCell.textContent=`${patient.price}.00`;row.appendChild(priceCell);const pricePerGramCell=document.createElement("td");pricePerGramCell.textContent=`${patient.pricepergram}.00`;row.appendChild(pricePerGramCell);const initialStockCell=document.createElement("td");initialStockCell.textContent=`${patient.parents} pcs`;row.appendChild(initialStockCell);const estimatedRevenue=initialStock*patient.price;const formattedRevenue=estimatedRevenue.toLocaleString("en");const revenueCell=document.createElement("td");revenueCell.textContent=`${formattedRevenue}.00`;row.appendChild(revenueCell);const actionsCell=document.createElement("td");const viewButton=document.createElement("button");viewButton.textContent="View";viewButton.classList.add("view-button");viewButton.addEventListener("click",function(){currentPatientName=patient.name;openPatientHistoryPopup(patient)});actionsCell.appendChild(viewButton);const sellButton=document.createElement("button");sellButton.textContent="Sell";sellButton.classList.add("sell-button");sellButton.addEventListener("click",function(){if(daysRemaining<0){alert(`The medicine ${patient.name} has expired!`)}else if(remainingStock===0){alert(`The medicine ${patient.name} is out of stock!`)}else{const sellPopupOverlay=document.getElementById("sellPopupOverlay2");sellPopupOverlay.style.display="block";const sellFormPatientName=document.getElementById("sellFormPatientName");sellFormPatientName.value=patient.name;sellProductForm.addEventListener("submit",handleSellProductSubmit);const sellPopupClose=document.getElementById("sellPopupClose2");sellPopupClose.addEventListener("click",function(){const sellPopupOverlay=document.getElementById("sellPopupOverlay2");sellPopupOverlay.style.display="none"})}});actionsCell.appendChild(sellButton);row.appendChild(actionsCell);table.appendChild(row)});patientsContainer.innerHTML="";patientsContainer.appendChild(table);if(alertCategories.some(category=>category.messages.length>0)){showAlert(alertCategories)}function showAlert(reportMessages){const customAlert=document.getElementById("customAlert");const categoryContainer=document.getElementById("categoryContainer");const customAlertButton=document.getElementById("customAlertButton");categoryContainer.innerHTML="";reportMessages.forEach(category=>{const categoryTitle=document.createElement("h3");categoryTitle.classList.add("category-title");categoryTitle.textContent=category.categoryName;categoryContainer.appendChild(categoryTitle);category.messages.forEach(message=>{const alertMessage=document.createElement("p");alertMessage.classList.add("alert-message");alertMessage.textContent=message;categoryContainer.appendChild(alertMessage)})});customAlert.style.display="block";customAlertButton.addEventListener("click",hideAlert);function hideAlert(){customAlert.style.display="none";customAlertButton.removeEventListener("click",hideAlert)}}}function handleSellProductSubmit(e){e.preventDefault();const sellFormPatientName=document.getElementById("sellFormPatientName").value;const sellPiecesInput=document.getElementById("sellPieces");const piecesSold=parseInt(sellPiecesInput.value,10);if(!isNaN(piecesSold)&&piecesSold>0){const patient=patients.find(p=>p.name===sellFormPatientName);if(!patient){console.error("Patient not found.");return}const initialStock=parseInt(patient.parents);if(patient.hasOwnProperty("sales")){const salesNode=patient.sales;let totalSalesQuantity=0;for(const saleKey in salesNode){const saleQuantity=parseInt(salesNode[saleKey].quantity);if(!isNaN(saleQuantity)){totalSalesQuantity+=saleQuantity}}const remainingStock=initialStock-totalSalesQuantity;if(piecesSold>remainingStock){alert("Cannot sell beyond remaining stock.");return}}const patientSalesRef=push(ref(database,`medicine/${sellFormPatientName}/sales`));const saleId=patientSalesRef.key;const currentTime=(new Date).getTime();const saleDate=new Date(currentTime).toLocaleDateString();const saleTime=new Date(currentTime).toLocaleTimeString();set(patientSalesRef,{saleId:saleId,quantity:piecesSold,date:saleDate,time:saleTime}).then(()=>{console.log("Sale added successfully with ID:",saleId);const successMessage=document.getElementById("sellSuccessMessage");successMessage.textContent=`Sale recorded with  id ${saleId} successfully on ${saleDate} at ${saleTime}`;successMessage.style.display="block";setTimeout(()=>{successMessage.style.display="none"},5e3)})["catch"](error=>{console.error("Failed to add sale data:",error);alert("Error adding sale. Please try again.")});const sellPopupOverlay=document.getElementById("sellPopupOverlay2");sellPopupOverlay.style.display="none"}else{alert("Please enter a valid number of pieces to sell.")}}const addRecordForm=document.getElementById("addRecordForm");let currentPatientName="";function showMessage(message){const messageElement=document.getElementById("message");messageElement.textContent=message;messageElement.style.display="block";setTimeout(()=>{messageElement.style.display="none"},3e3)}addRecordForm.addEventListener("submit",function(e){e.preventDefault();const patientName=currentPatientName;const testsTaken=document.getElementById("testsTaken").value;const resultsObtained=document.getElementById("resultsObtained").value;const medicationTaken=document.getElementById("medicationTaken").value;const additionalNotes=document.getElementById("additionalNotes").value;const recordData={testsTaken:testsTaken,resultsObtained:resultsObtained,medicationTaken:medicationTaken,additionalNotes:additionalNotes};const patientRef=ref(database,`medicine/${patientName}`);const newRecordRef=push(child(patientRef,"history"));set(newRecordRef,recordData).then(()=>{addRecordForm.reset();showMessage("Record added successfully!")})["catch"](error=>{console.error("Error adding record:",error);showMessage("Error adding record. Please try again.")})});function openPatientHistoryPopup(patient){const popupOverlay=document.getElementById("popupOverlay1");const popupClose=document.getElementById("popupClose1");const patientHistory=document.getElementById("patientHistory");patientHistory.innerHTML="";const patientHistoryContent=document.createElement("div");patientHistoryContent.innerHTML=`
      <p><strong>Name of Medicine:</strong> ${patient.name}</p>
      <p><strong>Date of Expiry:</strong> ${patient.dob}</p>
      <p><strong>Number of Pieces:</strong> ${patient.parents}</p>
      <p><strong>Date of Stock:</strong> ${patient.dos}</p>
      <p><strong>Medical History:</strong> ${patient.medicalHistory}</p>
    `;patientHistory.appendChild(patientHistoryContent);popupOverlay.style.visibility="visible";popupOverlay.style.opacity="1";addRecordPopupOverlay.style.visibility="hidden";addRecordPopupOverlay.style.opacity="0";popupClose.addEventListener("click",function(){popupOverlay.style.visibility="hidden";popupOverlay.style.opacity="0"});const patientHistoryElement=document.getElementById("patientHistory");const patientName=patient.name;const patientHistoryRef=ref(database,`medicine/${patientName}/history`);onValue(patientHistoryRef,snapshot=>{patientHistoryElement.innerHTML="";if(snapshot.exists()){snapshot.forEach(childSnapshot=>{const recordKey=childSnapshot.key;const record=childSnapshot.val();const recordElement=createRecordElement(recordKey,record);patientHistoryElement.appendChild(recordElement)})}else{const noRecordsElement=document.createElement("p");noRecordsElement.textContent="No Records Found";noRecordsElement.style.fontStyle="italic";patientHistoryElement.appendChild(noRecordsElement)}});function createRecordElement(recordKey,record){const recordElement=document.createElement("div");recordElement.classList.add("record");const recordKeyElement=document.createElement("h4");recordKeyElement.textContent="Record Key: "+recordKey;recordElement.appendChild(recordKeyElement);const testsTakenElement=document.createElement("p");testsTakenElement.textContent="Age Range: "+record.testsTaken;recordElement.appendChild(testsTakenElement);const resultsObtainedElement=document.createElement("p");resultsObtainedElement.textContent="Prescription: "+record.resultsObtained;recordElement.appendChild(resultsObtainedElement);const medicationTakenElement=document.createElement("p");medicationTakenElement.textContent="Works on (Treats): "+record.medicationTaken;recordElement.appendChild(medicationTakenElement);const additionalNotesElement=document.createElement("p");additionalNotesElement.textContent="Additional Notes: "+record.additionalNotes;recordElement.appendChild(additionalNotesElement);const deleteButton=document.createElement("button");deleteButton.classList.add("delete-button");const binIcon=document.createElement("i");binIcon.classList.add("fa","fa-trash");deleteButton.innerHTML="";deleteButton.appendChild(binIcon);deleteButton.innerHTML+=" Delete";deleteButton.addEventListener("click",()=>{deleteRecord(recordKey)});recordElement.appendChild(deleteButton);return recordElement}function deleteRecord(recordKey){const patientName=patient.name;const confirmation=confirm("Are you sure you want to delete this record?");if(confirmation){const password=prompt("Please enter your password to confirm the deletion:");if(password==="mm"){const recordRef=ref(database,`medicine/${patientName}/history/${recordKey}`);remove(recordRef).then(()=>{alert("Record deleted successfully!")})["catch"](error=>{console.error("Error deleting record:",error);alert("Error deleting record. Please try again.")})}else{alert("Wrong password. Deletion cancelled.")}}}}const addMedicationBtn=document.getElementById("addMedicationBtn");const addRecordPopupOverlay=document.getElementById("addRecordPopupOverlay");const addRecordPopupClose=document.getElementById("addRecordPopupClose");addMedicationBtn.addEventListener("click",()=>{addRecordPopupOverlay.style.visibility="visible";addRecordPopupOverlay.style.opacity="1"});addRecordPopupClose.addEventListener("click",()=>{addRecordPopupOverlay.style.visibility="hidden";addRecordPopupOverlay.style.opacity="0"});const loaderElement=document.getElementById("loader");const patientsRef=ref(database,"medicine");loaderElement.classList.remove("hidden");onValue(patientsRef,snapshot=>{const patientsData=snapshot.val();if(patientsData){patients=Object.values(patientsData);renderPatients(patients)}loaderElement.classList.add("hidden")});const uploadForm=document.getElementById("addPatientForm");uploadForm.addEventListener("submit",e=>{e.preventDefault();const nameInput=document.getElementById("name");const dobInput=document.getElementById("dob");const parentsInput=document.getElementById("parents");const database=getDatabase();const savePatientData=()=>{const name=nameInput.value;const dob=dobInput.value;const parents=parentsInput.value;const patientsRef=ref(database,"medicine");const newPatientRef=child(patientsRef,name);set(newPatientRef,{name:name,dob:dob,parents:parents}).then(()=>{nameInput.value="";dobInput.value="";parentsInput.value="";showMessage("Patient details uploaded successfully!")})["catch"](error=>{console.error("Error uploading patient details:",error);showMessage("Error uploading patient details. Please try again.")})};const showMessage=message=>{const messageElement=document.getElementById("message");messageElement.textContent=message;messageElement.style.display="block";setTimeout(()=>{messageElement.style.display="none"},3e3)}});const onlineStatusElement=document.getElementById("onlineStatus");const overlayElement=document.getElementById("overlay");function updateOnlineStatus(){if(navigator.onLine){onlineStatusElement.innerHTML='<i class="fa fa-wifi"></i>';onlineStatusElement.classList.remove("offline");onlineStatusElement.classList.add("online");overlayElement.style.display="none"}else{onlineStatusElement.innerHTML='<i class="fa fa-exclamation-triangle"></i>';onlineStatusElement.classList.remove("online");onlineStatusElement.classList.add("offline");overlayElement.style.display="block"}}updateOnlineStatus();window.addEventListener("online",updateOnlineStatus);window.addEventListener("offline",updateOnlineStatus);window.addEventListener("load",function(){const splashScreen=document.getElementById("splashScreen");splashScreen.style.opacity="0";setTimeout(function(){splashScreen.style.display="none"},500)});
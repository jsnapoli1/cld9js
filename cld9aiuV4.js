const buyButton = document.getElementById("buy_button1");
const convoDiv = document.getElementById("convoDiv");
const convoDivOuter = document.getElementById("convoDivOuter");
const userInput = document.getElementById('User-input');
const loadingDiv = document.getElementById('loadingDiv');
const AiMessageDiv = document.getElementById('AiMessageDiv');
var messageContainer = document.querySelector('.f-updated-msg');
var IngredientItemDiv = document.getElementById('ingredientContainer');
var formulationBlockDiv = document.getElementById('formulationBlockDiv');
var formulationHeaderDiv = document.getElementById('formulationHeaderDiv');
var IngredientDetailDiv = document.getElementById('IngredientDetailDiv');
var formulationENDiv = document.getElementById('formulationENDiv');
var IngredientEffectDiv = document.getElementById('description');
var NextStepDiv = document.getElementById('NextStepDiv');
var UserIngredientDiv = document.getElementById('UserIngredientDiv');
var descriptionWrapper = document.getElementById('descriptionWrapper');
var descriptionText = document.getElementById('description');
var VewFomulationLink = document.getElementById('VewFomulationLink');
var FullNameDiv = document.getElementById('FullNameDiv');
var Masterdiv_IngredientToAdd = document.getElementById('Masterdiv_IngredientToAdd');
var Masterdiv_IngredientAdded = document.getElementById('Masterdiv_IngredientAdded');
var hd2=[];
var UpdatingFormulation=false;
let idIndex=1;
var userName='';
var age;
var sex;
var weight;

let formulations = [];

var IngreadientMsaterData;

document.addEventListener("DOMContentLoaded", async function() {
  try {
    
    GetIngreadientsFromDb();

    // FullNameDiv.innerHTML = userName; This should go in after the div where we ask for age sex and weight

    initializeEventListeners();

    if (userId == "") {

      await makeUser();

    }

    HideElement(Masterdiv_IngredientToAdd);
    HideElement(Masterdiv_IngredientAdded);
    HideElement(document.getElementById('div_bt_innext'));

    document.getElementById('div_chooseI').addEventListener('click', () => LoadIngreadientsInDiv());


    // if(FullNameDiv!=null)
    // {
    //   UserFullName = await checkUserId_GetUserName();
    //   FullNameDiv.innerHTML=UserFullName.name;

    //   initializeEventListeners();
  
    //   HideElement(Masterdiv_IngredientToAdd);
    //   HideElement(Masterdiv_IngredientAdded);
    //   HideElement(document.getElementById('div_bt_innext'));       
      
    //   document.getElementById('div_chooseI').addEventListener('click', () => LoadIngreadientsInDiv());      
    // }

  } catch (error) {
    console.error('Error during initialization:', error);
  }
});

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

function initializeEventListeners() {
  const sendUserMessageButton = document.querySelector('.send-user-message');
  sendUserMessageButton.addEventListener('click', () => handleUserMessage());
  userInput.addEventListener('keydown', (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault(); 
      handleUserMessage();
    }
  });

  const brs = ['br1', 'br2', 'br3', 'br4', 'br5', 'br6', 'br7', 'br8'];
  brs.forEach((brId) => {
    const br = document.getElementById(brId);
    if (br) {
      br.addEventListener('click', () => handleUserMessage(br.textContent));
    }
  });
}

async function handleUserMessage(userText = userInput.value.trim()) {
  if (!userText) return;
  const introDiv = document.getElementById('IntroDiv');
  if (introDiv) {
    introDiv.style.display = 'none';
  }
 
  userInput.value = "";
  userInput.disabled = true;  
  ShowElement(loadingDiv);  
  HideElement(convoDivOuter);
  try {
    const response = await callApi(userText);    
    await displayAiMessage(response.cld9ai);
  } catch (error) {
    console.error('Error during API call:', error);
  } finally {
    
    userInput.disabled = false;
    userInput.focus();
  }
}

async function callApi(userText) {
  const data = `user_input=${encodeURIComponent(userText)}&user_id=${encodeURIComponent(userId)}`;
  const response = await fetch(`https://app.cld-nine.com/cld9ai`, {
    method: 'POST', 
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data
  });
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  const responseData = await response.json();
  if (responseData.error) throw new Error(responseData.error);
  return responseData;
}

async function GetIngreadientsFromDb() {
  const profileResponse = await fetch('https://app.cld-nine.com/get_ingredeients', {method: 'GET'});
  if (!profileResponse.ok) throw new Error(`HTTP error! Status: ${profileResponse.status}`);
  IngreadientMsaterData = await profileResponse.json();
}

async function callSectionApi() {
  const data = `user_id=${encodeURIComponent(userId)}`;
  const response = await fetch(`https://app.cld-nine.com/formulainf`, {
    method: 'POST', 
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data
  });
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  const responseData = await response.json();
  if (responseData.error) throw new Error(responseData.error);
  return responseData;
}

async function callExplanationApi() {
  const data = `user_id=${encodeURIComponent(userId)}`;
  const response = await fetch(`https://app.cld-nine.com/explanation`, {
    method: 'POST', 
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data
  });
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  const responseData = await response.json();
  if (responseData.error) throw new Error(responseData.error);
  return responseData;
}

async function checkUserId_GetUserName()
{
  const data = `user_id=${encodeURIComponent(userId)}`;
  const response = await fetch(`https://app.cld-nine.com/get_name`, {
    method: 'POST', 
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data
  });
  if (!response.ok) 
  { 
    logoutUser();
  }
  const responseData = await response.json();
  if (responseData.error)
  { 
    logoutUser();
  }
  return responseData;
}

function searchStringInArray (str, strArray) {
  for (var j=0; j<strArray.length; j++) {
      if (strArray[j].match(str)) return j;
  }
  return -1;
}

async function displayAiMessage(message) {
           
      let fMsg = message.replace(/\n/g, '<br>');
           
      if (message.includes("FORMULATION:")) 
      {
            ShowElement(formulationBlockDiv);
            AiMessageDiv.innerHTML = "";
            AiMessageDiv.hidden = true;

            const formula = extractFormulation(message);
            HideElement(UserIngredientDiv);
            HideElement(descriptionWrapper);     
            let nodesToRemove=[];
            
            if(UpdatingFormulation)
            {
              formulationHeaderDiv.innerHTML = "Your updated personalized formulation.";
              fMsg = fMsg.split('FORMULATION:')[1] || "";
              fMsg = fMsg.replace(/([\w\s\-\(\)%]+?)\s*--\s*([\d,]+(?:\s*(?:mg|mcg|IU)))/g, '');
              fMsg = fMsg.replace(/^(<br>)+/, '');
              fMsg = '<br>' + fMsg;
              HideElement(formulationENDiv);             
              IngredientInfoOuterDiv.innerHTML = fMsg;             
            }

            formula.forEach(item => {
              
                const fDiv = UserIngredientDiv.cloneNode(true); 
                fDiv.id= idIndex;
                idIndex++;               
                ShowElement(fDiv);
                const ingredientTextDiv = fDiv.querySelector('#ingredientName');
                ShowElement(ingredientTextDiv);

                const fromDB = IngreadientMsaterData.filter(item2 => item2.ingredient === item.ingredient);
                fDiv.style.display = 'fluid'
                fDiv.style.backgroundImage = `url(${fromDB!=null?fromDB[0].image_url:''})`;
                fDiv.style.backgroundSize = 'cover';
                fDiv.style.backgroundPosition = 'center';
                fDiv.style.borderRadius = '20px';

                fDiv.addEventListener('click', function () {

                    fDiv.style.backgroundColor = 'black';
                    ShowElement(descriptionWrapper);
                    if (descriptionWrapper) {
                        descriptionWrapper.style.display = 'fluid';
                        // Update description text
                        const descIngredientName = descriptionWrapper.querySelector('#descriptionIngredientName');
                        if (descIngredientName) {
                            descIngredientName.textContent = item.ingredient;
                        }
                        const descDosage = descriptionWrapper.querySelector('#dosage');
                        if (descDosage) {
                            descDosage.textContent = item.dosage;
                        }
                        // Update background of descriptionWrapper
                        descriptionWrapper.style.backgroundImage = `url(${fromDB!=null?fromDB[0].image_url:''})`;
                        descriptionWrapper.style.backgroundSize = 'cover'; // Optional: Cover the entire descriptionWrapper
                        descriptionWrapper.style.backgroundPosition = 'center'; // Optional: Center the background image
                    }
                });

                UpdatingFormulation=true;

                var deleteButton = fDiv.querySelector('#deleteButton');
                deleteButton.addEventListener('click', function(event) {
                    IngredientItemDiv.removeChild(fDiv);
                });
                
                ShowElement(deleteButton);

                ingredientTextDiv.innerHTML = item.ingredient;
                IngredientItemDiv.appendChild(fDiv);    

              });
            
            // formula.forEach(item => {
              
            //     const clone = UserIngredientDiv.cloneNode(true); 
            //     clone.id = idIndex;
            //     idIndex++;
            //     clone.style.display = 'fluid'

            //     const ingredientNameDiv = clone.querySelector('#ingredientName');
            //     if (ingredientNameDiv) {
            //         ingredientNameDiv.textContent = item.ingredient;
            //     }
            //     const fromDB = IngreadientMsaterData.filter(item2 => item2.ingredient === item.ingredient);
            //     clone.style.display = 'fluid'
            //     clone.style.backgroundImage = `url(${fromDB!=null?fromDB[0].image_url:''})`;
            //     clone.style.backgroundSize = 'cover';
            //     clone.style.backgroundPosition = 'center';

            //     const deleteButton = clone.querySelector('#deleteButton');
            //     if (deleteButton) {
            //     deleteButton.addEventListener('click', function () {
            //         // Remove the cloned div from the DOM
            //         container.removeChild(clone);
            //     });
            //     }

            //     clone.addEventListener('click', function () {

            //         ShowElement(descriptionWrapper);
            //         if (descriptionWrapper) {
            //             descriptionWrapper.style.display = 'block';
            //             // Update description text
            //             const descIngredientName = descriptionWrapper.querySelector('#descriptionIngredientName');
            //             if (descIngredientName) {
            //                 descIngredientName.textContent = item.ingredient;
            //             }
            //             const descDosage = descriptionWrapper.querySelector('#dosage');
            //             if (descDosage) {
            //                 descDosage.textContent = item.dosage;
            //             }
            //             // Update background of descriptionWrapper
            //             descriptionWrapper.style.backgroundImage = `url(${fromDB!=null?fromDB[0].image_url:''})`;
            //             descriptionWrapper.style.backgroundSize = 'cover'; // Optional: Cover the entire descriptionWrapper
            //             descriptionWrapper.style.backgroundPosition = 'center'; // Optional: Center the background image
            //             }
            //       });

            //     console.log(clone)

            //     container.appendChild(clone);

            // });
             
            LoadformulainInfo()
            LoadExplanation();

            showFormulationWithFadeIn();
            VewFomulationLink.addEventListener('click', function(event) {
              showFormulationWithFadeIn();             
            });   
                        
      } else {
              HideElement(formulationBlockDiv);
              ShowElement(convoDivOuter); 
              HideElement(loadingDiv);
              AiMessageDiv.innerHTML = "";
              await typeWriter(fMsg, AiMessageDiv);              
      }
}


async function LoadformulainInfo() {
  const data = `user_id=${encodeURIComponent(userId)}`;
  await fetch("https://app.cld-nine.com/formulainf", {
    method: 'POST', 
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      console.error("Error:", data.error);
      return;
    }   
    var message = data.cld9ai;
    let hds = message.split("#");
    const hd1 = hds[1].replace("Effects and Instructions:\n", "").replace(/\n/g, "<br>");
    IngredientEffectDiv.innerHTML = hd1;   
    ShowElement(IngredientEffectDiv); 
  });
}



async function LoadExplanation() {

  const data = `user_id=${encodeURIComponent(userId)}`;
 await fetch("https://app.cld-nine.com/explanation", {
    method: 'POST', 
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      console.error("Error:", data.error);
      return;
    }   
        
    var message = data.cld9ai;
    hds = message.split("#");
    hd2 = hds[1].replace("Your Ingredients:\n", "").split('\n\n');

    IngredientItemDiv.childNodes.forEach(element => {
     
      if(element.style.display != 'none')
      {

        element.addEventListener('click', function(event) {
          bindExplanationHover(event);              
        });      

      }
  });  

  })
  .catch(error => {
    console.error("Error fetching data from API:", error);
  });

}

function bindExplanationHover(event)
{
  const ingredientText = event.currentTarget.querySelector('#ingredientName').innerHTML;  
  let vals =  extractValues(ingredientText + "()");
  var matchingValues = hd2.filter(function(item) {
    return item.toLowerCase().includes(vals.beforeBrackets.toLowerCase()) || (vals.inBrackets!=""  &&  item.toLowerCase().includes(vals.inBrackets.toLowerCase()) );
  })  
  HideElement(formulationENDiv);
  let iText = matchingValues[0];
  descriptionText.innerHTML = iText.replace("- ","");       
   
}

function extractValues(str) {
  // Regular expression to match the values within brackets and before brackets
  var regex = /\((.*?)\)/;
  var match = regex.exec(str);
  if (match) {
      var valueInBrackets =(match[1] !== undefined) ? match[1].replace("as ", ""):null;
      var valueBeforeBrackets = str.substring(0, match.index).trim();
      return {
          inBrackets: valueInBrackets,
          beforeBrackets: valueBeforeBrackets
      };
  } else {
      // If no match found, return null or handle as needed
      return null;
  }
}


function showFormulationWithFadeIn()
{
  if (buyButton) {
    buyButton.style.display = 'block'
    buyButton.style.textAlign = 'center'
  } 

  AiMessageDiv.innerHTML = "";
  
  HideElement(loadingDiv);
  ShowElement(VewFomulationLink);
  HideElement(formulationBlockDiv);
  HideElement(formulationHeaderDiv);
  IngredientItemDiv.childNodes.forEach(elemet => {
    HideElement(elemet);
  });
  HideElement(BuyNowDiv);
  var timeDelay = 1600;
  ShowElement(convoDivOuter); 
  ShowElement(formulationBlockDiv);  
  ShowElementFadeIn(formulationHeaderDiv);
  ShowElementFadeIn(IngredientItemDiv);
  IngredientItemDiv.childNodes.forEach(elemet => {
    if(elemet.id !== "UserIngredientDiv")
    {
        ShowElementFadeIn(elemet,timeDelay);
        timeDelay+=100;
    }
  });
  ShowElementFadeIn(BuyNowDiv, timeDelay + 400);
}

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}


function typeWriter(text, container, index = 0) {
  return new Promise((resolve) => {
    function nextChar() {
      if (index < text.length) {
        let nxtCh = text[index];
        if (nxtCh === '<' && text.substr(index, 4) === '<br>') {
          container.innerHTML += '<br>';
          index += 4;
        } else if (nxtCh === '<' && text.substr(index, 8) === '<strong>') {
          index += 8;
        } else if (nxtCh === '<' && text.substr(index, 9) === '</strong>') {
          index += 9;
        } else {
          container.innerHTML += nxtCh;
          index++;
        }
        setTimeout(nextChar, 6);
      } else {
        resolve();
      }
    }
    nextChar();
  });
}

function extractFormulation(text) {
  const cleanText = text.replace(/<br\s*[\/]?>/gi, '\n');
  const formulationRegex = /([\w\s\-\(\)%]+?)\s*--\s*([\d,]+(?:\s*(?:mg|mcg|IU)))/g;
  const formulations = [];
  let match;
  while ((match = formulationRegex.exec(cleanText)) !== null) {
    formulations.push({ ingredient: match[1].trim(), dosage: match[2].trim() });
  }
  return formulations;
}

function HideElement(element)
{
  element.style.display = 'none';
}

function ShowElement(element)
{
  element.style.display = 'flex';  
}

function ShowElementInline(element)
{
  element.style.display = 'inline';  
}

function ShowElementInlineBlock(element)
{
  element.style.display = 'inline-block';  
}

function ShowElementFadeIn(element, delay = 1000)
{
  $(element).fadeIn(delay);  
}

function LoadIngreadientsInDiv()
{

    //var jsonData = GetIngreadients();
    var jsonData = IngreadientMsaterData;
    // Get the parent container where cloned divs will be appended
    const parentContainer = document.getElementById('div_ingrediant_parent'); // Replace 'parentContainer' with the actual ID of the parent container
    parentContainer.innerHTML = '';
    // Loop through each item in the JSON data
    jsonData.forEach(item => {
    // Clone the div with ID Masterdiv_IngredientToAdd
    const clonedDiv = document.getElementById('Masterdiv_IngredientToAdd').cloneNode(true);
    
    if (item.image_url !== null) {
        clonedDiv.style.backgroundImage = `url(${item.image_url})`;
        clonedDiv.style.backgroundSize = "cover";
        clonedDiv.style.backgroundPosition = "center";
        clonedDiv.style.backgroundRepeat = "no-repeat";
        clonedDiv.style.filter = "saturate(200%)";
      }
    // Populate the cloned div with data from the current item
    clonedDiv.querySelector('h1').textContent = item.ingredient;
    // Assuming the dosage range is stored as an array of two values
    const dosageRange = item.dosage.join('-') + ' ' + item.dosage_label;
    clonedDiv.querySelector('.text-block-138').textContent = dosageRange;    
    clonedDiv.style.cursor = 'pointer';
     // Add onclick event to the cloned div
    clonedDiv.onclick = handleIngredientClick;
    clonedDiv.dataset.id = item.id;
    // Append the cloned div to the parent container
    parentContainer.appendChild(clonedDiv);
    
    ShowElement(clonedDiv);
    });

    const chparentContainer = document.getElementById('parent_Masterdiv_IngredientAdded');
    chparentContainer.innerHTML='';
    clickedDivs = {};
    inCount = 0;
}

// Object to store the clicked divs and their dosage
var clickedDivs = {};
var inCount =0;
var curlDose='';
const maxIn = 7;
// Function to be called on click
function handleIngredientClick(event) {
    // Your logic here
   // Toggle visibility of the sub-element with class name addedingredient
  
  const parentContainer = document.getElementById('parent_Masterdiv_IngredientAdded');
  const ingredientId = event.currentTarget.dataset.id;     

    if (clickedDivs[event.currentTarget.dataset.id]) {
        // If it has been clicked before, increase the dosage and update the displayed text
        const existingIngredient = parentContainer.querySelector(`[data-id="${ingredientId}"]`); 
        const existingIngredientd = existingIngredient.querySelector('.text-block-138'); 
        const dosageElement = event.currentTarget.querySelector('.text-block-138');
        const currentDosage = existingIngredientd.textContent.split(' ')[0]; // Assuming dosage range is 'X-Y mg'
        const currentDosages = dosageElement.textContent.split(' ')[0].split('-') ; // Assuming dosage range is 'X-Y mg'
        const index = currentDosages.indexOf(currentDosage)+1;
        if(index< currentDosages.length && index>0)
        {    
            existingIngredientd.textContent = currentDosages[index] + ' ' + existingIngredientd.textContent.split(' ')[1];
            curlDose = existingIngredientd.textContent;
        }
        
    } else {


        if(inCount==maxIn)
        {
            parentContainer.classList.add('disabled');
            const elements = document.getElementsByClassName('TextBlock137')[0];
            
            const warningDiv = document.createElement('div');
            warningDiv.classList.add('warning-message');
            warningDiv.textContent = 'Max ingredient limit is reached. Please remove existing ingredient to add another one.';
            
            // Append the warning message div to the parent container      
            alert('Max ingredient limit is reached. Please remove existing ingredient to add another one.');
            return;
        }
        
        // Store the ID of the clicked div in the clickedDivs object
        clickedDivs[event.currentTarget.dataset.id] = true;

        const addedIngredient = event.currentTarget.querySelector('.addedingredient');
        addedIngredient.style.display = 'flex';

        // If it's the first click, clone the div and store it in the clickedDivs object
        const clonedIngredientAdded = document.getElementById('Masterdiv_IngredientAdded').cloneNode(true);

        // Get the data associated with the clicked Masterdiv_IngredientToAdd
        const label = event.currentTarget.querySelector('h1').textContent;
        const dosageRange = parseInt(event.currentTarget.querySelector('.text-block-138').textContent.split('-')[0]);
        const imageUrl = event.currentTarget.style.backgroundImage; // Retrieve background image URL
        clonedIngredientAdded.dataset.dosage = event.currentTarget.querySelector('.text-block-138').textContent;
        // Update the cloned div with relevant data
        clonedIngredientAdded.querySelector('h1').textContent = label;
        clonedIngredientAdded.querySelector('.text-block-138').textContent = dosageRange + ' ' + event.currentTarget.querySelector('.text-block-138').textContent.split(' ')[1];
        curlDose = dosageRange + ' ' + event.currentTarget.querySelector('.text-block-138').textContent.split(' ')[1];
        clonedIngredientAdded.style.backgroundImage = imageUrl; // Set background image URL        
        clonedIngredientAdded.style.backgroundSize = "cover";
        clonedIngredientAdded.style.backgroundPosition = "center";
        clonedIngredientAdded.style.backgroundRepeat = "no-repeat";
        clonedIngredientAdded.style.filter = "saturate(200%)";
        
        const btRemove = clonedIngredientAdded.querySelector('.remove-ingredient'); 
        btRemove.style.display = 'flex';  
        btRemove.addEventListener('click', () => handleRemoveIngredientClick(ingredientId));

        const btdecreasedosage = clonedIngredientAdded.querySelector('.decreasedosage'); 
        btdecreasedosage.addEventListener('click', () => handleDecreasedosageClick(ingredientId));

        const btIncreasedosage = clonedIngredientAdded.querySelector('.increasedosage'); 
        btIncreasedosage.addEventListener('click', () => handleIncreasedosageClick(ingredientId));

        // Display the cloned div
        clonedIngredientAdded.style.display = 'block';
        clonedIngredientAdded.style.cursor = 'pointer';
        clonedIngredientAdded.dataset.id = ingredientId;
        // Append the cloned div to the parent container
        // Replace 'parentContainer' with the actual ID of the parent container
        parentContainer.appendChild(clonedIngredientAdded);
        inCount++;      

        document.getElementById('div_bt_innext').onclick = InNext;
        document.getElementById('div_bt_innext').style.display = 'flex';  
        
        const markerparentContainer = document.getElementById('divmarkerparentContainer').querySelector('.div-block-439'); //div-block-439
        const clonedMarker = markerparentContainer.querySelector('.marker').cloneNode(true);
        clonedMarker.style.display = 'flex';  
        markerparentContainer.appendChild(clonedMarker);    
    }

  }

function handleDecreasedosageClick(ingredientId) {
    const parentContainer = document.getElementById('parent_Masterdiv_IngredientAdded');  
    const existingIngredient = parentContainer.querySelector(`[data-id="${ingredientId}"]`); 
    const existingIngredientd = existingIngredient.querySelector('.text-block-138'); 
    const currentDosage = existingIngredientd.textContent.split(' ')[0]; // Assuming dosage range is 'X-Y mg'
    const currentDosages =  existingIngredient.dataset.dosage.split(' ')[0].split('-') ; // Assuming dosage range is 'X-Y mg'
    const index = currentDosages.indexOf(currentDosage)-1;
    if(index>=0)
    {    
        existingIngredientd.textContent = currentDosages[index] + ' ' + existingIngredientd.textContent.split(' ')[1];
        curlDose = existingIngredientd.textContent;
    }   
}

function handleIncreasedosageClick(ingredientId) {
  const parentContainer = document.getElementById('parent_Masterdiv_IngredientAdded');  
  const existingIngredient = parentContainer.querySelector(`[data-id="${ingredientId}"]`); 
  const existingIngredientd = existingIngredient.querySelector('.text-block-138'); 
  const currentDosage = existingIngredientd.textContent.split(' ')[0]; // Assuming dosage range is 'X-Y mg'
  const currentDosages =  existingIngredient.dataset.dosage.split(' ')[0].split('-') ; // Assuming dosage range is 'X-Y mg'
  const index = currentDosages.indexOf(currentDosage)+1;
  if(index< currentDosages.length && index>0)
  {    
      existingIngredientd.textContent = currentDosages[index] + ' ' + existingIngredientd.textContent.split(' ')[1];
      curlDose = existingIngredientd.textContent;
  }   
}

  // Function to be called on click
function handleRemoveIngredientClick(ingredientId) {
    const parentContainer = document.getElementById('parent_Masterdiv_IngredientAdded');
    const childToRemove = parentContainer.querySelector(`[data-id="${ingredientId}"]`); 
    parentContainer.removeChild(childToRemove);

    const msParentContainer = document.getElementById('div_ingrediant_parent').querySelector(`[data-id="${ingredientId}"]`); 
    const addedIngredient = msParentContainer.querySelector('.addedingredient');
    addedIngredient.style.display = 'none';
    clickedDivs[parseInt(ingredientId)]=false;
    inCount--;


    if(inCount==0)
    {
        document.getElementById('div_bt_innext').style.display = 'none';  
    }

    msParentContainer.removeAttribute('disabled');  
    
    const markerparentContainer = document.getElementById('divmarkerparentContainer').querySelector('.div-block-439');
    const dvMarker = markerparentContainer.querySelector('.marker');
    markerparentContainer.removeChild(dvMarker);  
}

function InNext()
{
 
   // Get the Masterdiv_IngredientAdded element
    const masterdiv = document.getElementById('parent_Masterdiv_IngredientAdded');

    // Get all child divs inside Masterdiv_IngredientAdded
    const childDivs = masterdiv.querySelectorAll('.ingredient-custom-formula');

        
    let ingredients = [];
    // Loop through each child div
    childDivs.forEach((childDiv, index) => {
    // Extract ingredient name and dosage from the current child div

            const ingredientName = childDiv.querySelector('.heading-132').textContent.trim();
            const ingredientDosage = childDiv.querySelector('.text-block-138').textContent.trim();           
            
            ingredients.push({ ingredient: ingredientName, dosage: ingredientDosage });
    });

     
    var loading_Div = document.getElementById('loadingDiv');
    loading_Div.style.opacity = 1;  
    ShowElement(loading_Div); 	
        
    console.log(ingredients);

    // Append formulation data to FormData object
    let formData = new FormData();
    formData.append('formulation', JSON.stringify(ingredients));
    formData.append('user_id', userId);

    // Send the form data to the server
    fetch('https://app.cld-nine.com/buys', {
        method: 'POST',
        body: formData
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Server responded with an error');
        }
        return response.json();
        })
        .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        console.log(data);
        checkout_session_id = data.checkout_session_id;
        checkout_public_key = data.checkout_public_key;        
        div_Checkout =  document.getElementById('divCheckout');
        BindImage();        
        HideElement(loading_Div);
        div_Checkout.style.display = 'block';   
        div_Checkout.style.opacity = 1;     
        document.cookie = 'checkout_session_id='+data.checkout_session_id+'; expires=${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toUTCString()}; path=/';
            
        })
        .catch(error => {
        console.error('Error:', error);        
    });         
      
}

function UpdateFormulations()
{
 
   // Get the Masterdiv_IngredientAdded element
    const masterdiv = document.getElementById('parent_Masterdiv_IngredientAdded');

    // Get all child divs inside Masterdiv_IngredientAdded
    const childDivs = masterdiv.querySelectorAll('.ingredient-custom-formula');

        
    let ingredients = [];
    // Loop through each child div
    childDivs.forEach((childDiv, index) => {
        // Extract ingredient name and dosage from the current child div
        const ingredientName = childDiv.querySelector('.heading-132').textContent.trim();
        const ingredientDosage = childDiv.querySelector('.text-block-138').textContent.trim();           
        ingredients.push({ ingredient: ingredientName, dosage: ingredientDosage });
        
    });

     
    var loading_Div = document.getElementById('loadingDiv');
    loading_Div.style.opacity = 1;  
    ShowElement(loading_Div); 	
        
    console.log(ingredients);

    // Append formulation data to FormData object
    let formData = new FormData();
    formData.append('formulation', JSON.stringify(ingredients));
    formData.append('user_id', userId);
    formData.append('f_month', fMonth);

    // Send the form data to the server
    fetch('https://app.cld-nine.com/update/formulationV2', {
        method: 'POST',
        body: formData
        })
        .then(response => {
          if (!response.ok) {
            console.error('Server responded with an error');
          }
          fetchProfileData();
          HideElement(loading_Div);
        
        })
        .then(data => {
          if (data.error) {
            console.error('Error:', error); 
          }
          console.log(data);       
          HideElement(loading_Div);    
        })
        .catch(error => {
          console.error('Error:', error); 
          HideElement(loading_Div);       
    });
}

async function makeUser() {
    const data = {
    'name': "temp",
    'email': user_email = generateUUID(),
    'referral': null,
    'age': null,
    'sex': null,
    'weight': null,
    };

    try {
        const response = await fetch('https://app.cld-nine.com/signupv2', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        if (response.ok) {
            console.log("Signup successful");
            console.log(userId);
            // You can redirect the user or update the UI accordingly
            const user_id = responseData.user_id;
            document.cookie = `user_id=${user_id}; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
            userId = user_id;
        } else {
            console.error("Signup failed:", responseData.error);
            // Handle the error in the UI
        }
    } catch (error) {
    console.error("Error fetching data from API:", error);
    }
  }

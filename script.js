

document.cookie = "SameSite=None"

//DESOLE POUR LE SPAGHETTI CODE

//========================================================================================================================
//==============================================LEFT-CONTAINER============================================================
//========================================================================================================================

var currentFeed = [
  'http://localhost:3000/proxy?url=http://feeds.bbci.co.uk/news/technology/rss.xml',
  'http://localhost:3000/proxy?url=https://www.theguardian.com/uk/technology/rss',
  'http://localhost:3000/proxy?url=https://www.lemonde.fr/international/rss_full.xml',
  'http://localhost:3000/proxy?url=https://www.reddit.com/r/news/.rss',
  'http://localhost:3000/proxy?url=https://www.bretagne.ars.sante.fr/rss.xml'
]
var ClickableList = []

var DES_LIMIT = 250

var OpenCategory = []

const category = [
  { 
    title: "Tous les flux", 
    children: [
      {title: "AllRSS", url: [
        'http://localhost:3000/proxy?url=http://feeds.bbci.co.uk/news/technology/rss.xml',
        'http://localhost:3000/proxy?url=https://www.theguardian.com/uk/technology/rss',
        'http://localhost:3000/proxy?url=https://www.lemonde.fr/international/rss_full.xml',
        'http://localhost:3000/proxy?url=https://www.reddit.com/r/news/.rss',
        'http://localhost:3000/proxy?url=https://www.bretagne.ars.sante.fr/rss.xml'
      ] }
    ], 
    Icon: "mdi mdi-check-all"
  },
  {
    title: "Flux Plexus", 
    children: [
      {title : "ARS Bretagne", url: ['http://localhost:3000/proxy?url=https://www.bretagne.ars.sante.fr/rss.xml']}
    ], 
    Icon: "mdi mdi-hospital-building"
  },
  {
    title: "autre", 
    children: [], 
    Icon: "mdi mdi-plus-box-multiple-outline"
  }
];


function chooseFlux(Strflux) {
  for (let i = category.length - 1; i >= 0; --i) {
    for (let j = category[i].children.length - 1; j >= 0; --j){
      if(Strflux == category[i].children[j].title){
        //CHOOSE FLUX
        displayItems(category[i].children[j].url, "")
        currentFeed = category[i].children[j].url
      }
    }
  }
}
function generateCategoryHTML(items, OpenedCategory) {

  const exist = OpenedCategory.includes(items.title)
  console.log(OpenedCategory, items.title)
  console.log(exist)

  const container = document.createElement("div");
  container.setAttribute("style", "width: 100%")

  const titlecontainer = document.createElement("div")
  titlecontainer.setAttribute("class", "category-info")
  titlecontainer.setAttribute("style", "display: flex; flex-direction: row;")
  
  const dropdownClick = document.createElement("span")
  if (!(exist)){
    dropdownClick.setAttribute("class", "dropIcon mdi mdi-triangle mdi-rotate-90")
  }else{
    dropdownClick.setAttribute("class", "dropIcon mdi mdi-triangle mdi-rotate-180")
  }
  const title = document.createElement("div");
  title.classList.add("title");
  title.style.display = "flex"
  title.style.flexDirection = "row"
  title.style.alignItems = "baseline"
  
  const text = document.createElement("h5")

  var Icon = document.createElement("span")
  Icon.setAttribute("class", `${items.Icon}`)
  Icon.setAttribute("style", `color: grey`)
  text.textContent = items.title

  titlecontainer.addEventListener("click", () => {
    const titleToFind = items.title

    // Find the item with the matching title
    const item = category.find(categoryItem => categoryItem.title === titleToFind);

    if (item) {
      // Extract the URLs from the children array
      const urls = item.children.reduce((acc, child) => acc.concat(child.url), []);
      
      if (!(urls==[])){
        displayItems(urls, "")
      }else{
        console.log("No Feeds To Display")
      }
    } else {
      console.log("Item not found.");
    }
  })

  const dropdown = document.createElement("div");
  dropdown.classList.add("dropdown");
  if (!(exist)){
    dropdown.setAttribute("style", "display: none;")
  }else{
    dropdown.setAttribute("style", "display: block; margin-left: 10%;")
  }
  if (items.title == "autre"){
    const childElement = document.createElement("div");
    childElement.classList.add("category-info");
    childElement.setAttribute("id", "TriggerAddFlux")
    childElement.style.backgroundColor = "#2389BF"
    const grandChildElement = document.createElement("h5")
    grandChildElement.textContent = "Ajouter un Flux";
    grandChildElement.style.color = "#EEEEEE"
    childElement.appendChild(grandChildElement)

    childElement.addEventListener("click", () => {
      const modal = document.getElementById("myModal")
      modal.style.display = "block";
      console.log("AddFlux Opened")
    })

    dropdown.appendChild(childElement);
  }

  if (!(items.children.length == 0)) {
    items.children.forEach(child => {
      const childElement = document.createElement("div");
      childElement.classList.add("category-info"); 
      const grandChildElement = document.createElement("h5")
      childElement.setAttribute("id", child.title)
      grandChildElement.textContent = child.title;
      childElement.appendChild(grandChildElement)
      dropdown.appendChild(childElement);

      ClickableList.push(childElement)

      childElement.addEventListener("click", () => {
        chooseFlux(grandChildElement.textContent)
        console.log(grandChildElement.textContent)
      })

      if (items.title == "autre"){
      const DeleteElement = document.createElement("span")
      DeleteElement.innerHTML = "&times;"
      
      DeleteElement.addEventListener("click", () => {
        localStorage.removeItem(child.title)

        const elementIndex = category[2].children.findIndex(chil => chil.title === child.title)

        if (elementIndex !== -1) {
          category[2].children.splice(elementIndex, 1);
        }

        createToast("success", `Element supprimer`)
        DisplayCategory(OpenCategory)
        displayItems(currentFeed, "")
      })
      childElement.appendChild(DeleteElement, grandChildElement)
      }
    });
  }else{
    if (!(items.title == "autre")){
    const childElement = document.createElement("div");
    childElement.classList.add("category-info"); 
    const grandChildElement = document.createElement("h5")
    grandChildElement.textContent = "no Flux Registered";
    childElement.appendChild(grandChildElement)
    dropdown.appendChild(childElement);
    }
  }


  title.appendChild(text)
  title.insertBefore(Icon, text)

  titlecontainer.appendChild(title)
  titlecontainer.appendChild(dropdownClick)

  container.appendChild(titlecontainer);
  container.appendChild(dropdown);

  if(items.title == "Tous les flux"){
    dropdownClick.style.display = "none"
    ClickableList.push(container)
    container.addEventListener("click", () => {
      chooseFlux("AllRSS")
    })
  }

  // Add event listener to toggle display of dropdown
  dropdownClick.addEventListener("click", () => {
    console.log(OpenCategory)
    if (dropdown.style.display === "none"){
      dropdown.setAttribute("style", "display: block; margin-left: 10%;")
      dropdownClick.classList.remove("mdi-rotate-90")
      dropdownClick.classList.add("mdi-rotate-180")
      dropdownClick.style.alignSelf = "end"
      OpenCategory.push(items.title)
    }else{
      dropdown.style.display = "none"
      dropdownClick.classList.remove("mdi-rotate-180")
      dropdownClick.classList.add("mdi-rotate-90")
      dropdownClick.style.removeProperty("align-self")

      index = OpenCategory.indexOf(items.title);
      OpenCategory.splice(index, 1);
    }
  });

  return container;
}

function DisplayCategory(OpenedCategory){
  const container = document.getElementById("cont")

  container.innerHTML = ""

  const itemCount = localStorage.length

  category[2].children = []

  for (let i = 0; i < itemCount; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    const item = {title: key, url: `http://localhost:3000/proxy?url=${value}`}

    const urlExists = category[0].children.some(child => child.url == item.url);

    if (!urlExists) {
      // URL doesn't exist, push it to category[0].children
      category[0].children[0].url.push(item.url);
    }

    // Verify if the item already exists in category[2].children
    const itemExists = category[2].children.some(child => child == item);

    if (!itemExists) {
      // Item doesn't exist, push it to category[2].children
      category[2].children.push({title: key, url: [`http://localhost:3000/proxy?url=${value}`]});
    }
  }

  category.forEach(item => {
    const DivElement = generateCategoryHTML(item, OpenedCategory)
    container.appendChild(DivElement)
  });
}


//========================================================================================================================
//===============================================MAIN-CONTAINER===========================================================
//========================================================================================================================

function removeTags(str) {
  if ((str===null) || (str===''))
      return false;
  else
      str = str.toString();
        
  // Regular expression to identify HTML tags in
  // the input string. Replacing the identified
  // HTML tag with a null string.
  return str.replace( /(<([^>]+)>)/ig, '');
}

function FilterList(items, condition) {
  // Search Condition
  const Newtab = []

  for (let i = items.length - 1; i >= 0; --i) {
    const title = items[i].getElementsByTagName('title')[0].textContent.toLowerCase()
    const description = items[i].getElementsByTagName('description')[0].textContent.toLowerCase()
    const date = items[i].getElementsByTagName('pubDate')[0].textContent.toLowerCase()
    const link = items[i].getElementsByTagName('link')[0].textContent.toLowerCase()

    if (!(title.search(condition) == -1 && description.search(condition) == -1 && date.search(condition) == -1 && link.search(condition) == -1)){
      Newtab.push(items[i])
    }
  }

  return Newtab.reverse();
}

function Convertdate(StringDate){

  function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
  }

  let Newdate = convertTZ(new Date(StringDate), "Europe/Paris")
  let current = new Date()

  let diff = current - Newdate

  const seconde = Math.floor(diff/1000)
  const minute = Math.floor(diff/60000)
  const heure = Math.floor(diff/3600000)
  const jour = Math.floor(diff/86400000)
  const mois = Math.floor(diff/2592000000)
  const anne = Math.floor(diff/31104000000)

  let res = ""

  if (seconde > 0){
    res = `il y a ${seconde} seconde`
    if(seconde > 1){res += "s"}
    if (minute > 0){
      res = `il y a ${minute} minute`
      if(minute > 1){res += "s"}
      if (heure > 0){
        res = `il y a ${heure} heure`
        if(heure > 1){res += "s"}
        if (jour > 0) {
          res = `il y a ${jour} jour`
          if(jour > 1){res += "s"}
          if (mois > 0){
            res = `il y a ${mois} mois`
            if (anne > 0){
              res = `il y a ${anne} an`
              if(anne > 1){res += "s"}
            }
          }
        }
      }
    }
  }
  return res;

}

function generateItemHTML(item) {
  // HANDLING THE VARIABLE 
  const title = item.getElementsByTagName('title')[0].textContent
  const description = item.getElementsByTagName('description')[0].textContent
  const date = item.getElementsByTagName('pubDate')[0].textContent
  const link = item.getElementsByTagName('link')[0].textContent

  const container = document.createElement("div");
  container.classList.add("item")

  const UpperCont = document.createElement("div");
  UpperCont.setAttribute("style", "flex: 4; display: flex; justify-content: space-between; align-items: start;")

  const ItemLabel = document.createElement("h4")
  ItemLabel.setAttribute("style", "margin-left:10px")
  ItemLabel.textContent = title

  const ExternalLink = document.createElement("a")
  ExternalLink.setAttribute("href", link)
  ExternalLink.setAttribute("style", "display:flex; flex-direction: row;  align-items: center; margin-left: 30px; text-decoration: none;")
  ExternalLink.setAttribute("target", "_blank")

  const ExternalLinkLabel = document.createElement("h6")
  ExternalLinkLabel.setAttribute("style", "color:grey;")
  ExternalLinkLabel.textContent = link.replace(/.+\/\/|www.|\..+/g, '')

  const ExternalLinkIcon = document.createElement("img")
  ExternalLinkIcon.setAttribute("src", `https://www.google.com/s2/favicons?domain=${link}&sz=${180}`)
  ExternalLinkIcon.setAttribute("style", "border-radius: 10px;margin-left: 5px; border:black solid 1px;")
  ExternalLinkIcon.setAttribute("height", "16")
  ExternalLinkIcon.setAttribute("width", "auto")


  const Middlecont = document.createElement("div")
  Middlecont.setAttribute("style", "flex:6; margin:10px")
  Middlecont.style.display = "none"

  const MiddlecontText = document.createElement("p")
  MiddlecontText.textContent = removeTags(description)

  const Lowercont = document.createElement("div")
  Lowercont.setAttribute("style", "flex: 4; display: grid; justify-items: center")

  const pubDate = document.createElement("h6")
  pubDate.setAttribute("style", "color: grey; margin: top 4px;")
  pubDate.textContent = Convertdate(String(date))

  const pubDateIcon = document.createElement("span")
  pubDateIcon.setAttribute("class", "mdi mdi-calendar-blank")

  const Tooglebutton = document.createElement("h2")
  Tooglebutton.style.display = "flex"
  Tooglebutton.style.justifySelf = "center"

  const TooglebuttonIcon = document.createElement("span")
  Tooglebutton.setAttribute("class", "mdi mdi-arrow-up-bold-box-outline mdi-rotate-180")
  Tooglebutton.setAttribute("style", "justify-self: center; color: #2389BF; cursor: pointer")

  //ASSEMBLING THE DIV
  ExternalLink.appendChild(ExternalLinkIcon)
  ExternalLink.insertBefore(ExternalLinkLabel, ExternalLinkIcon)
  UpperCont.appendChild(ItemLabel)
  UpperCont.appendChild(ExternalLink)

  Middlecont.appendChild(MiddlecontText)

  pubDate.appendChild(pubDateIcon)
  Tooglebutton.appendChild(TooglebuttonIcon)
  Lowercont.appendChild(Tooglebutton)
  Lowercont.appendChild(pubDate)

  container.appendChild(UpperCont)
  container.appendChild(Middlecont)
  container.appendChild(Lowercont)

  Tooglebutton.addEventListener("click", () => {
    if (Middlecont.style.display == "none"){
      Tooglebutton.classList.remove("mdi-rotate-180")
      $(Middlecont).slideToggle()
    }else{
      Tooglebutton.classList.add("mdi-rotate-180")
      $(Middlecont).slideToggle()
    }
  })

  Tooglebutton.addEventListener("mouseover", () => {
    if (Tooglebutton.classList.contains("mdi-arrow-up-bold-box-outline")){
      Tooglebutton.classList.remove("mdi-arrow-up-bold-box-outline")
      Tooglebutton.classList.add("mdi-arrow-up-bold-box")
    }
  })

  Tooglebutton.addEventListener("mouseleave", () => {
    if (!(Tooglebutton.classList.contains("mdi-arrow-up-bold-box-outline"))){
      Tooglebutton.classList.remove("mdi-arrow-up-bold-box")
      Tooglebutton.classList.add("mdi-arrow-up-bold-box-outline")
    }
  })

  return container;
}

const main_cont = document.getElementsByClassName("items-container")

const col1 = document.getElementById("col1")
const col2 = document.getElementById("col2")

function GetItems(source) {
  return fetch(source)
    .then((res) => res.text())
    .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
    .then((data) => {
      const items = data.getElementsByTagName('item');
      return items;
    });
}

function displayItems(sources, condition) {
  currentFeed = sources
  console.log('search :', condition)
  let items = [];

  // Use Promise.all to wait for all GetItems promises to resolve
  Promise.all(sources.map((source) => GetItems(source)))
    .then((results) => {
      results.forEach((res) => items.push(...Array.from(res)));

      // EMPTY THE MAIN CONTAINER TO AVOID DUPLICATES
      col1.innerHTML = '';
      col2.innerHTML = '';

      // Sort items by date
      items.sort((a, b) => {
        const dateA = new Date(a.getElementsByTagName('pubDate')[0].textContent);
        const dateB = new Date(b.getElementsByTagName('pubDate')[0].textContent);
        return dateB - dateA; // Sort in descending order (latest date first)
      });

      items = FilterList(items, condition);
      console.log('Number of items:', items.length);

      for (let i = 0; i < items.length; i++) {
        const DivElement = generateItemHTML(items[i]); // Generate HTML element to display the items
        if (i % 2 === 0) {
          col1.appendChild(DivElement);
        } else {
          col2.appendChild(DivElement);
        }
      }
    });
}

DisplayCategory(OpenCategory)
displayItems(currentFeed, "")

//========================================================================================================================
//=================================================SEARCH-BAR=============================================================
//========================================================================================================================
let myInput = document.getElementById("searchinput");

//on search, start the filter
myInput.addEventListener('input', (e) => {
    displayItems(currentFeed, e.target.value.trim().toLowerCase())
});

//========================================================================================================================
//==================================================ADD-FEED==============================================================
//========================================================================================================================

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("TriggerAddFlux");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.addEventListener("click", () => {
  modal.style.display = "none";
})

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
})

const button = document.getElementById("mbtn")

button.addEventListener("click", () => {
  const untitre = document.getElementById("titleInput").value
  const unUrl = document.getElementById("urlInput").value

  const item = {title: untitre, url: [`http://localhost:3000/proxy?url=${unUrl}`]}

  localStorage.setItem(untitre, unUrl)
  DisplayCategory(OpenCategory)
  displayItems(currentFeed, "")

  document.getElementById("titleInput").value = ""
  document.getElementById("urlInput").value = ""

  createToast("success", `Element ajouté`)
  modal.style.display = "none"

})

//NOTIFICATION SYSTEM
const notifications = document.querySelector(".notifications")

const toastDetails = {
    timer: 2000,
    success: {
        icon: 'fa-circle-check',
    },
    error: {
        icon: 'fa-circle-xmark',
    },
    warning: {
        icon: 'fa-triangle-exclamation',
    },
    info: {
        icon: 'fa-circle-info',
    }
}

const removeToast = (toast) => {
    toast.classList.add("hide");
    if(toast.timeoutId) clearTimeout(toast.timeoutId); // Clearing the timeout for the toast
    setTimeout(() => toast.remove(), 500); // Removing the toast after 500ms
}

const createToast = (id, text) => {
    // Getting the icon and text for the toast based on the id passed
    const { icon } = toastDetails[id];
    const toast = document.createElement("li"); // Creating a new 'li' element for the toast
    toast.className = `toast ${id}`; // Setting the classes for the toast
    // Setting the inner HTML for the toast
    toast.innerHTML = `<div class="column">
                         <i class="fa-solid ${icon}"></i>
                         <span>${text}</span>
                      </div>
                      <i class="fa-solid fa-xmark" onclick="removeToast(this.parentElement)"></i>`;
    notifications.appendChild(toast); // Append the toast to the notification ul
    // Setting a timeout to remove the toast after the specified duration
    toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
}

let bigData = null;
// место для создания глобальных переменных (здесь, например, будет храниться переменная со всеми данными с бекенда)
// глобальная переменная нужна для того, чтобы доступ к ней был из любой функции (читать про глобальную область видимости)


async function getData() {
  const url = 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';
  const response = await fetch(url);
  const info = await response.json();
  bigData = info;
 };
 
function renderTable(currentBigData, table) {
  const allTr = currentBigData.map(function (bigDataItem) {
    const headrsList = Object.keys(bigDataItem).filter(function (headersListItem) {
      return headersListItem !== 'description' && headersListItem !== 'adress';
    });
    const allTd = headrsList.map(function (headersListItem) {
      const tdItem = document.createElement("td")
      tdItem.innerHTML = bigDataItem[headersListItem];
      tdItem.classList.add('personal-table__cell');
      return tdItem;
    });
    const tr = document.createElement("tr");
    tr.addEventListener('click', openModalInfo);
    allTd.forEach(function (tdItem) {
      tr.append(tdItem)
    });
    const root = document.getElementById('root');
    root.append(table);
    tr.classList.add('personal-table__row');
    return tr;
  });
    paginat(allTr, table)
};

function paginat(allTr, table) {
  const pagintaionContainer = document.querySelector('#pagination');
  const notesOnPage = 10;
  const countOFItems = Math.ceil(allTr.length / notesOnPage);
  const paginationBlock = [];
  Array.from(pagintaionContainer.children).forEach(function (paginationItem) {
    paginationItem.remove();
  });
  for (let i = 1; i <= countOFItems; i++) {
    const li = document.createElement('li');
    li.innerHTML = i;
    pagintaionContainer.appendChild(li);
    paginationBlock.push(li);
  };
  let active;
  for (let item of paginationBlock) {
    item.addEventListener('click', function() {
      if (active) {
        active.classList.remove('active');
      };
    active = this;
    this.classList.add('active');
    const pageNum = +this.innerHTML;
    const start = (pageNum - 1) * notesOnPage;
    const end = start + notesOnPage;
    const notes = allTr.slice(start, end)
    const trElements = table.querySelectorAll('.personal-table__row')
    for (let i = 0; i < trElements.length; i++) {
      trElements[i].remove()
    };
    for (let note of notes) {
      table.appendChild(note);
    };
  });
    };
  allTr.forEach(function (tr, i) {
    if ( i < notesOnPage) {
    table.append(tr);
    };
  });
};



function openModalInfo(e) {
  let clickedId = e.currentTarget.children[0].innerHTML;
  clickedId = Number(clickedId);
  const modalData = bigData.find(function(item) {
    return item.id === clickedId;
  });
  const modalContainer = document.getElementsByClassName('modal__data')[0]; 
  modalContainer.style.display = 'block';
  const adressLine = document.getElementsByClassName('modal__data_adress')[0];
  const descriptionLine = document.getElementsByClassName('modal__data_description')[0];
  Object.keys(modalData.adress).map((key) => {
    const adressBlock = modalData.adress[key];
    const adressInfo = document.createElement('p');
    adressInfo.innerHTML = adressBlock;
    adressLine.append(adressInfo);
  });
  const adressElem = adressLine.children;
  const descriptionElem = descriptionLine.children;
  const descriptionBlock = modalData.description;
  const descriptionInfo = document.createElement('p');
  descriptionInfo.innerHTML = descriptionBlock;
  descriptionLine.append(descriptionInfo);
  const close = document.getElementsByClassName('modal__data_close')[0];
  close.addEventListener('click', closeInfo);
  function closeInfo(e) {
    for (let i = 0; i < descriptionElem.length; i++){
      descriptionElem[i].remove()
    };
    Object.keys(adressElem).forEach(function () {
      for (let i = 0; i < adressElem.length; i++){
        adressElem[i].remove()
      };
    });
  modalContainer.style.display = 'none';
  fon.style.display = 'none';
  };
  const fon = document.getElementsByClassName('modal__data_display')[0];
  fon.style.display = 'block';
  fon.addEventListener('click', function () {
    for (let i = 0; i < descriptionElem.length; i++){
      descriptionElem[i].remove()
    };
  Object.keys(adressElem).forEach(function () {
    for (let i = 0; i < adressElem.length; i++){
      adressElem[i].remove()
    };
  });
  modalContainer.style.display = 'none';
  fon.style.display = 'none';
  })
}; 

function search(){
  const searchInfo = document.getElementsByClassName('search__input')[0];
  const searchTable = document.getElementsByClassName('personal-table')[0];

  const filteredBigData = bigData.filter(function (bigDataItem) {
    const searchFields = Object.keys(bigDataItem).filter(function (headersListItem){
      return headersListItem !== 'description' && headersListItem !== 'adress';
    });

     return searchFields.find(function(field){
      const cellData = String(bigDataItem[field])
        if (cellData.toLowerCase().includes(searchInfo.value.toLowerCase())){ 
          return true 
        } else {
          return false
        }
      });
  });

  if (searchTable) {
    searchTable.remove();
  };
  const table = personalTableHead();
  renderTable(filteredBigData, table);
};


function personalTableHead() {
  const headTr = bigData[1]
  const trHead = document.createElement("trhead");
  const table = document.createElement("table");

  const headerListTd = Object.keys(headTr).filter(function (headersListItem) {
      return headersListItem !== 'description' && headersListItem !== 'adress';
    });

  trHead.classList.add('personal-table__head');

  headerListTd.map(function (headersListItem) {
    const tdHead = document.createElement('td');
    tdHead.classList.add('personal-table__cell')
    tdHead.innerHTML = headersListItem;
    trHead.append(tdHead);
  });

  table.classList.add('personal-table');
  table.append(trHead);
  return table;
};

async function init () {
 await getData();
 const table = personalTableHead();
 renderTable(bigData, table);
 const searchInfo = document.getElementsByClassName('search__input')[0];
 searchInfo.addEventListener('input', search);
}

init(); 





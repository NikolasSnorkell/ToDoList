
//защита от незалогиненного пользователя
if (localStorage.getItem("login") == "") {
  document.location.href = "index.html";
}

var statusNetwork = "online";

// экран загрузки
window.addEventListener("load", function () {
  $("#loading").animate({ opacity: "0" }, 300);
  setTimeout(() => {
    $("#loading").css("visibility", "hidden");
  }, 100);
});

// если запрос на сервер не проходит то флаг статуса сети переходит в оффлайн режим
$(document).ajaxError(function (event, request, settings) {
  statusNetwork = "offline";
});

window.addEventListener("offline", () => (statusNetwork = "offline"));
window.addEventListener("online", () => (statusNetwork = "online"));



var todoitem_colors = {
  blue: " background: linear-gradient(145deg, #c2c2c2, #bdc8f6)",
  yellow: " background: linear-gradient(145deg, #c2c2c2, #f0f6bd)",
  red: " background: linear-gradient(145deg, #c2c2c2, #f6bdbd)",
  green: " background: linear-gradient(145deg, #c2c2c2, #bff6bd)",
  pink: "  background: linear-gradient(145deg, #c2c2c2, #f6bde0)",
}; // массив цветов для дел

let id_destination;

// блок библиотеки для Drag'n'Drop
new Sortable(document.querySelector("#main__todo_block"), {
  group: "todolist",
  swapThreshold: 1,
  sortable: true,
  // store: true,
  dropBubble: true,
  direction: "vertical",
  delay: 0.5,
  delayOnTouchOnly: true,
  handle: ".todoitem__handle",
  filter: ".sortable__block .done",
  forceFallback: true,
  fallbackClass: "sortable__block",
  dragClass: "sortable__block",
  animation: 300,
  easing: "cubic-bezier(1, 0, 0, 1)",
  onChoose: function (/**Event*/ evt) {
    $("#trash__field").css({ width: "50%" });
  },
  onMove: function (/**Event*/ evt) {
    // при переходе элемента в список удаления, включается анимация корзины
    if ($(evt.related).attr("id") == "trash_list") {
      $("#trash__field").addClass("overit");
    } else {
      $("#trash__field").removeClass("overit");
    }
    id_destination = $(evt.related).attr("id");
  },
  onUnchoose: function (/**Event*/ evt) {
    // если отпустили дело в списке удаления, то запускается процесс удаления и соответствующая анимация
    if (id_destination == "trash_list") {
      toggle1();
      async function toggle1() {
        await $("#trash_list_remover").animate({ top: "0%" }, 300);
        setTimeout(() => {
          delItem($(evt.item).children()[0]);
          $("#trash_list").html("");
        }, 300);

        await $("#trash_list_remover").animate({ top: "100%" }, 300);
        setTimeout(() => {
          $("#trash__field").css("width", "50px");
        }, 600);
      }

      $("#trash__field").removeClass("overit");
    }
  },
  onEnd: function (/**Event*/ evt) {
    if (id_destination != "trash_list") {
      if (evt.oldIndex != evt.newIndex) {
        if (evt.newIndex >= todosActive.length) {
          evt.newIndex = todosActive.length - 1;
        }
        if (evt.oldIndex >= todosActive.length) {
          evt.oldIndex = todosActive.length - 1;
        }
      }
      let tempArr = $(".todoitem ").not(".todoitem.done");
      for ([index, todo] of todosActive.entries()) {
        todo.body = tempArr[index].innerText;
        todo.color = tempArr[index].getAttribute("color");
  
      }

      saveToLocal();
    }
    $("#trash__field").css("width", "50px");
  },
});

// определение списка удаления
new Sortable(document.querySelector("#trash_list"), {
  group: "todolist",
  swapThreshold: 1,
});

let todosActive = [],
  todosDone = [];
let todosCurrentObj = [];

//--------------------------
// определяем текующий день, месяц и год
let date = new Date();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();

if (day < 10) day = `0${day}`;
if (month + 1 < 10) month = `0${month + 1}`;
else month += 1;

let system_date = `${year}-${month}-${day}`;
let todayDate = `${year}-${month}-${day}`;

function showDate(dateVar) {
  let tempDate = dateVar.split("-");
  if (tempDate[0].length > 2)
    dateVar = tempDate[2] + "-" + tempDate[1] + "-" + tempDate[0];
  else dateVar = tempDate.join("-");

  $("#main__todo_title h2").html(dateVar);
}

showDate(system_date);

// ----------------------------------
// проверка существует ли Json файл и если его нет то создаем

async function checkJson(dateVar) {
  let loc_mail = localStorage.getItem("login");
  $.post(
    "php/checkJson.php",
    { date: dateVar, loc_mail: loc_mail },
    (response) => {}
  );
}

// присваивание переменноф выходного из async функции промиса
let checkedJsonPromise = checkJson(system_date);

//--------------------------
// получаем данные о делах с сервера

function gettingJson(dateVar) {
  let loc_mail = localStorage.getItem("login");
  // запуск запроса получения json'а только после проверки его наличия
  checkedJsonPromise.then(
    $.post(
      "php/getJson.php",
      { aim: "get", date: dateVar, loc_mail: loc_mail },
      function (response) {
        response = JSON.parse(response);
        let localItem = JSON.parse(localStorage.getItem("currentDay"));

        if (dateVar == localItem.date && localItem!=null && +response[2] <= +localItem.timestamp  ) {
          if (localItem["arr1"] != null) todosActive = [...localItem["arr1"]];
          else todosActive = [];
          if (localItem["arr2"] != null) todosDone = [...localItem["arr2"]];
          else todosDone = [];
        } else if(dateVar != localItem.date || +response[2] > +localItem.timestamp){
          if (response[0] != null) todosActive = [...response[0]];
          else todosActive = [];
          if (response[1] != null) todosDone = [...response[1]];
          else todosDone = [];
        }

        if(localItem==null ){
          localItem = "";
        }

        // вызов функции показа всех дел
        showToDos([...todosActive, ...todosDone]);
      }
    )
  );
}

gettingJson(system_date);

//--------------------
// функция инициализации календаря

document.addEventListener("DOMContentLoaded", () => {
  const calendar = new VanillaCalendar("#calendar", {
    settings: {
      range: {
        min: "2023-01-01",
      },
    },
    actions: {
      clickDay(event, dates) {
        system_date = dates[0];
        if (statusNetwork == "online") {
          checkedJsonPromise = checkJson(system_date);
          gettingJson(system_date);
        } else if(system_date==todayDate && statusNetwork=="offline"){
          gettingJson(system_date);
        } else {
          alert("You are currently offline!");
        }
        showDate(system_date);
       
      },
    },
  });
  calendar.init();
});


$("#main__todo_title h2").click(function () {
  $("#calendar__block").toggleClass("shown");
});

//----------------------------
// функция показа всех имеющихся дел, как сделанных так и активных

function showToDos(arr) {
  $("#main__todo_block").html("");

  for ([index, todo] of arr.entries()) {
    let class__check,
      class__item,
      shift = 0, // 1,2 классы которые добавляются если дело сделано; 3 это сдвиг для переборки чтобы сделанные дела начинались с 0 для совпадения с элементами массива
      picker_choose_1 = "",
      picker_choose_2 = "",
      picker_choose_3 = "",
      picker_choose_4 = "",
      picker_choose_5 = "";
     

    // проверка статуса дела
    if (todo.status == "done") {
      class__check = "checked";
      class__item = "done";
      shift = todosActive.length; // сдвиг на длину массива активных дел
    } else {
      class__check = "";
      class__item = "";
      shift = 0;
    }

    switch (todo.color) {
      case "blue":
        picker_choose_1 = " choosen";
        break;
      case "yellow":
        picker_choose_2 = " choosen";
        break;
      case "red":
        picker_choose_3 = " choosen";
        break;
      case "green":
        picker_choose_4 = " choosen";
        break;
      case "pink":
        picker_choose_5 = " choosen";
        break;
    }

    $("#main__todo_block").html(
      $("#main__todo_block").html() +
        `<div class="sortable__block"  data-anijs="if: click, do: flipInY animated"><div class="todoitem ${class__item}" name="${
          index - shift
        }" style="${todoitem_colors[todo.color]}" color="${todo.color}">
        <img src="img/handle1.png" alt="handle" class="todoitem__handle">
        <div class="todoitem__check_block">
        <input type="checkbox" class="todoitem__check" id="todo${index}">
        <label for="todo${index}" class="todoitem__label ${class__check}" onclick="markItem(this)">${
          todo.body
        }</label>
        </div>
        <div class="todoitem__settings" onclick="settingsItem(this)"></div>
        <div class="setings_panel" id="panel-${class__item}${index - shift}">
        
        <span class="colorpick colorpick1 blue${picker_choose_1}" onclick="colorPick(this)" name="blue"></span>
        <span class="colorpick colorpick2 pink${picker_choose_5}" onclick="colorPick(this)" name="pink"></span> 
        <span class="colorpick colorpick3 green${picker_choose_4}" onclick="colorPick(this)" name="green"></span>
        <span class="colorpick colorpick4 red${picker_choose_3}" onclick="colorPick(this)" name="red"></span>
        <span class="colorpick colorpick5 yellow${picker_choose_2}" onclick="colorPick(this)" name="yellow"></span>
        
         <span class="edit_item" onclick="editItem(this)"></span>
         
         
        </div>
    </div></div>`
    );
  }
}


//----------------------------------

// слушатель для добавления нового дела в список
$("#addToDo").click(addItem);

//------------------------------------
// функция добавления дела

function addItem() {
  let toDoText = $("#typeToDo").val();
  if (toDoText != "" && toDoText != " ") {
    $("#typeToDo").val("");
    todosActive.push({
      body: `${toDoText}`,
      status: "active",
      color: "blue",
    });

    showToDos([...todosActive, ...todosDone]);
    saveToLocal();
  }
}
//------------------------------------
// функция удаления дела
function delItem(elem) {
  let parent_id = $(elem).attr("name"); // получение id из поля
  // name в todoitem
  if ($(elem).hasClass("done")) {
    // выбор нужного массива из которого нужно удалить элемент
    todosDone.splice(parent_id, 1);
  } else {
    todosActive.splice(parent_id, 1);
  }


  showToDos([...todosActive, ...todosDone]);
  saveToLocal();
}

//-----------------------------

// функция отметки сделанного дела
function markItem(elem) {
  let todoIndex = $(elem).parent("div").parent(".todoitem").attr("name");
  if ($(elem).hasClass("checked"))
    transferItem(todosDone, todoIndex, todosActive, "active");
  else transferItem(todosActive, todoIndex, todosDone, "done");
  // выше проверка при отметке дела, чтобы переместить его в верный массив

  $(elem).toggleClass("checked");
  $(elem).parent("div").parent(".todoitem").toggleClass("done");
}

//--------------------------------------
// функция для перемещения дела между активными и выполненными массивами
function transferItem(arr1, index1, arr2, status) {
  let tempBody = arr1[index1].body;
  let tempColor = arr1[index1].color;

  arr1.splice(index1, 1);
  arr2.push({
    body: `${tempBody}`,
    status: `${status}`,
    color: tempColor,
  });
  showToDos([...todosActive, ...todosDone]);
  saveToLocal();
}

// --------------------------------------
// отправка данных на сервер

function sendToDos() {
  let loc_mail = localStorage.getItem("login");
  let jsonString;
  let currentTime = new Date().getTime() / 1000;

  if (system_date == todayDate) {
    jsonString = JSON.parse(localStorage.getItem("currentDay"));
  } else {
    jsonString = {
      aim: "create/update",
      arr1: todosActive,
      arr2: todosDone,
      date: system_date,
      loc_mail: loc_mail,
      timestamp: currentTime,
    };
  }

  if (statusNetwork == "online") {
    $.post("php/updateJson.php", jsonString, function (response) {
     
    });

  } else {
    alert("Cannot sync! You are offline now.");
  }
}

//-------------
//функция сохранения дел в локальное хранилище

function saveToLocal() {
  if (system_date == todayDate) {
    let loc_mail = localStorage.getItem("login");
    let currentTime = new Date().getTime() / 1000;

    let jsonString = {
      aim: "create/update",
      arr1: todosActive,
      arr2: todosDone,
      date: system_date,
      loc_mail: loc_mail,
      timestamp: currentTime,
    };

    localStorage.setItem("currentDay", JSON.stringify(jsonString));
  } else {
    sendToDos();
  }
}

//--------------
//по клику отправка дел на сервер

$("#main__todo_sync").click(function () {
  sendToDos();
});

//--------------
// выход из аккаунта по нажатию кнопки
$("#main__todo_logout").click(function () {
  localStorage.setItem("login", "");
  localStorage.setItem("pass", "");

  document.location.href = "index.html";
});

//------------
// функция назначающая Enter для добавления дела

function enterToDo() {
  $(document).keyup(function (e) {
    if (e.key === "Enter") {
      addItem();
    }
  });
}

//------------------
// функция открытия панели настроек, swich здесь это элемент шестеренка

function settingsItem(swich) {
 press(swich);
  let id_parent = $(swich).parent().attr("name"); // забираем id родителя чтобы открыть панель у нужного блока
  let id_needed = "";
  let edit_item = $(swich).siblings("div").children(".edit_item");

  if ($(swich).parent().hasClass("done")) {
    // проверяем массив из которого нужно брать
    id_needed = `#panel-done${id_parent}`;
  } else {
    id_needed = `#panel-${id_parent}`;
  }

  if (!$(id_needed).hasClass("opened")) {
    $(id_needed).toggleClass("opened");

    let span_arr = $(id_needed).children("span.colorpick");

    $(id_needed).css({
      visibility: "visible",
      opacity: "1",
    });

    for (let i = 0; i < span_arr.length; i++) {
      setTimeout(() => {
        $(span_arr[i]).css({
          transform: "scale(1) translateY(0)",
        });
      }, (5 - i + "00") * 0.2);
    }
    $(edit_item[0]).css({
      transform: "scale(1) translateY(0px)",
    });
  } else {
    $(swich).css("transform", "rotate(0deg)");
    $(id_needed).toggleClass("opened");

    let span_arr = $(id_needed).children("span");

    $(edit_item[0]).css({
      transform: "scale(0) translateY(100px)",
    });

    for (let i = 0; i < span_arr.length; i++) {
      setTimeout(() => {
        $(span_arr[i]).css({
          transform: "scale(0) translateY(-50px)",
        });
      }, (i + "00") * 0.2);
    }

    setTimeout(() => {
      $(id_needed).css({
        opacity: "0",
      });
    }, 300);

    setTimeout(() => {
      $(id_needed).css({
        visibility: "hidden",
      });
    }, 500);
  }
}

//------------------------
// функция выбора цвета дела

function colorPick(elem) {
  let pick_parent = $(elem).parent().parent();
  let pick_parent_id = $(elem).parent().parent().attr("name");
  let pick_color = $(elem).attr("name");
  let tempArr = $(".todoitem ");
  // поиск верного id дела которому нужно заменить цвет
  for (let i = 0; i < tempArr.length; i++) {
    if (pick_parent[0].innerText == tempArr[i].innerText) {
      pick_parent_id = i;
    }
  }

  let todoitem_colors_items = $(elem).siblings(".colorpick");
  todoitem_colors_items.push(elem);

  for (pick of todoitem_colors_items) {
    $(pick).removeClass("choosen");
  }
  $(elem).addClass("choosen");

  $(pick_parent).attr("style", todoitem_colors[pick_color]);
  $(pick_parent).attr("color", pick_color);

  if ($(pick_parent).hasClass("done")) {
    todosDone[pick_parent_id].color = pick_color;
  } else {
    todosActive[pick_parent_id].color = pick_color;
  }
  saveToLocal();
}

// функция редактирования дела
//-----------------
let edit_parent, edit_parent_id;

function editItem(elem) {
  $("#edit__overlay").css("visibility", "visible");
  edit_parent = $(elem).parent("div").parent(".todoitem");

  let tempArr = $(".todoitem ").not(".todoitem.done");
  for (let i = 0; i < tempArr.length; i++) {
    if (edit_parent[0].innerText == tempArr[i].innerText) {
      edit_parent_id = i;
    }
  }

  let item_text = $(elem)
    .parent("div")
    .siblings(".todoitem__check_block")
    .children("label")
    .text();
  $("#edit__area").val(item_text);

}

// функция при нажатии кнопки edit в поле редактирования дела
function confirmEdit() {
  let edit_text = $("#edit__area").val();

  if (edit_text != "") {
    if ($(edit_parent).hasClass("done")) {
      todosDone[edit_parent_id].body = edit_text;
    } else {
      todosActive[edit_parent_id].body = edit_text;
    }
    saveToLocal();
    showToDos([...todosActive, ...todosDone]);

    $("#edit__overlay").css("visibility", "hidden");
  }
}
// закрытия поля редактирования при нажатии по пустому месту
$("#edit__blackplate").click(function () {
  $("#edit__overlay").css("visibility", "hidden");
});


// анимации нажатия для ряда кнопок
function press(flag){
  switch (flag){
    case 'sync': 
      $("#main__todo_sync").toggleClass("pressed");
      setTimeout(() => {
        $("#main__todo_sync").toggleClass("pressed");
      }, 800);
      break
    case 'logout':  
      $("#main__todo_logout").toggleClass("pressed");
      break
    case 'addToDo': 
      $("#addToDo").toggleClass("pressed");
      setTimeout(() => {
        $("#addToDo").toggleClass("pressed");
      }, 800);
      break
    case 'editToDo': 
      $("#edit__confirm").toggleClass("pressed");
      setTimeout(() => {
        $("#edit__confirm").toggleClass("pressed");
      }, 800);
      break
    case 'regToDo': 
      $("#reg__send").toggleClass("pressed");
      setTimeout(() => {
        $("#reg__send").toggleClass("pressed");
      }, 800);
      break
    case 'editToDo': 
      $("#login__send").toggleClass("pressed");
      setTimeout(() => {
        $("#login__send").toggleClass("pressed");
      }, 800);
      break
    default:
       $(flag).toggleClass("pressed");
    }
    
}

$("#main__todo_sync").on("touchstart",()=>press('sync'));

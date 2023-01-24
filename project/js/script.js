if (localStorage.getItem("login") == "") {
  document.location.href = "index.html";
}

window.addEventListener('load', function () {
  $('#loading').animate({'opacity':"0"},300);
  setTimeout(() => {
    
    $('#loading').css('visibility',"hidden");   
  }, 300);
 

})

var todoitem_colors = {
  blue: "background: rgb(169, 209, 247); border: 2px solid rgb(2, 113, 187)",
  yellow: "background: rgb(239,247,169); border: 2px solid rgb(175, 187, 2)",
  red: "background: rgb(247,169,169); border: 2px solid rgb(187, 24, 2)",
  green: "background: rgb(169,247,169); border: 2px solid rgb(24, 187, 2)",
  pink: "background: rgb(247, 169, 247); border: 2px solid rgb(201, 0, 201)",
}; // массив цветов и границ для дел

let id_destination;

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
  onSort: function (/**Event*/ evt) {
    var itemEl = evt.item; // dragged HTMLElement
    evt.to; // target list
    evt.from; // previous list
    evt.oldIndex; // element's old index within old parent
    evt.newIndex = 2; // element's new index within new parent
    evt.clone; // the clone element
    evt.pullMode; // when item is in another sortable: `"clone"` if cloning, `true` if moving

    //  console.log(evt.newIndex);
  },
  onUpdate: function (/**Event*/ evt) {
    sendToDos();
  },
  onChoose: function (/**Event*/ evt) {
    $("#trash__field").css({ width: "50%" });
  },
  onMove: function (/**Event*/ evt) {
    // console.log(evt.related);
    if ($(evt.related).attr("id") == "trash_list") {
      $("#trash__field").addClass("overit");
    } else {
      $("#trash__field").removeClass("overit");
    }
    id_destination = $(evt.related).attr("id");
  },
  onUnchoose: function (/**Event*/ evt) {
    if (id_destination == "trash_list") {

      toggle1();
     async function toggle1(){
       await $("#trash_list_remover").animate({"top":"0%"},300);
       setTimeout(() => {
       delItem($(evt.item).children()[0]);
        $("#trash_list").html("");
       }, 300);
       
       await $("#trash_list_remover").animate({"top":"100%"},300);
       setTimeout(() => {
       
        $("#trash__field").css("width", "50px");
        }, 600);
      
      }

      $("#trash__field").removeClass("overit");
    }
  
  
    
  },
  onEnd: function (/**Event*/ evt) {
  
    if(id_destination!="trash_list"){
    let tempText, tempColor;
    if (evt.oldIndex != evt.newIndex) {
      if (evt.newIndex >= todosActive.length) {
        evt.newIndex = todosActive.length - 1;
      }
      if (evt.oldIndex >= todosActive.length) {
        evt.oldIndex = todosActive.length - 1;
      }

      // console.log(evt.oldIndex + " " + evt.newIndex);
      tempText = todosActive[evt.newIndex].body;
      tempColor = todosActive[evt.newIndex].color;
      todosActive[evt.newIndex].body = todosActive[evt.oldIndex].body;
      todosActive[evt.newIndex].color = todosActive[evt.oldIndex].color;
      todosActive[evt.oldIndex].body = tempText;
      todosActive[evt.oldIndex].color = tempColor;
    }
      let tempArr = $(".todoitem ").not(".todoitem.done");
      for ([index, todo] of todosActive.entries()) {
        todo.body = tempArr[index].innerText;
      }
        
      sendToDos();
    }
    console.log(todosActive);
    // sendToDos();
    // console.log(evt.item.children[0].className)
    $("#trash__field").css("width", "50px");
  },
});

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
    (response) => console.log(response)
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
        // console.log(response);
        response = JSON.parse(response);
        if (response[0] != null) todosActive = [...response[0]];
        else todosActive = [];
        if (response[1] != null) todosDone = [...response[1]];
        else todosDone = [];

        // вызов функции показа всех дел
        showToDos([...todosActive, ...todosDone]);
        // console.log(todosActive);
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
        checkedJsonPromise = checkJson(system_date);
        gettingJson(system_date);
        showDate(system_date);
        //console.log(system_date);
      },
    },
  });
  calendar.init();
});

// $('#calendar__block').slideUp(0);

$("#main__todo_title h2").click(function () {
  $("#calendar__block").toggleClass("shown");
  // $('#calendar__block').slideToggle(1000);
});



//----------------------------
// функция показа всех имеющихся дел, как сделанных так и активных

function showToDos(arr) {
  $("#main__todo_block").html("");

  for ([index, todo] of arr.entries()) {
    let class__check,
      class__item,
      picker_choose_1 = "",
      picker_choose_2 = "",
      picker_choose_3 = "",
      picker_choose_4 = "",
      picker_choose_5 = "",
      shift = 0; // 1,2 классы которые добавляются если дело сделано; 3 это сдвиг для переборки чтобы сделанные дела начинались с 0 для совпадения с элементами массива

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
        }" style="${todoitem_colors[todo.color]}">
        <img src="img/handle.png" alt="handle" class="todoitem__handle">
        <div class="todoitem__check_block">
        <input type="checkbox" class="todoitem__check" id="todo${index}">
        <label for="todo${index}" class="todoitem__label ${class__check}" onclick="markItem(this)">${
          todo.body
        }</label>
        </div>
        <img src="img/settings.png" class="todoitem__settings" onclick="settingsItem(this)" alt="todosettings">
        <div class="setings_panel" id="panel-${class__item}${
          index - shift
        }">
        
        <span class="colorpick colorpick1 blue${picker_choose_1}" onclick="colorPick(this)" name="blue"></span>
        <span class="colorpick colorpick2 pink${picker_choose_5}" onclick="colorPick(this)" name="pink"></span> 
        <span class="colorpick colorpick3 green${picker_choose_4}" onclick="colorPick(this)" name="green"></span>
        <span class="colorpick colorpick4 red${picker_choose_3}" onclick="colorPick(this)" name="red"></span>
        <span class="colorpick colorpick5 yellow${picker_choose_2}" onclick="colorPick(this)" name="yellow"></span>
        
         
         
         
        </div>
    </div></div>`
    );
  }
}

// <img src="img/trash.png" class="todoitem__trash" onclick="delItem(this)" alt="trash">

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
    sendToDos();
  }
}
//------------------------------------
// функция удаления дела
function delItem(elem) {
  let parent_elem = $(elem).parent().parent();
  let parent_id = $(elem).attr("name"); // получение id из поля
  // name в todoitem
  if ($(elem).hasClass("done")) {
    // выбор нужного массива из которого нужно удалить элемент
    todosDone.splice(parent_id, 1);
  } else {
    todosActive.splice(parent_id, 1);
  }

  // let parent_elem = $(elem).parent().parent();
  // let parent_id = $(parent_elem).attr("name"); // получение id из поля
  // // name в todoitem
  // if ($(parent_elem).hasClass("done")) {
  //   // выбор нужного массива из которого нужно удалить элемент
  //   todosDone.splice(parent_id, 1);
  // } else {
  //   todosActive.splice(parent_id, 1);
  // }

  showToDos([...todosActive, ...todosDone]);
  // console.log(todosCurrentObj);
  sendToDos();
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
// функция для
function transferItem(arr1, index1, arr2, status) {
  let tempBody = arr1[index1].body;
  let tempColor = arr1[index1].color;

  arr1.splice(index1, 1);
  arr2.push({
    body: `${tempBody}`,
    status: `${status}`,
    color: tempColor,
  });
  // console.log(arr1);
  // console.log(arr2);
  showToDos([...todosActive, ...todosDone]);
  sendToDos();
}

// --------------------------------------
// отправка данных на сервер

function sendToDos() {
  let loc_mail = localStorage.getItem("login");

  let jsonString = {
    aim: "create/update",
    arr1: todosActive,
    arr2: todosDone,
    date: system_date,
    loc_mail: loc_mail,
  };

  $.post("php/updateJson.php", jsonString, function (response) {
    console.log(response);
  });
}

// sendToDos();

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
// функция открытия панели настроек

function settingsItem(swich) {
   let id_parent = $(swich).parent().attr("name"); // забираем id родителя чтобы открыть панель у нужного блока
  let id_needed = "";

  if ($(swich).parent().hasClass("done")) {
    // проверяем массив из которого нужно брать
    id_needed = `#panel-done${id_parent}`;
  } else {
    id_needed = `#panel-${id_parent}`;
  }

    if (!$(id_needed).hasClass("opened")) {
    $(swich).css("transform", "rotate(180deg)");
    $(id_needed).toggleClass("opened");
    
      let span_arr = $(id_needed).children("span");

      console.log(span_arr);
      $(id_needed).css({
        "visibility": "visible",
        "opacity":"1"
      });

      for(let i = 0; i<span_arr.length;i++){
        setTimeout(() => {
          $(span_arr[i]).css({
            "transform":"scale(1) translateY(0)"
          });
        }, (5-i)+"00");
       
      }

  } else {

    $(swich).css("transform", "rotate(0deg)");
    $(id_needed).toggleClass("opened");
    
    let span_arr = $(id_needed).children("span");
 

    for(let i = 0; i<span_arr.length;i++){
      setTimeout(() => {
        $(span_arr[i]).css({
          "transform":"scale(0) translateY(-50px)"
        });
      }, i+"00");
     
    }

    setTimeout(() => {
      $(id_needed).css({
        "opacity":"0"
      });

    }, 500);

    setTimeout(() => {
      $(id_needed).css({
        "visibility": "hidden"
      });

    }, 800);
   
  }

}

//------------------------
// функция выбора цвета дела

function colorPick(elem) {
  const pick_parent = $(elem).parent().parent();
  const pick_parent_id = $(elem).parent().parent().attr("name");
  const pick_color = $(elem).attr("name");
  let todoitem_colors_items = $(elem).siblings(".colorpick");
  todoitem_colors_items.push(elem);

  for (pick of todoitem_colors_items) {
    $(pick).removeClass("choosen");
  }
  console.log(pick_parent);
  $(elem).addClass("choosen");

  $(pick_parent).attr("style", todoitem_colors[pick_color]);

  if ($(pick_parent).hasClass("done")) {
    todosDone[pick_parent_id].color = pick_color;
  } else {
    todosActive[pick_parent_id].color = pick_color;
  }
  sendToDos();
}

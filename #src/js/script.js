new Sortable(document.querySelector("#main__todo_block"), {
  sortable: true,
  // store: true,
  dropBubble: true,
  direction: "vertical",
  delay:1,
  handle:".todoitem__handle",
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
  onEnd: function (/**Event*/ evt) {
    evt.newIndex;
    let temp;

    if (evt.oldIndex != evt.newIndex) {
      if (evt.newIndex >= todosActive.length) {
        evt.newIndex = todosActive.length - 1;
      }
      if (evt.oldIndex >= todosActive.length) {
        evt.oldIndex = todosActive.length - 1;
      }
      console.log(evt.oldIndex + " " + evt.newIndex);
      temp = todosActive[evt.newIndex].body;
      todosActive[evt.newIndex].body = todosActive[evt.oldIndex].body;
      todosActive[evt.oldIndex].body = temp;

      let tempArr = $(".todoitem ").not(".todoitem.done");

      for ([index, todo] of todosActive.entries()) {
        todo.body = tempArr[index].innerText;
      }

      // console.log(todosActive);
      sendToDos();
    }

    // sendToDos();
    // console.log(evt.item.children[0].className)
  },
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

console.log(day)

if (day < 10) day = `0${day}`;
if ((month + 1) < 10) month = `0${month + 1}`;
else month += 1;

let final_date = `${day}-${month}-${year}`;

$("#main__todo_title h2").html(final_date);
// ----------------------------------
// проверка существует ли Json файл и если его нет то создаем

function checkJson() {
  let loc_mail = localStorage.getItem("login");
  $.post("php/checkJson.php", { date: final_date,"loc_mail":loc_mail  }, (response) =>
    console.log(response)
  );
}

checkJson();





//--------------------------
// получаем данные о делах с сервера

function gettingJson() {
  let loc_mail = localStorage.getItem("login");
  $.post(
    "php/getJson.php",
    { aim: "get", date: final_date,"loc_mail":loc_mail },
    function (response) {
      response = JSON.parse(response);
      if (response[0] != null) todosActive = [...response[0]];
      else todosActive = [];
      if (response[1] != null) todosDone = [...response[1]];
      else todosDone = [];
      // console.log(todosActive);
      // вызов функции показа всех дел
      showToDos([...todosActive, ...todosDone]);
    }
  );
}

gettingJson();

//----------------------------
// функция показа всех имеющихся дел, как сделанных так и активных

function showToDos(arr) {
  $("#main__todo_block").html("");

  for ([index, todo] of arr.entries()) {
    let class__check,
      class__item,
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

    $("#main__todo_block").html(
      $("#main__todo_block").html() +
        `<div class="sortable__block"><div class="todoitem ${class__item}" name="${
          index - shift
        }">
        <img src="img/handle.png" alt="handle" class="todoitem__handle">
        <div class="todoitem__check_block">
        <input type="checkbox" class="todoitem__check" id="todo${index}">
        <label for="todo${index}" class="todoitem__label ${class__check}" onclick="markItem(this)">${
          todo.body
        }</label>
        </div>
        <img src="img/trash.png" class="todoitem__trash" onclick="delItem(this)" alt="trash">
    </div></div>`
    );
  }
}

//----------------------------------

// todosActive = [{
//         body: "Draw the vehicle",
//         status: "active"
//     },
//     {
//         body: "Wash the dishes",
//         status: "active"
//     },
// ];
// todosDone = [{
//     body: "Create project",
//     status: "done",
// }, ];

// слушатель для добавления нового дела в список
$("#addToDo").click(function () {
  let toDoText = $("#typeToDo").val();
  if (toDoText != "" && toDoText != " ") {
    $("#typeToDo").val("");
    todosActive.push({
      body: `${toDoText}`,
      status: "active",
    });
  }
  showToDos([...todosActive, ...todosDone]);
  sendToDos();
});
//------------------------------------
// функция удаления дела
function delItem(elem) {
  let parent_id = $(elem).parent("div").attr("name"); // получение id из поля
  // name в todoitem

  if ($(elem).parent("div").hasClass("done")) {
    // выбор нужного массива из которого нужно удалить элемент
    todosDone.splice(parent_id, 1);
  } else {
    todosActive.splice(parent_id, 1);
  }

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

  arr1.splice(index1, 1);
  arr2.push({
    body: `${tempBody}`,
    status: `${status}`,
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
    date: final_date,
    loc_mail: loc_mail
  };

  $.post("php/updateJson.php", jsonString, function (response) {
    console.log(response);
  });
}

// sendToDos();

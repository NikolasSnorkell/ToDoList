// draggable
// import { Draggable, Droppable } from 'agnostic-draggable';


new Sortable(document.querySelector('#main__todo_block'), {
    
    sortable: true,
    dropBubble: true,
    direction: 'vertical',
    filter: ".sortable__block .done",
    forceFallback: true,
    fallbackClass: "sortable__block",
    dragClass: "sortable__block",
    animation: 300,
    easing: "cubic-bezier(1, 0, 0, 1)",
    onSort: function (/**Event*/evt) {
        var itemEl = evt.item;  // dragged HTMLElement
        evt.to;    // target list
        evt.from;  // previous list
        evt.oldIndex;  // element's old index within old parent
        evt.newIndex=2;  // element's new index within new parent
        evt.clone // the clone element
        evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving
      
        console.log(evt.newIndex);
    
    },
});

let todosActive = [], todosDone = [];
let todosCurrentObj = [];

// функция показа всех имеющихся дел, как сделанных так и активных

var showTodos = (arr) =>{


    $('#main__todo_block').html('');

    for([index,todo] of arr.entries()){
        let class__check,class__item,shift = 0; // 1,2 классы которые добавляются если дело сделано; 3 это сдвиг для переборки чтобы сделанные дела начинались с 0 для совпадения с элементами массива

// проверка статуса дела\
        if(todo.status=="done"){
            class__check="checked";
            class__item="done";
            shift = todosActive.length; // сдвиг на длину массива активных дел
        } else {
            class__check="";
            class__item="";
            shift = 0;
        }

        $('#main__todo_block').html($('#main__todo_block').html()+`<div class="sortable__block"><div class="todoitem ${class__item}" name="${index-shift}">
        <div class="todoitem__check_block">
        <input type="checkbox" class="todoitem__check" id="todo${index}">
        <label for="todo${index}" class="todoitem__label ${class__check}" onclick="markItem(this)">${todo.body}</label>
        </div>
        <img src="img/trash.png" class="todoitem__trash" onclick="delItem(this)" alt="trash">
    </div></div>`);


    }
}

todosActive = [  {body:"Draw the vehicle", status:"active"},
{body:"Wash the dishes", status:"active"}]
todosDone = [{
    body:"Create project",status:"done"
},];



showTodos([...todosActive,...todosDone])




// слушатель для добавления нового дела в список
$('#addToDo').click(function(){
    let toDoText = $('#typeToDo').val();
    $('#typeToDo').val("");
    todosCurrentObj.push(toDoText);

    showTodos(todosCurrentObj);
})

// функция удаления дела
function delItem(elem){
       
    let par_id = $(elem).parent("div").attr("name");
   todosCurrentObj.splice(par_id,1);
    showTodos(todosCurrentObj);
    console.log(todosCurrentObj); 
}


// функция отметки сделанного дела
function markItem(elem){
    let todoIndex = $(elem).parent('div').parent(".todoitem").attr("name");
    if($(elem).hasClass('checked')) transferItem(todosDone,todoIndex,todosActive,"active");
    else  transferItem(todosActive,todoIndex,todosDone,"done");

    $(elem).toggleClass("checked");
    $(elem).parent('div').parent(".todoitem").toggleClass("done");
}


// функция для 
function transferItem(arr1,index1,arr2,status){
    let tempBody = arr1[index1].body;
    
    arr1.splice(index1,1);
    arr2.push({body:`${tempBody}`,status:`${status}`},);
  
    showTodos([...arr1,...arr2]);
}


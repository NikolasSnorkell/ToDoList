// draggable
// import { Draggable, Droppable } from 'agnostic-draggable';


new Sortable(document.querySelector('#main__todo_block'), {
    
    sortable: true,
    dropBubble: true,
    direction: 'vertical',
    filter: ".sortable__block .done",
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


let todosCurrentObj = ["Draw the vehicle","Wash the dishes"];

function showTodos(arr){
    $('#main__todo_block').html('');

    for([index,todo] of arr.entries()){
        $('#main__todo_block').html($('#main__todo_block').html()+`<div class="sortable__block"><div class="todoitem" name="${index}">
        <div class="todoitem__check_block">
        <input type="checkbox" class="todoitem__check" id="todo${index}">
        <label for="todo${index}" class="todoitem__label">${todo}</label>
        </div>
        <img src="img/trash.png" class="todoitem__trash" onclick="delItem(this)" alt="trash">
    </div></div>`);
    }
}

showTodos(todosCurrentObj)


$('#addToDo').click(function(){
    let toDoText = $('#typeToDo').val();
    $('#typeToDo').val("");
    todosCurrentObj.push(toDoText);

    showTodos(todosCurrentObj);
})


function delItem(elem){
       
    let par_id = $(elem).parent("div").attr("name");
   todosCurrentObj.splice(par_id,1);
    showTodos(todosCurrentObj);
    console.log(todosCurrentObj);
}

$('.todoitem__label').click(function(){
    $(this).toggleClass("checked");
    $(this).parent('div').parent(".todoitem").toggleClass("done");
})



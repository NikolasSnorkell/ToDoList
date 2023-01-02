// draggable
// import { Draggable, Droppable } from 'agnostic-draggable';


new Sortable(document.querySelector('#main__todo_block'), {
    delay: 2,
    dropBubble: true,
   
  
    animation: 0,
    easing: "cubic-bezier(1, 0, 0, 1)",
    
});


let todosCurrentObj = ["Draw the vehicle","Wash the dishes"];

function showTodos(arr){
    $('#main__todo_block').html('');

    for([index,todo] of arr.entries()){
        $('#main__todo_block').html($('#main__todo_block').html()+`<div class="todoitem" name="${index}">
        ${todo}
        <img src="img/trash.png" class="todoitem__trash" onclick="delItem(this)" alt="trash">
    </div>`);
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
}
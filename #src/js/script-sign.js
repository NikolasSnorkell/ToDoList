
//проверка залогинен ли пользователь ранее
if(localStorage.getItem('login')==undefined && localStorage.getItem('pass')==undefined){
  localStorage.setItem("login","");
  localStorage.setItem("pass","");
} else if(localStorage.getItem('login')!="" && localStorage.getItem('pass')=="true"){
  document.location.href = "todo.html";
}


// загрузочный экран
window.addEventListener('load', function () {
  $('#loading').animate({'opacity':"0"},300);
  setTimeout(() => {
    
    $('#loading').css('visibility',"hidden");   
  }, 300);
 

})


let sign_choose_arr = $("#main__sign_choose p");
let sign_choose_color = "rgb(2, 113, 187)";
let sign_type_flag = "login";
let flags_arr = [false,false,false];

// console.log(sign_choose_arr);

// функция выбора логина или регистрации (индекс приходит с кнопки переключения)
function sign_choose_change(index) {
  flags_arr = [false,false,false];

  if ($(sign_choose_arr[index]).hasClass("sign__choose_checked") == false) {
    $(sign_choose_arr[index]).toggleClass("sign__choose_checked");

    let index_invert = Math.abs(1 - index);
    $(sign_choose_arr[index_invert]).toggleClass("sign__choose_checked");


    if (index_invert == 1) {
      $("#main__sign_register").css("display", "none");
      $("#main__sign_login").css("display", "flex");
      sign_type_flag = "login";
    } else {
      $("#main__sign_register").css("display", "flex");
      $("#main__sign_login").css("display", "none");
      sign_type_flag = "register";
    }
    console.log(sign_type_flag);
  }


}

//-----------------------
// проверка правильности ввода инпутов в полях регистрации и логина
let check_flag = 0; // по этому флагу определяется выполнены ли все условия для регистрации/логина

function inputCheck(elem) {
  let regexp_mail = /^[A-Za-z0-9_-]+@[a-z]+\.{1}[a-z]{2,3}$/;
  let regexp_pass = /^\w{5,16}$/;
  let uni_regexp;
  // check_flag=0;
  if (
    $(elem).attr("id") == "reg__mail" ||
    $(elem).attr("id") == "login__mail"
  ) {
    uni_regexp = regexp_mail;
  }else if (
    $(elem).attr("id") == "reg__pass1" ||
    $(elem).attr("id") == "reg__pass2" ||
    $(elem).attr("id") == "login__pass"
  ) {
    uni_regexp = regexp_pass;
  }
//проверка текста внутри полей на правильность ввода по шаблону
  if (!uni_regexp.test($(elem).val())) {
    $(`#${$(elem).attr("id")}`).addClass("red_border");;
   
  } else {
    $(`#${$(elem).attr("id")}`).removeClass("red_border");;
   
  }

  if (
    $(elem).attr("id") == "reg__pass2"
  ) {
    // сравнение полей пароля при регистрации
    if ($("#reg__pass1").val() != $("#reg__pass2").val()) {
      $("#reg__pass1").addClass("red_border");
      $("#reg__pass2").addClass("red_border");
    
    } else {
      $("#reg__pass1").removeClass("red_border");
      $("#reg__pass2").removeClass("red_border");
    
    }

  }

  let element__type = ( $(elem).attr("id")).split("__");
  var elem__arr_name, check_number;

    switch (element__type[0]){
      case 'reg':
        elem__arr_name = "register";
        check_number = 2;
        
        break;
      case 'login':
        
        elem__arr_name = "login";
        check_number = 1;
        break;
    }
    let elem__arr = $(`#main__sign_${elem__arr_name} input`);


    

   cycle: for(let i = 0;i<elem__arr.length;i++){
        if($(elem__arr[i]).val()!=""){

          if(!$(elem__arr[i]).hasClass("red_border")){
          
            flags_arr[i] = true;
          
          } else {
          
            flags_arr[i] = false;
            
            
          }
    
        } else {
        
          flags_arr[i] = false;
      
          break cycle;
        }
      }
      
}

//----------------
// функция отправки регистрационных данных на сервер
$("#reg__send").click(reg_send);


function reg_send(){
  let mail = $("#reg__mail").val();
  let pass = $("#reg__pass1").val();

  mail = mail.toLowerCase();

  if (flags_arr.join()=="true,true,true") {
    // console.log(mail +" "+pass);

    $.post("php/createUser.php", { mail: mail, pass: pass }, (response) => {
      console.log(response);
      if (response == "Exist") alert("This E-mail is in use!");
      else {
        localStorage.setItem("login",mail);
        localStorage.setItem("pass","true");
       

        document.location.href = "todo.html";
      }
    });
  }
}


//----------------
// функция отправки логин данных на сервер
$("#login__send").click(login_send);


function login_send(){
  let mail = $("#login__mail").val();
  let pass = $("#login__pass").val();

  mail = mail.toLowerCase();

  if (flags_arr.join()==("true,true,false"||"true,true,true")) {
    

    $.post("php/loginUser.php", { mail: mail, pass: pass }, (response) => {
      console.log(response);
    
    
      if(response == "logged"){
        localStorage.setItem("login",mail);
        localStorage.setItem("pass","true");
        
        document.location.href = "todo.html";
      } else {
        alert("Are you sure you have the account?");
      }
    });
  }
}


//------------
// функция назначающая Enter для отправки данных

function  enterToDo(){
  $(document).keyup(function(e) {
    if (e.key === "Enter") {

      switch(sign_type_flag){
        case "login":
            login_send();
            break
        case "register":
            reg_send();
            break
      }
      
    }
  });
}

//анимация нажатия на кнопку выбора регистрации или логина
function press(flag){
  switch (flag){
   
    case 'regToDo': 
      $("#reg__send").toggleClass("pressed");
      setTimeout(() => {
        $("#reg__send").toggleClass("pressed");
      }, 800);
      break
    case 'loginToDo': 
      $("#login__send").toggleClass("pressed");
      setTimeout(() => {
        $("#login__send").toggleClass("pressed");
      }, 800);
      break
    }
    
}
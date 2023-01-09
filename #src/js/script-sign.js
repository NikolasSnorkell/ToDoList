let sign_choose_arr = $("#main__sign_choose p");
let sign_choose_color = "rgb(2, 113, 187)";

// console.log(sign_choose_arr);

// функция выбора логина или регистрации
function sign_choose_change(index) {
  $(sign_choose_arr[index]).toggleClass("sign__choose_checked");

  let index_invert = Math.abs(1 - index);
  $(sign_choose_arr[index_invert]).toggleClass("sign__choose_checked");
  if (index_invert == 1) {
    $("#main__sign_register").css("display", "none");
    $("#main__sign_login").css("display", "flex");
  } else {
    $("#main__sign_register").css("display", "flex");
    $("#main__sign_login").css("display", "none");
  }
}


//-----------------------
// проверка правильности ввода инпутов в полях регистрации и логина
let check_flag=0;// по этому флагу определяется выполнены ли все условия для регистрации/логина

function inputCheck(elem) {
  let regexp_mail = /^[a-z0-9]+@[a-z]+\.{1}[a-z]{2,3}$/;
  let regexp_pass = /^\w{5,10}$/;
  let uni_regexp;

  if ($(elem).attr("id") == "reg__mail" || $(elem).attr("id") == "login__mail") {
    uni_regexp = regexp_mail;
  }
  if ($(elem).attr("id") == "reg__pass1" || $(elem).attr("id") == "reg__pass2" || $(elem).attr("id") == "login__pass") {
    uni_regexp = regexp_pass;
  }


    if (!uni_regexp.test($(elem).val())) {
      $(`#${$(elem).attr("id")}`).css("border", "2px solid red");
    } else {
        switch ($(elem).attr("id")){// тут секция правильного ввода, и в зависимости от поля флагу начисляется разное количество баллов
            case 'reg__mail':
                check_flag=1;
                break
            case 'reg__pass1':
                check_flag=2;
                break
            case 'login__mail':
                check_flag=1;
                break    
            case 'login__pass':
                check_flag=2;
                break    
            }
            
      $(`#${$(elem).attr("id")}`).css("border", "2px solid rgb(2, 113, 187)");
    }


  if ($(elem).attr("id") == "reg__pass1" || $(elem).attr("id") == "reg__pass2") {// сравнение полей пароля при регистрации
    if ($("#reg__pass1").val() != $("#reg__pass2").val()) {
      $("#reg__pass1").css("border", "2px solid red");
      $("#reg__pass2").css("border", "2px solid red");
    } else {
      $("#reg__pass1").css("border", "2px solid rgb(2, 113, 187)");
      $("#reg__pass2").css("border", "2px solid rgb(2, 113, 187)");
      check_flag=3;// максимальный балл флага, значит что все прошло проверку
    }
  }  
}


//----------------
// функция отправки регистрационных данных на сервер
$("#reg__send").click(function () {
   
   let mail = $("#reg__mail").val();
   let pass = $("#reg__pass1").val();

   if(check_flag==3){
    // console.log(mail +" "+pass);

    $.post("php/createUser.php", { mail: mail, pass: pass }, (response) => {
        console.log(response);
        if(response=="Exist") alert("This E-mail is in use!");
      });
   }

});


//----------------
// функция отправки логин данных на сервер
$("#login__send").click(function () {
  
    let mail = $("#login__mail").val();
    let pass = $("#login__pass").val();
    console.log(check_flag)
    if(check_flag==2){
     // console.log(mail +" "+pass);
 
     $.post("php/loginUser.php", { mail: mail, pass: pass }, (response) => {
         console.log(response);
       });
    }
 
 });


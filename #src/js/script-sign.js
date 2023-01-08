let sign_choose_arr = $('#main__sign_choose p');
let sign_choose_color = "rgb(2, 113, 187)";
console.log(sign_choose_arr)
function sign_choose_change(index){
    $(sign_choose_arr[index]).toggleClass('sign__choose_checked');

    let index_invert = Math.abs(1-index);
    $(sign_choose_arr[index_invert]).toggleClass('sign__choose_checked');
    if(index_invert==1){
         $('#main__sign_register').css('display','none');
         $('#main__sign_login').css('display','flex');

        }
    else {
        $('#main__sign_register').css('display','flex');
        $('#main__sign_login').css('display','none');
        }
}
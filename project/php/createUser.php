<?php
$path = '../json/';
$request = $_POST;

if($request['mail']){
$mail = $request['mail'];
    if(is_dir($path.$mail)==false){
        mkdir($path.$mail, 0777);
        print_r("Created dir");
    } else{
        print_r("Exist");
    }
    

}





?>
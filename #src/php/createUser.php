<?php
$path = '../json/';
$request = $_POST;

if($request['mail']){
$mail = $request['mail'];
$pass = $request['pass'];
    if(is_dir($path.$mail)==false){
        mkdir($path.$mail, 0777);
        print_r("Created dir");


        $json = json_decode(file_get_contents($path."users.json"), true);

        $obj["mail"] = $mail;
        $obj["password"] = $pass;
    
       array_push($json, $obj);
        
    file_put_contents($path."users.json", json_encode($json));




    } else{
        print_r("Exist");
    }
    

   
}




?>
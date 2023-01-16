<?php
$filename = '../json/users.json';
$path = '../json/';
$request = $_POST;

if($request['mail']){
$mail = $request['mail'];


$jsonString = file_get_contents($filename);
$jsonObj = json_decode($jsonString,true);




    foreach($jsonObj as $jsonItem){
        $hash_pass_verify = password_verify($request["pass"],$jsonItem["password"]);
        if($jsonItem["mail"] ==$request["mail"] && $hash_pass_verify==true){
            print_r("logged");
        } 
        if ($jsonItem["mail"] ==$request["mail"]){
            print_r("");   
            
        }
    }


    }




?>
<?php
$filename = '../json/users.json';
$path = '../json/';
$request = $_POST;

if($request['mail']){
$mail = $request['mail'];

$jsonString = file_get_contents($filename);
$jsonObj = json_decode($jsonString,true);




    foreach($jsonObj as $jsonItem){
        if($jsonItem["mail"] ==$request["mail"] && $jsonItem["password"] ==$request["pass"]){
            print_r("logged");
        } 
        if ($jsonItem["mail"] ==$request["mail"]){
            print_r("");   
            
        }
    }


    }




?>
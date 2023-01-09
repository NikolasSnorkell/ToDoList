<?php
$filename = '../json/users.json';
$path = '../json/';
$request = $_POST;

if($request['mail']){
$mail = $request['mail'];

$jsonString = file_get_contents($filename);

$jsonObj = json_decode($jsonString,true);

print_r($jsonObj);
    for($i=0;$i<count($jsonString);$i++){
        if($jsonString[$i].mail==$request["mail"]){
            print_r("User exist");
        } elseif ($jsonString[$i].password==$request["pass"]){
            print_r("Logged In!");   
        }
    }

    // if(is_dir($path.$mail)==true){
    //     print_r("Logged In!");
      
    // } else{
    //     print_r("User doesn't exist!");  
    // }
    // print_r("dfgdfg");

    }




?>
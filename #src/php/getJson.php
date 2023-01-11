<?php
$path = '../json/';
$request = $_POST;

if ($request['aim'] == "get") {

    $filename = $path.$request['loc_mail'].'/'.$request['date'].'.json';

    $jsonString = file_get_contents($filename);
   
    $jsonObj = json_decode($jsonString,true);
  
  
    
    print_r($jsonString);
    // print_r('Getting Done');

}
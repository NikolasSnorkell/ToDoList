<?php
$path = '../json/';
$request = $_POST;



    $filename = $path.$request['loc_mail'].'/'.$request['date'].'.json';

    if(file_exists($filename)){

    } else {
        $fp = fopen($filename, 'w');
        fwrite($fp, '[[],[]]');
        fclose($fp);
        print_r("Created");
    }
  
  
    
    



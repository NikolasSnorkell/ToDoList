<?php
$path = '../json/';
$request = $_GET;



    $filename = $path.$request['date'].'.json';

    if(file_exists($filename)){

    } else {
        $fp = fopen($filename, 'w');
        fwrite($fp, '[[],[]]');
        fclose($fp);
        print_r("Created");
    }
  
  
    
    



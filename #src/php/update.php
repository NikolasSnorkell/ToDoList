<?php
$path = '../json/';
$request = $_POST;

if ($request['aim'] == "create/update") {

    $filename = $path.$request['date'].'.json';

    $jsonObj = [$request["arr1"], $request["arr2"]];

    $jsonString = json_encode($jsonObj, JSON_PRETTY_PRINT);
    // Write in the file
    $fp = fopen($filename, 'w');
    fwrite($fp, $jsonString);
    fclose($fp);

    print_r('Create/Update Done');

}

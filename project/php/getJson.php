<?php
$path = '../json/test.json';
$request = $_GET;

if ($request['aim'] == "create/update") {

    $jsonObj = [$request["arr1"], $request["arr2"]];

    $jsonString = json_encode($jsonObj, JSON_PRETTY_PRINT);
    // Write in the file
    $fp = fopen($path, 'w');
    fwrite($fp, $jsonString);
    fclose($fp);

    print_r('Create/Update Done');

}

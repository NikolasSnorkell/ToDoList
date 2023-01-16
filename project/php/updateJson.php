<?php

$path = '../json/';
$request = $_POST;


$ciphering = "AES-256-CTR"; //Метод шифрования
$options = 0; 
$encryption_iv = '0123456789abcdef'; //Вектор из 16 символов для инициализации шифрования
$encryption_key = $request['mail']; //Ключ для шифрования
 







if ($request['aim'] == "create/update") {

    $filename = $path.$request['loc_mail'].'/'.$request['date'].'.json';

    $jsonObj = [$request["arr1"], $request["arr2"]];

    if($jsonObj['0']!=null){
    for($i=0;$i<count($jsonObj['0']);$i++){
        $encryption = openssl_encrypt //Непосредственно шифрование
            ($jsonObj['0'][$i]['body'], $ciphering, $encryption_key, $options, $encryption_iv);
            $jsonObj['0'][$i]['body'] = $encryption;
        
    }
}
    if($jsonObj['1']!=null){
    for($i=0;$i<count($jsonObj['1']);$i++){
        $encryption = openssl_encrypt //Непосредственно шифрование
            ($jsonObj['1'][$i]['body'], $ciphering, $encryption_key, $options, $encryption_iv);
            $jsonObj['1'][$i]['body'] = $encryption;
        
    }
    }

    $jsonString = json_encode($jsonObj, JSON_PRETTY_PRINT);
    // echo $jsonString;
    // Write in the file
    $fp = fopen($filename, 'w');
    fwrite($fp, $jsonString);
    fclose($fp);

    print_r('Create/Update Done');

}

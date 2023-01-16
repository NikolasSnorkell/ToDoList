<?php
$path = '../json/';
$request = $_POST;

$ciphering = "AES-256-CTR"; //Метод шифрования
$options = 0;
$encryption_iv = '0123456789abcdef'; //Вектор из 16 символов для инициализации шифрования
$encryption_key = $request['mail']; //Ключ для шифрования

// if ($request['aim'] == "get") {

$filename = $path . $request['loc_mail'] . '/' . $request['date'] . '.json';

$jsonString = file_get_contents($filename);

$jsonObj = json_decode($jsonString, true);
// var_dump($jsonObj);
// foreach($jsonObj[0] as $item){
//     $decryption = openssl_decrypt //Дешифруем обратно с теми же данными
//     ($item["body"], $ciphering, $encryption_key, $options, $encryption_iv);
//     $item["body"] = $decryption;
//    }

// for($i=0;$i<count($jsonObj['0']);$i++){
//     $encryption = openssl_decrypt //Непосредственно шифрование
//         ($jsonObj['0'][$i]['body'], $ciphering, $encryption_key, $options, $encryption_iv);
//         $jsonObj['0'][$i]['body'] = $encryption;
//         // echo $encryption." // ";
// }

//    print_r($jsonObj);
if ($jsonObj['0'] != null) {
    for ($i = 0; $i < count($jsonObj[0]); $i++) {
        // echo $jsonObj['0'][$i]['body']." // ";
        $decryption = openssl_decrypt//Дешифруем обратно с теми же данными
        ($jsonObj['0'][$i]["body"], $ciphering, $encryption_key, $options, $encryption_iv);
        $jsonObj['0'][$i]["body"] = $decryption;
        
    }
}
if ($jsonObj['1'] != null) {
    for ($i = 0; $i < count($jsonObj[1]); $i++) {
        $decryption = openssl_decrypt//Дешифруем обратно с теми же данными
        ($jsonObj['1'][$i]["body"], $ciphering, $encryption_key, $options, $encryption_iv);
        $jsonObj['1'][$i]["body"] = $decryption;

    }
}

$jsonString = json_encode($jsonObj, JSON_PRETTY_PRINT);

print_r($jsonString);
// print_r('Getting Done');

// }

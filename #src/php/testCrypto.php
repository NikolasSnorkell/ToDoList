<?php
 $simple_string = "Я, Вань, строка для шифрования, шизофрения, цифромания"; 
 echo "Исходная строка: ".$simple_string.'<br>'; 

 $ciphering = "AES-256-CTR"; //Метод шифрования
 $options = 0; 
 $encryption_iv = '0123456789abcdef'; //Вектор из 16 символов для инициализации шифрования
 $encryption_key = "SecretKey"; //Ключ для шифрования
  
 $encryption = openssl_encrypt //Непосредственно шифрование
  ($simple_string, $ciphering, $encryption_key, $options, $encryption_iv);
 echo "Зашифрованная строка: ".$encryption.'<br>'; 
  
 $decryption = openssl_decrypt //Дешифруем обратно с теми же данными
  ($encryption, $ciphering, $encryption_key, $options, $encryption_iv); 
 echo "Расшифрованная строка: ".$decryption;   
?>
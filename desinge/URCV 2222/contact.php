<?php

                      
 $to_email = 'contact@urcv.net';
 $subject = $_POST["subject"];
  $name = $_POST["name"];
  $phone = $_POST["phone"];
  $model = $_POST["model"];
  $code = $_POST["code"];

 $body = $_POST["message"] ."<br>";                  
 $body .= "My name  is :" .$name ."<br>";
  $body .= "My number phone is :" .$phone ."<br>";
 
  $body .= "model  is :" .$model ."<br>";
  $body .= "discount is : " .$code ."<br>";
 
                            
$email = $_POST["email"];
 $header = "To:contact@urcv.net \r\n";
$header .= "From:$email  \r\n";


       
$header .= "Content-type: text/html\r\n";
                          
                    
                        if ( mail($to_email,$subject,$body,$header)) {
                            header("Location:index.html");
                        } else {
                            echo("Email sending failed...");
                        }
                      
                    
                    
                ?>





























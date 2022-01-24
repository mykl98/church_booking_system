<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function sendResponse($response){
            // Buffer all upcoming output...
            ob_start();
    
            // Send your response.
            echo $response;
    
            // Get the size of the output.
            $size = ob_get_length();
    
            // Disable compression (in case content length is compressed).
            header("Content-Encoding: none");
    
            // Set the content length of the response.
            header("Content-Length: {$size}");
    
            // Close the connection.
            header("Connection: close");
    
            // Flush all output.
            ob_end_flush();
            ob_flush();
            flush();
    
            // Close current session (if it exists).
            if(session_id()) session_write_close();
        }

        function sendMsg($number,$message){
            global $conn,$shortCode,$passPhrase,$appId,$appSecret;
            $url = "https://devapi.globelabs.com.ph/smsmessaging/v1/outbound/".$shortCode."/requests?passphrase=".$passPhrase."&app_id=".$appId."&app_secret=".$appSecret;
            $dataArray = [
                'outboundSMSMessageRequest' => [
                    'clientCorrelator' => $number,
                    'outboundSMSTextMessage' => ['message' => rawurldecode(rawurldecode($message))],
                    'address' => $number
                ]
            ];
            $json_data = json_encode($dataArray);
    
            $curl = curl_init($url);
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
            curl_setopt($curl, CURLOPT_POSTFIELDS, $json_data);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($json_data))
            );
            $response = curl_exec($curl);
            $err = curl_error($curl);
            curl_close($curl);
            if ($err) {
                //echo "cURL Error #:" . $err;
                return "false";
            } else {
                //saveLog($response);
                return "true";
            }
            //return "true";
        }

        function sendMessage($number,$message){
            global $conn;
            $table = "account";
            if($number == "all"){
                $sql = "SELECT number FROM `$table` WHERE access='user'";
                if($result=mysqli_query($conn,$sql)){
                    if(mysqli_num_rows($result) > 0){
                        sendResponse("true*_*Successfully sent the message.");
                        while($row=mysqli_fetch_array($result)){
                            $number = $row["number"];
                            sendMsg($number,$message);
                        }
                    }else{
                        return "Message cannot be sent due to no user is currently registered!";
                    }
                }else{
                    return "System Error!";
                }
            }else{
                sendMsg($number,$message);
                return "true*_*Successfully sent the message";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "church"){
            $number = sanitize($_POST["number"]);
            $message = sanitize($_POST["message"]);
            echo sendMessage($number,$message);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
<?php
    session_start();
    $error = "";
    $number = "";
    if($_POST){
        include_once "system/backend/config.php";

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

        $number = sanitize($_POST["number"]);
        if($number == ""){
            $error = "*Phone number field should not be empty!";
        }else if(strlen($number) != 11){
            $error = "*Invalid phone number!";
        }else{
            global $conn;
            $table = "account";
            $sql = "SELECT idx FROM `$table` WHERE number='$number'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    $row = mysqli_fetch_array($result);
                    $idx = $row["idx"];
                    $code = generateCode(50);
                    $sql = "UPDATE `$table` SET forgot='$code' WHERE idx='$idx'";
                    if(mysqli_query($conn,$sql)){
                        $link = $baseUrl . "/reset.php?code=" . $code;
                        $message = "You have requested a password reset, please click this link " . $link;
                        sendMsg($number,$message);
                        $error = "We have already sent a password reset link to your phone number.";
                    }else{
                        $error = "System Error!";
                    }
                }else{
                    $error = "*We can't find an account connected to this phone number!";
                }
            }else{
                $error = "*System Error!";
            }
        }
    }
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="description" content="" >
    <meta name="author" content="">
    <meta name="keywords" content="">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <!--Meta Responsive tag-->
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!--Bootstrap CSS-->
    <link rel="stylesheet" href="system/plugin/bootstrap/css/bootstrap.min.css">
    <!--Custom style.css-->
    <link rel="stylesheet" href="style.css">
    <!--Font Awesome-->
    <link rel="stylesheet" href="system/plugin/fontawesome/css/fontawesome-all.min.css">
    <link rel="stylesheet" href="system/plugin/fontawesome/css/fontawesome.css">

    <title>Church Booking System</title>
  </head>

  <body>
    
    <!--Login Wrapper-->

    <div class="container-fluid login-wrapper d-flex justify-content-center">
        <div class="login-box">
            <div class="row d-flex justify-content-center mt-5 pt-5">
                <div class="col-sm-5 col-md-5 bg-white p-4 mb-5">
                    <h3 class="mb-2 text-success">Forgot Password?</h3>
                    <small class="text-muted bc-description">Input your phone number. If this phone number is connected to an account, we will send an SMS with a link to reset your password.</small>
                    <form method="post" class="mt-2">
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><i class="fa fa-phone"></i></span>
                            </div>
                            <input type="number" name="number" value="<?php echo $number;?>" class="form-control mt-0" placeholder="Phone Number" aria-label="Username" aria-describedby="basic-addon1">
                        </div>
                        <div class="form-group">
                            <small class="text-danger font-italic"><?php echo $error;?></small>
                            <input type="submit" class="btn btn-success btn-block p-2 mb-1" value="Send">
                        </div>
                    </form>
                    <p class="text-secondary text-wrap m-0">Don't have an account? <a href="signup.php">Sign Up</a></p>
                    <a class="m-0" href="index.php">Sign In?</a>
                </div>
            </div>
        </div>
    </div>    

    <!--Login Wrapper-->

    <!-- Page JavaScript Files-->
    <script src="system/plugin/jquery/js/jquery.min.js"></script>
    <!--Popper JS-->
    <script src="system/plugin/popper/js/popper.min.js"></script>
    <!--Bootstrap-->
    <script src="system/plugin/bootstrap/js/bootstrap.min.js"></script>
  </body>
</html>
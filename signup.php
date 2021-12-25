<?php
    session_start();
    include_once "system/backend/config.php";
    $error = "";
    $name = "";
    $address = "";
    $number = "";
    $username = "";
    $password = "";
    $retype = "";

    function checkIfContainNumbers($string){
        if (strcspn($string, '0123456789') != strlen($string)){
            return "true";
        }else{
            return "false";
        }
    }

    function checkIfContainUppercase($string){
        if (strcspn($string, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') != strlen($string)){
            return "true";
        }else{
            return "false";
        }
    }

    function checkIfContainsSpecialChar($string){
        if (preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $string)){
            return "true";
        }else{
            return "false";
        }
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

    function checkUserName($username){
        global $conn;
        $table = "account";
        $sql = "SELECT idx FROM `$table` WHERE username='$username'";
        if($result=mysqli_query($conn,$sql)){
            if(mysqli_num_rows($result) > 0){
                return "*Username already in use, Please use another username";
            }else{
                return "true";
            }
        }else{
            return "*System Error!";
        }
    }

    if(isset($_SESSION["isLoggedIn"])){
        if($_SESSION["isLoggedIn"] == "true"){
            header("location:main");
            exit();
        }
    }
    if($_POST){
        $name = sanitize($_POST["name"]);
        $address = sanitize($_POST["address"]);
        $number = sanitize($_POST["number"]);
        $username = sanitize($_POST["username"]);
        $password = sanitize($_POST["password"]);
        $retype = sanitize($_POST["retype"]);
        $check = checkUserName($username);
        if($name == ""){
            $error = "*Name field should not be empty!";
        }else if(checkIfContainNumbers($name) == "true"){
            $error = "Name should not contain numbers!";
        }else if($address == ""){
            $error = "*Address field should not be empty!";
        }else if($number == "" || strlen($number) != 11){
            $error = "*Invalid phone number!Please check.";
        }else if($username == ""){
            $error = "*Username field should not be empty!";
        }else if($password == ""){
            $error = "*Password field should not be empty!";
        }else if(checkIfContainNumbers($password) == "false"){
            $error = "*Password should contain numbers.";
        }else if(checkIfContainUppercase($password) == "false"){
            $error = "*Password should contain uppercase characters.";
        }else if(checkIfContainsSpecialChar($password) == "false"){
            $error = "*Password should contain special characters.";
        }else if(strlen($password) < 8){
            $error = "*Password should be atleast 8 characters long.";
        }else if($password != $retype){
            $error = "*Password and retype password does not match!";
        }else if($check != "true"){
            $error = $check;
        }else{
            $table = "account";
            $otp = generateOTP(6);
            $qr = generateCode(100);
            $sql = "INSERT INTO `$table` (name,address,username,password,number,access,qr,otp,status) VALUES ('$name','$address','$username','$password','$number','user','$qr','$otp','processing')";
            if(mysqli_query($conn,$sql)){
                $last_id = $conn->insert_id;
                $_SESSION["lastidx"] = $last_id;
                $message = $otp . " is your otp code from Church Booking System signup.";
                sendMsg($number,$message);
                header("location:otp.php");
                exit();
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
            <div class="row d-flex justify-content-center">
                <div class="col-sm-5 col-md-5 bg-white p-4 mb-5">
                    <h3 class="mb-2 text-success">Signup</h3>
                    <form method="post" class="mt-2">
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fa fa-user"></i></span>
                            </div>
                            <input type="text" name="name" value="<?php echo $name;?>" class="form-control mt-0" placeholder="Your name">
                        </div>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fa fa-home"></i></span>
                            </div>
                            <textarea name="address" class="form-control mt-0" placeholder="Address"><?php echo $address;?></textarea>
                        </div>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fa fa-phone"></i></span>
                            </div>
                            <input type="number" name="number" value="<?php echo $number;?>" class="form-control mt-0" placeholder="Phone Number">
                        </div>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><i class="fa fa-user"></i></span>
                            </div>
                            <input type="text" name="username" value="<?php echo $username;?>" class="form-control mt-0" placeholder="Username">
                        </div>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><i class="fa fa-lock"></i></span>
                            </div>
                            <input type="password" name="password" value="<?php echo $password;?>" class="form-control mt-0" placeholder="Password">
                        </div>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><i class="fa fa-lock"></i></span>
                            </div>
                            <input type="password" name="retype" value="<?php echo $retype;?>" class="form-control mt-0" placeholder="Re-Type Password">
                        </div>

                        <div class="form-group">
                            <small class="text-danger font-italic"><?php echo $error;?></small>
                            <input type="submit" class="btn btn-success btn-block p-2 mb-1" value="Sign Up">
                        </div>
                    </form>
                    <p class="text-secondary text-wrap">Already have an account? <a href="index.php">Login</a></p>
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
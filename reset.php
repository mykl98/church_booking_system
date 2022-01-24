<?php
    include_once "system/backend/config.php";
    session_start();
    $error = "";
    $password = "";
    $rePassword = "";
    $idx = "";
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

    if(!empty($_GET)){
        $code = sanitize($_GET["code"]);
        $table = "account";
        $sql = "SELECT idx FROM `$table` WHERE forgot='$code'";
        if($result=mysqli_query($conn,$sql)){
            if(mysqli_num_rows($result) > 0){
                $row = mysqli_fetch_array($result);
                $idx = $row["idx"];
            }else{
                $error = "Invalid reset password link!";
            }
        }else{
            $error = "System Error!";
        }
    }
    if(!empty($_POST)){
        $password = sanitize($_POST["password"]);
        $rePassword = sanitize($_POST["repassword"]);
        $idx = sanitize($_POST["idx"]);
        if($idx == ""){
            $error = "*Invalid reset password link!";
        }else if($password == ""){
            $error = "*Password field should not be empty!";
        }else if($rePassword == ""){
            $error = "*Retype password field should not be empty!";
        }else if($password != $rePassword){
            $error = "*Password and retype password does not match!";
        }else if(checkIfContainNumbers($password) == "false"){
            $error = "*Password should contain numbers.";
        }else if(checkIfContainUppercase($password) == "false"){
            $error = "*Password should contain uppercase characters.";
        }else if(checkIfContainsSpecialChar($password) == "false"){
            $error = "*Password should contain special characters.";
        }else if(strlen($password) < 8){
            $error = "*Password should be atleast 8 characters long.";
        }else{
            global $conn;
            $table = "account";
            $sql = "UPDATE `$table` SET password='$password',forgot='' WHERE idx='$idx'";
            if(mysqli_query($conn,$sql)){
               header("location:index.php");
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
            <div class="row d-flex justify-content-center mt-5 pt-5">
                <div class="col-sm-5 col-md-5 bg-white p-4 mb-5">
                    <h3 class="mb-2 text-success">Forgot Password?</h3>
                    <small class="text-muted bc-description">Input your phone number. If this phone number is connected to an account, we will send an SMS with a link to reset your password.</small>
                    <form method="post" class="mt-2">
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><i class="fa fa-lock"></i></span>
                            </div>
                            <input type="text" name="password" value="<?php echo $password;?>" class="form-control mt-0">
                            <input type="hidden" name="idx" value="<?php echo $idx;?>" class="form-control mt-0">
                        </div>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><i class="fa fa-lock"></i></span>
                            </div>
                            <input type="text" name="repassword" value="<?php echo $rePassword;?>" class="form-control mt-0">
                        </div>
                        <div class="form-group">
                            <small class="text-danger font-italic"><?php echo $error;?></small>
                            <input type="submit" class="btn btn-success btn-block p-2 mb-1" value="Reset">
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
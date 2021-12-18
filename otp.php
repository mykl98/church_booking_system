<?php
    session_start();
    include_once "system/backend/config.php";
    $error = "";
    $otp = "";

    function updateStatus($idx){
        global $conn;
        $table = "account";
        $sql = "UPDATE `$table` SET status='approved' WHERE idx='$idx'";
        if(mysqli_query($conn,$sql)){
            return "true";
        }else{
            return "System Error!";
        }
    }

    if($_POST){
        $otp = sanitize($_POST["otp"]);
        if($otp == ""){
            $error = "*OTP field should not be empty!";
        }else{
            $table = "account";
            $idx = $_SESSION["lastidx"];
            $sql = "SELECT * FROM `$table` WHERE idx='$idx'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    $row = mysqli_fetch_array($result);
                    $otpCode = $row["otp"];
                    if($otp == $otpCode){
                        $update = updateStatus($idx);
                        if($update == "true"){
                            $_SESSION["isLoggedIn"] = "true";
                            $_SESSION["access"] = "user";
                            $_SESSION["loginidx"] = $idx;
                            header("location:main");
                            exit();
                        }else{
                            return $update;
                        }
                    }else{
                        $error = "*Invalid OTP COde";
                    }
                }else{
                    $error = "*Invalid OTP Code";
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
            <div class="row d-flex justify-content-center">
                <div class="col-sm-5 col-md-5 bg-white p-4 mb-5 mt-5">
                    <h3 class="mb-2 text-success">OTP Code</h3>
                    <form method="post" class="mt-2">
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fa fa-leaf"></i></span>
                            </div>
                            <input type="text" name="otp" class="form-control mt-0" placeholder="OTP Code">
                        </div>
                        <div class="form-group">
                            <small class="text-danger font-italic"><?php echo $error;?></small>
                            <input type="submit" class="btn btn-success btn-block p-2 mb-1" value="Verify">
                        </div>
                    </form>
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
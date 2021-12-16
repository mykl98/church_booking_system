<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function checkOldPassword($idx,$old){
            global $conn;
            $table = "account";
            $sql = "SELECT idx FROM `$table` WHERE idx='$idx' && password='$old'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    return "true";
                }else{
                    return "false";
                }
            }else{
                return "System Error!";
            }
        }

        function changePassword($idx,$new){
            global $conn;
            $table = "account";
            $sql = "UPDATE `$table` SET password='$new' WHERE idx='$idx'";
            if(mysqli_query($conn,$sql)){
                return "true*_*Successfully change your password";
            }else{
                return "system Error!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "admin"){
            $idx = sanitize($_SESSION["loginidx"]);
            $old = sanitize($_POST["old"]);
            $new = sanitize($_POST["new"]);
            $retype = sanitize($_POST["retype"]);

            $checkOldPassword = checkOldPassword($idx,$old);
            if($checkOldPassword == "true"){
                echo changePassword($idx,$new);
            }else{
                echo "Your old password does not match with your current password, Password cannot be change.";
            }
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
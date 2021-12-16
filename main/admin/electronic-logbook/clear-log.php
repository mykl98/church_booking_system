<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function clearLog($churchIdx){
            global $conn;
            $table = "log";
            $sql = "DELETE FROM `$table` WHERE churchidx='$churchIdx'";
            if(mysqli_query($conn,$sql)){
                return "true*_*";
            }else{
                return "System Error!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "admin"){
            $churchIdx = sanitize($_POST["churchidx"]);
            echo clearLog($churchIdx);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
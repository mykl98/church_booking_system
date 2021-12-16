<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function clearLog(){
            global $conn;
            $table = "system-log";
            $sql = "DELETE FROM `$table`";
            if(mysqli_query($conn,$sql)){
                systemLog("Clear the system logs.");
                return "true*_*";
            }else{
                return "System Failed!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "super-admin"){
            echo clearLog();
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
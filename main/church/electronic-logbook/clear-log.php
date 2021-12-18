<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function clearLog($church){
            global $conn;
            $table = "log";
            $sql = "DELETE FROM `$table` WHERE churchidx='$church'";
            if(mysqli_query($conn,$sql)){
                return "true*_*";
            }else{
                return "System Error!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "church"){
            $church = $_SESSION["church"];
            echo clearLog($church);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
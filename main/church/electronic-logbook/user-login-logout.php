<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function loginLogoutUser($idx,$activity,$church){
            global $conn;
            $table = "log";
            $date = date("Y/m/d");
            $time = date("h:i:sa");
            $sql = "INSERT INTO `$table` (churchidx,useridx,date,time,activity) VALUES ('$church','$idx','$date','$time','$activity')";
            if(mysqli_query($conn,$sql)){
                return "true*_*";
            }else{
                return "System Error!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "church"){
            $idx = sanitize($_POST["idx"]);
            $activity = sanitize($_POST["activity"]);
            $church = $_SESSION["church"];
            echo loginLogoutUser($idx,$activity,$church);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
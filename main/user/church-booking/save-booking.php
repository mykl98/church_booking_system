<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function saveBooking($userIdx,$churchIdx,$type,$date,$time){
            global $conn;
            $table = "booking";
            $sql = "INSERT INTO `$table` (churchidx,useridx,type,date,time,status) VALUES ('$churchIdx','$userIdx','$type','$date','$time','processing')";
            if(mysqli_query($conn,$sql)){
                return "true*_*";
            }else{
                return "System Error!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "user"){
            $userIdx = $_SESSION["loginidx"];
            $churchIdx = sanitize($_POST["church"]);
            $type = sanitize($_POST["type"]);
            $date = sanitize($_POST["date"]);
            $time = sanitize($_POST["time"]);
            if(!empty($churchIdx) && !empty($type) && !empty($date) && !empty($time)){
                echo saveBooking($userIdx,$churchIdx,$type,$date,$time);
            }else{
                echo "Network Error!";
            }
        }else{
            echo "Access Denied1!";
        }
    }else{
        echo "Access Denied2!";
    }
?>
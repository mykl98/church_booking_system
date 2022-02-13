<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function saveBooking($userIdx,$churchIdx,$type,$date){
            global $conn;
            $table = "booking";
            $sql = "INSERT INTO `$table` (churchidx,useridx,type,date,status) VALUES ('$churchIdx','$userIdx','$type','$date','processing')";
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
            if(!empty($churchIdx) && !empty($type) && !empty($date)){
                echo saveBooking($userIdx,$churchIdx,$type,$date);
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
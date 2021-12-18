<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function saveBooking($idx,$userIdx,$churchIdx,$type,$date,$time){
            global $conn;
            $table = "booking";
            if($idx == ""){
                $sql = "INSERT INTO `$table` (churchidx,useridx,type,date,time,status) VALUES ('$churchIdx','$userIdx','$type','$date','$time','processing')";
                if(mysqli_query($conn,$sql)){
                    return "true*_*";
                }else{
                    return "System Error!";
                }
            }else{
                $sql = "UPDATE `$table` SET churchidx='$churchIdx',type='$type',date='$date',time='$time' WHERE idx='$idx'";
                if(mysqli_query($conn,$sql)){
                    return "true*_*";
                }else{
                    return "System Error!";
                }
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "user"){
            $idx = sanitize($_POST["idx"]);
            $userIdx = $_SESSION["loginidx"];
            $churchIdx = sanitize($_POST["churchidx"]);
            $type = sanitize($_POST["type"]);
            $date = sanitize($_POST["date"]);
            $time = sanitize($_POST["time"]);
            if(!empty($churchIdx) && !empty($type) && !empty($date) && !empty($time)){
                echo saveBooking($idx,$userIdx,$churchIdx,$type,$date,$time);
            }else{
                echo "Network Error!";
            }
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
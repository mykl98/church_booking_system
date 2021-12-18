<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function getApprovedBooking($userIdx){
            global $conn;
            $table = "booking";
            $sql = "SELECT idx FROM `$table` WHERE useridx='$userIdx' && status='approved'";
            if($result=mysqli_query($conn,$sql)){
                return mysqli_num_rows($result);
            }else{
                return "System Error!";
            }
        }

        function getTotalBooking($userIdx){
            global $conn;
            $table = "booking";
            $sql = "SELECT idx FROM `$table` WHERE useridx='$userIdx'";
            if($result=mysqli_query($conn,$sql)){
                return mysqli_num_rows($result);
            }else{
                return "System Error!";
            }
        }

        function getDashboardDetails($userIdx){
            $data = array();
            $value = new \StdClass();
            $value -> approved = getApprovedBooking($userIdx);
            $value -> total = getTotalBooking($userIdx);
            array_push($data,$value);
            $data = json_encode($data);
            return "true*_*" . $data;
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "user"){
            $userIdx = $_SESSION["loginidx"];
            echo getDashboardDetails($userIdx);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
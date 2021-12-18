<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function getAccountCount($church){
            global $conn;
            $table = "account";
            $sql = "SELECT idx FROM `$table` WHERE churchidx='$church'";
            if($result=mysqli_query($conn,$sql)){
                return mysqli_num_rows($result);
            }else{
                return "System Error!";
            }
        }

        function getChurchScheduleCount($church){
            global $conn;
            $table = "schedule";
            $sql = "SELECT idx FROM `$table` WHERE churchidx='$church'";
            if($result=mysqli_query($conn,$sql)){
                return mysqli_num_rows($result);
            }else{
                return "System Error!";
            }
        }

        function getUnprocessedBookingCount($church){
            global $conn;
            $table = "booking";
            $sql = "SELECT idx FROM `$table` WHERE status='processing' && churchidx='$church'";
            if($result=mysqli_query($conn,$sql)){
                return mysqli_num_rows($result);
            }else{
                return "System Error!";
            }
        }

        function getBookingTotalCount($church){
            global $conn;
            $table = "booking";
            $sql = "SELECT idx FROM `$table` WHERE churchidx='$church'";
            if($result=mysqli_query($conn,$sql)){
                return mysqli_num_rows($result);
            }else{
                return "System Error!";
            }
        }

        function getDashboardDetails($church){
            global $vaccinee,$first,$complete;
            $data = array();
            $value = new \StdClass();
            $value -> account = getAccountCount($church);
            $value -> church = getChurchScheduleCount($church);
            $value -> unprocessed = getUnprocessedBookingCount($church);
            $value -> total = getBookingTotalCount($church);
            array_push($data,$value);
            $data = json_encode($data);
            return "true*_*" . $data;
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "church"){
            $church = $_SESSION["church"];
            echo getDashboardDetails($church);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
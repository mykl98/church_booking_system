<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function getAccountCount(){
            global $conn;
            $table = "account";
            $sql = "SELECT idx FROM `$table`";
            if($result=mysqli_query($conn,$sql)){
                return mysqli_num_rows($result);
            }else{
                return "System Error!";
            }
        }

        function getChurchCount(){
            global $conn;
            $table = "church";
            $sql = "SELECT idx FROM `$table`";
            if($result=mysqli_query($conn,$sql)){
                return mysqli_num_rows($result);
            }else{
                return "System Error!";
            }
        }

        function getUnprocessedBookingCount(){
            global $conn;
            $table = "booking";
            $sql = "SELECT idx FROM `$table` WHERE status='processing'";
            if($result=mysqli_query($conn,$sql)){
                return mysqli_num_rows($result);
            }else{
                return "System Error!";
            }
        }

        function getBookingTotalCount(){
            global $conn;
            $table = "booking";
            $sql = "SELECT idx FROM `$table`";
            if($result=mysqli_query($conn,$sql)){
                return mysqli_num_rows($result);
            }else{
                return "System Error!";
            }
        }

        function getDashboardDetails(){
            global $vaccinee,$first,$complete;
            $data = array();
            $value = new \StdClass();
            $value -> account = getAccountCount();
            $value -> church = getChurchCount();
            $value -> unprocessed = getUnprocessedBookingCount();
            $value -> total = getBookingTotalCount(0);
            array_push($data,$value);
            $data = json_encode($data);
            return "true*_*" . $data;
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "admin"){
            echo getDashboardDetails();
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
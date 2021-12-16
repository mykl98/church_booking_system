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

        function getDepartmentCount(){
            global $conn;
            $table = "departments";
            $sql = "SELECT idx FROM `$table`";
            if($result=mysqli_query($conn,$sql)){
                return mysqli_num_rows($result);
            }else{
                return "System Error!";
            }
        }

        function getDocumentCount(){
            global $conn;
            $table = "document";
            $sql = "SELECT idx FROM `$table`";
            if($result=mysqli_query($conn,$sql)){
                return mysqli_num_rows($result);
            }else{
                return "System Error!";
            }
        }

        function getLogCount(){
            global $conn;
            $table = "system-log";
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
            $value -> department = getDepartmentCount();
            $value -> document = getDocumentCount();
            $value -> log = getLogCount();
            array_push($data,$value);
            $data = json_encode($data);
            return "true*_*" . $data;
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "super-admin"){
            echo getDashboardDetails();
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
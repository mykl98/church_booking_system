<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function getDepartmentDetail($idx){
            global $conn;
            $data = array();
            $table = "departments";
            $sql = "SELECT * FROM `$table` WHERE idx='$idx'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    $row = mysqli_fetch_array($result);
                    $value = new \StdClass();
                    $value -> idx = $row["idx"];
                    $value -> image = $row["image"];
                    $value -> name = $row["name"];
                    $value -> shortname = $row["shortname"];
                    $value -> head = $row["head"];
                    $value -> status = $row["status"];
                    array_push($data,$value);
                }
                $data = json_encode($data);
                return "true*_*" . $data;
            }else{
                return "System Failed!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" || $_SESSION["access"] == "super-admin"){
            $idx = sanitize($_POST["idx"]);
            echo getDepartmentDetail($idx);
        }else{
            echo "Access Denied";
        }
    }else{
        echo "Access Denied!";
    }
?>
<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function getQrCode($idx){
            global $conn;
            $data = array();
            $table = "account";
            $sql = "SELECT * FROM `$table` WHERE idx='$idx'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    $row=mysqli_fetch_array($result);
                    $value = new \StdClass();
                    $value -> qr = $row["qr"];
                    array_push($data,$value);
                }
            }
            $data = json_encode($data);
            return "true*_*".$data; 
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "user"){
            $idx = $_SESSION["loginidx"];
            echo getQrCode($idx);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
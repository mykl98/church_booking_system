<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function getSetting($idx){
            global $conn;
            $data = array();
            $table = "church";
            $sql = "SELECT description FROM `$table` WHERE idx='$idx'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    $row = mysqli_fetch_array($result);
                    $value = new \StdClass();
                    $value -> description = $row["description"];
                    array_push($data,$value);
                }
                $data = json_encode($data);
                return "true*_*" . $data;
            }else{
                return "System Error!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "church"){
            $church = $_SESSION["church"];
            echo getSetting($church);
        }else{
            echo "Access Denied";
        }
    }else{
        echo "Access Denied!";
    }
?>
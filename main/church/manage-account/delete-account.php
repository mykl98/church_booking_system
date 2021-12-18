<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function deleteAccount($idx){
            global $conn;
            $table = "account";
            $sql = "DELETE FROM `$table` WHERE idx='$idx'";
            if(mysqli_query($conn,$sql)){
                return "true*_*Successfully deleted this account.";
            }else{
                return "System Error!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "church"){
            $idx = sanitize($_POST["idx"]);
            echo deleteAccount($idx);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
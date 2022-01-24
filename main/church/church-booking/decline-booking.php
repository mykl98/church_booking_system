<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function declineBooking($idx){
            global $conn;
            $table = "booking";
            $sql = "UPDATE `$table` SET status='declined' WHERE idx='$idx'";
            if(mysqli_query($conn,$sql)){
                return "true*_*Successfully declined this booking.";
            }else{
                return "System Error!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "church"){
            $idx = sanitize($_POST["idx"]);
            echo declineBooking($idx);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
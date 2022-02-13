<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function checkBooking($date,$church){
            global $conn;
            $table = "booking";
            $sql = "SELECT status FROM `$table` WHERE date='$date' && churchidx='$church'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    $row = mysqli_fetch_array($result);
                    return "A booking is already created for this date with a " . $row["status"] . " status.";
                }else{
                    return "true*_*";
                }
            }else{
                return "System Error!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "user"){
            $date = sanitize($_POST["date"]);
            $church = sanitize($_POST["church"]);
            echo checkBooking($date,$church);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function checkStatus($idx){
            global $conn;
            $table = "booking";
            $sql = "SELECT status FROM `$table` WHERE idx='$idx'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    $row = mysqli_fetch_array($result);
                    $status = $row["status"];
                    if($status == "approved"){
                        return "This booking is already approved. You could no longer delete this booking";
                    }else{
                        return "true";
                    }
                }else{
                    return "System Error!";
                }
            }else{
                return "System Error!";
            }
        }

        function deleteBooking($idx){
            global $conn;
            $table = "booking";
            $status = checkStatus($idx);
            if($status == "true"){
                $sql = "DELETE FROM `$table` WHERE idx='$idx'";
                if(mysqli_query($conn,$sql)){
                    return "true*_*";
                }else{
                    return "System Error!";
                }
            }else{
                return $status;
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "user"){
            $idx = sanitize($_POST["idx"]);
            echo deleteBooking($idx);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
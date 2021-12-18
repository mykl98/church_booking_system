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
                        return "This booking is already approved. You could no longer edit this booking";
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

        function getChurchName($idx){
            global $conn;
            $name = "";
            $table = "church";
            $sql = "SELECT name FROM `$table` WHERE idx='$idx'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    $row = mysqli_fetch_array($result);
                    $name = $row["name"];
                }
            }
            return $name;
        }

        function getBookingDetail($idx){
            global $conn;
            $data = array();
            $table = "booking";
            $status = checkStatus($idx);
            if($status == "true"){
                $sql = "SELECT * FROM `$table` WHERE idx='$idx'";
                if($result=mysqli_query($conn,$sql)){
                    if(mysqli_num_rows($result) > 0){
                        $row=mysqli_fetch_array($result);
                        $value = new \StdClass();
                        $value -> churchidx = $row["churchidx"];
                        $value -> church = getChurchName($row["churchidx"]);
                        $value -> type = $row["type"];
                        $value -> date = $row["date"];
                        $value -> time = $row["time"];
                        array_push($data,$value);
                    }
                }
                $data = json_encode($data);
                return "true*_*".$data;
            }else{
                return "System Error!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "user"){
            $idx = sanitize($_POST["idx"]);
            echo getBookingDetail($idx);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
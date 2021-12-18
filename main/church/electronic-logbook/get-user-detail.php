<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function getBookingList($userIdx,$churchIdx){
            global $conn;
            $date = date("Y/m/d");
            $data = array();
            $sql = "SELECT * FROM `$table` WHERE date='$date' && useridx='$userIdx' && churchidx='$churchIdx' && status='approved'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value -> type = $row["type"];
                        $value -> time = $row["time"];
                        array_push($data,$value);
                    }
                }
                $data = json_encode($data);
                return $data;
            }else{
                return "System Error!";
            }
        }

        function getUserDetail($qr,$church){
            global $conn;
            $data = array();
            $table = "user";
            $sql = "SELECT * FROM `$table` WHERE qr='$qr' ORDER by idx DESC";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        if($row["idx"] != 0){
                            $value = new \StdClass();
                            $value -> idx = $row["idx"];
                            $value -> image = $row["image"];
                            $value -> name = $row["name"];
                            $value -> address = $row["address"];
                            $value -> booking = getBookingList($row["idx"],$church);
                            array_push($data,$value);
                        }
                    }
                }
                $data = json_encode($data);
                return "true*_*".$data;
            }else{
                return "System Error!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "church"){
            $qr = sanitize($_POST["qr"]);
            $church = $_SESSION["church"];
            echo getUserDetail($qr,$church);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
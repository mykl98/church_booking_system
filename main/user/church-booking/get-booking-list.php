<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

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

        function getBookingList($idx){
            global $conn;
            $data = array();
            $table = "booking";
            $sql = "SELECT * FROM `$table` WHERE useridx='$idx' ORDER by idx DESC";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value -> idx = $row["idx"];
                        $value -> church = getChurchName($row["churchidx"]);
                        $value -> type = $row["type"];
                        $value -> date = $row["date"];
                        $value -> time = $row["time"];
                        $value -> status = $row["status"];
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
            $idx = $_SESSION["loginidx"];
            echo getBookingList($idx);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
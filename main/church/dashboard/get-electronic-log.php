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

        function getAccountName($idx){
            global $conn;
            $name = "";
            $table = "account";
            $sql = "SELECT name FROM `$table` WHERE idx='$idx'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    $row = mysqli_fetch_array($result);
                    $name = $row["name"];
                }
            }
            return $name;
        }

        function getElectronicLog($church){
            global $conn;
            $data = array();
            $table = "log";
            $sql = "SELECT * FROM `$table` WHERE churchidx='$church' ORDER BY idx DESC LIMIT 10";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value -> church = getChurchName($row["church"]);
                        $value -> user = getAccountName($row["useridx"]);
                        $value -> date = $row["date"];
                        $value -> time = $row["time"];
                        $value -> activity = $row["activity"];
                        array_push($data,$value);
                    }
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
            echo getElectronicLog($church);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
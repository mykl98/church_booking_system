<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function getUserName($idx){
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

        function getBookingList($church){
            global $conn;
            $data = array();
            $table = "booking";
            $sql = "SELECT * FROM `$table` WHERE churchidx='$church' ORDER by idx DESC";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        if($row["idx"] != 0){
                            $value = new \StdClass();
                            $value -> idx = $row["idx"];
                            $value -> name = getUserName($row["useridx"]);
                            $value -> type = $row["type"];
                            $value -> date = $row["date"];
                            $value -> time = $row["time"];
                            $value -> status = $row["status"];
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
            $church = $_SESSION["church"];
            echo getBookingList($church);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
<?php
if(isset($_POST)){
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

    function getLogList($church){
        global $conn;
        $data = array();
        $table = "log";
        $sql = "SELECT * FROM `$table` WHERE churchidx='$church' ORDER BY idx DESC";
        if($result=mysqli_query($conn, $sql)){
            if(mysqli_num_rows($result) > 0){
                while($row=mysqli_fetch_array($result)){
                    $value = new \StdClass();
                    $value -> idx = $row["idx"];
                    $value -> user = getUserName($row["useridx"]);
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
        echo getLogList($church);
    }else{
        echo "Access Denied!";
    }
}else{
    echo "Access Denied!";
}
?>
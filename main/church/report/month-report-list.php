<?php
if(isset($_POST)){
    include_once "../../../system/backend/config.php";

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

    function getDateReportList($church,$month){
        global $conn;
        $data = array();
        $table = "booking";
        $sql = "SELECT * FROM `$table` WHERE churchidx='$church' ORDER BY idx DESC";
        if($result=mysqli_query($conn, $sql)){
            if(mysqli_num_rows($result) > 0){
                while($row=mysqli_fetch_array($result)){
                    $date = $row["date"];
                    $date = explode("-", $date);
                    $reportMonth = $date[0] . '-' . $date[1];
                    if($reportMonth == $month){
                        $value = new \StdClass();
                        $value -> date = $row["date"];
                        $value -> time = $row["time"];
                        $value -> type = $row["type"];
                        $value -> bookedby = getAccountName($row["useridx"]);
                        $value -> status = $row["status"];
                        array_push($data,$value);
                    }
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
        $month = sanitize($_POST["month"]);
        echo getDateReportList($church,$month);
    }else{
        echo "Access Denied!";
    }
}else{
    echo "Access Denied!";
}
?>
<?php
if(isset($_POST)){
    include_once "../../../system/backend/config.php";

    function getChurchList(){
        global $conn;
        $data = array();
        $table = "church";
        $sql = "SELECT * FROM `$table` ORDER BY idx DESC";
        if($result=mysqli_query($conn, $sql)){
            if(mysqli_num_rows($result) > 0){
                while($row=mysqli_fetch_array($result)){
                    $value = new \StdClass();
                    $value -> idx = $row["idx"];
                    $value -> name = $row["name"];
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
    if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "admin"){
        echo getChurchList();
    }else{
        echo "Access Denied!";
    }
}else{
    echo "Access Denied!";
}
?>
<?php
if(isset($_POST)){
    include_once "../../../system/backend/config.php";

    function deleteUnit($idx){
        global $conn;
        $table = "system-unit";
        $sql = "DELETE FROM `$table` WHERE idx='$idx'";
        if(mysqli_query($conn,$sql)){
            return "true*_*Successfully deleted this designation.";
        }else{
            return "System Error!";
        }
    }

    session_start();
    if($_SESSION["isLoggedIn"] && $_SESSION["access"] == "super-admin"){
        $idx = sanitize($_POST["idx"]);
        echo deleteUnit($idx);
    }else{
        echo "Access Denied!";
    }
}else{
    echo "Access Denied!";
}
?>
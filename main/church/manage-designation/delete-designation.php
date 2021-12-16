<?php
if(isset($_POST)){
    include_once "../../../system/backend/config.php";

    function deleteDesignation($idx){
        global $conn;
        $table = "system-designation";
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
        echo deleteDesignation($idx);
    }else{
        echo "Access Denied!";
    }
}else{
    echo "Access Denied!";
}
?>
<?php
if($_POST){
    include_once "../../../system/backend/config.php";

    function saveSetting($idx,$description){
        global $conn;
        $table = "church";
        $sql = "UPDATE `$table` SET description='$description' WHERE idx='$idx'";
        if(mysqli_query($conn,$sql)){
            return "true*_*";
        }else{
            return "System Failed!";
        }
    }

    session_start();
    if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "church"){
        $church = $_SESSION["church"];
        $description = sanitize($_POST["description"]);

        echo saveSetting($church,$description);
    }else{
        echo "Access Denied!";
    }
}else{
    echo "Access Denied!";
}
?>
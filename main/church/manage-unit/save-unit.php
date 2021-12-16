<?php
if(isset($_POST)){
    include_once "../../../system/backend/config.php";

    function saveUnit($idx,$name,$status){
        global $conn;
        $table = "system-unit";
        if($idx == ""){
            $sql = "INSERT INTO `$table` (name,status) VALUES ('$name','$status')";
            if(mysqli_query($conn,$sql)){
                return "true*_*Successfully added this designation.";
            }else{
                return "System Error!";
            }
        }else{
            $sql = "UPDATE `$table` SET name='$name',status='$status' WHERE idx='$idx'";
            if(mysqli_query($conn,$sql)){
                return "true*_*Successfully updated this designation.";
            }else{
                return "System Error!";
            }
        }
    }

    session_start();
    if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "super-admin"){
        $idx = sanitize($_POST["idx"]);
        $name = sanitize($_POST["name"]);
        $status = sanitize($_POST["status"]);
        echo saveUnit($idx,$name,$status);
    }else{
        echo "Access Denied!";
    }
}else{
    echo "Access Denied!";
}
?>
<?php
if($_POST){
    include_once "../../../system/backend/config.php";

    function saveAccount($idx,$name,$username,$access,$church){
        global $conn;
        $table = "account";
        if($idx == ""){
            if($access == "church"){
                $sql = "INSERT INTO `$table` (name,username,password,access,churchidx) VALUES ('$name','$username','123456','$access','$church')";
            }else{
                $sql = "INSERT INTO `$table` (name,username,password,access) VALUES ('$name','$username','123456','$access')";
            }
            if(mysqli_query($conn,$sql)){
                return "true*_*";
            }else{
                return "System Failed!";
            }
        }else{
            if($access == "church"){
                $sql = "UPDATE `$table` SET name='$name',username='$username',access='$access',churchidx='$church' WHERE idx='$idx'";
            }else{
                $sql = "UPDATE `$table` SET name='$name',username='$username',access='$access',churchidx='$church' WHERE idx='$idx'";
            }
            if(mysqli_query($conn,$sql)){
                return "true*_*Successfully updated " . $name . "'s account in account list.";
            }else{
                return "System Failed!";
            }
        }
    }

    session_start();
    if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "admin"){
        $idx = sanitize($_POST["idx"]);
        $name = sanitize($_POST["name"]);
        $username = sanitize($_POST["username"]);
        $access = sanitize($_POST["access"]);
        $church = sanitize($_POST["church"]);

        if(!empty($name) && !empty($username) && !empty($access)){
            echo saveAccount($idx,$name,$username,$access,$church);
        }else{
            echo "Network Error!";
        }
    }else{
        echo "Access Denied!";
    }
}else{
    echo "Access Denied!";
}
?>
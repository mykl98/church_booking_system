<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function saveProfileSettings($idx,$image,$name,$username){
            global $conn;
            $table = "account";
            $sql = "UPDATE `$table` SET image='$image',name='$name',username='$username' WHERE idx='$idx'";
            if(mysqli_query($conn,$sql)){
                return "true*_*Successfully updated your profile.";
            }else{
                return "System Error!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "church"){
            $idx = $_SESSION["loginidx"];
            $image = sanitize($_POST["image"]);
            $name = sanitize($_POST["name"]);
            $username = sanitize($_POST["username"]);

            echo saveProfileSettings($idx,$image,$name,$username);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
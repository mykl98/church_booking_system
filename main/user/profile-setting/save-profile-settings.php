<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function checkIfContainNumbers($string){
            if (strcspn($string, '0123456789') != strlen($string)){
                return "true";
            }else{
                return "false";
            }
        }

        function saveProfileSettings($idx,$image,$name,$number,$address,$username){
            global $conn;
            if(checkIfContainNumbers($name) == "true"){
                return "Invalid name, it contains numbers.";
            }
            $table = "account";
            $sql = "UPDATE `$table` SET image='$image',name='$name',number='$number',address='$address',username='$username' WHERE idx='$idx'";
            if(mysqli_query($conn,$sql)){
                return "true*_*Successfully updated your profile.";
            }else{
                return "System Error!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "user"){
            $idx = $_SESSION["loginidx"];
            $image = sanitize($_POST["image"]);
            $name = sanitize($_POST["name"]);
            $number = sanitize($_POST["number"]);
            $address = sanitize($_POST["address"]);
            $username = sanitize($_POST["username"]);

            echo saveProfileSettings($idx,$image,$name,$number,$address,$username);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
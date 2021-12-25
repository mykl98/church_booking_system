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

    function saveChurch($idx,$name,$address,$description){
        global $conn;
        if(checkIfContainNumbers($name) == "true"){
            return "Invalid church name, it contains numbers.";
        }
        $table = "church";
        if($idx == ""){
            $sql = "INSERT INTO `$table` (name,address,description) VALUES ('$name','$address','$description')";
            if(mysqli_query($conn,$sql)){
                return "true*_*Successfully added " . $name . "'s to department list.";
            }else{
                return "System Error!";// . mysqli_error($conn);
            }
        }else{
            $sql = "UPDATE `$table` SET name='$name',address='$address',description='$description' WHERE idx='$idx'";
            if(mysqli_query($conn,$sql)){
                return "true*_*";
            }else{
                return "System Error!";// . mysqli_error($conn);
            }
        }
    }

    session_start();
    if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "admin"){
        $idx = sanitize($_POST["idx"]);
        $name = sanitize($_POST["name"]);
        $address = sanitize($_POST["address"]);
        $description = sanitize($_POST["description"]);
        if(!empty($name) && !empty($address) && !empty($description)){
            echo saveChurch($idx,$name,$address,$description);
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
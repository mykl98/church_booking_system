<?php
if($_POST){
    include_once "../../../system/backend/config.php";

    function saveDepartment($idx,$image,$name,$shortName,$head,$status){
        global $conn;
        $table = "departments";
        if($idx == ""){
            $sql = "INSERT INTO `$table` (image,name,shortname,head,status) VALUES ('$image','$name','$shortName','$head','$status')";
            if(mysqli_query($conn,$sql)){
                return "true*_*Successfully added " . $name . "'s to department list.";
            }else{
                return "System Error!";// . mysqli_error($conn);
            }
        }else{
            $sql = "UPDATE `$table` SET image='$image',name='$name',shortname='$shortName',head='$head',status='$status' WHERE idx='$idx'";
            if(mysqli_query($conn,$sql)){
                return "true*_*Successfully updated " . $name . "'s in department list.";
            }else{
                return "System Error!";// . mysqli_error($conn);
            }
        }
    }

    session_start();
    if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "super-admin"){
        $idx = sanitize($_POST["idx"]);
        $image = sanitize($_POST["image"]);
        $name = sanitize($_POST["name"]);
        $shortName = sanitize($_POST["shortname"]);
        $head = sanitize($_POST["head"]);
        $status = sanitize($_POST["status"]);

        echo saveDepartment($idx,$image,$name,$shortName,$head,$status);
    }else{
        echo "Access Denied!";
    }
}else{
    echo "Access Denied!";
}
?>
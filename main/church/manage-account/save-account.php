<?php
if($_POST){
    include_once "../../../system/backend/config.php";

    function saveAccount($idx,$name,$username,$access,$department,$designation,$status){
        global $conn;
        $table = "account";
        if($idx == ""){
            if($access == "department"){
                $sql = "INSERT INTO `$table` (name,username,password,access,department,designation,deptaccess,status) VALUES ('$name','$username','123456','$access','$department','$designation','admin','$status')";
            }else{
                $sql = "INSERT INTO `$table` (name,username,password,access,status) VALUES ('$name','$username','123456','$access','$status')";
            }
            if(mysqli_query($conn,$sql)){
                return "true*_*";
            }else{
                return "System Failed!";
            }
        }else{
            if($access == "department"){
                $sql = "UPDATE `$table` SET name='$name',username='$username',access='$access',department='$department',designation='$designation',status='$status' WHERE idx='$idx'";
            }else{
                $sql = "UPDATE `$table` SET name='$name',username='$username',access='$access',department='',designation='',deptaccess='',status='$status' WHERE idx='$idx'";
            }
            if(mysqli_query($conn,$sql)){
                return "true*_*Successfully updated " . $name . "'s account in account list.";
            }else{
                return "System Failed2!";
            }
        }
    }

    session_start();
    if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "super-admin"){
        $idx = sanitize($_POST["idx"]);
        $name = sanitize($_POST["name"]);
        $username = sanitize($_POST["username"]);
        $access = sanitize($_POST["access"]);
        $department = sanitize($_POST["department"]);
        $designation = sanitize($_POST["designation"]);
        $status = sanitize($_POST["status"]);

        if(isset($name,$username,$access,$status)){
            echo saveAccount($idx,$name,$username,$access,$department,$designation,$status);
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
<?php
if($_POST){
    include_once "../../../system/backend/config.php";

    function saveDocument($idx,$documentId,$documentDate,$uploadDate,$description,$category,$visibility,$link,$status){
        global $conn;
        $table = "document";
        $sql = "UPDATE `$table` SET documentid='$documentId',documentdate='$documentDate',uploaddate='$uploadDate',description='$description',category='$category',visibility='$visibility',link='$link',status='$status' WHERE idx='$idx'";
        if(mysqli_query($conn,$sql)){
            return "true*_*";
        }else{
            return "System Failed!";
        }
    }

    session_start();
    if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "super-admin"){
        $idx = sanitize($_POST["idx"]);
        $documentId = sanitize($_POST["documentid"]);
        $documentDate = sanitize($_POST["documentdate"]);
        $uploadDate = sanitize($_POST["uploaddate"]);
        $description = sanitize($_POST["description"]);
        $category = sanitize($_POST["category"]);
        $visibility = sanitize($_POST["visibility"]);
        $link = sanitize($_POST["link"]);
        $status = sanitize($_POST["status"]);

        if(isset($idx,$documentId,$documentDate,$uploadDate,$description,$category,$visibility,$link,$status)){
            echo saveDocument($idx,$documentId,$documentDate,$uploadDate,$description,$category,$visibility,$link,$status);
        }else{
            echo "Network Error";
        }
        
    }else{
        echo "Access Denied1!";
    }
}else{
    echo "Access Denied2!";
}
?>
<?php
include_once "../system/backend/config.php";
    session_start();
    if($_SESSION["isLoggedIn"] == "true"){
        $access = $_SESSION["access"];
        switch($access){
            case "admin":
                header("location:admin/dashboard");
                exit();
                break;
            case "church":
                header("location:church/dashboard");
                exit();
                break;
            case "user":
                header("location:user/dashboard");
                exit();
                break;
            default:
                session_destroy();
                header("location:../index.php");
                exit();
                break;
        }
    }else{
        session_destroy();
        header("location:../index.php");
        exit();
    }
?>
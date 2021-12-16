<?php
session_start();
if($_SESSION["isLoggedIn"] != "true"){
    header("location:../../login.php");
    exit();
}
?>
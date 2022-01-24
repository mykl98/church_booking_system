<?php
$whitelist = array('127.0.0.1', "::1");

/*if(!in_array($_SERVER['REMOTE_ADDR'], $whitelist)){
    $servername = "localhost";
	$username = "u528264240_cbs";
	$password = "Skooltech_113012";
	$dbname = "u528264240_cbs";
	$conn = new mysqli($servername, $username, $password, $dbname);
	$baseUrl = "https://raptorapps.xyz/cbs";
}else{
	$servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = "cbs";
	$conn = new mysqli($servername, $username, $password, $dbname);
	$baseUrl = "http://localhost/churchbookingsystem";
}*/

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "cbs";
$conn = new mysqli($servername, $username, $password, $dbname);
$baseUrl = "http://192.168.1.3/churchbookingsystem";

date_default_timezone_set("Asia/Manila");

function sanitize($input){
	global $conn;
	$output = mysqli_real_escape_string($conn, $input);
	return $output;
}

function saveLog($log){
	$logFile = fopen("log.txt", "a") or die("Unable to open file!");
	$timeStamp = date("Y-m-d") . '-' . date("h:i:sa");
	fwrite($logFile, $timeStamp .' Log: '. $log . "\n");
	fclose($logFile);
}

function generateCode($length){
	$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$charactersLength = strlen($characters);
	$randomString = '';
	for ($i = 0; $i < $length; $i++) {
		$randomString .= $characters[rand(0, $charactersLength - 1)];
	}
	return $randomString;
}

function generateOTP($length){
	$characters = '0123456789';
	$charactersLength = strlen($characters);
	$randomString = '';
	for ($i = 0; $i < $length; $i++) {
		$randomString .= $characters[rand(0, $charactersLength - 1)];
	}
	return $randomString;
}

$shortCode = "23737526";
$passPhrase = "slQ2p8hokq";
$appId = "z5xjHEeRb8tBgin5BMcR6gtEa58oHGXX";
$appSecret = "810df2bbe3d25bfe2e8dd9ef64d85798231b9134e92f252b974ed1bdc60242f1";
?>
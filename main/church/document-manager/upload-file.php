<?php

if(isset($_FILES['file']['name']) && isset($_POST)){
    include_once "../../../system/backend/config.php";
    $department;
    session_start();
    
    function deleteFile($file){
        if(file_exists($file)){
            if (!unlink($file)) { 
                return "false"; 
            }else { 
                return "true"; 
            } 
        }
    }

    function getLink($idx){
        global $conn,$department;
        $link = "";
        $table = "document";
        $sql = "SELECT link,department FROM `$table` WHERE idx='$idx'";
        if($result=mysqli_query($conn,$sql)){
            if(mysqli_num_rows($result) > 0){
                $row = mysqli_fetch_array($result);
                $link = $row["link"];
                $department = $row["department"];
            }
            return $link;
        }else{
            return "false";
        }
    }

    function saveFile($idx){
        global $department;
        /* Getting file name */
        $getLink = getLink($idx);

        $filename = generateCode(100) . ".pdf";
        $valid_extensions = array("pdf");

        /* Location */
        $location = "../../../document/".$department."/".$filename;
        $fileType = pathinfo($location,PATHINFO_EXTENSION);

        if($getLink == "false"){
            return "System Error!";
        }else{
            $deleteFile = deleteFile($getLink);
            if($deleteFile == "false"){
                return "System Error!";
            }else{
                if(in_array(strtolower($fileType), $valid_extensions)) {
                    /* Upload file */
                    if(move_uploaded_file($_FILES['file']['tmp_name'],$location)){
                        $response = "true*_*". $location;
                    }else{
                        $response = "File upload error!";
                    }
                }else{
                    $response = "Invalid file type!Only PDF accepted.";
                }
                echo $response;
            }
        } 
    }

    if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "super-admin"){
        $idx = $_POST["idx"];
        echo saveFile($idx);
    }else{
        echo "Access Denied3!";
    }
}else{
    echo "Access Denied4!";
}
?>
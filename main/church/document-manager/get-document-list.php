<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function getCategory($idx){
            global $conn;
            $table = "document-category";
            $sql = "SELECT name FROM `$table` WHERE idx='$idx'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    $row = mysqli_fetch_array($result);
                    return $row["name"];
                }
            }
        }

        function getDocumentList($department){
            global $conn;
            $data = array();
            $table = "document";
            if($department == "all"){
                $sql = "SELECT * FROM `$table` ORDER BY idx DESC";
            }else{
                $sql = "SELECT * FROM `$table` WHERE department='$department' ORDER BY idx DESC";
            }
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        if($row["idx"] != 0){
                            $value = new \StdClass();
                            $value -> idx = $row["idx"];
                            $value -> documentid = $row["documentid"];
                            $value -> documentdate = $row["documentdate"];
                            $value -> description = $row["description"];
                            $value -> category = getCategory($row["category"]);
                            $value -> visibility = $row["visibility"];
                            $value -> link = $row["link"];
                            $value -> root = $_SERVER['DOCUMENT_ROOT'];
                            $value -> status = $row["status"];

                            array_push($data,$value);
                        }
                    }
                }
                $data = json_encode($data);
                return "true*_*".$data;
            }else{
                return "System Error!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "super-admin"){
            $department = $_POST["department"];
            if(isset($department)){
                echo getDocumentList($department);
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
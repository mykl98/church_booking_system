<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function getCategories($department){
            global $conn;
            $data = array();
            $table = "document-category";
            $sql = "SELECT * FROM `$table` WHERE department='$department'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value -> idx = $row["idx"];
                        $value -> name = $row["name"];
                        array_push($data,$value);
                    }
                }
            }
            $data = json_encode($data);
            return $data;
        }

        function getDepartmentName($idx){
            global $conn;
            $name = "";
            $table = "departments";
            $sql = "SELECT name FROM `$table` WHERE idx='$idx'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    $row = mysqli_fetch_array($result);
                    $name = $row["name"];
                }
            }
            return $name;
        }

        function getDocumentDetail($idx){
            global $conn;
            $data = array();
            $table = "document";
            $sql = "SELECT * FROM `$table` WHERE idx='$idx'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        if($row["idx"] != 0){
                            $value = new \StdClass();
                            $value -> documentid = $row["documentid"];
                            $value -> documentdate = $row["documentdate"];
                            $value -> uploaddate = $row["uploaddate"];
                            $value -> categories = getCategories($row["department"]);
                            $value -> department = getDepartmentName($row["department"]);
                            $value -> category = $row["category"];
                            $value -> description = $row["description"];
                            $value -> visibility = $row["visibility"];
                            $value -> link = $row["link"];
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
            $idx = $_POST["idx"];
            echo getDocumentDetail($idx);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>
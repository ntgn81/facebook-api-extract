<?php
    if($_SERVER['REQUEST_METHOD'] == 'POST') {
        $filename = $_POST['filename'];
        if(unlink('../data/'.$filename)) {
            echo 'true';
        }else {
            echo 'false';
        }
    }

?>
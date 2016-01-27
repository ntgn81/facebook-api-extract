<?php
$files = array();
try {
    $dir = 'data';
    foreach (new DirectoryIterator($dir) as $file) {
        if ($file->isFile()) {
            $files[] = $file->getFilename();
        }
    }

} catch (Exception $e) {

}
?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Facebook Data Extractor</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap-theme.min.css">
    <link href='http://fonts.googleapis.com/css?family=VT323' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="css/style.css">
</head>
<body ng-app="PageInfo" ng-controller="AppController">
<div id="fb-root"></div>
<!-- Fixed navbar -->
<nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">FExtract</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li ><a href="index.html">Dashboard</a></li>
                <li class="active"><a href="#">Download</a></li>
            </ul>
        </div><!--/.nav-collapse -->
    </div>
</nav> <!-- END: Navigation  -->

<div id="container" class="container">

    <table class="table table-bordered table-responsive">

    <?php
        if(count($files) > 0) {

            foreach($files as $file) {
                ?>
                <!-- Display all files here -->
                <tr>
                    <td>
                        <span class="filename"><?php echo $file; ?></span>
                    </td>
                    <td>
                        <a href="data/<?php echo $file; ?>" target="_blank" class="action btn btn-primary btn-sm" data-filename="<?php echo $file; ?>">Download</a>
                        <a href="#" class="action btn btn-warning btn-sm" data-filename="<?php echo $file; ?>" id="delete">Delete</a>
                    </td>
                </tr>

                <?php
            }
            ?>
    </table>

<?php
    }else {
            ?>
        <!-- No files found. -->

    <?php
        }
    ?>
</div>


<!-- Load Vendor Scripts -->
<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
<script>
    $(document).on('click', '#delete', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var that = $(this);
        var filename = that.data('filename');
        var shouldDelete = confirm('Are you sure you want to delete this file?');
        if(shouldDelete) {
            $.ajax({
                url: 'include/deleteCsv.php',
                method: 'post',
                data: {
                    filename: filename
                },
                success: function(response) {
                    that.parents('tr').remove();
                }
            })
        }
    });
</script>
</body>
</html>

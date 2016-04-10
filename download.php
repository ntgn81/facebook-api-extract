<?php
  $files = array();
  try {
    $dir = 'data';
    foreach (new DirectoryIterator($dir) as $file):
      if ($file->isFile()):
        $files[] = $file->getFilename();
      endif;
    endforeach;
  } catch (Exception $e) {
    var_dump($e->getMessage());
  }

require_once('include/head.php');
?>

<body ng-app="PageInfo" ng-controller="AppController">
  <div id="fb-root"></div>

  <?php require_once('include/navigation.php'); ?>
  
  <div id="container" class="container">
    <table class="table table-bordered table-responsive">
      <?php
      if(count($files) > 0):
        foreach($files as $file):
      ?>
        <tr>
          <td>
            <span class="filename"><?php echo $file; ?></span>
          </td>
          <td>
            <a href="data/<?php echo $file; ?>"
              target="_blank"
              class="action btn btn-primary btn-sm"
              data-filename="<?php echo $file; ?>">Download</a>
            <a href="#"
              class="action btn btn-warning btn-sm"
              data-filename="<?php echo $file; ?>" id="delete">Delete</a>
          </td>
        </tr>
      <?php endforeach; ?>
    </table>
    <?php else: ?>
      <!-- No files found. -->
    <?php endif; ?>
  </div>

<!-- Load Vendor Scripts -->
<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
<script>

  // ditch jquery
  // refactor into a service method

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
      });
    }
  });
</script>
</body>
</html>

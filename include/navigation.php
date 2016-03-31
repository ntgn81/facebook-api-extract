<nav class="navbar navbar-inverse navbar-fixed-top">
  <div class="container">
    <div class="navbar-header">
      <button
        type="button"
        class="navbar-toggle collapsed"
        data-toggle="collapse"
        data-target="#navbar"
        aria-expanded="false"
        aria-controls="navbar">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="index.php">FExtract</a>
    </div>
    <div id="navbar" class="navbar-collapse collapse">
      <ul class="nav navbar-nav">
        <li><a href="index.php">Dashboard</a></li>
        <li><a href="download.php">Download</a></li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li ng-show="username"><a href="#">{{username}}</a></li>
        <li ng-hide="isLoggedIn"><a href="#" ng-click="fblogin()">Login</a></li>
        <li ng-show="isLoggedIn"><a href="#" ng-click="fblogout()">Logout</a></li>
      </ul>
    </div>
  </div>
</nav>

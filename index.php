<?php require_once('include/head.php'); ?>

<body ng-app="PageInfo" ng-controller="AppController">
  <div id="fb-root"></div>

  <?php require_once('include/navigation.php'); ?>

  <div id="container" class="container">
    <div class="row">
      <div class="col-md-4" id="sidebar">
          <div id="settings" class="sidebar-section">
            <h4>Settings:</h4>
            <hr>
            <div class="row">
              <div class="form-group">
                <div class="col-md-6 vc">
                  <label for="min-likes" title="Minimum amount of page likes you want to download.">Minmum Likes:</label>
                </div>
                <div class="col-md-6 vc">
                  <input
                    ng-model="settings.minLikes"
                    id="min-likes"
                    name="min-likes"
                    type="number"
                    value="5000" min="1000"
                    max="1000000" step="1000"
                    class="form-control">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 vc">
                <label for="requestInterval" title="Interval between each request sent to Facebook in ms">Interval:</label>
              </div>
              <div class="col-md-6 vc">
                <input
                  ng-model="settings.requestInterval"
                  class="form-control"
                  name="requestInterval"
                  type="number"
                  value="800" min="200"
                  step="1000"
                  id="requestInterval">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 vc">
                <label for="filename" title="Filename you want to save the data.">Filename:</label>
              </div>
              <div class="col-md-6 vc">
                <input type="text" ng-model="settings.filename" class="form-control" name="filename" id="filename">
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 vc">
                <label for="categories">Categories</label>
              </div>
            </div>
            <div class="row" style="margin-bottom: 20px;">
              <div class="col-md-12 vc">
                <div ng-repeat="category in settings.categories" class="category">
                  {{category}}
                  <span  ng-click="removeCategory(category)"><i class="glyphicon glyphicon-remove"></i></span>
                </div>
              </div>
            </div>
            <div class="row">
              <form ng-submit="">
                <div class="col-md-8 vc">
                  <input ng-model="newCategory" class="form-control" type="text" id="add-category" placeholder="New Category Name">
                </div>
                <div class="col-md-4 vc">
                  <button ng-click="addCategory(newCategory)" type="submit" class="btn btn-primary">Add</button>
                </div>
              </form>
            </div>
          </div>
          <div id="counter" class="sidebar-section">
            <h4>Progress</h4>
            <hr>
            <div id="progress">
              <p>
                <span  ng-class="{'running': queryStart, 'finished': queryFinished}">1: Getting Data</span>
              </p>
              <p>
                <span ng-class="{'running': validationStart, 'finished': validationFinished}">2: Validating Data</span>
              </p>
              <p>
                <span ng-class="{'running': saveStart, 'finished': saveFinished}">3: Saving Data to CSV</span>
              </p>
              <p>
                <span ng-class="{'finished': saveFinished}">4: Done!</span>
              </p>
            </div>
            <p>
              Total Pages: <span>{{pagesCount | number}}</span>
            </p>
            <p>
              Valid Pages: <span>{{validPagesCount | number}}</span>
            </p>
            <p>
              Invalid Pages: <span>{{invalidPagesCount | number}}</span>
            </p>
        </div>
      </div>

      <div class="col-md-8" id="main-container">
        <div id="search-box">
          <form class="form-inline">
            <div class="form-group">
              <label for="keyword">Keyword:</label>
              <input ng-model="keyword" type="search" class="form-control" id="keyword" placeholder="Enter your keyword here">
            </div>
            <button
              type="submit"
              class="btn btn-success"
              ng-click="initializeSearch(keyword)"
              ng-disabled="queryStart">Search</button>
            <button
              type="submit"
              class="btn btn-warning"
              ng-click="stopQuery()"
              ng-disabled="!queryStart">Stop</button>
          </form>
          <div id="keyword-state" ng-show="queryStart">
            <div id="keywords-left">
              <div ng-hide="queryFinished" ng-repeat="keyword in keywords" class="category keyword">
                {{keyword}}
              </div>
            </div>
            <div id="keywords-done">
              <div ng-repeat="keyword in finishedKeywords" class="category keyword">
                {{keyword}}
              </div>
            </div>
          </div>
        </div>
        <div id="result-container">
          <div ng-repeat="page in pages  | limitTo:15:0 ">
            <page page="page"></page>
          </div>

          <div id="bottom-controls" ng-show="showPagination">
            <button class="btn btn-primary prev">Prev</button>
            <button class="btn btn-primary next">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>

<!-- Load Vendor Scripts -->
<?php require_once('include/vendor-js.php'); ?>
</body>
</html>

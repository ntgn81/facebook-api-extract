<?php
ini_set('display_errors', '1');
require_once 'parsecsv.lib.php';


$csv = new parseCSV();
if($_SERVER['REQUEST_METHOD'] == 'POST') {

    $pages = json_decode($_POST['pages']);
    $filename = json_decode($_POST['filename']);
    $keyword = json_decode($_POST['keyword']);

    $sorted_pages = [];
    $lnth = sizeof($pages);
    $filepath = '../data/'.$filename.'.csv';
    if(!file_exists($filepath)) {
        $csv->save($filepath, array(array('ID', 'Name', 'Likes', 'Category', 'Website', 'Email', 'Page Url', 'Keyword')), true);
    }

    for($i = 0; $i < $lnth; $i++) {
        $innerArray = [];
        $innerArray['id'] = $pages[$i]->{'id'};
        $innerArray['name'] = $pages[$i]->{'name'};
        $innerArray['likes'] = $pages[$i]->{'likes'};
        $innerArray['category'] = $pages[$i]->{'category'};
        $innerArray['website'] = $pages[$i]->{'website'};
        $innerArray['email'] = $pages[$i]->{'emails'}[0];
        $innerArray['link'] = $pages[$i]->{'link'};
        $innerArray['keyword'] = $keyword[0];
        $sorted_pages[] = $innerArray;
    }

    $csv->save($filepath, $sorted_pages, true);

    echo 'true';


}
?>



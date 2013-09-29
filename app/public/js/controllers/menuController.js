angular.module('homejs.controllers')
  .controller("MenuController",function($scope, $http) {

    $scope.items = [
    {"itemId":1, "title":"Overview", "description":"Overview", href: "#/",
     "sublinks":[
            /*{"title":"Google", "href":"http://google.com/", "target":"_blank"}*/
      ]},
    {"itemId":2, "title":"Charts", "description":"Charts", href: "#/charts",
        "sublinks":[ 
            /*{"title":"Yahoo", "href":"http://yahoo.com/", "target":"_blank" }*/
        ]},
    {"itemId":3, "title":"Devices", "description":"Devices", href: "#/devices",
         "sublinks":[
            /*{"title":"Bing", "href":"http://www.bing.com", "target":"_blank" }*/
         ]},
    {"itemId":4, "title":"Automation", "description":"Automation", href: "#/automations",
         "sublinks":[
             /*{"title":"Dogpile", "href":"http://www.dogpile.com", "target":"_blank"},*/
        ]},
    {"itemId":5, "title":"Events", "description":"Events",href: "#/events",
         "sublinks":[]},
    {"itemId":5, "title":"Admin", "description":"Admin",href: "#/admins",
         "sublinks":[
            {"title":"Configurations", "href":"#/admins/configurations"},
            {"title":"Services", "href":"#/admins/services"},
         ]},
    {"itemId":6, "title":"Info", "description":"Info",href: "#/info",
         "sublinks":[
            {"title":"github pages", "href":"http://github.com/jupe/home.js", "target":"_blank"},
            {"title":"Report issue", "href":"https://github.com/jupe/home.js/issues/new", "target":"_blank"},
         ]}
    ];
    
    // Defaults
    $scope.sublinks = null;
    $scope.activeItem = null;

    // Default submenu left padding to 0
    $scope.subLeft = {'padding-left':'0px'};

    /*
     * Set active item and submenu links
     */
    $scope.showSubMenu = function(item,pos) {
        // Move submenu based on position of parent
        $scope.subLeft = {'padding-left':(80 * pos)+'px'};
        // Set activeItem and sublinks to the currectly
        // selected item.
        $scope.activeItem = item;
        $scope.sublinks = item.sublinks;
    };
    $scope.hideSubMenu = function(){
      $scope.sublinks = null;
      $scope.activeItem = null;
    }
}); 
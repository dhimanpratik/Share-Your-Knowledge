angular.module('app', ['ionic','firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    
    .state('page3', {
      url: '/home',
      templateUrl: 'templates/page3.html'
    })
  
    .state('newPost', {
      url: '/NewPost',
      templateUrl: 'templates/newPost.html'
    })
    
    .state('side-menu1', {
      url: '/menu',
      templateUrl: 'templates/side-menu1.html'
    })
  
    .state('chatScreen', {
      url: '/chatScreen',
      templateUrl: 'templates/chatScreen.html'
    })
    ;

  // if none of the above states are matched, use this as the fallback
  
  $urlRouterProvider.otherwise('/home');
  

})
        
.controller('navController', function($scope, $ionicSideMenuDelegate) {
      $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
      };
    })

.controller('BackBack', function($scope, $ionicHistory) {
      $scope.goB = function() {
        $ionicHistory.goBack();
      };
    })

.controller('SignInCtrl',['$scope','$firebaseObject','$firebaseAuth', function($scope,$firebaseObject,$firebaseAuth){
    console.log("Into");
    var ref = new Firebase("https://syk.firebaseio.com/");
  $scope.user = {emailid:"",pass:""};
    
    $scope.Connect = function(){
  var eid = $scope.user.emailid;
  var password = $scope.user.pass;

    ref.authWithPassword({
            "email": eid,
            "password": password
        }, function(error, authData) {
        if (error) {
                    console.log("Login Failed!", error);
            } else {
                    console.log("Authenticated successfully with payload:", authData);
                    }
        });    
    };
    
    $scope.NewConnect = function(){
        
    $scope.authObj = $firebaseAuth(ref);
        
    $scope.authObj.$createUser({
  email: $scope.user.emailid,
  password: $scope.user.pass
}).then(function(userData) {
  console.log("User " + userData.uid + " created successfully!");     
    });       
        
        };
    
}])


.controller('AddNewPost',['$scope','$firebaseObject',function($scope,$firebaseObject){
    $scope.post = {category:"",name:"",descrip:""};
    
        
    $scope.AddNew = function()
    {
        var ref = new Firebase("https://syk.firebaseio.com/"+$scope.post.category+"/");
        //var obj = $firebaseObject(ref);
        ref.push({'name':$scope.post.name,
                  'desc':$scope.post.descrip});
        var path = ref.toString();
        console.log(path);
        
    };

}])


.controller('GetPosts',['$scope','$rootScope','$firebaseObject',function($scope,$rootScope,$firebaseObject){
    //var a = {name: 'pratik',desc:'hhhhhhhhh'};
    //var b = {name: 'krina',desc:'hhhhhhhhh'};
/*$scope.main = 'abc':[
    {'a':{name: 'pratik',desc:'hhhhhhhhh'}},
    {'b':{name: 'krina',desc:'hhhhhhhhh'}}
];*/
  /*  $scope.abc = { 

   "-Jol8Ax_Z0sbMnd_-PYT" :  
      { "Name"  : "Pratik", "desc" : "jhjghghjghjghj" }
   ,                       
   "-Jol954Ew5kg79CHikKw" : 
      { "Name"  : "Krina", "desc" : "iuyuyuyuyuyuyu" }   
};   */ 

   // $scope.data = {};
   //  $scope.data = "";
    var ref = new Firebase("https://syk.firebaseio.com/Technology/");

ref.on("value", function(snapshot) {
  //console.log(snapshot.val());
  $rootScope.data = snapshot.val();
  console.log($rootScope.data);
    $scope.$apply();
  //console.log($scope.abc);
  console.log("key="+$rootScope.data);     
          
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
$scope.saveKey = function(newKey){
$rootScope.keyvalue = newKey;
console.log("Key: "+$rootScope.keyvalue);

}
    
}])


.controller('ChatController',['$ionicScrollDelegate','$scope','$rootScope','$firebaseObject',function($ionicScrollDelegate,$scope,$rootScope,$firebaseObject){
    
    console.log("Key from chats: "+$rootScope.keyvalue);
 $scope.rep="";
    var ref = new Firebase("https://syk.firebaseio.com/Technology/"+$rootScope.keyvalue);
    
var obj = $firebaseObject(ref);
    
  obj.$loaded().then(function() {
        console.log("loaded record:", obj.$id, obj.name,obj.desc);
      $scope.details = {'name':obj.name,'desc':obj.desc};
     });
    
    var ref2 = new Firebase("https://syk.firebaseio.com/Technology/"+$rootScope.keyvalue+"/reps");  
    ref2.on("value", function(snapshot) {
  $rootScope.chatdata = snapshot.val();
  console.log($rootScope.chatdata);
    $scope.$apply();    
                $ionicScrollDelegate.scrollBottom(true);

}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
    
    $scope.reply = function(){
        
    var ref = new Firebase("https://syk.firebaseio.com/Technology/"+$rootScope.keyvalue+"/reps");

    ref.push({'name':'xyz',
            'reply':$scope.rep});
        var path = ref.toString();
        console.log(path);
        $ionicScrollDelegate.scrollBottom(true);
    };
    
    
}])

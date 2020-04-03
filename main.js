//if (document.URL.includes("azure")) {
//    console.log("azure");
//}

var app = angular.module('app', ['smart-table']);

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter);
                });
                        
                event.preventDefault();
            }
        });
    };
});

app.controller('MainCtrl', function($scope, rafflerFactory) { 
    $scope.rawItems = rafflerFactory.get();
    $scope.displayedItems = [].concat($scope.rawItems);

    $scope.pickAWinner = function() {
        $scope.winner = rafflerFactory.pickAWinner($scope.rawItems);
    };  
    
    $scope.clearWinner = function(e) {
        e.preventDefault();
        $scope.winner = null;
    };
    
    $scope.err = function(err) {
        alert("Oops, " + err + ".");
    };
    
    $scope.add = function() {
        var item = {
            name: $scope.newName,
            totalCount: 1
        }
        
        rafflerFactory.create(item)
            .then(function() {
                $scope.rawItems.push(item);
                $scope.newName = null;
            }).catch(function(err) {
                $scope.err(err);
            });
    };
  
    $scope.incrOrDecr = function(e, index, incrOrDecr) {
        e.preventDefault();
        
        var diff = incrOrDecr == "incr" ? 1 : -1;
        var item = $scope.rawItems[index];
        
        item.totalCount = parseInt(item.totalCount) + diff;
        rafflerFactory.incrOrDecr(item, item.totalCount);
    };
  
    $scope.remove = function(e, index) {
        e.preventDefault();
        var item = $scope.rawItems[index];
        rafflerFactory.remove(item);
        $scope.rawItems.splice(index,1);
    };
    
    $scope.removeAll = function(e) {
        e.preventDefault();
        if (!confirm("Are you sure?")) return;
        
        rafflerFactory.removeAll();
        $scope.rawItems = [];
    }
});

/*
function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}
*/
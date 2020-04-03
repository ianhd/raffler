app.factory('rafflerFactory', function($q, $timeout) {
    var personKey = 'person';
    
    var _get = function() {
        var people = localStorage.getItem(personKey);
        return people ? JSON.parse(people) : [];
    };
    
    var _save = function(people) {
        localStorage.removeItem(personKey);
        localStorage.setItem(personKey, JSON.stringify(people));
    };
    
    return {
        get: function() {
            return _get();    
        },
        
        create: function(person) {
            var deferred = $q.defer();

            var people = _get();
            var alreadyExists = _.some(people, function(p) { return p.name == person.name; });

            $timeout(function() {
                if (alreadyExists) {
                    deferred.reject("this name is already in the list");
                } else {
                    people.push(person);
                    _save(people);
                    deferred.resolve();
                }                
            });
            
            return deferred.promise;
        },
        
        incrOrDecr: function(person, newTotalCount) {
            var people = _.map(_get(), function(p) {
                if (p.name !== person.name) return p; // if this isn't the person, do nothing to it
                p.totalCount = newTotalCount; // this is the person, so adjust the totalCount
                return p;
            });
            _save(people);
        },
        
        remove: function(person) {
            var people = _.filter(_get(), function(p) {
                return p.name !== person.name; // incl. all names except the one passed in
            });
            _save(people);
        },
        
        removeAll: function(person) {
            _save([]);
        },
        
        pickAWinner: function(items) {
            var temp = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                for (var j = 0; j < item.totalCount; j++) {
                    temp.push(item.name);
                }
            }

            var raffleCount = temp.length;
            var randomIndex = Math.floor(Math.random() * (raffleCount)); // between 0 (incl) and length (excl)

            return temp[randomIndex];            
        }
    };
});
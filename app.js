/**
 * Created by hhe on 12/1/2016.
 */
(function () {
    'use strict';
    var app = angular.module('NarrowItDownApp', []);
    app.controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', foundItems);

    //directives
    function foundItems() {
        var ddo = {
            templateUrl:'directive/menuItems.html',
            scope: {
                title: '@',
                found: '<', //one-way binding
                onRemove: '&'  //reference binding
            }
        }
        return ddo;
    }
    
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var list = this;
        list.getItems = function (search) {
            var promise = MenuSearchService.getMatchedMenuItems();
            promise.then(function (result) {
                list.found = [];
                var response = result.data;
                //convert from object to array
                var response_array = response.menu_items;
                // loop through each items 
                for (var i = 0; i < response_array.length; i++) {
                    if (response_array[i].description.toLowerCase().indexOf(search) !== -1 && search) {
                        var item = {name: response_array[i].name, description: response_array[i].description};
                        list.found.push(item);
                    }
                } // end loop
                if(list.found.length && search) { list.title = 'A list of found menu items';}
                else { list.title="Nothing found!";}
            });
        };
        list.removeItem = function (index) {
            list.found.splice(index, 1);
        };
    }

    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
        var service = this;
        service.getMatchedMenuItems = function () {
            var response = $http({
                method: 'GET',
                url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
            });
            return response;
        };
    }
} )();
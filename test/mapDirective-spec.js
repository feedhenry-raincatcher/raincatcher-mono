var initMapDirectiveModule = require('./initMapDirectiveModule');
var CONSTANTS = require('../lib/angular/constants');

var angular = require('angular');
require('angular-mocks');

var sinon = require('sinon');
var chai = require('chai');

var expect = chai.expect;

describe("Map Directive",function(){

    var mediator = {};
    var self = {};
    function initModuleDependencies(){
        angular.module('wfm.core.mediator',[]);
        angular.mock.module(CONSTANTS.MAP_DIRECTIVE,function($provide){
            $provide.value('mediator',mediator);
        });
    }

    function initDirective()
    {
        var $rootScope;
        var $compile;
        inject(function (_$rootScope_, _$compile_) {
            $rootScope = _$rootScope_;
            $compile = _$compile_;
            self.scope = $rootScope.$new();
            self.element = '<workorder-map container-selector="testing"></workorder-map>';
            self.element = $compile(self.element)(self.scope);
            self.scope.$digest();
            self.element.data('$workorderMapController', {});
            self.mapController = self.element.scope().mapCtrl;

        });
    }

    before(function(){
        initMapDirectiveModule();
        require('../lib/angular/directive');
        require('../lib/angular/controller');
        require('../dist');
    });

    beforeEach(initModuleDependencies);
    //beforeEach(angular.mock.module(CONSTANTS.MAP_DIRECTIVE));
    beforeEach(initDirective);

    it('Should contain only one div element',function(){
        console.log(angular.module(CONSTANTS.MAP_DIRECTIVE).info());
        expect(self.element.find('#gmap_canvas').length).to.equal(1);
    });
});
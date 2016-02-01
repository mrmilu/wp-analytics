var m = angular.module('wp-analytics', []);

var AEClick = function(WPAnalytics) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.click(function() {
        var data = 'aeData' in attrs ? scope.$eval(attrs.aeData) : {};
        WPAnalytics.trackEvent(data);
      });
    }
  };
};

var AEChange = function(WPAnalytics) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      ngModelCtrl.$viewChangeListeners.push(function() {
        if ('aeValidOnly' in attrs && ngModelCtrl.$invalid) return;

        var data = 'aeData' in attrs ? scope.$eval(attrs.aeData) : {};
        if (!('aePreventValue' in attrs)) data['value'] = ngModelCtrl.$viewValue;

        data['validation'] = ngModelCtrl.$valid ? 'valid' : 'invalid';
        WPAnalytics.trackEvent(data);
      });
    }
  };
};

var AEForm = function(WPAnalytics) {
  return {
    restrict: 'A',
    require: 'form',
    link: function(scope, element, attrs, formCtrl) {
      // On validation change
      scope.$watch(function() {
        return formCtrl.$valid;
      }, function(validity) {
        if ('aeValidOnly' in attrs && formCtrl.$invalid) return;

        var data = 'aeData' in attrs ? scope.$eval(attrs.aeData) : {};
        data['validation'] = formCtrl.$valid ? 'valid' : 'invalid';
        WPAnalytics.trackEvent(data);
      });
    }
  };
};

var AEBlur = function(WPAnalytics) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      element.blur(function() {
        if ('aeValidOnly' in attrs && ngModelCtrl.$invalid) return;

        var data = 'aeData' in attrs ? scope.$eval(attrs.aeData) : {};
        if (!('aePreventValue' in attrs)) data['value'] = ngModelCtrl.$viewValue;

        data['validation'] = ngModelCtrl.$valid ? 'valid' : 'invalid';
        WPAnalytics.trackEvent(data, attrs)
      });
    }
  };
};



var WPAnalytics = function () {
  var that = this;

  this.trackEventGTM = function(data) {
    dataLayer.push(data);
  };

  this.trackEventGA = function(data) {
    data['hitType'] = 'event';
    ga('send', data);
  };

  this.trackEventConsole = function(data) {
    console.log(data);
  };

  this.trackEvent = this.trackEventGTM;
  this.$get = [function() {
    return new function() {
      var service = {};

      service.trackEvent = function(data) {
        that.trackEvent(data);
      };

      return service;
    };
  }];
};

m.provider('WPAnalytics', WPAnalytics);
m.directive('aeBlur', ['WPAnalytics', AEBlur]);
m.directive('aeClick', ['WPAnalytics', AEClick]);
m.directive('aeForm', ['WPAnalytics', AEForm]);
m.directive('aeChange', ['WPAnalytics', AEChange]);

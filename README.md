# ui-date directive [![Build Status](https://travis-ci.org/angular-ui/ui-date.svg)](https://travis-ci.org/angular-ui/ui-date)

This directive allows you to add a date-picker to your form elements.

# Requirements

- AngularJS
- JQuery
- JQueryUI
- [Date.toISOString()](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/toISOString) (requires [polyfill](https://github.com/kriskowal/es5-shim/) for &le;IE8)

# Alternatives

Please consider using the excellent [ui-bootstrap](https://angular-ui.github.io/bootstrap/) date-picker which is maintained by a larger team.

# Usage

We use [bower](http://bower.io/) for dependency management.  Install and save to bower.json by running:

    bower install angular-ui-date --save

This will copy the ui-date files into your `bower_components` folder, along with its dependencies.

Add the css:

    <link rel="stylesheet" href="bower_components/jquery-ui/themes/smoothness/jquery-ui.css"/>

Load the script files in your application:

    <script type="text/javascript" src="bower_components/jquery/jquery.js"></script>
    <script type="text/javascript" src="bower_components/jquery-ui/jquery-ui.js"></script>
    <script type="text/javascript" src="bower_components/angular/angular.js"></script>
    <script type="text/javascript" src="bower_components/angular-ui-date/src/date.js"></script>

Add the date module as a dependency to your application module:

    angular.module('MyApp', ['ui.date'])

Apply the directive to your form elements:

    <input ui-date>

## Options

All the jQueryUI DatePicker options can be passed through the directive.

    myAppModule.controller('MyController', function($scope) {
      $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '1900:-0'
        };
    });

    <input ui-date="dateOptions" name="DateOfBirth">

## Static Inline Picker

If you want a static picker then simply apply the directive to a div rather than an input element.

    <div ui-date="dateOptions" name="DateOfBirth"></div>

## Working with ng-model

The ui-date directive plays nicely with ng-model and validation directives such as ng-required.

If you add the ng-model directive to same the element as ui-date then the picked date is automatically synchronized with the model value.

_The ui-date directive stores and expects the model value to be a standard javascript Date object._

## ui-date-format directive

The ui-date directive only works with Date objects.
If you want to pass date strings to and from the date directive via ng-model then you must use the ui-date-format directive.
This directive specifies the format of the date string that will be expected in the ng-model.
The format string syntax is that defined by the JQueryUI Date picker. For example

    <input ui-date ui-date-format="DD, d MM, yy" ng-model="myDate">

Now you can set myDate in the controller.

    $scope.myDate = "Thursday, 11 October, 2012";

## ng-required directive

If you apply the required directive to element then the form element is invalid until a date is picked.

Note: Remember that the ng-required directive must be explictly set, i.e. to "true".  This is especially true on divs:

    <div ui-date="dateOptions" name="DateOfBirth" ng-required="true"></div>


## Need help?
Need help using UI date?

* Ask a question in [StackOverflow](http://stackoverflow.com/) under the [angular-ui-date](http://stackoverflow.com/questions/tagged/angular-ui-date) tag.

**Please do not create new issues in this repository to ask questions about using UI date**

## Found a bug?
Please take a look at [CONTRIBUTING.md](CONTRIBUTING.md#you-think-youve-found-a-bug).

# Contributing to the project

We are always looking for the quality contributions! Please check the [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution guidelines.

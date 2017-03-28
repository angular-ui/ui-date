import jQuery from 'jquery';
import angular from 'angular';
import _datePicker from 'jquery-ui/datepicker'; // sets up jQuery with the datepicker plugin

export default angular.module('ui.date', [])
  .constant('uiDateConfig', {})
  .constant('uiDateFormatConfig', '')
  .factory('uiDateConverter', ['uiDateFormatConfig', function(uiDateFormatConfig) {
    return {
      stringToDate: stringToDate,
      dateToString: dateToString,
    };

    //https://github.com/angular/angular.js/blob/622c42169699ec07fc6daaa19fe6d224e5d2f70e/src/Angular.js#L1207
    function timezoneToOffset(timezone, fallback) {
      timezone = timezone.replace(/:/g, '');
      var requestedTimezoneOffset = Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
      return isNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
    }

    function addDateMinutes(date, minutes) {
      date = new Date(date.getTime());
      date.setMinutes(date.getMinutes() + minutes);
      return date;
    }

    function convertTimezoneToLocal(date, timezone, reverse) {
      reverse = reverse ? -1 : 1;
      var dateTimezoneOffset = date.getTimezoneOffset();
      var timezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
      return addDateMinutes(date, reverse * (timezoneOffset - dateTimezoneOffset));
    }

    function doTZ(date,timezone,reverse) {
      return timezone ? convertTimezoneToLocal(date, timezone, reverse) : date;
    }

    function dateToString(uiDateFormat, value) {
      var dateFormat = uiDateFormat || uiDateFormatConfig;
      if (value) {
        if (dateFormat) {
          try {
            return jQuery.datepicker.formatDate(dateFormat, value);
          } catch (formatException) {
            return undefined;
          }
        }

        if (value.toISOString) {
          return value.toISOString();
        }

      }
      return null;
    }

    function stringToDate(dateFormat, valueToParse, timezone) {
      dateFormat = dateFormat || uiDateFormatConfig;

      if (angular.isDate(valueToParse) && !isNaN(valueToParse)) {
        return doTZ(valueToParse, timezone);
      }

      if (angular.isString(valueToParse)) {
        if (dateFormat) {
          return doTZ(jQuery.datepicker.parseDate(dateFormat, valueToParse), timezone);
        }

        var isoDate = new Date(valueToParse);
        return isNaN(isoDate.getTime()) ? null : doTZ(isoDate, timezone);

      }

      if (angular.isNumber(valueToParse)) {
        // presumably timestamp to date object
        return doTZ(new Date(valueToParse), timezone);
      }

      return null;
    }
  }])

  .directive('uiDate', ['uiDateConfig', 'uiDateConverter', function uiDateDirective(uiDateConfig, uiDateConverter) {

    return {
      require: '?ngModel',
      link: function link(scope, element, attrs, controller) {

        var $element = jQuery(element);

        var getOptions = function() {
          return angular.extend({}, uiDateConfig, scope.$eval(attrs.uiDate));
        };
        var initDateWidget = function() {
          var showing = false;
          var opts = getOptions();
          var timezone = controller ? controller.$options.getOption('timezone') : null;

          function setVal(forcedUpdate) {
            var keys = ['Hours', 'Minutes', 'Seconds', 'Milliseconds'];
            var isDate = angular.isDate(controller.$modelValue);
            var preserve = {};

            if (!forcedUpdate && isDate && controller.$modelValue.toDateString() === $element.datepicker('getDate').toDateString()) {
              return;
            }

            if (isDate) {
              angular.forEach(keys, function(key) {
                preserve[key] = controller.$modelValue['get' + key]();
              });
            }

            var newViewValue = $element.datepicker('getDate');

            if (isDate) {
              angular.forEach(keys, (key) => {
                newViewValue['set' + key](preserve[key]);
              });
            }

            controller.$setViewValue(newViewValue);
          }

          // If we have a controller (i.e. ngModelController) then wire it up
          if (controller) {
            // Set the view value in a $apply block when users selects
            // (calling directive user's function too if provided)
            var _onSelect = opts.onSelect || angular.noop;
            opts.onSelect = function(value, picker) {
              scope.$apply(function() {
                showing = true;
                setVal();
                $element.blur();
                _onSelect(value, picker, $element);
              });
            };

            var _beforeShow = opts.beforeShow || angular.noop;
            opts.beforeShow = function(input, picker) {
              showing = true;
              _beforeShow(input, picker, $element);
            };

            var _onClose = opts.onClose || angular.noop;
            opts.onClose = function(value, picker) {
              showing = false;
              _onClose(value, picker, $element);
            };

            element.on('focus', function(focusEvent) {
              if (attrs.readonly) {
                focusEvent.stopImmediatePropagation();
              }
            });

            $element.off('blur.datepicker').on('blur.datepicker', function() {
              if (!showing) {
                scope.$apply(function() {
                  $element.datepicker('setDate', $element.datepicker('getDate'));
                  setVal();
                });
              }
            });

            controller.$validators.uiDateValidator = function uiDateValidator(modelValue, viewValue) {
              return   viewValue === null
                    || viewValue === ''
                    || angular.isDate(uiDateConverter.stringToDate(attrs.uiDateFormat, viewValue));
            };

            controller.$parsers.push(function uiDateParser(valueToParse) {
              return uiDateConverter.stringToDate(attrs.uiDateFormat, valueToParse, timezone);
            });

            // Update the date picker when the model changes
            controller.$render = function() {
              // Force a render to override whatever is in the input text box
              if (angular.isDate(controller.$modelValue) === false && angular.isString(controller.$modelValue)) {
                controller.$modelValue = uiDateConverter.stringToDate(attrs.uiDateFormat, controller.$modelValue, timezone);
              }
              $element.datepicker('setDate', controller.$modelValue);
            };
          }
          // Check if the $element already has a datepicker.
          //

          if ($element.data('datepicker')) {
            // Updates the datepicker options
            $element.datepicker('option', opts);
            $element.datepicker('refresh');
          } else {
            // Creates the new datepicker widget
            $element.datepicker(opts);

            // Cleanup on destroy, prevent memory leaking
            $element.on('$destroy', function() {
              $element.datepicker('hide');
              $element.datepicker('destroy');
            });
          }

          if (controller) {
            controller.$render();
            // Update the model with the value from the datepicker after parsed
            setVal(true);
          }
        };

        // Watch for changes to the directives options
        scope.$watch(getOptions, initDateWidget, true);
      },
    };
  }])

  .directive('uiDateFormat', ['uiDateConverter', function(uiDateConverter) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        var dateFormat = attrs.uiDateFormat;

        // Use the datepicker with the attribute value as the dateFormat string to convert to and from a string
        modelCtrl.$formatters.unshift(function(value) {
          return uiDateConverter.stringToDate(dateFormat, value);
        });

        modelCtrl.$parsers.push(function(value) {
          return uiDateConverter.dateToString(dateFormat, value);
        });
      },
    };
  }]);

/**
 * wraps angular's currency filter with an additional layer, in case the currency symbol is not available.
 */
angular.module('isoCurrency', ['isoCurrency.common'])
	.filter('isoCurrency', ["$filter", "iso4217", function ($filter, iso4217) {

		/**
	   * transforms an amount into the right format and currency according to a passed currency code (3 chars).
	   *
	   * @param float amount
	   * @param string currencyCode e.g. EUR, USD
	   * @param number fraction User specified fraction size that overwrites default value
	   * @return string
	   */
		return function (amount, currencyCode, fraction) {
			var currency = iso4217.getCurrencyByCode(currencyCode);

			if (!currency || amount == '') {
				return amount;
			}

			var fractionSize = fraction === void 0 ? currency.fraction : fraction;
			if (!currency.crypto)
				return $filter('currency')(amount, currency.symbol || currencyCode + ' ', fractionSize);
			else
				return $filter('currency')(amount, '', fractionSize);
		};
	}])
	.directive('isoCurrency', ["iso4217", function (iso4217) {

		return {
			template: '<span>{{amount | isoCurrency:currency}}</span>',
			scope: {
				amount: '@',
				currency: '@'
			},
			link: function ($scope, element, attributes) {
				var currency = iso4217.getCurrencyByCode(attributes.currency);
				if (currency != null) {
					var classToAdd = "";
					if (currency.crypto === true && currency.cssclass != null) {
						classToAdd = " " + currency.cssclass;

						element[0].className = element[0].className + classToAdd;
					}
				}
			}
		};
	}]);
/* global VBET5 */
/**
 * @ngdoc controller
 * @name vbet5.controller:footerCtrl
 * @description
 * footer controller
 */
VBET5.controller('footerCtrl', ['$scope', '$rootScope', '$window', '$sce', '$location', 'Config', 'DomHelper', 'smoothScroll', 'UserAgent', function ($scope, $rootScope, $window, $sce, $location, Config, DomHelper, smoothScroll, UserAgent) {
    'use strict';

    //footer text can contain HTML
    if (Config.main.about_company_text && (!Config.main.about_company_text[Config.env.lang] || typeof Config.main.about_company_text[Config.env.lang] === 'string')) {
        Config.main.about_company_text[Config.env.lang] = $sce.trustAsHtml(Config.main.about_company_text[Config.env.lang] || Config.main.about_company_text.eng || '');
    }

    /**
     * @ngdoc method
     * @name scrollToTop
     * @methodOf vbet5.controller:footerCtrl
     * @description Scrolls to beginning of page.
     *
     * @param {bool} [always] optional. If true, will scroll always, independent of screen size.
     * If false or not specified will scroll only on small screens
     */
    $scope.scrollToTop = function scrollToTop(always) {

        always = always || false;
        if (always || DomHelper.isScreenSmall()) {
            if (UserAgent.IEVersion()) {
                $window.scroll(0, 0);
            } else {
                smoothScroll('header');
            }


        }
    };

    if( $location.path().indexOf('about') >= 0) {
        $scope.isAbout = true;
    }

    /**
     * @ngdoc method
     * @name openHelpPage
     * @methodOf vbet5.controller:footerCtrl
     * @description sends a message to cmsPagesCtrl to open help page specified by **slug**
     *
     * @param {String} slug page slug
     */
    $scope.openHelpPage = function openHelpPage(slug) {
        $rootScope.$broadcast('openHelpPage', {slug: slug, from: 'footer'});
    };


    /**
     * @ngdoc method
     * @name openDepositWithPayment
     * @methodOf vbet5.controller:footerCtrl
     * @description opens deposit with selected payment method
     * @param {String} name name of payment method
     */
    $scope.openDepositWithPayment = function openDepositWithPayment(event, name) {
        if(!Config.main.header.version === 2 || !Config.main.footerPaymentsClickable) {
            return;
        }
        if(Config.env.authorized) {
            $rootScope.$broadcast('openPayment.deposit', {event: event, name: name});
            $rootScope.env.selectedPayment = name;
        } else {
            $rootScope.$broadcast("openLoginForm");
            event.stopPropagation();
        }
    };

    $scope.now = Date.now();
    if (Config.payments && Config.payments.length) {
        $scope.paymentSystemNames = Config.payments.sort(function (a, b) { return a.order - b.order; }).reduce(function (accumulator, current) {
            if (!current.isTransferToLinkedService && (current.canDeposit || current.canWithdraw) && !current.hidePaymentInFooter) {
                accumulator.push({
                    name: current.name,
                    image: current.image
                });
            }
            return accumulator;
        }, []);
    }
}]);
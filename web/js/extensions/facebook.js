define(['facebook'], function(FB) {
    // Load the facebook SDK
    var appId;

    if (window.location.href.indexOf('example-production-domain.com') !== -1) {
        // Production
        appId = '1514544938798400';
    } else if (window.location.href.indexOf('ua5host.com') !== -1) {
        // Staging
        appId = '1514545655464995';
    } else if (window.location.href.indexOf('local') !== -1) {
        // Development
        appId = '1514545412131686';
    }

    FB.init({
        appId: appId,
        version: 'v2.0'
    });
});

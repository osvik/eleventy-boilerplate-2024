/* global cookieTrackingManager, gtag, fbq, obApi, googleTrackingConfig, dataLayer, twq */

const getConsentString = function() {
    let consentString = "";
    consentString += cookieTrackingManager.canItrack("analytics").toString();
    consentString += ",";
    consentString += cookieTrackingManager.canItrack("segmentation").toString();
    consentString += ",";
    consentString += cookieTrackingManager.canItrack("advertisement").toString();
    return consentString;
};

const storeUTMParameters = function() {
    // Parse the current URL
    var url = new URL(window.location.href);

    // List of common UTM parameters
    var utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    var hasUTMParams = false;

    // Iterate over each UTM parameter and check if it exists in the URL
    for (var i = 0; i < utmParams.length; i++) {
        var value = url.searchParams.get(utmParams[i]);
        if (value !== null) {
            hasUTMParams = true;
            // If the UTM parameter exists, store it in local storage with the prefix "gtm_"
            localStorage.setItem("gtm_" + utmParams[i], value);
        }
    }

    if (hasUTMParams) {
        // Store the current timestamp
        localStorage.setItem("gtm_timestamp", Date.now());
    } else {
        // Check the timestamp if there are no UTM parameters in the URL
        var storedTimestamp = localStorage.getItem("gtm_timestamp");
        if (storedTimestamp !== null) {
            var currentTime = Date.now();
            var thirtyMinutesInMillis = 30 * 60 * 1000;
            if (currentTime - storedTimestamp > thirtyMinutesInMillis) {
                // Timestamp is older than 30 minutes, clear all UTM parameters and timestamp
                for (var j = 0; i < utmParams.length; j++) {
                    localStorage.removeItem("gtm_" + utmParams[j]);
                }
                localStorage.removeItem("gtm_timestamp");
            } else {
                // Update the timestamp to the current time
                localStorage.setItem("gtm_timestamp", currentTime);
            }
        }
    }
};


// eslint-disable-next-line no-unused-vars
const trackingScripts = {

    /**
     * Propriety to check if the tracking has initialized.
     */
    hasInitialized: false,
    
    /**
     * Runs all the tracking scripts checking permissions
     */
    initAll: function () {
    
        let consentObject = {};

        if (cookieTrackingManager.canItrack("analytics")) {
            consentObject['analytics_storage'] = 'granted'; // V1
        } else {
            consentObject['analytics_storage'] = 'denied'; // V1
        }

        if (cookieTrackingManager.canItrack("advertisement")) {
            consentObject['ad_storage'] = 'granted'; // V1
            consentObject['ad_user_data'] = 'granted'; // V2
        } else {
            consentObject['ad_storage'] = 'denied'; // V1
            consentObject['ad_user_data'] = 'denied'; // V2
        }

        if (cookieTrackingManager.canItrack("segmentation") && cookieTrackingManager.canItrack("advertisement") ) {
            consentObject['ad_personalization'] = 'granted'; // V2
        } else {
            consentObject['ad_personalization'] = 'denied'; // V2
        }

        gtag('consent', 'update', consentObject);
    
        if (cookieTrackingManager.canItrack("analytics")) {
            this.googleAnalyticsFooter();
            this.googleTagManager();
            this.hotjar();
            storeUTMParameters();
        } else {
            this.googleAnalyticsFooter();
        }

        if (cookieTrackingManager.canItrack("advertisement")) {
            this.facebook();
            this.twitter();
            this.outbrain();
            this.tiktok();
        }
        
        if (cookieTrackingManager.canItrack("segmentation") && cookieTrackingManager.canItrack("advertisement") ) {
            this.hubspot();
        }

        this.hasInitialized = true;

    },
    
    
    // ----------- Analytics ----------- 

    /**
     * Google Analytics, footer part
     */
    googleAnalyticsFooter: function () {

        if ( typeof gtag === "function") {  
            
            googleTrackingConfig.cookie_consent = getConsentString();
            
            gtag('config', 'G-7NL9SM5MNP', googleTrackingConfig);
        }

        setTimeout(function(){
            if (typeof(window.timeSinceDomLoaded) === "number") {
                gtag('event', 'timing_complete', {
                    'name': 'DOMContentLoaded',
                    'value': window.timeSinceDomLoaded,
                    'event_category': 'Loading'
                });            
            }

            if (typeof(window.timeSinceEventLoad) === "number") {
                gtag('event', 'timing_complete', {
                    'name': 'load',
                    'value': window.timeSinceEventLoad,
                    'event_category': 'Loading'
                });
            }    
        }, 5000);
                        
    },

        /**
     * Retrieves and formats page data to be pushed into the dataLayer object.
     * This function extracts various data points from the URL parameters, document properties,
     * and the googleTrackingConfig object. It then formats the data and pushes it into the dataLayer
     * object for further tracking and analysis.
     */
    getPageData: function () {
    
        // Extract URL parameters
        const urlParams = new URLSearchParams(window.location.search);

        // Helper function to format date in the format YYYY-MM-DD
        function dateFormat(d) {
            const fd = d.split("-");
            return fd[2] + "-" + fd[1] + "-" + fd[0];
        }

        if (typeof dataLayer === "object") {
            dataLayer.push({
                'nro' : 'Spain',
                'office': 'Spain',
                'page_title': document.title,
                'page_language': document.documentElement.lang,
                'page_platform' : '11ty',
                'page_type' : googleTrackingConfig.page_type ? googleTrackingConfig.page_type : '',
                'page_tags': googleTrackingConfig.tags ? googleTrackingConfig.tags.split(",") : [],
                'page_categories': googleTrackingConfig.categories ? googleTrackingConfig.categories.split(",") : [],
                'page_author': googleTrackingConfig.author ? googleTrackingConfig.author : '',
                'page_date' : googleTrackingConfig.post_date ? dateFormat(googleTrackingConfig.post_date) : '',
                'referring_project' : urlParams.has('global_project') ? urlParams.get('global_project') : '',
                'global_project' : googleTrackingConfig.global_project ? googleTrackingConfig.global_project : '',
                'global_project_id' : googleTrackingConfig.global_project_id ? googleTrackingConfig.global_project_id : '',
                'local_project' : googleTrackingConfig.local_project ? googleTrackingConfig.local_project : ''
            });
        }
    },

    /**
     * Hotjar initialization
     */
    hotjar: function () {
        
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:1356277,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

    },
    
    /**
     * Google Tag Manager initialization
     */
    googleTagManager: function() {
        
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-K9LBN3C');
    
    },

    /**
     * Hubspot initalization and pageview
     */
    hubspot: function () {
        
        // Needs <div id="hubspotEmbed"></div> in the html before using this script
        var t = document.getElementById("hubspotEmbed"),
            e = document.createElement("script");
        e.src = "//js.hs-scripts.com/5361482.js"; 
        e.setAttribute("id", "hs-script-loader"); 
        e.setAttribute("type", "text/javascript"); 
        e.setAttribute("defer", "defer"); 
        e.setAttribute("async", "async"); 
        t.appendChild(e);
        
    },
    
    // ----------- Advertising ----------- 


    /**
     * Facebook initialization and pageview
     */
    facebook: function () {

        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','//connect.facebook.net/en_US/fbevents.js');

        fbq('init', '1055834218174209'); // De GPI
        fbq('track', "PageView");
        
    },
    
    /**
     * Twitter initialization
     */
    twitter: function () {
            
            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
            twq('config','nx9ab');
        
    },
    
    /**
     * Outbrain initialization and page view
     */
    outbrain: function () {

      !function(_window, _document) {
        var OB_ADV_ID='002d6df58f70160012cc266f46bbd90888';
        if (_window.obApi) {var toArray = function(object) {return Object.prototype.toString.call(object) === '[object Array]' ? object : [object];};_window.obApi.marketerId = toArray(_window.obApi.marketerId).concat(toArray(OB_ADV_ID));return;}
        var api = _window.obApi = function() {api.dispatch ? api.dispatch.apply(api, arguments) : api.queue.push(arguments);};api.version = '1.1';api.loaded = true;api.marketerId = OB_ADV_ID;api.queue = [];var tag = _document.createElement('script');tag.async = true;tag.src = '//amplify.outbrain.com/cp/obtp.js';tag.type = 'text/javascript';var script = _document.getElementsByTagName('script')[0];script.parentNode.insertBefore(tag, script);}(window, document);
        obApi('track', 'PAGE_VIEW');
        
    },

    /**
     * Tiktok initialization and page view
     */
     tiktok: function(){
        !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++
  )ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=i+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
          
            ttq.load('CAG7KOBC77UEV29MNQO0');
            ttq.page();
          }(window, document, 'ttq');
    }

    
};


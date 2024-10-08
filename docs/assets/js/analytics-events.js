/**
 * Configuring analytics events
 */

/* global dataLayer, gtag, cookieTrackingManager, sha256, fbq, obApi, ttq, twq, twttr,  FORM_GOAL, HUBSPOT_FORM_TITLE, HUBSPOT_FORM_ID, SALESFORCE_CAMPAIGN, EVENT_CATEGORY, ADWORDS_ACCOUNT_ID, CONVERSION_LABEL_DISPLAY, CONVERSION_LABEL_NEW_DISPLAY, ADWORDS_GRANTS_ACCOUNT_ID, CONVERSION_LABEL_GRANTS */
{
    /**
     * On form start
     */
    let formAlreadyStarted = false;
    // eslint-disable-next-line no-unused-vars
    document.addEventListener('form:click', function (e) {
        if (!formAlreadyStarted) {
            dataLayer.push({
                'event': 'form_started',
                'form_goal': FORM_GOAL,
                'form_plugin': 'no_plugin',
                'form_title': HUBSPOT_FORM_TITLE,
                'form_id': HUBSPOT_FORM_ID,
                'salesforce_campaign': SALESFORCE_CAMPAIGN
            });
        }
        formAlreadyStarted = true;
    });

    /**
     * On form submit sucessfuly
     */
    document.addEventListener('form:submit', function (e) {
        const existingOrNew = e.detail.was_contact ? 'Existing' : 'New';

        let includesPhone;
        if (document.getElementById("phone_number").value) {
            includesPhone = "Yes";
        } else {
            includesPhone = "No";
        }

        gtag("event", "Signup", {
            "event_category": EVENT_CATEGORY,
            "event_label": "?FIXME",
            "value": 0,
            "new_email": existingOrNew === "New" ? true : false,
            "has_phone": includesPhone === "Yes" ? true : false,
            "has_zip": false
        });

        if (cookieTrackingManager.canItrack("analytics") && cookieTrackingManager.canItrack("segmentation")) {
            dataLayer.push({
                'event': 'user_identified',
                'distinct_id': sha256(document.querySelector("#email").value.trim().toLowerCase()),
                'registration_type': 'Lead',
                'consent_analytics': cookieTrackingManager.canItrack("analytics").toString().toUpperCase(),
                'consent_segmentation': cookieTrackingManager.canItrack("segmentation").toString().toUpperCase(),
                'consent_marketing': cookieTrackingManager.canItrack("advertisement").toString().toUpperCase(),
                'user_type': 'profiled'
            });
        }

        // Sends form submit event to Mixpanel
        dataLayer.push({
            'event': 'form_submitted',
            'form_goal': FORM_GOAL,
            'form_plugin': 'none',
            'form_title': HUBSPOT_FORM_TITLE,
            'form_id': HUBSPOT_FORM_ID,
            'salesforce_campaign': SALESFORCE_CAMPAIGN
        });

        if (existingOrNew == "New") {
            gtag('event', "generate_lead", {
                "currency": "EUR",
                "value": includesPhone === "Yes" ? 5 : 1.5
            });
        }

        if (typeof (fbq) == "function" && cookieTrackingManager.canItrack("advertisement")) {
            fbq('track', 'PageView');
            fbq('track', 'Lead');

            if (existingOrNew === 'New') {
                fbq('track', 'Subscribe');
            }
        }
        const adwordsEnhacedConversion = function (conversion_id) {
            if (cookieTrackingManager.canItrack("advertisement")) {
                gtag('js', new Date());
                gtag('config', 'AW-' + conversion_id, { 'allow_enhanced_conversions': true });
                window.userEmail = document.getElementById("email").value.trim().toLowerCase();
                window.userPhone = document.getElementById("phone_number").value.trim() ? String("+34" + document.getElementById("phone_number").value.trim()) : "";
                gtag('set', 'user_data', {
                    "sha256_email_address": sha256(window.userEmail),
                    "sha256_phone_number": sha256(window.userPhone)
                });
            }
        };
        adwordsEnhacedConversion(ADWORDS_ACCOUNT_ID);

        const adwordsConversion = function (conversion_id, conversion_label) {
            gtag('event', 'conversion', {
                'send_to': 'AW-' + conversion_id + '/' + conversion_label,
                'value': 1.00
            });
        };

        adwordsConversion(ADWORDS_ACCOUNT_ID, CONVERSION_LABEL_DISPLAY);

        if (existingOrNew === 'New') {
            adwordsConversion(ADWORDS_ACCOUNT_ID, CONVERSION_LABEL_NEW_DISPLAY);
        }

        adwordsConversion(ADWORDS_GRANTS_ACCOUNT_ID, CONVERSION_LABEL_GRANTS);

        const outbrainConversion = function (event) {
            if (cookieTrackingManager.canItrack("advertisement")) {
                if (typeof (obApi) == "function") {
                    obApi("track", event);
                }
            }
        };
        outbrainConversion("FIRMA");

        // TODO Implement enhanced conversion using Tiktok

        const tiktokConversion = function (eventName, details = {}) {
            if (cookieTrackingManager.canItrack("advertisement")) {
                ttq.track(eventName, details);
            }
        };
        tiktokConversion("CompleteRegistration");

        if (existingOrNew === "New") {
            tiktokConversion("Subscribe");
        }

        const twitterConversion = function () {
            if (typeof (twttr) == "object" && typeof (twttr.conversion.trackPid) == "function" && cookieTrackingManager.canItrack("advertisement")) {
                twq('event', 'tw-nx9ab-ockx6', {
                });
            }
        };
        twitterConversion();

    });

    /**
     * On form does not submit to Hubspot
     */
    // eslint-disable-next-line no-unused-vars
    document.addEventListener('form:error', function (e) {
        gtag("event", "exception", {
            "description": "Could not send to Hubspot",
            'fatal': false
        });
    });

    /**
     * If the page can track ads, fire Outbrain 15 segs after loading
     */
    document.addEventListener("DOMContentLoaded", function () {
        if (document.location.href.includes("descarga") && cookieTrackingManager.canItrack('advertisement')) {
            setTimeout(() => {
                obApi('track', "15 sec on site");
            }, 15000);
        }
    });

    /**
     * Fire Outbrain 15 sec after cookie acceptance
     */
    const delayedOutbrain = function () {
        setTimeout(() => {
            if (cookieTrackingManager.canItrack('advertisement')) {
                obApi('track', "15 sec on site");
            }
        }, 15000);
    };

    /**
     * On cookies accept
     */
    // eslint-disable-next-line no-unused-vars
    document.addEventListener('cookies:accept', function (e) {
        gtag('event', 'Click', {
            'event_label': 'Accept',
            'event_category': 'CookiePrivacy',
            'non_interaction': true
        });

        cookieTrackingManager.writeEvent();

        if (document.location.href.includes("descarga")) {
            delayedOutbrain();
        }
    });

    /**
     * On cookies config
     */
    // eslint-disable-next-line no-unused-vars
    document.addEventListener('cookies:config', function (e) {
        gtag('event', 'Click', {
            'event_label': 'Config',
            'event_category': 'CookiePrivacy',
            'non_interaction': true
        });

    });

    /**
     * On cookies check policy
     */
    // eslint-disable-next-line no-unused-vars
    document.addEventListener('cookies:checkpolicy', function (e) {
        gtag('event', 'Click', {
            'event_label': 'Check Policy',
            'event_category': 'CookiePrivacy',
            'non_interaction': true
        });
    });

    /**
     * On cookies accept all
     */
    // eslint-disable-next-line no-unused-vars
    document.addEventListener('cookies:acceptall', function (e) {
        gtag('event', 'Click', {
            'event_label': 'Accept all',
            'event_category': 'CookiePrivacy',
            'non_interaction': true
        });

        cookieTrackingManager.writeEvent();

        if (document.location.href.includes("descarga")) {
            delayedOutbrain();
        }
    });

    /**
     * On cookies deny all
     */
    // eslint-disable-next-line no-unused-vars
    document.addEventListener('cookies:denytall', function (e) {
        gtag('event', 'Click', {
            'event_label': 'Deny all',
            'event_category': 'CookiePrivacy',
            'non_interaction': true
        });

        cookieTrackingManager.writeEvent();
    });

    /**
     * On cookies OK
     */
    // eslint-disable-next-line no-unused-vars
    document.addEventListener('cookies:ok', function (e) {
        gtag('event', 'Click', {
            'event_label': 'OK ' + String(cookieTrackingManager.consent.cats.analytics) + ',' + String(cookieTrackingManager.consent.cats.segmentation) + ',' + String(cookieTrackingManager.consent.cats.advertisement),
            'event_category': 'CookiePrivacy',
            'non_interaction': true
        });

        cookieTrackingManager.writeEvent();

        if (document.location.href.includes("descarga")) {
            delayedOutbrain();
        }
    });

    /**
     * On clics in thank you buttons
     */
    document.addEventListener('thankyou:buttons', function (e) {

        const clickedButton = e.detail.button;

        gtag("event", "click", {
            'event_category': EVENT_CATEGORY,
            'event_label': clickedButton,
            'value': 0
        });

    });

    /**
     * On clics in thank you buttons, new
     *  $dispatch('thankyou:share', { method: 'Facebook' });
     *  $dispatch('thankyou:share', { method: 'Whatsapp' });
     *  $dispatch('thankyou:share', { method: 'Twitter' });
     */
    document.addEventListener('thankyou:share', function (e) {

        gtag("event", "share", {
            "method": e.detail.method
        });

        dataLayer.push({
            'event': 'page_shared',
            'channel': e.detail.method
        });

    });

    /**
     * On clics in end of the page buttons
     */
    document.addEventListener('button:end_page', function (e) {

        const clickedButton = e.detail.button;

        gtag("event", "Click", {
            'event_category': EVENT_CATEGORY,
            'event_label': clickedButton,
            'value': 0
        });

    });

}

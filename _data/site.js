/* jshint esversion:6 */
// eslint-disable-next-line no-undef
module.exports = function () {
    // eslint-disable-next-line no-undef
    const environmentVal = process.env.MY_ENVIRONMENT || "development";
    let domainVal, basedomainVal, assetsVal, development;

    if (environmentVal === "development") {
        domainVal = "http://localhost:8080";
        assetsVal = "http://localhost:8080/assets";
        basedomainVal = "http://localhost:8080";
        development = true;
    } else if (environmentVal === "github") {
        domainVal = "https://osvik.github.io/eleventy-boilerplate-2024";
        assetsVal = "https://osvik.github.io/eleventy-boilerplate-2024/assets";
        basedomainVal = "https://osvik.github.io";
        development = true;
    } else if (environmentVal === "prod") {
        domainVal = "https://es.greenpeace.org/es/gpes-eleventy";
        assetsVal = "https://es.greenpeace.org/wp-content/themes/gpes-eleventy/assets";
        basedomainVal = "https://es.greenpeace.org";
        development = false;
    }

    return {
        environment: environmentVal,
        domain: domainVal,
        basedomain: basedomainVal,
        assets: assetsVal,
        isDev: development,
        version: "0.6.2",
        googleTagManager: "WJL33446",
        ab_testing: false
    };
};

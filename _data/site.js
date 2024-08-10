/* jshint esversion:6 */
// eslint-disable-next-line no-undef
module.exports = function () {
	// eslint-disable-next-line no-undef
	const environmentVal = process.env.MY_ENVIRONMENT || "development";
	let domainVal, basedomainVal, assetsVal, development_siteVal;

	if (environmentVal === "development") {
		domainVal = "http://localhost:8080";
		assetsVal = "http://localhost:8080/assets";
		basedomainVal = "http://localhost:8080";
		development_siteVal = true;
	} else if (environmentVal === "github") {
		domainVal = "https://greenpeace.github.io/gpes-eleventy";
		assetsVal = "https://greenpeace.github.io/gpes-eleventy/assets";
		basedomainVal = "https://greenpeace.github.io";
		development_siteVal = true;
	} else if (environmentVal === "prod") {
		domainVal = "https://es.greenpeace.org/es/gpes-eleventy";
		assetsVal = "https://es.greenpeace.org/wp-content/themes/gpes-eleventy/assets";
		basedomainVal = "https://es.greenpeace.org";
		development_siteVal = false;
	}

	return {
		environment: environmentVal,
		domain: domainVal,
		basedomain: basedomainVal,
		assets: assetsVal,
		development_site: development_siteVal,
		version: "0.5"
	};
};

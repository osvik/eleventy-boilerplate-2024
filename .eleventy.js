// Import the clean-css library to minify CSS
const CleanCSS = require("clean-css");

// Export a function that takes the Eleventy configuration object as a parameter
module.exports = (function (eleventyConfig) {
    // Add the 'assets' directory to the list of files to copy to the output directory
    eleventyConfig.addPassthroughCopy("assets/img");
    eleventyConfig.addPassthroughCopy("assets/js");

    // Add the 'favicon.ico' file to the list of files to copy to the output directory
    eleventyConfig.addPassthroughCopy("favicon.ico");

    // Ignore the 'README.md' file when generating the site
    eleventyConfig.ignores.add("README.md");

    // Add a shortcode for inserting the current year into a template
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    // Add a filter for minifying CSS code using the clean-css library
    eleventyConfig.addFilter("cssmin", function (code) {
        return new CleanCSS({}).minify(code).styles;
    });

    // Return an object with configuration options for Eleventy
    return {
        dir: {
            // Set the output directory to 'docs'
            output: "docs",
            // Set the layouts directory to '_layouts'
            layouts: "_layouts",
        }
    };
});

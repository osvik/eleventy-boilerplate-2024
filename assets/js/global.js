/* eslint-disable no-unused-vars */

/**
 * Not function for Alpine
 * @param {boolean} value 
 * @returns {string}
 */
const not = function (value) {
    if (value) {
        return "false";
    } else {
        return "true";
    }
};

/**
 * Scroll to a specific id
 * @param {string} id 
 */
const flyTo = function (id, delay=300) {
    setTimeout(function(){
        document.getElementById(id).scrollIntoView({
            behavior: "smooth"
        });
    }, delay);
};

/**
 * Trigger an event with an ID
 * @param {string} elementID 
 * @param {string} event 
 * @param {object} detailObject 
 */
const trigger = function(elementID, event, detailObject){
    let cEvent = new CustomEvent(event, {
        detail : detailObject,
        bubbles: true,
        cancelable: true,
        composed: false
    });

    const element = document.getElementById(elementID);
    element.dispatchEvent(cEvent);
};

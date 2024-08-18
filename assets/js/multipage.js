/**
 * Multipage
 */

const multipage = {
    
    /**
     * Stores an object in the session storage
     * @param {object} data Object to be stored
     */
    storeData: (data) => {
        const dataAsString = JSON.stringify(data);
        const dataEnconded = btoa(dataAsString);
        sessionStorage.setItem('form_data', dataEnconded);
    },
    
    /**
     * Gets all stored data
     * @returns {object} Data stored as an object
     */
    getData: () => {
        const dataEnconded = sessionStorage.getItem('form_data');
        if ( dataEnconded === null || dataEnconded === undefined ) {
            return {};
        }
        const dataAsString = atob(dataEnconded);
        const data = JSON.parse(dataAsString);
        return data;
    },
    
    /**
     * Deletes all data stored
     */
    deleteAllData: () => {
        sessionStorage.removeItem('form_data');
    },
    
    /**
     * Add or modify one item to data
     * @param {string} itemName  Name of propriety to store
     * @param {object} itemValue Name of value to store in that propriety
     */
    addModifyItemToData: (itemName, itemValue) => {
        const existingData = multipage.getData();
        existingData[itemName] = itemValue;
        multipage.storeData(existingData);
    },
    
    /**
     * Reads one item in data
     * @param {string} itemName  Name of propriety to read
     * @returns {object} Data stored in that propriety
     */
    getItemInData: (itemName) => {
        const existingData = multipage.getData();
        return existingData[itemName];
    },

};


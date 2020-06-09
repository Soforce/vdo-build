vlocity.cardframework.registerModule.filter('indent', function() {

    /**
     * This function simply takes the line number and will use
     * it to determine how to indent the itemName string.  This
     * allows us to render the proper hierarchy on the
     * order summary page
     * 
     * @param itemName    The item name
     * @param lineNumber  The line number (i.e. 0001, 0001.0002, etc.)
     * 
     * @return The item name prefixed with an appropriate amount of whitespace
     */
    return function(itemName, lineNumber) {
        
        if (itemName && lineNumber) {
        
            let prefix = "";
            
            // Indent based on the entries in the Line Number (i.e. 0001.0001.0002)
            let depth = lineNumber.split(".").length;
            for (let i=0; i<depth - 1; i++) prefix += "   ";
            
            return prefix + itemName;
        }
        
        return itemName;
    }
});
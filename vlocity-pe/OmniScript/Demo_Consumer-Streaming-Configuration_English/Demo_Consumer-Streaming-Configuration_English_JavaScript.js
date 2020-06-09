/**
 * This is a filter function that can be used on an OmniScript SetValues component.  
 * 
 * For example:
 * 
 * StreamingOffers =ARRAY(%offers%).filter(byOfferCode, 'VLO-STR')
 * 
 * @param offer  The offer to test
 * @param this   The special 'this' variable is the product code (full or partial) to use in our matching
 * 
 * @returns List of matching offers
 */
function byOfferCode(offer) {
	
	return offer.ProductCode.includes(this);
};

/**
 * Locates a specific offer from the catalog.  The catalog data is assumed to be sitting
 * in the OmniScript data under "offers"
 *
 * @param $scope  The current scope
 * @param code    The offer code we are looking for
 *
 * @return The offer with the given offer code
 */
function findOfferByCode($scope, code) {

  return $scope.bpTree.response.offers.find(function(offer) {
    return offer.ProductCode === code;
  });
};

/**
 * Returns the control data for a given OmniScript component.  This is useful
 * in situations where you need data from the component in order to perform
 * some activity in JavaScript.  It isn't provided by the os-sv-javascript 
 * framework automatically but is easy to grab.
 *
 * @param scp   The AngularJS Scope associated with the current OmniScript Component
 * @param path  The path to the current OmniScript Component (provided by os-sv-javascript)
 * 
 * @return The control for the OmniScript component associated to the AngularJS scope provided
 */
function getControlData(scp, path) {

	// Return the data found at the end of the path
  for (let i = 0; i < path.length; i++) scp = scp[path[i]];
  
  if (scp.eleArray && scp.eleArray[0]) return scp.eleArray[0];	
};

/**
 * Adds a specific offer to the Digial Commerce Basket.  It is expected that this function will be called
 * by a SetValues (os-sv-javascript) event and the following data will be present in the valueMap variable
 * 
 * valueMap
 * ========
 * offerCode   - the code identifying the offer to add to the digital commerce basket (i.e. VLO-SHR-SHRSET)
 * autoAdvance - boolean indicating if the OmniScript should move to the next step once the offer is added to the basket
 * 
 * @param $scope    Provides access to the underlying OmniScript infrastructure and data
 * @param path      An array with incremental steps leading from $scope to the set values element that triggered the function
 * @param library   An object with a collection of functions that might be useful to your code
 * @param valueMap  A JavaScript dictionary with the key:value pairs in the set values statement
 *
 */
function addOffer($scope, path, library, valueMap) {  

  // Extract the Offer Code
  let offerCode = library.getStepValue(valueMap, "offerCode");
  if (offerCode) {

    // Find the Offer in the catalog
    let offer = findOfferByCode($scope, offerCode);
    if (offer) {

      let control     = getControlData($scope, path);
      let autoAdvance = library.getStepValue(valueMap, "autoAdvance");

      console.log("Adding Offer " + offer.Name + " to Basket!");
      
      // Add the offer to the basket      
      $scope.baseCtrl.addOfferToBasket(offer, control, $scope, autoAdvance);
    }
    else console.error("Unable to find offer (" + offerCode + ") in the catalog.");
  }
  else console.error("No offerCode value was configured on this SetValue!");
};
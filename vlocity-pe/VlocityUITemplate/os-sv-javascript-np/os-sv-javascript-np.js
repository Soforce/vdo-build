/**
*
*   Set Values Template that provides hooks for running JavaScript
*
*   @version    1.16
*   @date       2019-04-19
*   @author     Charles McGuinness <cmcguinness@vlocity.com>
*   @author     Duane Nelson <dnelson@vlocity.com>
*   @author     Kirk Leibert <kleibert@vlocity.com>
*   @author     Joe McMaster <jmcmaster@vlocity.com>
*
*
*   !!!!!!!!!!!!!!!!!!!!!!!!!!
*
*   If you wish to modify this template, please clone it and make your own
*   template.  If you break this, you break dozens of OmniScripts.
*
*   If you have changes you wish to add to this, 
*   please contact Charles, Duane, or Kirk to merge and test your code.
*   
*   !!!!!!!!!!!!!!!!!!!!!!!!!!
*/

//  If noone has installed these functions yet, install them now ....
if (! baseCtrl.prototype.$scope.hasOwnProperty('osjsShowUploader')) {
    (function() {

        /*
         *
         * Data Helper Functions
         *
         * One of the challenges we face is that the metadata and runtime data for the OmniScript is held in very
         * complicated hierarchies, and depend upon the sequencing of the steps, blocks, and elements within
         * the OmniScript design, all of which will be constantly changed over the development of an OS.
         *
         * Any hard coding, therefore, of where to find things is going to be incredibly fragile.
         *
         * These helper functions allow us to find data we're interested in via a compelete tree search, which
         * sounds inefficient in theory but works fine in reality.
         */

        // Put them in an object so we can pass them to our called functions
        let library = {};


        /**
         * findPathByKeyValue
         *
         * Search through a complicated Java Object/Array hierarchy and find a key & value in it, then return
         * the path to that value.  The path is an array that holds a sequence of steps down the tree
         * to the found data.  It relies on two tricks of JavaScript: (1) you an access both array elements
         * and object members with the [] operator. In the case of arrays, it's [Integer].  In the case of
         * objects, it's [String].  (2) JavaScript arrays can hold mixed data types.  Combine this two,
         * and an array like ['children', 1, 'property'] would access an .children property, get the second
         * element of that array, and then get the .property value of that element.
         *
         * if key is undefined, only look for matching values
         *
         * The actual search logic is recursive, and it builds up the path as you return back up the tree after
         * having found the data.
         */


        library.findPathByKeyValue = function(jsonData, key, value) {
            // We expect to be passed either an Array or an Object
            // If it's an array, iterate over the elements
            if (jsonData instanceof Array) {
                for (let i = 0; i < jsonData.length; i++) {

                    if (key === undefined) {
                        // Does this element hold the value?
                        if (jsonData[i] === value) {
                            return [i];
                        }
                    } else {
                        // Does this element hold the value?
                        if (key === i && jsonData[i] === value) {
                            return [i];
                        }
                    }

                    // If this is an object or array, do a recursive search
                    if (jsonData[i] instanceof Object || jsonData[i] instanceof Array) {
                        // Then search for the value under this element
                        let found = library.findPathByKeyValue(jsonData[i], key, value);
                        if (found !== undefined) {
                            // This inserts our location at the front of the array
                            // and is part of the magic of building the ultimate path
                            found.unshift(i);
                            return found;
                        }
                    }
                }
            }

            // Is this an Object? Loop through the members...
            if (jsonData instanceof Object) {
                for (let k in jsonData) {
                    // If this is an object or array, do a recursive search
                    if (jsonData.hasOwnProperty(k) && (jsonData[k] instanceof Object || jsonData[k] instanceof Array)) {
                        let found = library.findPathByKeyValue(jsonData[k], key, value);
                        if (found !== undefined) {
                            // This inserts our location at the front of the array
                            // and is part of the magic of building the ultimate path
                            found.unshift(k);
                            return found;
                        }
                    } else {
                        // Not an object or array, so maybe this is the value?
                        if (key === undefined) {
                            if (jsonData[k] === value) {
                                return [k];
                            }
                        } else {
                            if (key === k && jsonData[k] === value) {
                                return [k];
                            }

                        }
                    }
                }
            }

            // I guess this path was a dead end.
            return undefined;
        };


        /**
        *  Find element by name
        *
        *   @param  name    String with the element's name
        *   @return         Array with steps in path
        */

        library.findElementByName = function(name) {
            let path = library.findPathByKeyValue(baseCtrl.prototype.$scope.children, "name", name);
            if (path === undefined) {
                return path; // not found
            }

            path.pop(); // get rid of name
            path.pop(); // get rid of eleArray index
            path.pop(); // get rid of eleArray
            path.unshift('children');
            return path;
        };

        /**
         * 
         *  getDataByPath
         *
         *  Takes an object/array and a path, and returns whatever's at that path.  The path itself is an array, and we
         *  traverse the path by repeatedly subscripting it. The path is probably generated by findPathByValue.
         *  The jsonData is probably $scope
         * 
         */

        library.getDataByPath = function(jsonData, path) {

            for (let i = 0; i < path.length; i++) {
                jsonData = jsonData[path[i]];
            }

            return jsonData;
        };


        /**
        *
        *   getElementData
        *
        *   Finds things in {Data}
        *
        *   @param    name    Name of the element (or element-less property) to find
        *   @return           Either the data (in whatever form it may be) or undefined if not found
        *
        *   The name consists of a list of properties separated by periods or colons
        *   Note that if you want to subscript an array, you just use the slightly oddball
        *   syntax of array.index, for example:
        *           child.records.0.attributes really means child.records[0].attributes
        *
        *   If a property starts with a "#", then the parent is considered an array, and we
        *   will evaluate the property as being key=value, where we are looking for an element
        *   of the array that has a property key with the matching value
        *
        */

        library.getElementData = function(name) {
            // Accept either colons or periods as path seperators
            let namePath = name.split(/[:\.]/);
            let cursor = baseCtrl.prototype.$scope.bpTree.response;
            let p;
            while (undefined !== (p = namePath.shift())) {
                if (p.startsWith('#')) {
                    p = p.substr(1);
                    let kv = p.split('=');
                    let newCursor = undefined;
                    for (let i = 0; i < cursor.length; i++) {
                        if (cursor[i][kv[0]] == kv[1]) {
                            newCursor = cursor[i];
                            break;
                        }
                    }
                    cursor = newCursor;
                } else {
                    cursor = cursor[p];
                }
                if (cursor === undefined) {
                    break;
                }
            }

            return cursor;
        };


        /**
        *
        *   setElementData
        *
        *   Updates values in {Data}
        *
        *   @param    name    Name of the element (or element-less property) to find
        *   @param    value   The value to set (can be of any type)
        *   @return           Void
        *
        */

        library.setElementData = function(name, value) {
            var toSet = value;
            // Accept either colons or periods as path seperators
            let namePath = name.split(/[:\.]/);

            for (var i = namePath.length - 1; i >= 0; i--) {
                var newSet = {};
                newSet[namePath[i]] = toSet;
                toSet = newSet;
            }

            baseCtrl.prototype.$scope.applyCallResp(toSet);
        };

        /**
        *
        *  remoteQuery
        *
        *  Executes a SOQL query (ideally something that is too complex for a DataRaptor - the preferred approach)
        *  Note that this assumes you will clean up the query response within your OS.
        *  Assumes you have the custom OSTools Apex Class installed in your org . You can find this
        *  under the Apex folder.
        *
        *   @param    incomingQuery    The SOQL query
        *   @param    JSONresponsepath  The JSON node where you want the results to be returned to in your OS.
        *
        */

        library.remoteQuery = function($scope, path, library, valueMap, incomingQuery, JSONresponsepath) {
            var className = 'OSTools';
            var classMethod = 'SOQL';
            // removed pass through parameter for my specific chained function.
            var myquery = incomingQuery;

            if (className && classMethod) {
                var inputMap = {
                    Query: myquery
                };
                $scope.bpService.GenericInvoke(className, classMethod, angular.toJson(inputMap), '{}').then(function(result) {
                    $scope.SOQLData = JSON.parse(result);
                    var listresult = $scope.SOQLData.results;
                    library.setElementData(JSONresponsepath, listresult);
                    //removed specific chained function call here.                    
                }).catch(function(err) { alert(err);
                    console.info("The Error Was...", err) });
            }
        }

        /**
        * Some demo / maybe / maybe not useful functions
        */


        // Display an alert box.  Expects to see the text in message
        library.alert = function($scope, path, library, valueMap) {
            let message = valueMap.message;
            alert(message);
        };

        //  JSON Stringify.  Expects the source in "from" and the destination in "to"
        library.JSONstringify = function($scope, path, library, valueMap) {
            let fromVar;
            let fromData;

            if (valueMap.hasOwnProperty('from') && valueMap.from != '') {
                fromVar = valueMap.from;
                fromData = library.getElementData(fromVar);
            } else {
                fromData = baseCtrl.prototype.$scope.bpTree.response;
            }
            let toVar = valueMap.to;

            library.setElementData(toVar, JSON.stringify(fromData));
        };




        //  JSON Parse (unstringify).  Expects the source in "from" and the destination in "to"
        library.JSONparse = function($scope, path, library, valueMap) {
            let fromVar = valueMap.from;
            let toVar = valueMap.to;
            let fromData = library.getElementData(fromVar);
            if (fromData === undefined) {
                library.setElementData('JSONparse.error','Could Not Find ' + fromVar);
            } else {
                library.setElementData(toVar, JSON.parse(fromData));
            }
        };


        // Go to a step.  Step element name in "Step"
        library.gotoStep = function($scope, path, library, valueMap) {
            let stepName = valueMap.Step;
            for (let i=0;i<$scope.bpTree.children.length;i++) {
                if ($scope.bpTree.children[i].name == stepName) {
                    $scope.sidebarNav($scope.bpTree.children[i]);
                    return;
                }
            }
        };

        // Go to a URL.
        //      URL is in URL, 
        //      Target is in Target (optional)
        //      Nonce, if exists, means append a nonce=timestamp to the end of the URL to force a page refresh
        //      Community, if exists, means the URL is added to everything up to the community paty, if it exists
        library.gotoURL = function($scope, path, library, valueMap) {
            let url = valueMap.URL;
            let target = '_top';
            if (valueMap.hasOwnProperty('Target')) {
                target = valueMap.Target;
            }

            if (valueMap.hasOwnProperty('Nonce')) {
                if (url.includes('?')) {
                    url = url + '&nonce=' + String(Date.now())
                } else {
                    url = url + '?nonce=' + String(Date.now())
                }
            }

            while (-1 !== url.indexOf('%')) {
                let pid = url.indexOf('%');
                let s_before = url.substr(0,pid);
                let s_after = url.substr(pid+1);
                let end_pid = s_after.indexOf('%');
                let name = s_after.substr(0,end_pid);
                s_after = s_after.substr(end_pid+1);
                url = s_before + library.getElementData(name) + s_after;
            }

            if (valueMap.hasOwnProperty('Community')) {
                var here = window.location.href.substr(8); // strip https://
                here =  here.substr(here.indexOf('/')); // strip domain
                here = here.substr(0,here.indexOf('/apex')) // Get the community if any
                url = here + url
            }


            window.open(url,target);
        };

        /**
        *
        *   library.getAttributes
        *
        *   There are many times we get back not key value pairs, but { k: "Key", v: "value"} objects
        *   This routine will transform these into an array of { key: value } values
        *
        *   Inputs:
        *
        *       inpath      The path.to.the.attributes, which is going to be an array of objects
        *       outpath     Where to put our output
        *       keyname     The name of the key name member in each element, "code" is typical
        *       valuename   The name of the value member in each element, "userValues" is typical
        *       deleteelement       Optional, will set the element to null to clean up afterwards
        *
        */
        library.getAttributes = function($scope, path, library, valueMap) {
            var varInpath, varOutpath, varKeyname, varValueName;

            try {
                varInpath = valueMap.inpath;
                varOutpath = valueMap.outpath;
                varKeyname = valueMap.keyname;
                varValueName = valueMap.valuename;
            } catch (e) {
                alert('Error getting parameters to getAttributes(): ' + e.message);
                return;
            }

            let arrayRoot = library.getElementData(varInpath);
            if (arrayRoot === undefined) {
                alert('Could not find ' + varInpath);
                return;
            }

            if (arrayRoot.constructor !== Array) {
                alert(varInpath + ' is not an array of properties');
                return;
            }

            for (let i=0;i < arrayRoot.length;i++) {
                let key = arrayRoot[i][varKeyname];
                let value = arrayRoot[i][varValueName];
                library.setElementData(varOutpath + '.' + key, value);

            }

        }

        /**
        *
        *   deepCopy
        *
        *   The idea is that if you have a tree you want to copy, and you
        *   want to make an actual copy of everything,  you can't just do
        *   b = a.  If there is an a.first, then changing b.first would change
        *   a.first as well: you've made a shallow copy of a.
        *
        *   This will make a deep copy by converting the source to and then
        *   back from JSON.  The net result is that the copy can be changed
        *   at will without affectig the source.
        *
        *   This does not work, unfortunately, if the source has a cyclic
        *   reference.  The source must be JSON strigify-able.
        */
        library.deepCopy = function($scope, path, library, valueMap) {
            var varInpath, varOutpath;

            try {
                varInpath = valueMap.inpath;
                varOutpath = valueMap.outpath;
            } catch (e) {
                alert('Error getting parameters to getAttributes(): ' + e.message);
                return;
            }

            let arrayRoot = library.getElementData(varInpath);
            if (arrayRoot === undefined) {
                alert('Could not find ' + varInpath);
                return;
            }

            if (typeof arrayRoot !==  'object') {
                library.setElementData(varOutpath, arrayRoot);
            } else {
                library.setElementData(varOutpath, JSON.parse(JSON.stringify(arrayRoot)));
            }
        }


        /* 
        *
        *   library.deepSet
        *
        *   Set a value deep inside the OmniScript data
        *
        *   target: the full path var.var[index].var etc.
        *   value: The value to set
        */

        library.deepSet = function($scope, path, library, valueMap) {

            let assignments;

            if ("from" in valueMap) {
                assignments = [ { "from": valueMap.from, "to": valueMap.to}];
            } else {
                assignments = valueMap.assignments;
            }

            for (let a=0;a<assignments.length;a++) {

                let fromVar = assignments[a].from;
                let toVar = assignments[a].to;

                // Accept either colons or periods as path seperators
                let namePath = toVar.split(/[:\.]/);

                let oldData =$scope.bpTree.response[namePath[0]];
                let targetData = oldData;

                for (var i=1;i<namePath.length-1;i++) {
                    targetData = targetData[namePath[i]];
                }

                // If the from is surrounded by %s, then it is a variable
                if (fromVar.indexOf('%') == 0) {
                    fromVar = library.getElementData(fromVar.substr(1,fromVar.length-2));
                }

                targetData[namePath[namePath.length-1]] = fromVar;

                baseCtrl.prototype.$scope.applyCallResp(oldData);
            }
        };


        /**
         * This function returns the given value from the list of fields configured on the SetValue action.
         * It also supports simple merge fields if they are used.
         *
         * @param library   An object with a collection of functions that might be useful to your code
         * @param valueMap  A JavaScript dictionary with the key:value pairs in the set values statement
         * @param name      The name of the field to retrieve
         * 
         *
         * @return The value of the field
         */
        library.getStepValue = function(valueMap, name) {
            
            let value = valueMap[name];
            if (value === undefined) {
                console.warn("Unable to find SetValue configuration '" + name + "'");
                value = undefined;
            }
            else if (typeof value === "string" && value.startsWith("%") && value.endsWith("%")) {
                value = library.getElementData(value.replace(/%/g, ""));
            }

            return value;
        }


        /**

            Call Remote Method

            This is invoked from a set values statement via the JavaScript template (os-sv-javascript).

            It expects the following values to be set:

            * className     The name of the class, which adheres to Vlocity's OpenInterface
            * classMethod   The name of the "method" to be called.  Note that in OpenInterface,
                            we really just call invokeMethod and pass this as a string.
            * input         What to pass to the input, must be an object
            * options       What to pass to the options, must be an object
            * target        Where to put the final result
            * extract       How to extract the data we want from the result

            Optional:

            * DebugFlags    String that contains none, one, or both of PRE and POST.
                            Causes us to hit a debugger statement before the remote call (PRE)
                            and/or after we get the results (POST)

            Target can be in the form Step:Element (and other variations, see documentation on library.setElementData)

            Extract is a comma separated list.  Each element is either a !, which means run the data at this point
            through JSON.parse (because we sometimes see JSON structures with strinified JSON inside of them), or
            it is the name of a member to access, or the index of an array.  If this is too rigid, just pass in
            an empty string and parse the result yourself in code.

        */

        library.CallRemoteMethod = function($scope, path, library, valueMap) {

            let className = valueMap.className;
            let classMethod = valueMap.classMethod;
            let callInput = angular.toJson(valueMap.input);
            let callOptions = angular.toJson(valueMap.options);
            let outputTarget = valueMap.target;
            let extractChain = valueMap.extract;
            let debuggerFlag = { 'pre': false, 'post': false };

            if (valueMap.hasOwnProperty('DebugFlags')) {
                let df = valueMap.DebugFlags.toUpperCase();
                if (df.includes('PRE')) {
                    debuggerFlag.pre = true;
                }
                if (df.includes('POST')) {
                    debuggerFlag.post = true;
                }
            }

            if (debuggerFlag.pre) {
                debugger;
            }


            $scope.bpService.GenericInvoke(className, classMethod, callInput, callOptions).then(function(result) {

                if (debuggerFlag.post) {
                    debugger;
                }
                let extractSteps = extractChain.split(',');
                for (let i=0;i < extractSteps.length;i++) {
                    if (extractSteps[i] == "!") {
                        result = JSON.parse(result);
                    } else {
                        result = result[extractSteps[i]];
                    }
                }
                library.setElementData(outputTarget, result);
            }).catch(function(err) {
                alert(err);
                console.info("Error in calling " + className + ":" + classMethod, err)
            });

        }

        /**
        *
        *   executeClickOrStepFunction
        *
        *   Executes the click or step function
        *
        *   If the "code" is a string, then it's the name and away we go.
        *
        *   If the "code" is an array, then it's a list of functions and values, and we run through that instead
        *
        */
        library.executeClickOrStepFunction = function(scp, path, library, root, code, functype) {
            var lastFunctionName = 'NONE';
            try {
                var listOfFuncs = [];

                // Make a solitary function into a list of one
                if (code.constructor !== Array) {
                    // We want a clean copy of the value map so we don't modify it...
                    let element = root.propSetMap.elementValueMap;
                    element['Function'] = code;
                    listOfFuncs.push(element);
                } else {
                    listOfFuncs = code;
                }

                for (let i=0;i < listOfFuncs.length; i++) {
                    let valueMap = listOfFuncs[i];
                    lastFunctionName = valueMap.Function;   // To leave something around if we catch an error
                    eval(valueMap.Function+'(scp, path, library, valueMap)');
                    let varDeleteElement = valueMap.PostDeleteElemennt;
                    if (varDeleteElement !== undefined)
                    {
                        library.setElementData(varDeleteElement, 'Deleted in Custom JavaScript');
                    }
                }
            } catch (e) {
                alert('Error in executing ' + functype + ' ' + lastFunctionName + ': ' + e.message);
            }
        };


        //  
        //  This section of code deals with triggering the functions as well as controlling whether the control is shown or not.
        //  

        // Remember what the last step we were on, so we can tell if we've moved steps since the last invocation...
        baseCtrl.prototype.$scope.lastActiveIndex = -1;


        // Remember the last state of the data, so we can trigger code on data changes
        baseCtrl.prototype.$scope.lastHash = -1;
        baseCtrl.prototype.$scope.lastLength = -1;



        function hashJSON(jsonData) {
            let str = JSON.stringify(jsonData);
            var h = 0, l = str.length, i = 0;
            if ( l > 0 )
                while (i < l)
                    h = (h << 5) - h + str.charCodeAt(i++) | 0;
            return h;
        };

        library.hashData = function () {
            return hashJSON(baseCtrl.prototype.$scope.bpTree.response);
        }


        /**
        *
        *   osjsStepIsActive
        *
        *   This function is is called when we first come into the step. It's also called a zillion other times, so we have to filter 
        *   out the invocations to just the one we're interested in.
        *
        *   Figures out if now is when we're moving into the step and then if there's anything specified to do
        *
        *   @param  ctrl    a refernce to the control, defined as child in the html of the template
        *
        */

        let didExecute = [];

        baseCtrl.prototype.$scope.osjsStepIsActive = function(ctrl) {
            var scp = baseCtrl.prototype.$scope;
            // Are we on a new step? No? Not our time then.
            // if (scp.lastActiveIndex == scp.activeIndex) {
            //     return;
            // }

            if (scp.lastActiveIndex != scp.activeIndex) {
                // Reset the list of functions that executed
                didExecute = [];
                scp.lastActiveIndex = scp.activeIndex;
            }

            // Find me in the overall hierarchy
            let path = library.findPathByKeyValue(scp.children, "$$hashKey", ctrl.$$hashKey);

            //  Find the properties on the set values
            let root;

            // Clean up the path
            path.pop(); // get rid of the $$hashKey
            path.unshift('children'); // Put children on the front to make it relative to $scope

            // This is only mildly magic...
            if (library.getDataByPath(baseCtrl.prototype.$scope, path).hasOwnProperty('eleArray')) {
                root = library.getDataByPath(baseCtrl.prototype.$scope, path).eleArray[0];
            } else {
                root = ctrl;
            }

            let code;


            // Is this a change function?
            code = root.propSetMap.elementValueMap.ChangeFunction;
            if (code !== undefined) {

                // Check to see if the data has changed and we need to notify a listener
                let newHash = hashJSON(baseCtrl.prototype.$scope.bpTree.response);

                if (newHash != baseCtrl.prototype.$scope.lastHash) {
                    baseCtrl.prototype.$scope.lastHash = newHash;
                    library.executeClickOrStepFunction(scp, path, library, root, code, 'ChangeFunction');
                }
            }



            // Are we on the step this element is on?


            // The second step in the path is conveniently the step #
            if (scp.activeIndex == path[1]) {

                // Did we already execute this function?
                if (didExecute.includes(ctrl.$$hashKey)) {
                    return; // Don't execute twice
                }

                didExecute.push(ctrl.$$hashKey);    // Mark it as having been done..

                code = root.propSetMap.elementValueMap.StepFunction;
                if (code !== undefined) {
                    library.executeClickOrStepFunction(scp, path, library, root, code, 'StepFunction');
                }

            }
        };

        /**
        *
        *   osjsButtonClickCode
        *
        *   This function is is called when the user clicks our button
        *
        *   If finds the code to execute and does so.
        *
        *   @param  ctrl    a refernce to the control, defined as child in the html of the template
        *
        */

        baseCtrl.prototype.$scope.osjsButtonClickCode = function(ctrl) {
            var scp = baseCtrl.prototype.$scope;

            // Find me in the overall hierarchy
            let path = library.findPathByKeyValue(scp.children, "$$hashKey", ctrl.$$hashKey);


            // Clean up the path
            path.pop(); // get rid of the $$hashKey
            path.unshift('children'); // Put children on the front to make it relative to $scope

            // This is only mildly magic...
            let code = library.getDataByPath(baseCtrl.prototype.$scope, path).eleArray[0].propSetMap.elementValueMap.ClickFunction;
            let ftype = 'ClickFunction';
            if (code === undefined) {
                code = library.getDataByPath(baseCtrl.prototype.$scope, path).eleArray[0].propSetMap.elementValueMap.UploadFunction;
                ftype = 'UploadFunction';
            }
            if (code !== undefined) {
                library.executeClickOrStepFunction(scp, path, library, library.getDataByPath(baseCtrl.prototype.$scope, path).eleArray[0], code, ftype);
            }
        };


        /**
        *
        *   osjsShowthis
        *
        *   We only want to show the set values element if there's
        *   a ClickFunction specified for it.  Otherwise, there's no point
        *
        *   @param  ctrl    a refernce to the control, defined as child in the html of the template
        *   @return         Boolean indicating whether the button should be shown
        *
        */
        baseCtrl.prototype.$scope.osjsShowthis = function (ctrl) {

            // Performance optimization...
            if (ctrl.osjsShowMe === undefined) {
                var scp = baseCtrl.prototype.$scope;

                // Find me in the overall hierarchy
                let path = library.findPathByKeyValue(scp.children, "$$hashKey", ctrl.$$hashKey);


                // Clean up the path
                path.pop(); // get rid of the $$hashKey
                path.unshift('children'); // Put children on the front to make it relative to $scope

                ctrl.osjsShowMe = false;

                // Handle case where we are not inside of a step (and so never shown)
                if (library.getDataByPath(baseCtrl.prototype.$scope, path).hasOwnProperty('eleArray')) {
                    // This is only mildly magic...
                    let code = library.getDataByPath(baseCtrl.prototype.$scope, path).eleArray[0].propSetMap.elementValueMap.ClickFunction;
                    if (code === undefined) {
                        code = library.getDataByPath(baseCtrl.prototype.$scope, path).eleArray[0].propSetMap.elementValueMap.UploadTarget;
                    }

                    ctrl.osjsShowMe = code !==undefined;        
                }

            }

            return ctrl.osjsShowMe;
        };


        /**
        *
        *   osjsShowUploader
        *
        *   Read a file into the OmniScript's working {Data}
        *
        *   @parameters UploadTarget    Where to put the file's contents
        *
        */
        baseCtrl.prototype.$scope.osjsShowUploader = function (ctrl) {
            if (ctrl.hasUploadListener !== undefined) {
                return ctrl.hasUploadListener;
            }
            var scp = baseCtrl.prototype.$scope;

            // Find me in the overall hierarchy
            let path = library.findPathByKeyValue(scp.children, "$$hashKey", ctrl.$$hashKey);


            // Clean up the path
            path.pop(); // get rid of the $$hashKey
            path.unshift('children'); // Put children on the front to make it relative to $scope

            // Handle case where we are not inside of a step (and so never shown)
            if (library.getDataByPath(baseCtrl.prototype.$scope, path).hasOwnProperty('eleArray')) {
                // This is only mildly magic...
                if (library.getDataByPath(baseCtrl.prototype.$scope, path).eleArray[0].propSetMap.elementValueMap.hasOwnProperty('UploadTarget')) {
                    let target = library.getDataByPath(baseCtrl.prototype.$scope, path).eleArray[0].propSetMap.elementValueMap.UploadTarget;
                    let inputElement = document.getElementById("uploader");
                    let valueMap = library.getDataByPath(baseCtrl.prototype.$scope, path).eleArray[0].propSetMap.elementValueMap
                    inputElement.addEventListener("change", function(evt) { 
                        var files = evt.target.files; // FileList object

                        // Loop through the FileList and render image files as thumbnails.
                        for (var i = 0, f; f = files[i]; i++) {
                          var reader = new FileReader();

                          // Closure to capture the file information.
                          reader.onload = (function(theFile) {
                            return function(e) {
                                library.setElementData(target, reader.result);
                            };
                          })(f);

                          // Read in the image file as a data URL.
                          reader.readAsText(f);
                        }

                    }, false);
                    ctrl.hasUploadListener = true;
                    return true;
                }
            }
            ctrl.hasUploadListener = false; 
            return false;
        };

    })();
}
/* This file is intended to hold "common" javascript functions. */

function logError(event) {
    // for logging random javascript errors on the web site
    try {
        var now = new Date();
        var error;
        if (event instanceof Event)
            error = event.error;
        else if (event instanceof Error)
            error = event;
        else {
            //don't create an error, because it will just trigger an infinite loop
            console.log('Invalid argument passed to logError():');
            console.log(event);
            return;
        }
        console.log(error); // for debugging, it's nice to see unhandled errors in the console
        if (event instanceof Event) {
            // try to prevent any javascript error from stopping script execution
            if (event.preventDefault)
                event.preventDefault();
            event.stopPropagation();
            var handled = true;
            return handled;
        }
    } catch (e) {
        //don't allow an error to propogate, because it will just trigger an infinite loop
    }
}
window.addEventListener('error', logError);

function byId(id, tagName) {
    // if tagName is input, find a match of that tagName, and ignore case on the id
    if (typeof tagName == 'string' & tagName != '') {
        var elems = document.getElementsByTagName(tagName);
        for (var i = 0; i < elems.length; i++)
            if (elems[i].id.toLowerCase() == id.toLowerCase())
                return elems[i];
        return null;
    } else {
        return document.getElementById(id);
    }
}
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (search, pos) {
        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
}
function getElementsById(id) {
    // allow getting multiple elements by a single id value (yes, this is against the spec, but it works)
    var elementCollection = new Array();
    var allElements = document.getElementsByTagName('*');
    for (var i = 0; i < allElements.length; i++) {
        if (allElements[i].id == id)
            elementCollection.push(allElements[i]);

    }
    return elementCollection;
}

function expandCollapseEvent() {
    classAddOrRemove(this, 'collapsed');
}
function addExpandCollapseEvents() {
    var elems = document.getElementsByClassName('expandcollapse');
    for (var i = 0; i < elems.length; i++)
        elems[i].addEventListener('click', expandCollapseEvent, false);
}
function getHostName(value) {
    if (!value)
        value = window.location.toString();
    var i = value.indexOf('//');
    if (i > -1)
        value = value.substr(i + 2);
    i = value.indexOf('/');
    if (i > -1)
        value = value.substr(0, i);
    return value;
}

function addSidebarAsync() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function (event) {
        var xmlhttp = event.target;
        if (xmlhttp.readyState != 4) return; // ignore
        if (xmlhttp.status != 200) throw new Error('HTTP status ' + xmlhttp.status + '\n' + xmlhttp.responseText);
        var sidebar = byId('_sidebar');
        if (!sidebar) throw new Error('No elem with id "_sidebar" found to replace with contents of the sidebar');
        sidebar.outerHTML = xmlhttp.responseText;
        var sidebar = byId('_sidebar');
    };
    xmlhttp.open('GET', '_sidebar.html', true);
    xmlhttp.setRequestHeader('Content-Type', 'text/html;charset=UTF-8');
    xmlhttp.send();
}

var ie = window.navigator.userAgent.match(/MSIE\s([\d.]+)/),
    ie11 = !!window.MSInputMethodContext && !!document.documentMode,
    ieVer = (ie ? ie[1] : (ie11 ? 11 : -1)),
    ie = (ie | ie11); // set indicator for InternetExplorer, for any browser-specific logic

function classAddOrRemove(elem, className) {
    if (typeof elem == 'string')
        elem = byId(elem);
    if (typeof elem != 'object' || !(elem instanceof Element))
        return null;
    if (elem.className.contains(className)) {
        removeClassName(elem, className);
        return false;
    } else {
        addClassName(elem, className);
        return true;
    }
}

function removeElement(tagID) {
    var element = byId(tagID);
    element.parentNode.removeChild(element);
}

String.prototype.contains = function (value) { return this.indexOf(value) >= 0; }
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}

String.prototype.replaceAll = function (find, replace) { return this.split(find).join(replace); }

Array.prototype.contains = function (value) { return this.indexOf(value) >= 0; }

function removeClassName(elem, className) {
    // because IE9 doesn't support "classList" :-(
    var classes = elem.className.split(' ');
    var i = classes.indexOf(className);
    if (i >= 0)
        classes.splice(i, 1);
    elem.className = classes.join(' ');
}

function addClassName(elem, className) {
    // because IE9 doesn't support "classList" :-(
    var classes = elem.className.split(' ');
    var i = classes.indexOf(className);
    if (i == -1)
        classes.push(className);
    elem.className = classes.join(' ');
}

Element.prototype.appendChildWithValue = function (elemName, value, ignoreIfEmpty) {
    if (ignoreIfEmpty && (value || '') == '')
        return;
    var newElem = this.ownerDocument.createElement(elemName);
    this.appendChild(newElem);
    newElem.textContent = value;
    return newElem;
}

function getChildren (elem) {
    var children = elem.children;
    if (children != null && children.length > 0)
        return children;
    var childNodes = elem.childNodes;
    var children = [];
    for (var i = 0; i < children.length; i++) {
        var child = childNodes[i]
        if (child.nodeName == '#text')
            children.push(child);
    }
    return children;
}

function getAncestorByTagName(elem, tagName) {
    if (elem == null) return null;
    tagName = tagName.toUpperCase();
    while (elem = elem.parentNode) { // will exit loop when parent is null
        if (elem.tagName == tagName)
            return elem;
    }
    return null;
}
function isDescendentOfElement(elem, id) {
    while (elem = elem.parentNode) {
        if (elem.id == id) return true;
    }
    return false;
}
function expandAll() {
    var didSomething = false;
    var elems = document.getElementsByClassName('xpnd');
    for (var i = 0; i < elems.length; i++)
        if (elems[i].onclick) {
            elems[i].onclick();
            didSomething = true;
        }
    return didSomething;
}

function getElementIndex(element) {
    return Array.from(element.parentNode.children).indexOf(element);
}

function createUrl(text) {
    var textFileAsBlob = new Blob([text], { type: 'text/plain' });
    return window.URL.createObjectURL(textFileAsBlob);
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

function saveTextAsFile(fileNameToSaveAs, textToWrite) {
    if (ie && ieVer < 10) {
        window.alert('Cannot save file in Internet Explorer 9 (or earlier)')
        return;
    }

    if (ie) {
        window.navigator.msSaveBlob(new Blob([textToWrite], { type: 'text/plain' }), fileNameToSaveAs);
    } else {
        var downloadLink = document.createElement('a');
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = 'Download File';

        downloadLink.href = createUrl(textToWrite);
        if (typeof window.webkitURL != 'undefined') {
            // Chrome allows the link to be clicked without actually adding it to the DOM.
        } else {
            // Firefox requires the link to be added to the DOM before it can be clicked.
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
        }

        downloadLink.click();
    }
}

function isNumeric(value) {
    if (typeof value == 'string' && value.trim() == '')
        return false;
    return !isNaN(value);
}

function addMilliseconds(value, milliseconds) {
    var isoString = toISOString(value);
    if (isoString == null)
        return '';
    var d0 = new Date(isoString);
    var t0 = d0.getTime();
    var t1 = t0 + milliseconds;
    var d1 = new Date(t1);
    return d1.toISOString();
}
function formatDateCommon(event) {
    try {
        var elem = event.target;
        var iso = toISOString(elem.value);
        // YYYY-MM-DDTHH:MM:SS.000Z

        var v = iso.substr(5, 2) + '/' + iso.substr(8, 2) + '/' + iso.substr(0, 4) + ' ' + iso.substr(11, 12);
        // MM/DD/YYYY HH:MM:SS.000

        if (v.substr(19, 4) == '.000') {
            v = v.substr(0, 19)
            // MM/DD/YYYY HH:MM:SS
            if (v.substr(16, 3) == ':00') {
                v = v.substr(0, 16)
                // MM/DD/YYYY HH:MM
            }
        }
        elem.value = v;
    }
    catch (err) {
        return null;
    }
}
function formatQuantity(value, singular, plural) {
    if (typeof plural === 'undefined')
        plural = singular + 's';
    if (value == 1)
        return value + ' ' + singular;
    else
        return value.toLocaleString() + ' ' + plural;
}
function getRelativeTime(value1, value2) {
    // returns the "relative time" compared to now, like "1 hour ago"
    // (this always rounds values down, be that seems ok)
    var t1, t2;
    if (typeof value2 === 'undefined')
        t2 = new Date();
    else
        t2 = new Date(value2);
    var t1 = new Date(value1);

    var totalMilliseconds = (t2 - t1);
    var timeSuffix = (totalMilliseconds < 0) ? ' in the future' : ' ago';

    var delta = Math.abs(totalMilliseconds);
    var milliseconds = delta % 1000;
    delta = (delta - milliseconds) / 1000; // leave the seconds
    var seconds = delta % 60;
    delta = (delta - seconds) / 60; // leave the minutes
    var minutes = delta % 60;
    delta = (delta - minutes) / 60; // leave the hours
    var hours = delta % 24;
    delta = (delta - hours) / 24; // leave the days
    var days = delta;

    if (totalMilliseconds < 10000) // less than 10 seconds total
        return formatQuantity(seconds + milliseconds / 1000, 'second') + timeSuffix;
    if (totalMilliseconds < 60000) // less than 60 seconds total
        return formatQuantity(seconds, 'second') + timeSuffix;
    if (totalMilliseconds < 120000) // less than 120 seconds total
        return formatQuantity(minutes, 'minute') + ', ' + formatQuantity(seconds, 'second') + timeSuffix;
    if (totalMilliseconds < 3600000) // less than 60 minutes total
        return formatQuantity(minutes, 'minute') + timeSuffix;
    if (totalMilliseconds < 7200000) // less than 120 minutes total
        return formatQuantity(hours, 'hour') + ', ' + formatQuantity(minutes, 'minute') + timeSuffix;
    if (totalMilliseconds < 86400000) // less than 24 hours total
        return formatQuantity(hours, 'hour') + timeSuffix;
    if (totalMilliseconds < 172800000) // less than 48 hours total
        return formatQuantity(days, 'day') + ', ' + formatQuantity(hours, 'hour') + timeSuffix;
    if (totalMilliseconds < 63072000000) // less than 730 days total
        return formatQuantity(days, 'day') + timeSuffix;

    // prob should return in years or something, but meh
    return formatQuantity(days, 'day') + timeSuffix;
}

function subtractTimezone(value) {
    value = new Date(value.getTime() - (value.getTimezoneOffset() * 60000));
    return value;
}
function toISOString(value) {
    try {
        if (typeof value == 'object')
            if (value instanceof Date) {
                return value.toISOString();
            }
        if (typeof value != 'string')
            return null;
        value = value.trim();
        if (value.length < 8)
            return null;

        if (value.endsWith('Z'))
        // If in ISO format, like '2001-01-01T00:00:00Z', browsers will know this date has the timezone explicitly given.
            return (new Date(value)).toISOString();

        if (value.contains(' ') || value.contains('/'))
        // If in local format, like '01/01/2001', browsers will know this date has does NOT have the timezone explicitly given.
            return (subtractTimezone(new Date(value))).toISOString();

        if (!value.contains('T'))
        // If in date-only ISO format, like '2001-01-01', browsers will know this date has does has the timezone explicitly given.
            return (new Date(value)).toISOString();

        // BUT, with the almost-ISO format like '2001-01-02T00:00:00',
        //  some browsers (Chrome) will instantiate a 'new Date()'
        //  assuming the timezone is 0, others (MSIE and Firefox) will not.
        // Hence the below stupidity.
        if (isNumeric(value.substr(0, 4))
        && value.substr(4, 1) == '-'
        && isNumeric(value.substr(5, 2))
        && value.substr(7, 1) == '-'
        && isNumeric(value.substr(8, 2))
        && value.substr(10, 1) == 'T'
        && isNumeric(value.substr(11, 2))
        && value.substr(13, 1) == ':'
        && isNumeric(value.substr(14, 2))) {
            // good
        } else {
            console.log('Unexpected condition in toISOString(), value: ' + value);
            return (new Date(value)).toISOString();
        }

        if ((new Date('2001-01-01T00:00')).getUTCHours() == 0) {
            // browser assumed this date has the timezone built in
            return (new Date(value)).toISOString();
        } else {
            // browser assumed this date does NOT have the timezone built in
            return (subtractTimezone(new Date(value))).toISOString();
        }
    }
    catch (err) {
        console.log('Error in toISOString(), value: ' + value + '\n' + err);
        return null;
    }
}
function webFormattedDate(value) {
    // need a date formatted like: 2015-07-06T15:00:00.000, which is *almost* the ISO format
    return (toISOString(value) || '').substr(0, 23);
}
function toTimestamp(value) {
    // need a date formatted like: 2015-07-06-15.00.00.000000, which is *almost* the ISO format
    var iso = toISOString(value);
    if (typeof iso != 'string' || iso.length != 24)
        return '';
    var ts = iso.substr(0, 23).replace('T', '-').replace(':', '.') + '000';
    return ts;
}

function unitTest_toISOString() {
    var prefix = 'Problem with test: toISOString(#)';
    var n = 0;
    n++; if (toISOString('2016-01-01T01:01        '.trim()) != '2016-01-01T01:01:00.000Z') console.log(prefix.replace('#', n));
    n++; if (toISOString('2016-01-01T01:01:01     '.trim()) != '2016-01-01T01:01:01.000Z') console.log(prefix.replace('#', n));
    n++; if (toISOString('2016-01-01T01:01:01.1   '.trim()) != '2016-01-01T01:01:01.100Z') console.log(prefix.replace('#', n));
    n++; if (toISOString('2016-01-01T01:01:01.123 '.trim()) != '2016-01-01T01:01:01.123Z') console.log(prefix.replace('#', n));
    n++; if (toISOString('2016-01-01T01:01Z       '.trim()) != '2016-01-01T01:01:00.000Z') console.log(prefix.replace('#', n));
    n++; if (toISOString('2016-01-01T01:01:01.123Z'.trim()) != '2016-01-01T01:01:01.123Z') console.log(prefix.replace('#', n));
    n++; if (toISOString(Infinity)                          != null)                       console.log(prefix.replace('#', n));
    n++; if (toISOString('01/01/2016 01:01        '.trim()) != '2016-01-01T01:01:00.000Z') console.log(prefix.replace('#', n));
    n++; if (toISOString('01/01/2016 01:01:01     '.trim()) != '2016-01-01T01:01:01.000Z') console.log(prefix.replace('#', n));
    n++; if (toISOString('01/01/2016 01:01 PM     '.trim()) != '2016-01-01T13:01:00.000Z') console.log(prefix.replace('#', n));
    n++; if (toISOString(new Date('2016-01-01')) != '2016-01-01T00:00:00.000Z') console.log(prefix.replace('#', n));
    n++; if (toISOString(new Date('2016-01-01')) != '2016-01-01T00:00:00.000Z') console.log(prefix.replace('#', n));
}
function unitTests() {
    console.log('Running unit tests; only problems will be output:');
    unitTest_toISOString();
    console.log('Unit tests done!');
}

function cellIndexByValue(tr, value) {
    // allow to pass in most any element in the table, but get the row level object to work on
    if (tr.constructor.toString().contains('HTMLTableElement'))
        tr = getChildren(tr)[0];
    if (tr.constructor.toString().contains('HTMLTableSectionElement'))
        tr = getChildren(tr)[0];
    if (isTableCell(tr))
        tr = tr.parentNode;
    if (!tr.constructor.toString().contains('HTMLTableRowElement'))
        return null;

    var tds = tr.cells;
    // search for exact match first, then search for substring match, else return null
    for (var i = 0; i < tds.length; i++)
        if (tds[i].textContent == value)
            return i;
    for (var i = 0; i < tds.length; i++)
        if (tds[i].textContent.contains(value))
            return i;
    return null;
}

function isTableCell(o) {
    if (o.constructor.toString().contains('HTMLTableCellElement')
        | o.constructor.toString().contains('HTMLTableDataCellElement')
        | o.constructor.toString().contains('HTMLTableHeaderCellElement'))
        return true;
    else
        return false;
}

function getTableHeader(td) {
    if (!isTableCell(td))
        return null;
    var trHeader = getAncestorByTagName(td, 'table').getElementsByTagName('tr')[0];
    return getChildren(trHeader)[td.cellIndex];
}

function dragAndDropSupported() {
    if (ie && ieVer < 10)
        return false;
    return true;
}

function getQueryStringArray() {
    // since it is not possible for the queryString to change, store in this global variable to use for repeated calls
    if (typeof window.queryStringArray != 'undefined')
        return window.queryStringArray;

    var queryString = window.location.search.substring(1);
    var qsa = queryString.split('&');
    window.queryStringArray = qsa;

    fixqsa(qsa);

    // now also add each value as a property of the object, for convenience of use
    for (var i = 0; i < qsa.length; i++) {
        var iequalSign = qsa[i].indexOf('=');
        if (iequalSign == -1) {
            // there is no value, treat as null instead of undefined
            var k = qsa[i];
            qsa['_' + k] = null;
        } else if (iequalSign == 0) {
            // there is no name for this value, skip it
        } else {
            var k = qsa[i].substr(0, iequalSign);
            var v = qsa[i].substr(iequalSign + 1);
            v = v.replace(/\+/g, ' '); // decodeURIComponent will not replace + with space, which should be done for query string values
            v = decodeURIComponent(v);
            qsa['_' + k] = v;
        }
    }
    return qsa;
}
function updateUrl(queryStringArray) {
    var qs = createQueryString(queryStringArray);
    // remove 'default' values from the "Permanent Link", they just clutter up the URL
    var valuesToIgnore = ['max=25', 'ts=10', 'sum=0', 'ae=true'];

    for (var i = 0; i < valuesToIgnore.length; i++) {
        var v = valuesToIgnore[i];
        var i1 = qs.indexOf(v);
        if (i1 > -1) {
            var removeStart;
            if (i1 + v.length == qs.length) {
                // last parameter, remove it and one char before it
                removeStart = i1 - 1;
            } else {
                // else remove it and one char after it
                removeStart = i1;
            }
            var removeEnd = removeStart + v.length + 1;
            qs = qs.substr(0, removeStart) + qs.substr(removeEnd);
        }
    }
    // For more and related info, see: https://stackoverflow.com/questions/824349/modify-the-url-without-reloading-the-page
    var href = window.location.toString();
    if (window.location.search.length > 0)
        href = window.location.toString().replace(window.location.search, '');

    href += qs;
    //var wholePage = document.childNodes[document.childNodes.length - 1].outerHTML;
    window.history.pushState({ 'html': null, 'pageTitle': null }, '', href);
};

function getInputAndSelectElements() {
    var inputElems = document.getElementsByTagName('input');
    var selectElems = document.getElementsByTagName('select');
    var textareaElems = document.getElementsByTagName('textarea');
    inputElems = Array.prototype.slice.call(inputElems);
    selectElems = Array.prototype.slice.call(selectElems);
    textareaElems = Array.prototype.slice.call(textareaElems);
    return inputElems.concat(selectElems).concat(textareaElems);
}

function applyQueryString() {
    var qsa = getQueryStringArray();
    var elems = getInputAndSelectElements();
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (elem.id != '') {
            var k = elem.id;
            var value = qsa['_' + k];
            if (value != null & typeof value != 'undefined')
                setElemValue(elem, value);
        }
    }
}

function createQueryString(qsa) {
    if (!qsa) {
        qsa = [];
        var elems = getInputAndSelectElements();
        for (var i = 0; i < elems.length; i++) {
            var elem = elems[i];
            var k = elem.name || elem.id || null;
            if (k != null) {
                var v = getElemValue(elem);
                if (typeof v != 'undefined' & v !== null & v !== false & v !== '') {
                    qsa.push(k + '=' + encodeURIComponent(v));
                }
            }
        }
    }
    if (qsa.length == 0)
        return '';
    else
        return '?' + qsa.join('&');
}

function hasQueryString() { return (window.location.search.substring(1).length > 0); }

/*
  To enable "memory" on a page, add this line to it:
    document.addEventListener('DOMContentLoaded', loadPreviousInputValues, false);
  NOTE: this will cause strange/bad effects to most .aspx pages, so it is not done by default.
*/
function loadPreviousInputValues() {
    if (hasQueryString()) {
        applyQueryString();
        return;
    }

    // retrieve query values from localStorage
    var elems = getInputAndSelectElements();
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (elem.id != '') {
            var value = localStorage.getItem(window.location.pathname + '.' + elem.id);
            if (value != null & typeof value != 'undefined') {
                setElemValue(elem, value);
            }
        }
    }
}
function getDefaultValue(input) {
    if (!input.list)
        return null;
    var option = input.list.querySelector('option[label="default"]');
    if (option == null)
        return null;
    return option.value;
}

function saveInputValuesForNextLoad() {
    // store query values in localStorage
    var elems = getInputAndSelectElements();
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (elem.id != '') {
            var value = getElemValue(elem);
            if (value != null & typeof value != 'undefined') {
                localStorage.setItem(window.location.pathname + '.' + elem.id, value);
            }
        }
    }
}
window.onbeforeunload = function () {
    if (hasQueryString()) {
        return;
    }
    saveInputValuesForNextLoad();
}

function setElemValue(elem, value) {
    if (elem.tagName == 'INPUT') {
        switch (elem.type) {
            case 'button': case 'submit': case 'image': case 'password':
                // ignore
                break;
            case 'text': case 'number': case 'url': case 'date': case 'hidden':
                elem.value = value;
                break;
            case 'checkbox': case 'radio':
                elem.checked = (value == 'true');
                break;
            default:
                console.log('unknown <input> type: ' + elem.type);
        }
    } else if (elem.tagName == 'SELECT') {
        if (value === null) {
            // reset to the default value
            elem.value = value;
            if (elem.options)
                for (var i = 0; i < elem.options.length; i++)
                    if (elem.options[i].defaultSelected)
                        elem.selectedIndex = [i];
        } else if (typeof window.valueNotIndex != 'undefined' && window.valueNotIndex)
            elem.value = value;
        else
            elem.selectedIndex = value;
    } else if (elem.tagName == 'TEXTAREA') {
        elem.value = value;
    } else {
        console.log(elem)
    }
}

function getElemValue(elem) {
    if (elem.tagName == 'INPUT') {
        switch (elem.type) {
            case 'button': case 'submit': case 'image': case 'password':
                // ignore
                return null;
            case 'text': case 'number': case 'url': case 'date': case 'hidden':
                return elem.value;
            case 'checkbox': case 'radio':
                return elem.checked;
            default:
                console.log('unknown <input> type: ' + elem.type);
                return null;
        }
    } else if (elem.tagName == 'SELECT') {
        if (elem.selectedIndex == -1)
            return undefined;
        else {
            if (typeof window.valueNotIndex != 'undefined' && window.valueNotIndex)
                return elem.value;
            else
                return elem.selectedIndex;
        }
    } else if (elem.tagName == 'TEXTAREA') {
        return elem.value;
    } else {
        return null;
    }
}

function fixTimestamp(value) {
    // checking for a timestamp in the format YYYY-MM-DD HH:MM:SS.XXX[XXX]
    // if value is not a recognizable timestamp, just return it as-is
    if (value.length != 23 & value.length != 26)
        return value;

    var datepart = value.split(' ')[0];
    if (datepart.split('-').length != 3)
        return value;
    datepart = datepart.split('-').join('');
    datepart = parseFloat(datepart);
    if (isNaN(datepart))
        return value;

    var timepart = value.split(' ')[1];
    if (timepart.split(':').length != 3)
        return value;
    if (timepart.split('.').length != 2)
        return value;
    timepart = timepart.split(':').join('');
    timepart = parseFloat(timepart);
    if (isNaN(timepart))
        return value;

    // just cut off the sub-second values (because they do not import into Microsoft Excel well)
    return value.substr(0, 19);
}

function randomInt(min, max) {
    if (typeof min == 'undefined') return 0;
    if (typeof max == 'undefined') { max = min; min = 1; }
    return Math.floor(Math.random() * (max - min)) + min;
}

// polyfill for method 'remove', for Element / CharacterData / DocumentType
// from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
(function (arr) {
    arr.forEach(function (item) {
        if (item.hasOwnProperty('remove')) {
            return;
        }
        Object.defineProperty(item, 'remove', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function remove() {
                if (this.parentNode !== null)
                    this.parentNode.removeChild(this);
            }
        });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

// polyfill for for Array.from() -- Production steps of ECMA-262, Edition 6, 22.1.2.1
if (!Array.from) {
    Array.from = (function () {
        var toStr = Object.prototype.toString;
        var isCallable = function (fn) {
            return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
        };
        var toInteger = function (value) {
            var number = Number(value);
            if (isNaN(number)) { return 0; }
            if (number === 0 || !isFinite(number)) { return number; }
            return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function (value) {
            var len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
        };

        // The length property of the from method is 1.
        return function from(arrayLike/*, mapFn, thisArg */) {
            // 1. Let C be the this value.
            var C = this;

            // 2. Let items be ToObject(arrayLike).
            var items = Object(arrayLike);

            // 3. ReturnIfAbrupt(items).
            if (arrayLike == null) {
                throw new TypeError('Array.from requires an array-like object - not null or undefined');
            }

            // 4. If mapfn is undefined, then let mapping be false.
            var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
            var T;
            if (typeof mapFn !== 'undefined') {
                // 5. else
                // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                if (!isCallable(mapFn)) {
                    throw new TypeError('Array.from: when provided, the second argument must be a function');
                }

                // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                if (arguments.length > 2) {
                    T = arguments[2];
                }
            }

            // 10. Let lenValue be Get(items, "length").
            // 11. Let len be ToLength(lenValue).
            var len = toLength(items.length);

            // 13. If IsConstructor(C) is true, then
            // 13. a. Let A be the result of calling the [[Construct]] internal method 
            // of C with an argument list containing the single item len.
            // 14. a. Else, Let A be ArrayCreate(len).
            var A = isCallable(C) ? Object(new C(len)) : new Array(len);

            // 16. Let k be 0.
            var k = 0;
            // 17. Repeat, while k < len… (also steps a - h)
            var kValue;
            while (k < len) {
                kValue = items[k];
                if (mapFn) {
                    A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                } else {
                    A[k] = kValue;
                }
                k += 1;
            }
            // 18. Let putStatus be Put(A, "length", len, true).
            A.length = len;
            // 20. Return A.
            return A;
        };
    }());
}

// polyfill for for Array.forEach()
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback/*, thisArg*/) {
        var T, k;
        if (this == null) { throw new TypeError('this is null or not defined'); }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== 'function') { throw new TypeError(callback + ' is not a function'); }
        if (arguments.length > 1) { T = arguments[1]; }
        k = 0;
        while (k < len) {
            if (k in O) {
                callback.call(T, O[k], k, O);
            }
            k++;
        }
    };
}

// polyfill for for Array.forEach() and NodeList.forEach()
(function (arr) {
    arr.forEach(function (item) {
        if (item.hasOwnProperty('forEach')) {
            return;
        }
        Object.defineProperty(item, 'forEach', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function (callback, thisArg) {
                thisArg = thisArg || window;
                for (var i = 0; i < this.length; i++)
                    callback.call(thisArg, this[i], i, this);
            }
        });
    });
})([Array.prototype, window.NodeList.prototype]);

function formatDateISO(evt) {
    var inputElem = evt.target;
    var value = inputElem.value;
    if (value != '') {
        var d = new Date(inputElem.value);
        if (d.getFullYear() >= 1900 && d.getFullYear() < 2000)
            d.setFullYear(d.getFullYear() + 100)
        inputElem.value = d.toISOString().substr(0, 10);
    }
}
function firstDayOfThisYear() { return (new Date()).toISOString().substr(0, 4) + '-01-01'; }
function lastDayOfThisYear() { return (new Date()).toISOString().substr(0, 4) + '-12-31'; }
function firstDayOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function lastDayOfMonth(d) {
    var m = d.getMonth(), y = d.getFullYear();
    // add 1 month (Jan=0, Dec=11), then subtract 1 day
    m += 1; if (m == 12) { m = 0; y += 1; }
    return new Date(Math.floor(new Date(y, m, 1).getTime() / 86400000 - 1) * 86400000);
}
function firstDayOfLastMonth() {
    // get first day of this month, subtract 1 day, get first day of that month
    var tempDate = firstDayOfMonth(new Date());
    tempDate.setDate(tempDate.getDate() - 1);
    return firstDayOfMonth(tempDate).toISOString().substr(0, 10);
}

function addHandleInputDateFormat() {
    var inputs = document.getElementsByTagName('INPUT');
    for (var i = 0; i < inputs.length; i++) {
        // add support for input types that the browser does not support
        switch (inputs[i].getAttribute('type')) {
            case 'date':
                if (inputs[i].type != 'date')
                    inputs[i].addEventListener('focusout', formatDateISO);
                break;
            case 'datetime-picker':
            case 'datetime-local':
                // replace default handling with jqueryUI
                $(inputs[i]).datetimepicker();
                inputs[i].setAttribute('type', 'datetime-picker');
                // I really don't like the JQuery datetimepicker very much, but it is much better than the
                //  default implementation of <input type="datetime-local"> (when implemented at all)
                break;
        }
       
    }
};

function getEventPath(event) {
    var path = event.path || (event.composedPath && event.composedPath());
    if (typeof path != 'undefined')
        return path;
    // fallback for when path and composedPath are not supported (IE11)
    var element = event.target || null;
    if (!element || !element.parentElement)
        return [];
    var path = [element];
    while (element.parentElement) {
        element = element.parentElement;
        path.unshift(element);
    }
    return path;
}
function selectableTable_click(event) {
    if (event.button !== 0) return; // only change selection for left-click

    var table = event.target;
    if (table.tagName == 'TD')
        table = table.parentNode;
    else if (table.tagName == 'TH')
        table = table.parentNode;
    if (table.tagName == 'TR')
        table = table.parentNode;
    if (table.tagName == 'THEAD')
        table = table.parentNode;
    else if (table.tagName == 'TBODY')
        table = table.parentNode;
    if (table.tagName != 'TABLE')
        return;

    var tr = null, trs = []; // need currently selected row, and the list of all rows in this table
    var path = getEventPath(event);
    for (var b = 0; b < table.tBodies.length; b++) {
        var tbody = table.tBodies[b]
        for (var r = 0; r < tbody.rows.length; r++) {
            var row = tbody.rows[r];
            trs.push(row);
            if (path.indexOf(row) > -1)
                tr = row;
        };
    }
    if (!tr) return;
    var selIndex = trs.indexOf(tr);
    if (event.shiftKey & typeof table.lastSelectedRowIndex != 'undefined') {
        var i1 = table.lastSelectedRowIndex;
        var i2 = selIndex;
        if (i1 > i2) { i1 = i1 + i2; i2 = i1 - i2; i1 = i1 - i2; } // swap values
        if (event.ctrlKey) // unselect all between the two rows
            for (var i = i1 + 1; i < i2; i++)
                trs[i].classList.remove('selected');
        else // select all between the two rows
            for (var i = i1 + 1; i < i2; i++)
                trs[i].classList.add('selected');
    } else if (!event.ctrlKey) //clear all previously selected
        for (var i = 0; i < trs.length; i++)
            trs[i].classList.remove('selected');
    //toggle target row
    var classList = tr.classList;
    if (classList.contains('selected'))
        classList.remove('selected');
    else
        classList.add('selected');
    table.lastSelectedRowIndex = selIndex; // store for next time
}
function deleteSelectedRows(event) {
    var table;
    if (event instanceof Event) {
        // called with event from either a button, or on a table itself
        event.preventDefault();
        if (event.target.tagName == 'TABLE') {
            table = event.target;
            // continue to delete selected rows for this table
        } else {
            // when called on a button, perform for all 'selectable' tables instead
            var tables = document.getElementsByClassName('selectable');
            if (tables.length == 0) {
                Toast.toast('No rows selected');
            }
            for (var i = 0; i < tables.length; i++)
                deleteSelectedRows(tables[i]);
            return false;
        }
    } else
        table = event; // assume this is called recursively by the above

    var rowsRemoved = false;
    for (var b = 0; b < table.tBodies.length; b++) {
        var tbody = table.tBodies[b]
        for (var r = 0; r < tbody.rows.length; r++) {
            var row = tbody.rows[r];
            if (row.classList.contains('selected')) {
                row.remove(); r--;
                rowsRemoved = true;
            }
        };
    }
    return rowsRemoved;
}

var Toast = {
    showToast: function (uiToast) {
        uiToast.setAttribute('class', 'show');
    },
    hideToast: function (toast) {
        if (toast.parentElement == null) return; // already removed from the DOM
        var isHoveredOver = (toast.parentElement.querySelector(':hover') === toast);
        if (isHoveredOver) {
            // if the cursor is over this message, don't remove it;
            // wait 1/4 second and try again
            setTimeout(function () { Toast.hideToast(toast); }, 250);
            return;
        }
        // if this is the top-most element, let it fade out, then remove it
        if (toast.parentNode.getElementsByTagName('DIV')[0] == toast) {
            toast.removeAttribute('class');
            // after the fade-outtransition ends, remove the element from the DOM
            setTimeout(function () { toast.remove(); }, 250);
        } else {
            // else remove it immediately
            toast.remove();
        }
    },
    getMatchingToast: function (keyObject) {
        if (typeof keyObject == 'undefined' | keyObject == null)
            return null;
        var uiToaster = byId('uiToaster');
        for (var i = 0; i < uiToaster.childNodes.length; i++) {
            var toast = uiToaster.childNodes[i]
            if (toast.keyObject == keyObject) {
                return toast;
            }
        }
        return null;
    },
    toast: function (message, delay, keyObject, isError) {
        if (message instanceof Error)
            message = (message.stack || message.toString());
        var uiToaster = byId('uiToaster');
        if (uiToaster == null) {
            uiToaster = document.createElement('DIV');
            uiToaster.id = 'uiToaster';
            document.body.appendChild(uiToaster);
        }

        var uiToast;
        if (typeof message == 'object' && message instanceof HTMLElement)
            if (message.tagName == 'DIV')
                uiToast = message;
            else {
                // the CSS relies on each toast being a <DIV> element
                uiToast = document.createElement('DIV');
                uiToast.appendChild(message);
            }
        else {
            uiToast = document.createElement('DIV');
            uiToast.innerText = message;
        }

        uiToast.keyObject = keyObject;

        if (typeof delay == 'undefined' | delay == null || delay <= 0) {
            // average reading speed around 24-29 characters per second; use 20 for a safer value
            delay = uiToast.innerText.length * 1000 / 20;
            if (delay < 2000)
                delay = 2000; // minimum 2 seconds
            else if (delay > 5000)
                // assume that the user will skim a longer message
                delay = 5000 + (delay - 5000) / 2;
        }

        var matchingToast = Toast.getMatchingToast(keyObject);
        if (matchingToast != null) {
            // instead of adding a new node at the end, replace the one with the matching key value
            uiToaster.insertBefore(uiToast, matchingToast);
            Toast.showToast(uiToast); // no need for a timer delay, since this is replacing an already visible element
            clearTimeout(matchingToast.timerHandle); // prevent 'hideToast' from running later - we're removing it now instead
            if (!isError)
                matchingToast.remove(); // remove from DOM
        } else {
            uiToaster.appendChild(uiToast);
            // when adding a new element, give a micro-second delay before adding it,
            //  or else it will not fade-in on the first time.
            // This is fine when we are "replacing" the previous matching element, which is why this is only done for non-matched elements.
            setTimeout(function () { Toast.showToast(uiToast); }, 1);
        }

        if (isError) {
            // do not remove error messages until the user clicks "dismiss"
            console.log(message);
            addClassName(uiToast, 'toasterror');

            var uiDismiss = document.createElement('BUTTON');
            addClassName(uiDismiss, 'dismiss');
            uiDismiss.onclick = function () { uiToast.remove(); }
            uiDismiss.textContent = 'Dismiss';
            uiToast.insertBefore(uiDismiss, uiToast.childNodes[0]);
            //uiToast.appendChild(uiDismiss);
        } else
            // after the duration, remove this message
            uiToast.timerHandle = setTimeout(function () { Toast.hideToast(uiToast); }, delay);

        //console.log('Toast(' + (isError?'error':delay) + '): ' + message);
    },
    add: function (message, delay, keyObject) { this.toast(message, delay, keyObject); }
}
var _autocompleteInputs = [];
Array.prototype.removeItem = function (item) {
    var index = this.indexOf(item);
    if (index > -1)
        return this.splice(index, 1)[0]; // return the item that was removed
    else
        return null;
};
function autocomplete(inp, arr, forceFlag, multiselect) {
    if (inp.hasAttribute('autocomplete')) {
        if (!forceFlag)
            // unless forcing to replace existing autocomplete, do not add a second time
            return; 

        // if forcing to replace existing autocomplete, remove the first set before adding
        // First, remove existing active drop-down (if any)
        var existingList = document.getElementsByClassName('autocomplete-items')[0];
        if (typeof existingList != 'undefined')
            existingList.parentNode.removeChild(existingList);
        // doing this correctly is annoying, so instead just replace the element with a clone that has no listeners
        var clone = inp.cloneNode(true);
        inp.parentNode.insertBefore(clone, inp);
        inp.remove();
        _autocompleteInputs.removeItem(inp);
        inp = clone;
    }
    _autocompleteInputs.push(inp);
    // For at least three inputs that I used ("su", "sc", "add"), the Chrome browser believes that this indicates 
    //  a specific autocomplete field (city, city, address; so weird). There is a simple "correct" fix for this,
    //  which is to set autocomplete="off" in the <input> tag, but Chrome disregards this.
    // I added this complaint to a bug report, so maybe it will be fixed someday, but it's doubtful
    //  https://bugs.chromium.org/p/chromium/issues/detail?id=883440&q=commentby%3Aabamacus%40gmail.com&colspec=ID%20Pri%20M%20Stars%20ReleaseBlock%20Component%20Status%20Owner%20Summary%20OS%20Modified
    // For now, the only reasonable workaround is to set the autocomplete attribute on the <input> element to a random value.
    // This does seem to work, overriding the autocomplete "guess" from Chrome.
    inp.setAttribute('autocomplete', 'off');// YAY, seems to be fixed!
    //inp.setAttribute('autocomplete', Math.random().toString());

    function multiUpdateSelected(target, listDiv, clickedValue) {
        var selectedValues = target.value.split(',');

        if (clickedValue) {
            // update the value of the target (which is an input element)
            var clickedValues = clickedValue.split(',');
            var allValuesPresent = true;
            for (var i = 0; i < clickedValues.length; i++) {
                // remove if exists
                var index = selectedValues.indexOf(clickedValues[i]);
                if (index > -1)
                    selectedValues.splice(index, 1);
                else
                    allValuesPresent = false;
            }
            target.value = selectedValues.join();
            // if not all values existed, add all values to end
            if (!allValuesPresent)
                if (target.value === '')
                    target.value = clickedValue;
                else
                    target.value += ',' + clickedValue;
            selectedValues = target.value.split(',');
        }

        var itemList = listDiv.getElementsByTagName('DIV');
        for (var i1 = 0; i1 < itemList.length; i1++) {
            var itemDiv = itemList[i1];
            var thisfullvalue = itemDiv.getAttribute('value');
            if (thisfullvalue) {
                var thiskeyvalues = itemDiv.getAttribute('value').split(',');
                var selected = true;
                for (var i2 = 0; selected && i2 < thiskeyvalues.length; i2++) {
                    if (!selectedValues.contains(thiskeyvalues[i2]))
                        selected = false;
                }
                if (selected)
                    itemDiv.classList.add('selected')
                else
                    itemDiv.classList.remove('selected')
            }
        }
    }

    var prevValue = null;
    function updateAutocomplete(event) {
        // this little ugly bit of code is a workaround for how IE11's 'input' event fires when the user clicks an input field, even when not changing the value
        // (if not for that, could just call addAutocomplete directly and not go through this method)
        var valueChanged = (!(prevValue === null || prevValue === event.target.value))
        prevValue = event.target.value;
        if (valueChanged)
            addAutocomplete(event);
    }
    var currentFocus;
    function addAutocomplete(event) {
        var target = event.target;
        // close any other existing autocomplete lists in the document
        var x = document.getElementsByClassName('autocomplete-items');
        for (var i = 0; i < x.length; i++)
            x[i].parentNode.removeChild(x[i]);
        var val = target.value;
        // escape special chars -- because to ignore case, we are going to going to "RegExp" this val,
        //   but we do not want to actually apply regex values from the input
        var valEscaped = val.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        //if (!val) return false;
        currentFocus = -1;
        var listDiv = document.createElement('DIV');
        listDiv.setAttribute('class', 'autocomplete-items');
        listDiv.setAttribute('for', inp.id);
        target.parentNode.appendChild(listDiv);
        var listGroup = document.createElement('GROUP');
        listDiv.appendChild(listGroup);
        for (var i = 0; i < arr.length; i++) {
            var arri = arr[i];
            var thisDisplayValue;
            var thisKeyValue;
            if (typeof arri === 'string') {
                // good, this is a simple value
                thisDisplayValue = arri;
                thisKeyValue = arri;
            } else {
                // this should be an object with only one property; the name of the property is the "value", and the value of the property is for display
                thisKeyValue = Object.keys(arri)[0];
                thisDisplayValue = arri[thisKeyValue];
            }
            if (typeof thisDisplayValue == 'undefined') {
                // acts as a sortof "line break"
                var listGroup = document.createElement('GROUP');
                listDiv.appendChild(listGroup);
            } else if (thisKeyValue === '') {
                // add as a non-clickable group name
                var itemHead = document.createElement('H3');
                itemHead.appendChild(document.createTextNode(thisDisplayValue));
                var itemDiv = document.createElement('DIV');
                itemDiv.appendChild(itemHead);
                listGroup.appendChild(itemDiv);
                itemDiv.addEventListener('click', function (e) {
                    e.cancelBubble = true;
                });
            } else if (multiselect) {
                // add to list, with <STRONG> around the matching text
                var itemDiv = document.createElement('DIV');
                itemDiv.setAttribute('value', thisKeyValue);
                itemDiv.appendChild(document.createTextNode(thisDisplayValue));

                itemDiv.addEventListener('click', function (e) {
                    var itemDiv = e.target;
                    var thisKeyValue = itemDiv.getAttribute('value');
                    multiUpdateSelected(target, listDiv, thisKeyValue);
                    e.cancelBubble = true; // prevent the autocomplete_document_click() event from firing
                });
                listGroup.appendChild(itemDiv);
            } else {
                var iMatch = thisDisplayValue.search(new RegExp(valEscaped, 'i'));
                if (iMatch > -1) {
                    // add to list, with <STRONG> around the matching text
                    var itemDiv = document.createElement('DIV');
                    itemDiv.setAttribute('value', thisKeyValue);
                    itemDiv.appendChild(document.createTextNode(thisDisplayValue.substr(0, iMatch)));
                    var itemStrong = document.createElement('STRONG');
                    itemStrong.textContent = thisDisplayValue.substr(iMatch, val.length);
                    itemDiv.appendChild(itemStrong);
                    itemDiv.appendChild(document.createTextNode(thisDisplayValue.substr(iMatch + val.length)));
                    itemDiv.addEventListener('click', function (e) {
                        target.value = e.target.getAttribute('value');
                        listDiv.parentNode.removeChild(listDiv);
                    });
                    listGroup.appendChild(itemDiv);
                }
            }
        }

        if (multiselect) // not used for multiselect; and multiselect allows multiple lists
            multiUpdateSelected(target, listDiv);
        else
            target.autocompleteList = listDiv;

    }
    inp.addAutocomplete = addAutocomplete; // expose so autocomplete_document_click can call this
    if (!multiselect) {
        inp.addEventListener('input', updateAutocomplete);
        inp.addEventListener('keydown', function (e) {
            var x = e.target.autocompleteList;
            if (x) x = x.getElementsByTagName('div');
            if (e.keyCode == 40) { // DOWN
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) { // UP
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) { // ENTER -  prevent form from being submitted
                e.preventDefault();
                if (currentFocus > -1)
                    if (x) x[currentFocus].click();
            }
        });
    }
    function addActive(x) {
        if (!x) return false;
        for (var i = 0; i < x.length; i++)
            x[i].classList.remove('autocomplete-active');
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add('autocomplete-active');
    }
    if (forceFlag) {
        // force displaying the drop-down immediately
        addAutocomplete({ target: inp });
        if (document.activeElement != inp) {
            // set focus to the input, cursor at end of text
            // this is only needed because above (in this method),
            //  we may replace the input with a clone of itself,
            //  which will not have focus or cursor position
            inp.focus();
            inp.setSelectionRange(inp.getAttribute('value').length, inp.getAttribute('value').length);
        }
    }
}
function autocomplete_document_click(event) {
    if (event.target.hasAttribute('autocomplete')) {
        var i = _autocompleteInputs.indexOf(event.target);
        if (i > -1) {
            var inputClicked = _autocompleteInputs[i];

            // when click on empty input field, toggle the autocomplete on or off
            var existingList = document.getElementsByClassName('autocomplete-items')[0];
            if (typeof existingList == 'undefined')
                inputClicked.addAutocomplete(event);
            else
                existingList.parentNode.removeChild(existingList);

        }
    } else {
        /*close all autocomplete lists in the document, except the one passed as an argument*/
        var x = document.getElementsByClassName('autocomplete-items');
        for (var i = 0; i < x.length; i++)
            x[i].parentNode.removeChild(x[i]);
    }
}
document.addEventListener('click', autocomplete_document_click);

{// snowfall
    function letItSnow(options) {
        var SVG_NS = 'http://www.w3.org/2000/svg';
        var getSnowflakeArm = function (x, y, radius) {
            var x0 = Math.round(x * 100) / 100, y0 = Math.round(y * 100) / 100;
            radius = Math.round(radius * 100) / 100;
            var radiusOffset1 = radius / 5;
            var xArm1 = radius / 5, yArm1 = radius / 10;
            var radiusOffset2 = radiusOffset1 * 2;
            var xArm2 = xArm1 * 2, yArm2 = yArm1 * 2;
            var armPoints = []; // draw from center to tip
            armPoints.push({ a: 'M', x: x0, y: y0 });
            armPoints.push({ a: 'L', x: x0, y: y0 - radius });
            // draw first spoke -- from tip, to center, to tip
            armPoints.push({ a: 'M', x: x0 + xArm1, y: y0 - radius + yArm1 });
            armPoints.push({ a: 'L', x: x0, y: y0 - radius + radiusOffset1 });
            armPoints.push({ a: 'L', x: x0 - xArm1, y: y0 - radius + yArm1 });
            // draw second spoke
            armPoints.push({ a: 'M', x: x0 + xArm2, y: y0 - radius + yArm2 });
            armPoints.push({ a: 'L', x: x0, y: y0 - radius + radiusOffset2 });
            armPoints.push({ a: 'L', x: x0 - xArm2, y: y0 - radius + yArm2 });
            var d = '';
            for (var j = 0; j < armPoints.length; j++) {
                var p = armPoints[j];
                d += '\n' + p.a + p.x + ',' + p.y;
            }
            return d;
        }
        var getSnowflake = function (x, y, radius, speed, spin, clockwise) {
            var secondsSpin = (11 - spin) / 4; // spin should be from 1 to 10
            var sign = clockwise ? 1 : -1;
            var g = document.createElementNS(SVG_NS, 'g');
            // the bigger the snowflake, the thicker you need the lines to be
            var strokeWidth = Math.round(radius / 15 * 100) / 100;
            var d = getSnowflakeArm(x, 0, radius);
            for (var i = 0; i < 6; i++) {
                var path = document.createElementNS(SVG_NS, 'path');
                //path.setAttribute('id','Mine' + i);
                path.setAttribute('d', d);
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke-width', strokeWidth);
                path.setAttribute('stroke', '#ffffff');
                var animate = document.createElementNS(SVG_NS, 'animateTransform');
                animate.setAttribute('attributeName', 'transform');
                animate.setAttribute('type', 'rotate');
                animate.setAttribute('from', (i + 0) * 60 * sign + ' ' + x + ' ' + 0);
                animate.setAttribute('to', (i + 1) * 60 * sign + ' ' + x + ' ' + 0);
                animate.setAttribute('dur', secondsSpin + 's');
                animate.setAttribute('repeatCount', 'indefinite');
                path.appendChild(animate);
                g.appendChild(path);
            }
            var h = window.innerHeight;
            var secondsFall = h / speed;
            var fallenBeginSeconds = secondsFall * y / h;
            var animate = document.createElementNS(SVG_NS, 'animateTransform');
            animate.setAttribute('attributeName', 'transform');
            animate.setAttribute('type', 'translate');
            animate.setAttribute('from', '0 ' + (0 - radius));
            animate.setAttribute('to', '0 ' + (h + radius));
            animate.setAttribute('dur', secondsFall + 's');
            animate.setAttribute('begin', -fallenBeginSeconds + 's');
            animate.setAttribute('repeatCount', 'indefinite');
            g.appendChild(animate);
            return g;
        }
        { // validation/defaults for all used option values
            if (typeof options == 'undefined') options = {};
            var validOrDefault = function (value, min, max, defaultValue) {
                if (isNaN(value))
                    return defaultValue;
                value = Number(value);
                if (value < min || value > max)
                    return defaultValue;
                return value;
            }
            options.numFlakes = validOrDefault(options.numFlakes, 1, 500, 75);
            options.minSize = validOrDefault(options.minSize, 5, 50, 5);
            options.maxSize = validOrDefault(options.maxSize, 5, 50, 20);
            options.minSpin = validOrDefault(options.minSpin, 0, 10, 3);
            options.maxSpin = validOrDefault(options.maxSpin, 0, 10, 7);
            options.minSpeed = validOrDefault(options.minSpeed, 0, 100, 10);
            options.maxSpeed = validOrDefault(options.maxSpeed, 0, 100, 90);
            if (isNaN(options.zIndex)) options.zIndex = -1;
        }
        // create <svg>, set to size of page, add animated snowflakes
        var svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('width', window.innerWidth);
        svg.setAttribute('height', window.innerHeight);
        svg.style.position = 'fixed';
        svg.style.left = 0;
        svg.style.top = 0;
        svg.style.zIndex = options.zIndex;
        for (var i = 0; i < options.numFlakes; i++) {
            var x = Math.random() * window.innerWidth;
            var y = Math.random() * window.innerHeight;
            var radius = Math.random() * (options.maxSize - options.minSize) + options.minSize;
            var spin = Math.random() * (options.maxSpin - options.minSpin) + options.minSpin;
            var clockwise = (Math.random() > 0.5);
            var speed = Math.random() * (options.maxSpeed - options.minSpeed) + options.minSpeed;
            var snowflake = getSnowflake(x, y, radius, speed, spin, clockwise);
            svg.appendChild(snowflake);
        }
        if (isNaN(options.delay) == false) {
            var delaySeconds = Number(options.delay);
            if (delaySeconds > 0) {
                svg.style.display = 'none';
                window.setTimeout(function () { svg.style.display = ''; },
                    delaySeconds * 1000);
            }
        }
        document.addEventListener("DOMContentLoaded", function () { document.body.appendChild(svg); }, false);
    }
    var isDecember = ((new Date()).getMonth() == 11);
    isDecember = false; // in 2019, noticed that this is using way more CPU and RAM than it should; disabling at least for now
    if (isDecember)
        letItSnow({ delay: 30 }); // don't show until user stays on page (without postback) for 30 seconds
}

function addHandlersSelectAndCopy() {
    var labels = document.getElementsByClassName('clickcopy');
    for (var i = 0; i < labels.length; i++)
        labels[i].addEventListener('click', selectAndCopy);
}
function selectAndCopy(e) {
    try {
        var elem = e.target;
        var id = elem.getAttribute('for');
        var elemTarget = byId(id);
        var tempStyle = null;
        if (window.getComputedStyle(elemTarget).display == 'none') {
            // temporarily un-hide the data, so it can be copied
            tempStyle = elemTarget.style.display;
            elemTarget.style.display = 'block';
        }
        window.getSelection().selectAllChildren(elemTarget);
        document.execCommand('copy');
        if (tempStyle !== null)
            elemTarget.style.display = tempStyle;
        Toast.toast('The value of "' + elem.textContent + '" was copied to clipboard');
    } catch (err) {
        console.log(err);
    }
}

function updateFavicon() {
    try {
        var link = document.querySelectorAll('link[rel="shortcut icon"]')[0];
        if (typeof link == 'undefined') {
            var head = document.getElementsByTagName('HEAD')[0];
            if (typeof head == 'undefined')
                return;
            // create element, like:
            link = document.createElement('LINK');
            link.setAttribute('rel', 'shortcut icon');
            link.setAttribute('href', '/favicon.png');
            head.appendChild(link);
        }
        link.setAttribute('href', '/favicon.png');
    } catch (e) {
        console.log(e);
    }
}

var KEYCODE_END_OF_TEXT = 3;
var KEYCODE_BACKSPACE = 8;
var KEYCODE_TAB = 9;
var KEYCODE_NEW_LINE = 10;
var KEYCODE_CARRIAGE_RETURN = 13;
var KEYCODE_SHIFT_IN = 14;
var KEYCODE_SHIFT_OUT = 15;
var KEYCODE_CANCEL = 24;
var KEYCODE_ESCAPE = 27;
var KEYCODE_LEFT = 37;
var KEYCODE_UP = 38;
var KEYCODE_RIGHT = 39;
var KEYCODE_DOWN = 40;

function initializeJScript() {
    var elems = Array.prototype.slice.call(document.getElementsByTagName('hoverOptions'), 0);
    document.body.setAttribute('host', window.location.hostname.toUpperCase());
    addExpandCollapseEvents();
    updateFavicon();
    addHandleInputDateFormat();
    addHandlersSelectAndCopy();
}
//The DOMContentLoaded event will fire as soon as the DOM hierarchy has been fully constructed;
// the load event will do it when all the images and sub-frames have finished loading.
document.addEventListener('DOMContentLoaded', initializeJScript, false);

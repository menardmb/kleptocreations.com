/*
Script: Moo.js
	My Object Oriented javascript.
	
Dependancies:
	 Has no dependancies.
	
Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.

Credits:
	- Class is slightly based on Base.js  <http://dean.edwards.name/weblog/2006/03/base/> (c) 2006 Dean Edwards, License <http://creativecommons.org/licenses/LGPL/2.1/>
	- Some functions are based on those found in prototype.js <http://prototype.conio.net/> (c) 2005 Sam Stephenson sam [at] conio [dot] net, MIT-style license
	- Documentation by Aaron Newton (aaron.newton [at] cnet [dot] com) and Valerio Proietti.
*/

/*
Class: Class
	The base class object of the <http://mootools.net> framework.
	
Arguments:
	properties - the collection of properties that apply to the class. Creates a new class, its initialize method will fire upon class instantiation.
	
Example:
	>var Cat = new Class({
	>	initialize: function(name){
	>		this.name = name;
	>	}
	>});
	>var myCat = new Cat('Micia');
	>alert myCat.name; //alerts 'Micia'
*/

var Class = function(properties){
	var klass = function(){
		for (var p in this){
			if (this[p]) this[p]._proto_ = this;
		}
		if (arguments[0] != 'noinit' && this.initialize) return this.initialize.apply(this, arguments);
	};
	klass.extend = this.extend;
	klass.implement = this.implement;
	klass.prototype = properties;
	return klass;
};

/*
Property: empty
	Returns an empty function
*/

Class.empty = function(){};

/*
Property: create
	same as new Class. see <Class>
*/

Class.create = function(properties){
	return new Class(properties);
};

Class.prototype = {

	/*
	Property: extend
		Returns the copy of the Class extended with the passed in properties.
		
	Arguments:
		properties - the properties to add to the base class in this new Class.
		
	Example:
		>var Animal = new Class({
		>	initialize: function(age){
		>		this.age = age;
		>	}
		>});
		>var Cat = Animal.extend({
		>	initialize: function(name, age){
		>		this.parent(age); //will call the previous initialize;
		>		this.name = name;
		>	}
		>});
		>var myCat = new Cat('Micia', 20);
		>alert myCat.name; //alerts 'Micia'
		>alert myCat.age; //alerts 20
	*/

	extend: function(properties){
		var pr0t0typ3 = new this('noinit');
		for (var property in properties){
			var previous = pr0t0typ3[property];
			var current = properties[property];
			if (previous && previous != current) current = previous.parentize(current) || current;
			pr0t0typ3[property] = current;
		}
		return new Class(pr0t0typ3);
	},
	
	/*	
	Property: implement
		Implements the passed in properties to the base Class prototypes, altering the base class, unlike <Class.extend>.

	Arguments:
		properties - the properties to add to the base class.
		
	Example:
		>var Animal = new Class({
		>	initialize: function(age){
		>		this.age = age;
		>	}
		>});
		>Animal.implement({
		>	setName: function(name){
		>		this.name = name
		>	}
		>});
		>var myAnimal = new Animal(20);
		>myAnimal.setName('Micia');
		>alert(myAnimal.name); //alerts 'Micia'
	*/
	
	implement: function(properties){
		for (var property in properties) this.prototype[property] = properties[property];
	}

};

/* Section: Object related Functions  */

/*
Function: Object.extend
	Copies all the properties from the second passed object to the first passed Object.
	If you do myWhatever.extend = Object.extend the first parameter will become myWhatever, and your extend function will only need one parameter.
		
Example:
	>var firstOb = {
	>	'name': 'John',
	>	'lastName': 'Doe'
	>};
	>var secondOb = {
	>	'age': '20',
	>	'sex': 'male',
	>	'lastName': 'Dorian'
	>};
	>Object.extend(firstOb, secondOb);
	>//firstOb will become: 
	>{
	>	'name': 'John',
	>	'lastName': 'Dorian',
	>	'age': '20',
	>	'sex': 'male'
	>};
	
Returns:
	The first object, extended.
*/

Object.extend = function(){
	var args = arguments;
	if (args[1]) args = [args[0], args[1]];
	else args = [this, args[0]];
	for (var property in args[1]) args[0][property] = args[1][property];
	return args[0];
};

/*
Function: Object.Native
	Will add a .extend method to the objects passed as a parameter, equivalent to <Class.implement>

Arguments:
	a number of classes/native javascript objects

*/

Object.Native = function(){
	for (var i = 0; i < arguments.length; i++) arguments[i].extend = Class.prototype.implement;
};

new Object.Native(Function, Array, String, Number);

Function.extend({

	parentize: function(current){
		var previous = this;
		return function(){
			this.parent = previous;
			return current.apply(this, arguments);
		};
	}

});
/* 
Script: Function.js
	Contains Function prototypes, utility functions and Chain.

Dependencies: 
	<Moo.js>

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.

Credits:
	- Some functions are inspired by those found in prototype.js <http://prototype.conio.net/> (c) 2005 Sam Stephenson sam [at] conio [dot] net, MIT-style license
*/

/*
Class: Function
	A collection of The Function Object prototype methods.
*/

Function.extend({
	
	/*
	Property: pass
		Shortcut to create closures with arguments and bind.
	
	Returns:
		a function.
	
	Arguments:
		args - the arguments to pass to that function (array or single variable)
		bind - optional, the object that the "this" of the function will refer to.
	
	Example:
		>myFunction.pass([arg1, arg2], myElement);
	*/
	
	pass: function(args, bind){
		var fn = this;
		if ($type(args) != 'array') args = [args];
		return function(){
			return fn.apply(bind || fn._proto_ || fn, args);
		};
	},
	
	/*
	Property: bind
		method to easily create closures with "this" altered.
	
	Arguments:
		bind - optional, the object that the "this" of the function will refer to.
	
	Returns:
		a function.
	
	Example:
		>function myFunction(){
		>	this.setStyle('color', 'red');
		>	// note that 'this' here refers to myFunction, not an element
		>	// we'll need to bind this function to the element we want to alter
		>};
		>var myBoundFunction = myFunction.bind(myElement);
		>myBoundFunction(); // this will make the element myElement red.
	*/
	
	bind: function(bind){
		var fn = this;
		return function(){
			return fn.apply(bind, arguments);
		};
	},
	
	/*
	Property: bindAsEventListener
		cross browser method to pass event firer
	
	Arguments:
		bind - optional, the object that the "this" of the function will refer to.
	
	Returns:
		a function with the parameter bind as its "this" and as a pre-passed argument event or window.event, depending on the browser.
	
	Example:
		>function myFunction(event){
		>	alert(event.clientx) //returns the coordinates of the mouse..
		>};
		>myElement.onclick = myFunction.bindAsEventListener(myElement);
	*/
		
	bindAsEventListener: function(bind){
		var fn = this;
		return function(event){
			fn.call(bind, event || window.event);
			return false;
		};
	},
	
	/*
	Property: delay
		Delays the execution of a function by a specified duration.
	
	Arguments:
		ms - the duration to wait in milliseconds
		bind - optional, the object that the "this" of the function will refer to.
	
	Example:
		>myFunction.delay(50, myElement) //wait 50 milliseconds, then call myFunction and bind myElement to it
		>(function(){alert('one second later...')}).delay(1000); //wait a second and alert
	*/
	
	delay: function(ms, bind){
		return setTimeout(this.bind(bind || this._proto_ || this), ms);
	},
	
	/*
	Property: periodical
		Executes a function in the specified intervals of time
		
	Arguments:
		ms - the duration of the intervals between executions.
		bind - optional, the object that the "this" of the function will refer to.
	*/
	
	periodical: function(ms, bind){
		return setInterval(this.bind(bind || this._proto_ || this), ms);
	}

});

/* Section: Utility Functions  */

/*
Function: $clear
	clears a timeout or an Interval.

Returns:
	null

Arguments:
	timer - the setInterval or setTimeout to clear.

Example:
	>var myTimer = myFunction.delay(5000); //wait 5 seconds and execute my function.
	>myTimer = $clear(myTimer); //nevermind

See also:
	<Function.delay>, <Function.periodical>
*/

function $clear(timer){
	clearTimeout(timer);
	clearInterval(timer);
	return null;
};

/*
Function: $type
	Returns the type of object that matches the element passed in.

Arguments:
	obj - the object to inspect.

Example:
	>var myString = 'hello';
	>$type(myString); //returns "string"

Returns:
	'function' - if obj is a function
	'textnode' - if obj is a node but not an element
	'element' - if obj is a DOM element
	'array' - if obj is an array
	'object' - if obj is an object
	'string' - if obj is a string
	'number' - if obj is a number
	false - (boolean) if the object is not defined or none of the above, or if it's an empty string.
*/
	
function $type(obj){
	if (!obj) return false;
	var type = false;
	if (obj instanceof Function) type = 'function';
	else if (obj.nodeName){
		if (obj.nodeType == 3 && !/\S/.test(obj.nodeValue)) type = 'textnode';
		else if (obj.nodeType == 1) type = 'element';
	}
	else if (obj instanceof Array) type = 'array';
	else if (typeof obj == 'object') type = 'object';
	else if (typeof obj == 'string') type = 'string';
	else if (typeof obj == 'number' && isFinite(obj)) type = 'number';
	return type;
};

/*Class: Chain*/

var Chain = new Class({
	
	/*
	Property: chain
		adds a function to the Chain instance stack.
		
	Arguments:
		fn - the function to append.
	
	Returns:
		the instance of the <Chain> class.
	
	Example:
		>var myChain = new Chain();
		>myChain.chain(myFunction).chain(myFunction2);
	*/
	
	chain: function(fn){
		this.chains = this.chains || [];
		this.chains.push(fn);
		return this;
	},
	
	/*
	Property: callChain
		Executes the first function of the Chain instance stack, then removes it. The first function will then become the second.

	Example:
		>myChain.callChain(); //executes myFunction
		>myChain.callChain(); //executes myFunction2
	*/
	
	callChain: function(){
		if (this.chains && this.chains.length) this.chains.splice(0, 1)[0].delay(10, this);
	},

	/*
	Property: clearChain
		Clears the stack of a Chain instance.
	*/
	
	clearChain: function(){
		this.chains = [];
	}

});
/*
Script: Array.js
	Contains Array prototypes and the function <$A>;

Dependencies:
	<Moo.js>
	
Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: Array
	A collection of The Array Object prototype methods.
*/

if (!Array.prototype.forEach){
	
	/*	
	Mehod: forEach
		Iterates through an array; note: <Array.each> is the preferred syntax for this funciton.
		
	Arguments:
		fn - the function to execute with each item in the array
		bind - optional, the object that the "this" of the function will refer to.
		
	Example:
		>var Animals = ['Cat', 'Dog', 'Coala'];
		>Animals.forEach(function(animal){
		>	document.write(animal)
		>});

	See also:
		<Function.bind>
		<Array.each>
	*/
	
	Array.prototype.forEach = function(fn, bind){
		for(var i = 0; i < this.length ; i++) fn.call(bind, this[i], i);
	};
}

Array.extend({
	
	/*
	Property: each
		Same as <Array.each>.
	*/
	
	each: Array.prototype.forEach,
	
	/*	
	Property: copy
		Copy the array and returns it.
	
	Returns:
		an Array
			
	Example:
		>var letters = ["a","b","c"];
		>var copy = ["a","b","c"].copy();
	*/
	
	copy: function(){
		var newArray = [];
		for (var i = 0; i < this.length; i++) newArray.push(this[i]);
		return newArray;
	},
	
	/*	
	Property: remove
		Removes an item from the array.
		
	Arguments:
		item - the item to remove
		
	Returns:
		the Array without the item removed.
		
	Example:
		>["1","2","3"].remove("2") // ["1","3"];
	*/
	
	remove: function(item){
		for (var i = 0; i < this.length; i++){
			if (this[i] == item) this.splice(i, 1);
		}
		return this;
	},
	
	/*	
	Property: test
		Tests an array for the presence of an item.
		
	Arguments:
		item - the item to search for in the array.
		
	Returns:
		true - the item was found
		false - it wasn't
		
	Example:
		>["a","b","c"].test("a"); // true
		>["a","b","c"].test("d"); // false
	*/
	
	test: function(item){
		for (var i = 0; i < this.length; i++){
			if (this[i] == item) return true;
		};
		return false;
	},
	
	/*	
	Property: extend
		Extends an array with another
		
	Arguments:
		newArray - the array to extend ours with
		
	Example:
		>var Animals = ['Cat', 'Dog', 'Coala'];
		>Animals.extend(['Lizard']);
		>//Animals is now: ['Cat', 'Dog', 'Coala', 'Lizard'];
	*/
	
	extend: function(newArray){
		for (var i = 0; i < newArray.length; i++) this.push(newArray[i]);
		return this;
	},
	
	/*	
	Property: associate
		Creates an associative array based on the array of keywords passed in.
		
	Arguments:
		keys - the array of keywords.
		
	Example:
		(sart code)
		var Animals = ['Cat', 'Dog', 'Coala', 'Lizard'];
		var Speech = ['Miao', 'Bau', 'Fruuu', 'Mute'];
		var Speeches = Animals.associate(speech);
		//Speeches['Miao'] is now Cat.
		//Speeches['Bau'] is now Dog.
		//...
		(end)
	*/
	
	associate: function(keys){
		var newArray = [];
		for (var i =0; i < this.length; i++) newArray[keys[i]] = this[i];
		return newArray;
	}

});

/* Section: Utility Functions  */

/*
Function: $A()
	Same as <Array.copy>, but as function. 
	Useful to apply Array prototypes to iterable objects, as a collection of DOM elements or the arguments object.
	
Example:
	>function myFunction(){
	>	$A(arguments).each(argument, function(){
	>		alert(argument);
	>	});
	>};
	>//the above will alert all the arguments passed to the function myFunction.
*/

function $A(array){
	return Array.prototype.copy.call(array);
};
/*
Script: String.js
	Contains String prototypes and Number prototypes.

Dependencies:
	<Moo.js>
	
Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: String
	A collection of The String Object prototype methods.
*/

String.extend({
	
	/*	
	Property: test
		Tests a string with a regular expression.
		
	Arguments:
		regex - the regular expression you want to match the string with
		params - optional, any parameters you want to pass to the regex
		
	Returns:
		an array with the instances of the value searched for or empty array.
		
	Example:
		>"I like cookies".test("cookie"); // returns ["I like cookies", "cookie"]
		>"I like cookies".test("COOKIE", "i") //ignore case
		>"I like cookies because cookies are good".test("COOKIE", "ig"); //ignore case, find all instances.
		>"I like cookies".test("cake"); //returns empty array
	*/
	
	test: function(regex, params){
		return this.match(new RegExp(regex, params));
	},
	
	/*	
	Property: toInt
		parses a string to an integer.
		
		Returns:
			either an int or "NaN" if the string is not a number.
		
		Example:
			>var value = "10px".toInt(); // value is 10
	*/
	toInt: function(){
		return parseInt(this);
	},
	
	/*	
	Property: camelCase
		Converts a hiphenated string to a camelcase string.
		
	Example:
		>"I-like-cookies".camelCase(); //"ILikeCookies"
		
	Returns:
		the camel cased string
	*/
	
	camelCase: function(){
		return this.replace(/-\D/gi, function(match){
			return match.charAt(match.length - 1).toUpperCase();
		});
	},
	
	/*	
	Property: capitalize
		Converts the first letter in each word of a string to Uppercase.
		
	Example:
		>"i like cookies".capitalize(); //"I Like Cookies"
		
	Returns:
		the capitalized string
	*/
	capitalize: function(){
		return this.toLowerCase().replace(/\b[a-z]/g, function(match){
			return match.toUpperCase();
		});
	},
	
	/*	
	Property: trim
		Trims the leading and trailing spaces off a string.
		
	Example:
		>"    i like cookies     ".trim() //"i like cookies"
		
	Returns:
		the trimmed string
	*/
	
	trim: function(){
		return this.replace(/^\s*|\s*$/g, '');
	},
	
	/*	
	Property: clean
		trims (<String.trim>) a string AND removes all the double spaces in a string.
		
	Returns:
		the cleaned string
		
	Example:
		>" i      like     cookies      \n\n".clean() //"i like cookies"
	*/

	clean: function(){
		return this.replace(/\s\s/g, ' ').trim();
	},

	/*	
	Property: rgbToHex
		Converts an RGB value to hexidecimal. The string must be in the format of "rgb(255, 255, 255)" or "rgba(255, 255, 255, 1)";
		
	Arguments:
		array - boolean value, defaults to false. Use true if you want the array ['FF', '33', '00'] as output instead of #FF3300
		
	Returns:
		hex string or array. returns transparent if the fourth value of rgba in input string is 0,
		
	Example:
		>"rgb(17,34,51)".rgbToHex(); //"#112233"
		>"rgba(17,34,51,0)".rgbToHex(); //"transparent"
		>"rgb(17,34,51)".rgbToHex(true); //[11,22,33]
	*/
	
	rgbToHex: function(array){
		var rgb = this.test('([\\d]{1,3})', 'g');
		if (rgb[3] == 0) return 'transparent';
		var hex = [];
		for (var i = 0; i < 3; i++){
			var bit = (rgb[i]-0).toString(16);
			hex.push(bit.length == 1 ? '0'+bit : bit);
		}
		var hexText = '#'+hex.join('');
		if (array) return hex;
		else return hexText;
	},
	
	/*	
	Property: hexToRgb
		Converts a hexidecimal color value to RGB. Input string must be the hex color value (with or without the hash). Also accepts triplets ('333');
		
	Arguments:
		array - boolean value, defaults to false. Use true if you want the array ['255', '255', '255'] as output instead of "rgb(255,255,255)";
		
	Returns:
		rgb string or array.
		
	Example:
		>"#112233".hexToRgb(); //"rgb(17,34,51)"
		>"#112233".hexToRgb(true); //[17,34,51]
	*/
	
	hexToRgb: function(array){
		var hex = this.test('^[#]{0,1}([\\w]{1,2})([\\w]{1,2})([\\w]{1,2})$');
		var rgb = [];
		for (var i = 1; i < hex.length; i++){
			if (hex[i].length == 1) hex[i] += hex[i];
			rgb.push(parseInt(hex[i], 16));
		}
		var rgbText = 'rgb('+rgb.join(',')+')';
		if (array) return rgb;
		else return rgbText;
	}

});

/*
Class: Number
	contains the internal method toInt.
*/

Number.extend({

	/*
	Property: toInt
		Returns this number; useful because toInt must work on both Strings and Numbers.
	*/

	toInt: function(){
		return this;
	}

});
/*
Script: Element.js
	Contains useful Element prototypes, to be used with the dollar function <$>.
	
Dependencies:
	<Moo.js>, <Function.js>, <Array.js>, <String.js>

Author:
	Valerio Proietti, <http://mad4milk.net>
	
License:
	MIT-style license.
	
Credits:
	- Some functions are inspired by those found in prototype.js <http://prototype.conio.net/> (c) 2005 Sam Stephenson sam [at] conio [dot] net, MIT-style license
*/

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

var Element = new Class({

	/*
	Property: initialize
		Creates a new element of the type passed in.
			
	Arguments:
		el - the tag name for the element you wish to create.
			
	Example:
		>var div = new Element('div');
	*/

	initialize: function(el){
		if ($type(el) == 'string') el = document.createElement(el);
		return $(el);
	},

	inject: function(el, where){
		el = $(el) || new Element(el);
		switch(where){
			case "before": $(el.parentNode).insertBefore(this, el); break;
			case "after": {
					if (!el.getNext()) $(el.parentNode).appendChild(this);
					else $(el.parentNode).insertBefore(this, el.getNext());
			} break;
			case "inside": el.appendChild(this); break;
		}
		return this;
	},
	
	/*
	Property: injectBefore
		Inserts the Element before the passed element.
			
	Parameteres:
		el - a string representing the element to be injected in (myElementId, or div), or an element reference.
		If you pass div or another tag, the element will be created.
			
	Example:
		>html: 
		><div id="myElement"></div>
		><div id="mySecondElement"></div>
		>js:
		>$('mySecondElement').injectBefore('myElement');
		>resulting html
		><div id="myElement"></div>
		><div id="mySecondElement"></div>

	*/
	
	injectBefore: function(el){
		return this.inject(el, 'before');
	},
	
	/*  
	Property: injectAfter
		Same as <Element.injectBefore>, but inserts the element after.
	*/
	
	injectAfter: function(el){
		return this.inject(el, 'after');
	},

	/*  
	Property: injectInside
		Same as <Element.injectBefore>, but inserts the element inside.
	*/
	
	injectInside: function(el){
		return this.inject(el, 'inside');
	},

	/*  
	Property: adopt
		Inserts the passed element inside the Element. Works as <Element.injectInside> but in reverse.
			
	Parameteres:
		el - a string representing the element to be injected in (myElementId, or div), or an element reference.
		If you pass div or another tag, the element will be created.
	*/
	
	adopt: function(el){
		this.appendChild($(el) || new Element(el));
		return this;
	},
	
	/*  
	Property: remove
		Removes the Element from the DOM.
			
	Example:
		>$('myElement').remove() //bye bye
	*/
	
	remove: function(){
		this.parentNode.removeChild(this);
	},
	
	/*  
	Property: clone
		Clones the Element and returns the cloned one.
		
	Returns: 
		the cloned element
		
	Example:
		>var clone = $('myElement').clone().injectAfter('myElement');
		>//clones the Element and append the clone after the Element.
	*/
	
	clone: function(contents){
		return $(this.cloneNode(contents || true));
	},

	/*  
	Property: replaceWith
		Replaces the Element with an element passed.
			
	Parameteres:
		el - a string representing the element to be injected in (myElementId, or div), or an element reference.
		If you pass div or another tag, the element will be created.
		
	Returns:
		the passed in element
			
	Example:
		>$('myOldElement').replaceWith($('myNewElement')); //$('myOldElement') is gone, and $('myNewElement') is in its place.
	*/
	
	replaceWith: function(el){
		var el = $(el) || new Element(el);
		this.parentNode.replaceChild(el, this);
		return el;
	},
	
	/*  
	Property: appendText
		Appends text node to a DOM element.

	Arguments:
		text - the text to append.
		
	Example:
		><div id="myElement">hey</div>
		>$('myElement').appendText(' howdy'); //myElement innerHTML is now "hey howdy"
  	*/

	appendText: function(text){
		if (this.getTag() == 'style' && window.ActiveXObject) this.styleSheet.cssText = text;
		else this.appendChild(document.createTextNode(text));
		return this;
	},
	
	/*
	Property: hasClass
		Tests the Element to see if it has the passed in className.
		
	Returns:
	 	true - the Element has the class
	 	false - it doesn't
	 
	Arguments:
		className - the class name to test.
	 
	Example:
		><div id="myElement" class="testClass"></div>
		>$('myElement').hasClass('testClass'); //returns true
	*/

	hasClass: function(className){
		return !!this.className.test("\\b"+className+"\\b");
	},

	/*	
	Property: addClass
		Adds the passed in class to the Element, if the element doesnt already have it.
		
	Arguments:
		className - the class name to add
		
	Example: 
		><div id="myElement" class="testClass"></div>
		>$('myElement').addClass('newClass'); //<div id="myElement" class="testClass newClass"></div>
	*/
	
	addClass: function(className){
		if (!this.hasClass(className)) this.className = (this.className+' '+className.trim()).clean();
		return this;
	},
	
	/*	
	Property: removeClass
		works like <Element.addClass>, but removes the class from the element.
	*/

	removeClass: function(className){
		if (this.hasClass(className)) this.className = this.className.replace(className.trim(), '').clean();
		return this;
	},

	/*	
	Property: toggleClass
		Adds or removes the passed in class name to the element, depending on if it's present or not.
		
	Arguments:
		className - the class to add or remove
		
	Example:
		><div id="myElement" class="myClass"></div>
		>$('myElement').toggleClass('myClass');
		><div id="myElement" class=""></div>
		>$('myElement').toggleClass('myClass');
		><div id="myElement" class="myClass"></div>
	*/
	
	toggleClass: function(className){
		if (this.hasClass(className)) return this.removeClass(className);
		else return this.addClass(className);
	},
	
	/*
	Property: setStyle	
		Sets a css property to the Element.
		
		Arguments:
			property - the property to set
			value - the value to which to set it
		
		Example:
			>$('myElement').setStyle('width', '300px'); //the width is now 300px
	*/
	
	setStyle: function(property, value){
		if (property == 'opacity') this.setOpacity(parseFloat(value));
		else this.style[property.camelCase()] = value;
		return this;
	},

	/*
	Property: setStyles
		Applies a collection of styles to the Element.
		
	Arguments:
		source - an object or string containing all the styles to apply
		
	Examples:
		>$('myElement').setStyles({
		>	border: '1px solid #000',
		>	width: '300px',
		>	height: '400px'
		>});

		OR
		
		>$('myElement').setStyle('border: 1px solid #000; width: 300px; height: 400px;');
	*/
	
	setStyles: function(source){
		if ($type(source) == 'object') {
			for (var property in source) this.setStyle(property, source[property]);
		} else if ($type(source) == 'string') {
			if (window.ActiveXObject) this.cssText = source;
			else this.setAttribute('style', source);
		}
		return this;
	},
	
	/*	
	Property: setOpacity
		Sets the opacity of the Element, and sets also visibility == "hidden" if opacity == 0, and visibility = "visible" if opacity == 1.
		
	Arguments:
		opacity - Accepts numbers from 0 to 1.
		
	Example:
		>$('myElement').setOpacity(0.5) //make it 50% transparent
	*/
	
	setOpacity: function(opacity){
		if (opacity == 0){
			if(this.style.visibility != "hidden") this.style.visibility = "hidden";
		} else {
			if(this.style.visibility != "visible") this.style.visibility = "visible";
		}
		if (window.ActiveXObject) this.style.filter = "alpha(opacity=" + opacity*100 + ")";
		this.style.opacity = opacity;
		return this;
	},
	
	/*	
	Property: getStyle
		Returns the style of the Element given the property passed in.
		
	Arguments:
		property - the css style property you want to retrieve
		
	Example:
		>$('myElement').getStyle('width'); //returns "400px"
		>//but you can also use
		>$('myElement').getStyle('width').toInt(); //returns "400"
		
	Returns:
		the style as a string
	*/
	
	getStyle: function(property){
		var proPerty = property.camelCase();
		var style = this.style[proPerty] || false;
		if (!style) {
			if (document.defaultView) style = document.defaultView.getComputedStyle(this,null).getPropertyValue(property);
			else if (this.currentStyle) style = this.currentStyle[proPerty];
		}
		if (style && ['color', 'backgroundColor', 'borderColor'].test(proPerty) && style.test('rgb')) style = style.rgbToHex();
		return style;
	},

	/*	
	Property: addEvent
		Attaches an event listener to a DOM element.
		
	Arguments:
		action - the event to monitor ('click', 'load', etc)
		fn - the function to execute
		
	Example:
		>$('myElement').addEvent('click', function(){alert('clicked!')});
	*/

	addEvent: function(action, fn){
		this[action+fn] = fn.bind(this);
		if (this.addEventListener) this.addEventListener(action, fn, false);
		else this.attachEvent('on'+action, this[action+fn]);
		var el = this;
		if (this != window) Unload.functions.push(function(){
			el.removeEvent(action, fn);
			el[action+fn] = null;
		});
		return this;
	},
	
	/*	
	Property: removeEvent
		Works as Element.addEvent, but instead removes the previously added event listener.
	*/
	
	removeEvent: function(action, fn){
		if (this.removeEventListener) this.removeEventListener(action, fn, false);
		else this.detachEvent('on'+action, this[action+fn]);
		return this;
	},

	getBrother: function(what){
		var el = this[what+'Sibling'];
		while ($type(el) == 'textnode') el = el[what+'Sibling'];
		return $(el);
	},
	
	/*
	Property: getPrevious
		Returns the previousSibling of the Element, excluding text nodes.
		
	Example:
		>$('myElement').getPrevious(); //get the previous DOM element from myElement
		
	Returns:
		the sibling element or undefined if none found.
	*/
	
	getPrevious: function(){
		return this.getBrother('previous');
	},
	
	/*
	Property: getNext
		Works as Element.getPrevious, but tries to find the nextSibling.
	*/
	
	getNext: function(){
		return this.getBrother('next');
	},
	
	/*
	Property: getNext
		Works as <Element.getPrevious>, but tries to find the firstChild.
	*/

	getFirst: function(){
		var el = this.firstChild;
		while ($type(el) == 'textnode') el = el.nextSibling;
		return $(el);
	},

	/*
	Property: getLast
		Works as <Element.getPrevious>, but tries to find the lastChild.
	*/

	getLast: function(){
		var el = this.lastChild;
		while ($type(el) == 'textnode')
		el = el.previousSibling;
		return $(el);
	},

	/*	
	Property: setProperty
		Sets an attribute for the Element.
		
	Arguments:
		property - the property to assign the value passed in
		value - the value to assign to the property passed in
		
	Example:
		>$('myImage').setProperty('src', 'whatever.gif'); //myImage now points to whatever.gif for its source
	*/

	setProperty: function(property, value){
		var el = false;
		switch(property){
			case 'class': this.className = value; break;
			case 'style': this.setStyles(value); break;
			case 'name': if (window.ActiveXObject && this.getTag() == 'input'){
				el = $(document.createElement('<input name="'+value+'" />'));
				$A(this.attributes).each(function(attribute){
					if (attribute.name != 'name') el.setProperty(attribute.name, attribute.value);
					
				});
				if (this.parentNode) this.replaceWith(el);
			};
			default: this.setAttribute(property, value);
		}
		return el || this;
	},
	
	/*	
	Property: setProperties
		Sets numerous attributes for the Element.
		
	Arguments:
		source - an object with key/value pairs.
		
	Example:
		>$('myElement').setProperties({
		>	src: 'whatever.gif',
		>	alt: 'whatever dude'
		>});
		><img src="whatever.gif" alt="whatever dude">
	*/
	
	setProperties: function(source){
		for (var property in source) this.setProperty(property, source[property]);
		return this;
	},
	
	/*
	Property: setHTML
		Sets the innerHTML of the Element.
		
	Arguments:
		html - the new innerHTML for the element.
		
	Example:
		>$('myElement').setHTML(newHTML) //the innerHTML of myElement is now = newHTML
	*/
	
	setHTML: function(html){
		this.innerHTML = html;
		return this;
	},
	
	/*	
	Property: getProperty
		Gets the an attribute of the Element.
		
	Arguments:
		property - the attribute to retrieve
		
	Example:
		>$('myImage').getProperty('src') // returns whatever.gif
		
	Returns:
		the value, or an empty string
	*/
	
	getProperty: function(property){
		return this.getAttribute(property);
	},
	
	/*
	Property: getTag
		Returns the tagName of the element in lower case.
		
	Example:
		>$('myImage').getTag() // returns 'img'
		
	Returns:
		The tag name in lower case
	*/
	
	getTag: function(){
		return this.tagName.toLowerCase();
	},
	
	getOffset: function(what){
		what = what.capitalize();
		var el = this;
		var offset = 0;
		do {
			offset += el['offset'+what] || 0;
			el = el.offsetParent;
		} while (el);
		return offset;
	},

	/*	
	Property: getTop
		Returns the distance from the top of the window to the Element.
	*/
	
	getTop: function(){
		return this.getOffset('top');
	},
	
	/*	
	Property: getLeft
		Returns the distance from the left of the window to the Element.
	*/
	
	getLeft: function(){
		return this.getOffset('left');
	},
	
	/*	
	Property: getValue
		Returns the value of the Element, if its tag is textarea, select or input.
	*/
	
	getValue: function(){
		var value = false;
		switch(this.getTag()){
			case 'select': value = this.getElementsByTagName('option')[this.selectedIndex].value; break;
			case 'input': if ( (this.checked && ['checkbox', 'radio'].test(this.type)) || (['hidden', 'text', 'password'].test(this.type)) ) 
				value = this.value; break;
			case 'textarea': value = this.value;
		}
		return value;
	}

});

new Object.Native(Element);

Element.extend({
	hasClassName: Element.prototype.hasClass,
	addClassName: Element.prototype.addClass,
	removeClassName: Element.prototype.removeClass,
	toggleClassName: Element.prototype.toggleClass
});

/* Section: Utility Functions  */

/*
Function: $Element
	Applies a method with the passed in args to the passed in element. Useful if you dont want to extend the element
		
	Arguments:
		el - the element
		method - a string representing the Element Class method to execute on that element
		args - an array representing the arguments to pass to that method
		
	Example:
		>$Element(el, 'hasClass', className) //true or false
*/

function $Element(el, method, args){
	if ($type(args) != 'array') args = [args];
	return Element.prototype[method].apply(el, args);
};

/*
Function: $()
	returns the element passed in with all the Element prototypes applied.
	
Arguments:
	el - a reference to an actual element or a string representing the id of an element
		
Example:
	>$('myElement') // gets a DOM element by id with all the Element prototypes applied.
	>var div = document.getElementById('myElement');
	>$(div) //returns an Element also with all the mootools extentions applied.
		
	You'll use this when you aren't sure if a variable is an actual element or an id, as
	well as just shorthand for document.getElementById().
		
Returns:
	a DOM element or false (if no id was found)
		
Note:
	you need to call $ on an element only once to get all the prototypes.
	But its no harm to call it multiple times, as it will detect if it has been already extended.
*/

function $(el){
	if ($type(el) == 'string') el = document.getElementById(el);
	if ($type(el) == 'element'){
		if (!el.extend){
			Unload.elements.push(el);
			el.extend = Object.extend;
			el.extend(Element.prototype);
		}
		return el;
	} else return false;
};

window.addEvent = document.addEvent = Element.prototype.addEvent;
window.removeEvent = document.removeEvent = Element.prototype.removeEvent;

var Unload = {

	elements: [], functions: [], vars: [],

	unload: function(){
		Unload.functions.each(function(fn){
			fn();
		});
		
		window.removeEvent('unload', window.removeFunction);
		
		Unload.elements.each(function(el){
			for(var p in Element.prototype){
				window[p] = null;
				document[p] = null;
				el[p] = null;
			}
			el.extend = null;
		});
	}
	
};

window.removeFunction = Unload.unload;
window.addEvent('unload', window.removeFunction);
/*
Script: Fx.js
	Applies visual transitions to any element. Contains Fx.Base, Fx.Style and Fx.Styles

Dependencies:
	<Moo.js>, <Function.js>, <Array.js>, <String.js>, <Element.js>

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

var Fx = fx = {};

/*
Class: Fx.Base
	Base class for the Mootools fx library.
	
Options:
	onStart - the function to execute as the effect begins; nothing (<Class.empty>) by default.
	onComplete - the function to execute after the effect has processed; nothing (<Class.empty>) by default.
	transition - the equation to use for the effect see <Fx.Transitions>; default is <Fx.Transitions.sineInOut>
	duration - the duration of the effect in ms; 500 is the default.
	unit - the unit is 'px' by default (other values include things like 'em' for fonts or '%').
	wait - boolean: to wait or not to wait for a current transition to end before running another of the same instance. defaults to true.
	fps - the frames per second for the transition; default is 30
*/

Fx.Base = new Class({

	setOptions: function(options){
		this.options = Object.extend({
			onStart: Class.empty,
			onComplete: Class.empty,
			transition: Fx.Transitions.sineInOut,
			duration: 500,
			unit: 'px',
			wait: true,
			fps: 50
		}, options || {});
	},

	step: function(){
		var time = new Date().getTime();
		if (time < this.time + this.options.duration){
			this.cTime = time - this.time;
			this.setNow();
		} else {
			this.options.onComplete.pass(this.element, this).delay(10);
			this.clearTimer();
			this.callChain();
			this.now = this.to;
		}
		this.increase();
	},
	
	/*	
	Property: set
		Immediately sets the value with no transition.
	
	Arguments:
		to - the point to jump to
	
	Example:
		>var myFx = new Fx.Style('myElement', 'opacity').set(0); //will make it immediately transparent
	*/
	
	set: function(to){
		this.now = to;
		this.increase();
		return this;
	},
	
	setNow: function(){
		this.now = this.compute(this.from, this.to);
	},

	compute: function(from, to){
		return this.options.transition(this.cTime, from, (to - from), this.options.duration);
	},
	
	/*
	Property: custom
		Executes an effect from one position to the other.
	
	Arguments:
		from - integer:  staring value
		to - integer: the ending value
	
	Examples:
		>var myFx = new Fx.Style('myElement', 'opacity').custom(0,1); //display a transition from transparent to opaque.
	*/
	
	custom: function(from, to){
		if (!this.options.wait) this.clearTimer();
		if (this.timer) return;
		this.options.onStart.pass(this.element, this).delay(10);
		this.from = from;
		this.to = to;
		this.time = new Date().getTime();
		this.timer = this.step.periodical(Math.round(1000/this.options.fps), this);
		return this;
	},
	
	/*
	Property: clearTimer
		Stops processing the transition.
	*/
	clearTimer: function(){
		this.timer = $clear(this.timer);
		return this;
	},
	
	setStyle: function(element, property, value){
		element.setStyle(property, value + this.options.unit);
	}

});

Fx.Base.implement(new Chain);

/*	
Class: Fx.Style
	The Style effect; Extends <Fx.Base>, inherits all its properties. Used to transition any css property from one value to another.

Arguments:
	el - the $(element) to apply the style transition to
	property - the property to transition
	options - the Fx.Base options (see: <Fx.Base>)
	
Example:
	>var marginChange = new fx.Style('myElement', 'margin-top', {duration:500});
	>marginChange.custom(10, 100);
*/

Fx.Style = Fx.Base.extend({

	initialize: function(el, property, options){
		this.element = $(el);
		this.setOptions(options);
		this.property = property.camelCase();
	},
	
	/*	
	Property: hide
		Same as <Fx.Base.set>(0)
	*/
	
	hide: function(){
		return this.set(0);
	},

	/*	
	Property: goTo
		will apply <Fx.Base.custom>, setting the starting point to the current position.
		
	Arguments:
		val - the ending value
	*/

	goTo: function(val){
		return this.custom(this.now || 0, val);
	},

	increase: function(){
		this.setStyle(this.element, this.property, this.now);
	}

});

/*
Class: Fx.Styles
	Allows you to animate multiple css properties at once; Extends <Fx.Base>, inherits all its properties.
	
Arguments:
	el - the $(element) to apply the styles transition to
	options - the fx options (see: <Fx.Base>)

Example:
	>var myEffects = new fx.Styles('myElement', {duration: 1000, transition: fx.linear});
	>myEffects.custom({
	>	'height': [10, 100],
	>	'width': [900, 300]
	>});
*/

Fx.Styles = Fx.Base.extend({

	initialize: function(el, options){
		this.element = $(el);
		this.setOptions(options);
		this.now = {};
	},

	setNow: function(){
		for (var p in this.from) this.now[p] = this.compute(this.from[p], this.to[p]);
	},
	
	/*
	Property:	custom
		The function you'll actually use to execute a transition.
	
	Arguments:
		an object
		
	Example:
		see <Fx.Styles>
	*/

	custom: function(objFromTo){
		if (this.timer && this.options.wait) return;
		var from = {};
		var to = {};
		for (var p in objFromTo){
			from[p] = objFromTo[p][0];
			to[p] = objFromTo[p][1];
		}
		return this.parent(from, to);
	},

	increase: function(){
		for (var p in this.now) this.setStyle(this.element, p, this.now[p]);
	}

});

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.extend({

	/*
	Property: effect
		Applies an <Fx.Style> to the Element; This a shortcut for <Fx.Style>.

	Example:
		>var myEffect = $('myElement').effect('height', {duration: 1000, transition: Fx.Transitions.linear});
		>myEffect.custom(10, 100);
	*/
	
	effect: function(property, options){
		return new Fx.Style(this, property, options);
	},
	
	/*	
	Property: effects
		Applies an <Fx.Styles> to the Element; This a shortcut for <Fx.Styles>.
		
	Example:
		>var myEffects = $(myElement).effects({duration: 1000, transition: Fx.Transitions.sineInOut});
 		>myEffects.custom({'height': [10, 100], 'width': [900, 300]});
	*/

	effects: function(options){
		return new Fx.Styles(this, options);
	}

});

/*
Class: Fx.Transitions
	A collection of transition equations for use with the <Fx> Class.
		
See Also:
	<Fxtransitions.js> for a whole bunch of transitions.
		
Credits:
	Easing Equations, (c) 2003 Robert Penner (http://www.robertpenner.com/easing/), Open Source BSD License.
*/

Fx.Transitions = {
	
	/* Property: linear */
	linear: function(t, b, c, d){
		return c*t/d + b;
	},
	
	/* Property: sineInOut */
	sineInOut: function(t, b, c, d){
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	}

};
/*
Script: Window.js
	Window methods, as those to get the size or a better onload.
		
Dependencies:
	<Moo.js>, <Function.js>, <String.js>

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: Window
	Cross browser methods to get the window size, onDomReady method.
*/

var Window = {
	
	/*	
	Property: disableImageCache
		Disables background image chache for internex explorer, to prevent flickering. 
		To be called if you have effects with background images, and they flicker.
		
	Example:
		Window.disableImageCache();
	*/
	
	disableImageCache: function(){
		if (window.ActiveXObject) document.execCommand("BackgroundImageCache", false, true);
	},

	extend: Object.extend,
	
	/*	
	Property: getWidth
		Returns an integer representing the width of the browser.
	*/

	getWidth: function(){
		return window.innerWidth || document.documentElement.clientWidth || 0;
	},
	
	/*
	Property: getHeight
		Returns an integer representing the height of the browser.
	*/

	getHeight: function(){
		return window.innerHeight || document.documentElement.clientHeight || 0;
	},

	/*
	Property: getScrollHeight
		Returns an integer representing the scrollHeight of the window.

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollHeight>
	*/

	getScrollHeight: function(){
		return document.documentElement.scrollHeight;
	},

	/*
	Property: getScrollWidth
		Returns an integer representing the scrollWidth of the window.
		
	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollWidth>
	*/

	getScrollWidth: function(){
		return document.documentElement.scrollWidth;
	},

	/*	
	Property: getScrollTop
		Returns an integer representing the scrollTop of the window (the number of pixels the window has scrolled from the top).
		
	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollTop>
	*/

	getScrollTop: function(){
		return document.documentElement.scrollTop || window.pageYOffset || 0;
	},

	/*
	Property: getScrollLeft
		Returns an integer representing the scrollLeft of the window (the number of pixels the window has scrolled from the left).
		
	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollLeft>
	*/
	
	getScrollLeft: function(){
		return document.documentElement.scrollLeft || window.pageXOffset || 0;
	},
	
	/*
	Property: onDomReady
		Executes the passed in function when the DOM is ready (when the document tree has loaded, not waiting for images).
		
	Credits:
		(c) Dean Edwards/Matthias Miller/John Resig, remastered for mootools. Later touched up by Christophe Beyls <http://digitalia.be>.
		
	Arguments:
		init - the function to execute when the DOM is ready
		
	Example:
		> Window.onDomReady(function(){alert('the dom is ready');});
	*/
	
	onDomReady: function(init){
		var state = document.readyState;
		if (state && document.childNodes && !document.all && !navigator.taintEnabled){ //khtml
			if (state.test(/loaded|complete/)) return init();
			else return Window.onDomReady.pass(init).delay(100);
		} else if (state && window.ActiveXObject){ //ie
			var script = $('_ie_ready_');
			if (!script) document.write("<script id='_ie_ready_' defer='true' src='://'></script>");
			$('_ie_ready_').addEvent('readystatechange', function(){
				if (this.readyState == 'complete') init();
			});
			return;
		} else { //others
			var myInit = function() {
				if (arguments.callee.done) return;
				arguments.callee.done = true;
				init();
			};
			window.addEvent("load", myInit);
			document.addEvent("DOMContentLoaded", myInit);
		}
	}

};
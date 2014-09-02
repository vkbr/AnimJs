#AnimJs

######A light weight library for animation
This is a very basic animation library which uses javascript, not CSS, to animate element. It uses ```requestAnimationFrame``` for render the elements and hence bringing GPU into picture for better rendering.

######Support
IE9+ (tested with transform: rotate, translate)
chrome (tested in newer versions(36) but should also work on older browsers)
Firefox (rested in 31)
Safari mobile (iOs 7 not sure about the version)
Android browser(The default one, Samsung galaxy S3 running android 4.1.2)

####Usage
```javascript
Anim({
	el: HTMLElement,
	duration: 500, // [optional]default: 400
	from: {
		left: '0px'
	},
	to: {
		left: '100px'
	},
	onComplete: function(anim){ // anim contains Anim object
		var th = this; // this points to the el (HTMLElement)
		// do something
	}
});
```

As already said, this is very basic library. Nothing fancy. Enjoy....

####Future plans
- Adding easing

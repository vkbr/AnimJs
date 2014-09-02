(function(win){
	win.requestAnimationFrame = win.requestAnimationFrame || function(cb){
		return setTimeout(cb, 1000/60);
	};
	win.cancelAnimationFrame  = win.requestAnimationFrame || function(id){
		clearTimeout(id);
	};
})(window);
(function(win){
	var CONST = {
		status: {
			play: 1,
			pause: 2,
			stop: 3
		}
	};

	var a = function(opts){
		this.init(opts);
	};
	a.prototype.crossStyle = ["transform"];
	a.prototype.vendors = ["Webkit","moz","ms","o"];
	a.prototype.init = function(opts){
		var i;

		this.el = opts.el;
		this.prog = 0;
		this.status = CONST.status.stop;
		this.duration = opts.duration || 400;
		this.to = opts.to;
		this.from = opts.from;

		for(i in opts.to) {
			if(!opts.from[i]) this.from[i] = this.to[i].toString().replace(/\d+/g, '0');
		}
		this.handleCompatibility();

		if(!this.from || !this.to) {
			return;
		}
	};
	a.prototype.handleCompatibility = function(){
		var th = this,
			i, j;
		for(i in th.to) {
			if(th.crossStyle.indexOf(i.toString().toLowerCase())+1) {
				for(j=0; j < th.vendors.length; j++) {
					th.from[th.vendors[j] + i] = th.from[i];
					th.to[th.vendors[j] + i] = th.to[i];
				}
				if(i != i.toString().toLowerCase()) {
					j = th.from[i];
					delete th.from[i];
					th.from[i.toString().toLowerCase()] = j;
					j = th.to[i];
					delete th.to[i];
					th.to[i.toString().toLowerCase()] = j;
				}
			}
		}
	};
	a.prototype.stop = function(){
		this.status = CONST.status.stop;
	};
	a.prototype.pause = function(){
		this.status = CONST.status.pause;
	};
	a.prototype.start = function(){
		var th = this;
		if(th.status == CONST.status.stop) {
			progress = 0;
			th.startTime = Date.now();
		} else if(th.status == CONST.status.pause) {
			th.startTime += (Date.now() - th.pausedTime);
		} else {
			th.startTime = Date.now();
		}
		th.status = CONST.status.play;

		th.frame = win.requestAnimationFrame(function(){
			th.cb(th);
		}, th.el);
	};
	a.prototype.cb = function(th){
		var i;
		if(this.status != CONST.status.play) {
			this.pasedAt = this.pausedAt || Date.now();
			return;
		}

		for (i in th.from) {
			th.el.style[i] = th.getValue(th.from[i], th.to[i]);
		};
		th.frame = win.requestAnimationFrame(function(){
			th.cb(th);
		}, this.el);
	};
	a.prototype.getValue = function(from, to){
		var th = this,
			valsFrom, valsTo, i, tmpl, rndStr, cur;
		rndStr = Math.random().toString(36).substr(2,4);
		while(to.indexOf(rndStr)+1)	{
			rndStr = Math.random().toString(36).substr(2,4);
		}
		valsFrom = from.toString().match(/(\d+)/g);
		valsTo = to.toString().match(/(\d+)/g);
		tmpl = to;

		if(valsFrom.length != valsTo.length) {
			return valsTo;
		}

		for(i=0; i<valsTo.length; i++) {
			cur = parseFloat(valsFrom[i] || 0) + parseFloat((valsTo[i] - valsFrom[i])*th.getProgress());
			tmpl = tmpl.replace(valsTo[i].toString(), cur.toString());
		}

		return tmpl;
	};
	a.prototype.getProgress = function(){
		var now = Date.now(),
			started = this.startTime,
			duration =  this.duration,
			progress;
		progress = ((now-started)/duration);
		
		progress = Math.min(progress, 1)

		if(progress === 1) {
			if(typeof th.onComplete == 'function') {
				th.onComplete.call(this.el, this);
			}
			this.status = CONST.status.stop;
		}

		return progress;
	};

	var Anim = function(opts){
		var anim = new a(opts);
		anim.start();

		return anim;
	};

	win.Anim = Anim;
})(window);
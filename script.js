var fixtures = [];
var select = [];
var properties = ['red', 'green', 'blue'];

var scenes = [];
var cues = [];
var values = [];
var play = [];
var priority = 0;

var fxinterval = 0;
var fxtime = 0;
var fxspeed = 0;
var tofx = [];
var fromfx = [];

class Fixture {
	constructor(id) {
		this.addr = id;
		this.dmx = {
			red: 0,
			green: 0,
			blue: 0
		};
		this.hsl = [0, 0, 0];
	}
}

$(document).ready(function () {
	$('.fixture').each(function () {
		$(this).attr('data-addr', fixtures.length);
		fixtures.push(new Fixture(fixtures.length));
	});
	tofx = copy(fixtures);

	$('#scene .slider').each(function () {
		play.push(false);
		cues.push(0);
		scenes.push([[]]);
	});

	/* --------Listeners-------- */
	$('.fixture').on('click', function () {
		let self = $(this);
		let id = self.data('addr');
		select = [];
		$('.fixture').each(function () {
			if ($(this).prop('checked')) {
				select.push($(this).data('addr'));
			}
		});
		for (let i in fixtures[id].hsl) {
			$(`#attr .slider:eq(${i})`).val(fixtures[id].hsl[i] * 100);
		}
	});

	$('.fixture').on('dblclick', function () {
		$('.fixture').prop('checked', false);
		select = [];
	});

	$('#attr .slider').on('input', function () {
		for (let i in tofx) {
			if (select.includes(tofx[i].addr)) {
				let hsl = [];
				for (let k in properties) {
					tofx[i].dmx[properties[k]] = parseInt($(`#attr .slider:eq(${k})`).val()) / 100;
					hsl.push(parseInt($(`#attr .slider:eq(${k})`).val()) / 100);
				}
				tofx[i].hsl = copy(hsl);
				let rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
				Object.keys(rgb).forEach(el => rgb[el] /= 255);
				tofx[i].dmx = copy(rgb);
			}
		}
		setFX(0.2);
	});

	$('#cue-up .button').on('click', function () {
		cues[$(this).index()]++;
		updateButtons();
		updateScenes();
	});

	$('#cue-down .button').on('click', function () {
		if (cues[$(this).index()] > 0) {
			cues[$(this).index()]--;
			updateButtons();
			updateScenes();
		}
	});

	$('#scene-save .button').on('click', function () {
		scenes[$(this).index()][cues[$(this).index()]] = copy(fixtures.filter((el, i) => select.includes(i)));
		$(this).addClass('saved');
		updateButtons();
		setTimeout(function () {
			$('.saved').removeClass('saved');
		}, 300);
	});

	$('#scene .slider').on('input', function () {
		$('#scene .slider').each(function (i) {
			values[i] = parseInt($(this).val());
			if ($(this).val() > 2 && !play[i]) { // Rising Edge
				$(`#scene-save .button:eq(${i})`).addClass('on');
				$(`.priority`).removeClass('priority');
				play[i] = 'up';
				priority = i;
				$(`#scene-save .button:eq(${i})`).addClass('priority');
			} else if ($(this).val() < 2 && play[i]) { // Falling Edge
				play[i] = 'down';
				if ($(`#scene-save .button:eq(${i})`).hasClass('priority') && play.includes(true)) {
					$(`#scene-save .button:eq(${i})`).removeClass('priority');
					priority = play.lastIndexOf(true);
					$(`#scene-save .button:eq(${play.lastIndexOf(true)})`).addClass('priority');
				} else {
					$(`#scene-save .button:eq(${i})`).removeClass('priority');
				}
				$(`#scene-save .button:eq(${i})`).removeClass('on');
			}
		});
		updateScenes();
	});
});

function updateFixtures() {
	for (let i in fixtures) {
		$(`.fixture[data-addr=${i}]`).css('background-color', `rgb(${fixtures[i].dmx.red * 255}, ${fixtures[i].dmx.green * 255}, ${fixtures[i].dmx.blue * 255})`);
	}
}

function updateScenes() {
	let fade = false;
	for (let i in scenes) {
		if (play[i] && i !== priority) {
			for (let k in scenes[i][cues[i]]) {
				let fixture = tofx.find(el => el.addr === scenes[i][cues[i]][k].addr);
				for (let j in properties) {
					fixture.dmx[properties[j]] = scenes[i][cues[i]][k].dmx[properties[j]] * (values[i] / 100);
				}
			}
		}
	}
	for (let i in play) {
		if (play[i] === 'down') {
			fade = true;
			play[i] = false;
		} else if (play[i] === 'up') {
			fade = true;
			play[i] = true;
		}
	}
	for (let k in scenes[priority][cues[priority]]) {
		let fixture = tofx.find(el => el.addr === scenes[priority][cues[priority]][k].addr);
		for (let j in properties) {
			fixture.dmx[properties[j]] = scenes[priority][cues[priority]][k].dmx[properties[j]] * (values[priority] / 100);
		}
	}
	if (fade) {
		setFX(0.2);
	} else {
		setFX(0.2);
	}
}

function setFX(time) {
	fromfx = copy(fixtures);
	fxtime = time * 100;
	fxspeed = fxtime;
	clearInterval(fxinterval);
	fxinterval = setInterval(function () {
		if (fxtime > 0) {
			for (let i in fixtures) {
				for (let k in properties) {
					fixtures[i].dmx[properties[k]] = fromfx[i].dmx[properties[k]] + (tofx[i].dmx[properties[k]] - fromfx[i].dmx[properties[k]]) * (fxspeed - fxtime) / fxspeed;
				}
			}
			fxtime -= 1;
		} else {
			clearInterval(fxinterval);
			fixtures = copy(tofx);
		}
		updateFixtures();
	}, 10);
}

function updateButtons() {
	$('#cue-up .has, #cue-down .has').removeClass('has');
	$('#scene-save .has').removeClass('has');
	for(let i in scenes) {
		if (scenes[i][cues[i] + 1] && scenes[i][cues[i] + 1].length > 0) {
			$(`#cue-up .button:eq(${i})`).addClass('has');
		}
		if (cues[i] > 0 && scenes[i][cues[i] - 1] && scenes[i][cues[i] - 1].length > 0) {
			$(`#cue-down .button:eq(${i})`).addClass('has');
		}
		if (scenes[i][cues[i]] && scenes[i][cues[i]].length > 0) {
			$(`#scene-save .button:eq(${i})`).addClass('has');
		}
		$(`#scene-cue .label:eq(${i})`).text(`Cue: ${cues[i] + 1}/${(cues[i] + 1) > scenes[i].length ? cues[i] + 1 : scenes[i].length}`);
	}
}

function copy(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function hslToRgb(h, s, l) {
	let r, g, b;
	if (s == 0) {
		r = g = b = l; // achromatic
	} else {
		let hue2rgb = function hue2rgb(p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		}
		let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		let p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}
	return {
		red: Math.round(r * 255),
		green: Math.round(g * 255),
		blue: Math.round(b * 255)
	};
}
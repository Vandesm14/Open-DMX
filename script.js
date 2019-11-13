var fixtures = [];
var properties = ['red', 'green', 'blue'];
var select = [];

var scenes = [];
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
		// tofx = copy(fixtures);
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

	$('#scene-save .button').on('click', function () {
		scenes[$(this).index()] = copy(fixtures.filter((el, i) => select.includes(i)));
		$(this).addClass('saved');
		$('.cue').removeClass('cue');
		for (let i in scenes) {
			if (scenes[i].length > 0) {
				$(`#scene-save .button:eq(${i})`).addClass('cue');
			}
		}
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
		// $(`.fixture[data-addr=${i}]`).css('background-color', `hsl(${fixtures[i].dmx.red * 255}, ${fixtures[i].dmx.green * 100}%, ${fixtures[i].dmx.blue * 100}%)`);
	}
}

function updateScenes() {
	let fade = false;
	// tofx = copy(fixtures);
	// tofx = fixtures;
	for (let i in scenes) {
		if (play[i] && i !== priority) {
			for (let k in scenes[i]) {
				let fixture = tofx.find(el => el.addr === scenes[i][k].addr);
				for (let j in properties) {
					fixture.dmx[properties[j]] = scenes[i][k].dmx[properties[j]] * (values[i] / 100);
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
	for (let k in scenes[priority]) {
		let fixture = tofx.find(el => el.addr === scenes[priority][k].addr);
		for (let j in properties) {
			fixture.dmx[properties[j]] = scenes[priority][k].dmx[properties[j]] * (values[priority] / 100);
		}
	}
	if (fade) {
		// setFX(2);
		setFX(0.2);
	} else {
		console.log('nofade');
		// updateFixtures();
		// setFX(0.5);
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
					// fixtures[i].dmx[properties[k]] = fromfx[i].dmx[properties[k]] + (tofx[i].dmx[properties[k]] - fromfx[i].dmx[properties[k]]) * (fxspeed - fxtime) / fxspeed;
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

function copy(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function hslToRgb(h, s, l) {
  var r, g, b;
  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
		var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
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
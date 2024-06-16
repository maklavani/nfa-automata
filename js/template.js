$(window).load(function (event) {
	resized()

	$(window).resize(function () {
		resized()
	})

	function resized() {
		wid = parseInt($(window).width())
		hei = parseInt($(window).height() - 87)
		$('#body').attr('width', wid)
		$('#body').attr('height', hei)
		$('#body').attr('viewBox', '0 0 ' + wid + ' ' + hei)
		$('#body').attr('enable-background', '0 0 ' + wid + ' ' + hei)
	}
})

$(document).ready(function (event) {
	array_of_state = []
	array_of_lines = []
	array_of_stacks = []
	first_state = false

	addstate = false
	removestate = false
	addline = false
	removeline = false
	addowner = false
	addstart = false
	addend = false

	mousex = false
	mousey = false

	dragging = false

	numberstate = 0
	selectedstate = false
	selectedstate_x = 0
	selectedstate_y = 0
	selectedstate_number = 0
	selectedstate_number_b = 0
	numberline = 0

	cx_old = 0
	cy_old = 0

	selectowner = 0

	createlinenum = 0

	$('.icon-mouse').click(function () {
		resetOption()
		$(this).addClass('active')
	})

	$('.icon-add-state').click(function () {
		resetOption()
		$(this).addClass('active')
		$('#wrapper').addClass('add')
		addstate = true
	})

	$('.icon-add-line').click(function () {
		resetOption()
		$(this).addClass('active')
		$('#wrapper').addClass('add')
		addline = true
	})

	$('.icon-remove-state').click(function () {
		resetOption()
		$(this).addClass('active')
		$('#wrapper').addClass('remove')
		removestate = true
		state_dashed()
	})

	$('.icon-remove-line').click(function () {
		resetOption()
		$(this).addClass('active')
		$('#wrapper').addClass('remove')
		removeline = true
		state_line()
	})

	$('.icon-owner').click(function () {
		resetOption()
		$(this).addClass('active')
		$('#wrapper').addClass('add')
		addowner = true
		state_dashed()
	})

	$('.start').click(function () {
		resetOption()
		$(this).addClass('active')
		$('#wrapper').addClass('add')
		addstart = true
		state_dashed()
	})

	$('.end').click(function () {
		resetOption()
		$(this).addClass('active')
		$('#wrapper').addClass('add')
		addend = true
		state_dashed()
	})

	$('.icon-reset').click(function () {
		resetOption()
		$('#body').empty()
		$('.icon-mouse').addClass('active')
		numberstate = 0
		selectedstate = false
		selectedstate_x = 0
		selectedstate_y = 0
		selectedstate_number = 0
		selectedstate_number_b = 0
		numberline = 0
		cx_old = 0
		cy_old = 0
	})

	$('#window-in-button').click(function () {
		if (addline) {
			$('#window').addClass('hidden')
			numberline++

			str = '~'
			if ($('#window-in-input').val() != '' && !$('#window-in-input').val().match(/\d/)) str = $('#window-in-input').val()

			fstr = '@' + selectedstate_number + '@.' + str + '.@' + selectedstate_number_b + '@'

			exist = false
			exist_elm = false
			$('.item-line').each(function () {
				if (
					($(this).attr('x1') == $('.addlineline').attr('x1') &&
						$(this).attr('x2') == $('.addlineline').attr('x2') &&
						$(this).attr('y1') == $('.addlineline').attr('y1') &&
						$(this).attr('y2') == $('.addlineline').attr('y2')) ||
					($(this).attr('x1') == $('.addlineline').attr('x2') &&
						$(this).attr('x2') == $('.addlineline').attr('x1') &&
						$(this).attr('y1') == $('.addlineline').attr('y2') &&
						$(this).attr('y2') == $('.addlineline').attr('y1'))
				) {
					exist = true
					exist_elm = $(this)
					createlinenum = $(this).attr('line')
				}
			})

			accept = false
			if (exist) {
				lstr = exist_elm.attr('states')
				if (lstr.indexOf(fstr) < 0) {
					exist_elm.attr('states', lstr + ',' + fstr)
					add_polygon(selectedstate_number, selectedstate_number_b)
					add_text_line(selectedstate_number, selectedstate_number_b, createlinenum, str)
					accept = true
				}
				$('.addlineline').remove()
			} else {
				$('.addlineline').attr('states', fstr)
				$('.addlineline').attr({ class: 'item-line', line: numberline })
				createlinenum = numberline
				add_polygon(selectedstate_number, selectedstate_number_b)
				add_text_line(selectedstate_number, selectedstate_number_b, createlinenum, str)
				accept = true
			}

			if (accept) {
				$('.item-state').each(function () {
					if (parseInt($(this).attr('state')) == selectedstate_number) {
						if (typeof $(this).attr('lineout') == 'undefined') {
							$(this).attr('lineout', selectedstate_number_b)
						} else {
							$(this).attr('lineout', $(this).attr('lineout') + ',' + selectedstate_number_b)
						}
					}
					if (parseInt($(this).attr('state')) == selectedstate_number_b) {
						if (typeof $(this).attr('linein') == 'undefined') {
							$(this).attr('linein', selectedstate_number)
						} else {
							$(this).attr('linein', $(this).attr('lineout') + ',' + selectedstate_number)
						}
					}
				})
			}
			selectedstate = false
			selectedstate_x = 0
			selectedstate_y = 0
			selectedstate_number = 0
			selectedstate_number_b = 0
		} else if (addowner) {
			$('#window').addClass('hidden')
			str = '~'
			if ($('#window-in-input').val() != '' && !$('#window-in-input').val().match(/\d/)) str = $('#window-in-input').val()

			if (typeof $(".item-state[state='" + selectowner + "']").attr('owner') != 'undefined') {
				fstr = $(".item-state[state='" + selectowner + "']").attr('owner')
				if (fstr.indexOf(str) < 0) {
					$(".item-state[state='" + selectowner + "']").attr('owner', fstr + ',' + str)
					$('.text-owner[state="' + selectowner + '"]').text(fstr + ',' + str)
				}
			} else {
				X = parseInt($(".item-state[state='" + selectowner + "']").attr('cx')) + 5
				Y = parseInt($(".item-state[state='" + selectowner + "']").attr('cy')) + 30

				txt = makeSVG('text', { class: 'text-owner', state: selectowner, fill: '#f0f', x: X, y: Y })
				document.getElementById('body').appendChild(txt)
				$('.text-owner[state="' + selectowner + '"]').text(str)

				$(".item-state[state='" + selectowner + "']").attr('owner', str)
			}
			selectowner = 0
		}
	})

	$(document).on('mousedown', '#body', function (event) {
		if (addstate) {
			numberstate++
			$('.addstatecircle').attr({ class: 'item-state', state: numberstate })

			X = parseInt($('.item-state[state="' + numberstate + '"]').attr('cx')) + 5
			Y = parseInt($('.item-state[state="' + numberstate + '"]').attr('cy')) + 5

			text = makeSVG('text', { class: 'text-state', fill: '#000', state: numberstate, x: X, y: Y })
			document.getElementById('body').appendChild(text)
			$('.text-state[state="' + numberstate + '"]').text(String.fromCharCode(numberstate + 64))
		} else if (removestate) {
		} else if (addline) {
		} else if (removeline) {
		}
	})

	$(document).on('mousedown', '.item-state', function (event) {
		if (removestate) {
			remove_line($(this).attr('state'))
			$('.text-state[state="' + $(this).attr('state') + '"]').remove()
			$('.text-owner[state="' + $(this).attr('state') + '"]').remove()
			$(this).remove()
			if (!$('.item-state').length) numberstate = 0
		} else if (addline) {
			if (selectedstate && selectedstate_x != $(this).attr('cx') && selectedstate_y != $(this).attr('cy')) {
				remove_state_dashed()
				$('.addlineline').attr('x2', $(this).attr('cx'))
				$('.addlineline').attr('y2', $(this).attr('cy'))
				$('.addlineline').removeAttr('stroke-dasharray')
				selectedstate_number_b = $(this).attr('state')
				$('#window-in-input').val('')
				$('#window').removeClass('hidden')
			} else {
				selectedstate = true
				selectedstate_x = $(this).attr('cx')
				selectedstate_y = $(this).attr('cy')
				selectedstate_number = $(this).attr('state')
				$(this).attr('stroke-dasharray', '7,3')
			}
		} else if (addowner) {
			$('#window-in-input').val('')
			$('#window').removeClass('hidden')
			selectowner = parseInt($(this).attr('state'))
		} else if (addstart) {
			if (typeof $(this).attr('start') == 'undefined') {
				if (typeof $('.item-state[start=""]').attr('end') == 'undefined') {
					$('.item-state[start=""]').attr('stroke', '#000')
				} else {
					$('.item-state[start=""]').attr('stroke', '#0072ff')
				}
				$('.item-state[start=""]').removeAttr('start')

				$(this).attr('start', '')
				if (typeof $(this).attr('end') == 'undefined') {
					$(this).attr('stroke', '#ff1800')
				} else {
					$(this).attr('stroke', '#8c087e')
				}
			} else {
				$(this).removeAttr('start')
				if (typeof $(this).attr('end') == 'undefined') {
					$(this).attr('stroke', '#000')
				} else {
					$(this).attr('stroke', '#0072ff')
				}
			}
			remove_state_dashed()
			resetOption()
			$('.icon-mouse').addClass('active')
		} else if (addend) {
			if (typeof $(this).attr('end') == 'undefined') {
				$(this).attr('end', '')
				if (typeof $(this).attr('start') == 'undefined') {
					$(this).attr('stroke', '#0072ff')
				} else {
					$(this).attr('stroke', '#8c087e')
				}
			} else {
				$(this).removeAttr('end')
				if (typeof $(this).attr('start') == 'undefined') {
					$(this).attr('stroke', '#000')
				} else {
					$(this).attr('stroke', '#ff1800')
				}
			}
		} else {
			dragging = $(this)
			$('#wrapper').addClass('move')
			jQuery('#body').append($(this))
			jQuery('#body').append($('.text-state[state="' + dragging.attr('state') + '"]'))
			jQuery('#body').append($('.text-owner[state="' + dragging.attr('state') + '"]'))
		}
	})

	$(document).on('mousedown', '.item-line', function (event) {
		if (removeline) {
			$('.polygon_num[line="' + $(this).attr('line') + '"]').remove()
			$('.text-line[line="' + $(this).attr('line') + '"]').remove()
			$(this).remove()
			if (!$('.item-line').length) numberline = 0
		}
	})

	jQuery('#body').on('mouseup', function (e) {
		dragging = null
		$('#wrapper').removeClass('move')
	})

	$(document).on('mousemove', '#body', function (event) {
		mousex = event.pageX - $('#body').offset().left
		mousey = event.pageY - $('#body').offset().top
		if (addstate) {
			add_state_func()
		} else if (removestate) {
		} else if (addline && selectedstate) {
			add_line_func()
		} else if (removeline) {
		}

		if (dragging) {
			cx_old = dragging.attr('cx')
			cy_old = dragging.attr('cy')

			dragging.attr('cx', parseInt(mousex))
			dragging.attr('cy', parseInt(mousey))

			$('.text-state[state="' + dragging.attr('state') + '"]').attr('x', parseInt(dragging.attr('cx')) + 5)
			$('.text-state[state="' + dragging.attr('state') + '"]').attr('y', parseInt(dragging.attr('cy')) + 5)

			$('.text-owner[state="' + dragging.attr('state') + '"]').attr('x', parseInt(dragging.attr('cx')) + 5)
			$('.text-owner[state="' + dragging.attr('state') + '"]').attr('y', parseInt(dragging.attr('cy')) + 30)

			change_polygon(dragging.attr('state'))
			change_text_line(dragging.attr('state'))

			update_item_line()
		}
	})

	function add_state_func() {
		if (!$('#body .addstatecircle').length) {
			c1 = Math.floor(Math.random() * 156) + 100
			c2 = Math.floor(Math.random() * 156) + 100
			c3 = Math.floor(Math.random() * 156) + 100
			circle = makeSVG('circle', { class: 'addstatecircle', r: 30, stroke: '#000', 'stroke-width': 4, fill: 'rgba(' + c1 + ' , ' + c2 + ' , ' + c3 + ' , 1)' })
			document.getElementById('body').appendChild(circle)
		}

		$('.addstatecircle').attr('cx', parseInt(mousex))
		$('.addstatecircle').attr('cy', parseInt(mousey))
	}

	function add_line_func() {
		if (!$('#body .addlineline').length) {
			line = makeSVG('line', {
				class: 'addlineline',
				x1: selectedstate_x,
				y1: selectedstate_y,
				x2: mousex,
				y2: mousex,
				stroke: '#000',
				'stroke-width': 4,
				'stroke-dasharray': '7,2'
			})
			$('#body').prepend(line)
		}

		$('.addlineline').attr('x2', parseInt(mousex))
		$('.addlineline').attr('y2', parseInt(mousey))
	}

	function state_dashed() {
		$('.item-state').each(function () {
			$(this).attr('stroke-width', 15)
		})
	}

	function remove_state_dashed() {
		$('.item-state').each(function () {
			$(this).removeAttr('stroke-dasharray')
			$(this).attr('stroke-width', 4)
		})
	}

	function remove_line_dashed() {
		$('.item-line').each(function () {
			$(this).removeAttr('stroke-dasharray')
			$(this).attr('stroke-width', 4)
		})
	}

	function makeSVG(tag, attrs) {
		var el = document.createElementNS('http://www.w3.org/2000/svg', tag)
		for (var k in attrs) el.setAttribute(k, attrs[k])
		return el
	}

	function resetOption() {
		$('.controls-item.active').removeClass('active')
		$('.addstatecircle').remove()
		$('.addlineline').remove()
		$(this).addClass('active')
		$('#wrapper').removeClass('add')
		$('#wrapper').removeClass('remove')
		remove_state_dashed()
		remove_line_dashed()
		addstate = false
		removestate = false
		addline = false
		removeline = false
		addowner = false
		addstart = false
		addend = false

		addstate = false
		removestate = false
		addline = false
		removeline = false
		addowner = false
		addstart = false
		addend = false
		selectowner = 0
		selectedstate_number = 0
		selectedstate_number_b = 0
	}

	function update_item_line() {
		$('.item-line').each(function () {
			str = $(this).attr('states')
			if (str.indexOf('@' + dragging.attr('state') + '@') >= 0) {
				if ($(this).attr('x1') == cx_old && $(this).attr('y1') == cy_old) {
					$(this).attr('x1', dragging.attr('cx'))
					$(this).attr('y1', dragging.attr('cy'))
				} else {
					$(this).attr('x2', dragging.attr('cx'))
					$(this).attr('y2', dragging.attr('cy'))
				}
			}
		})
	}

	function remove_line(state) {
		$('.item-line').each(function () {
			str = $(this).attr('states')
			if (str.indexOf('@' + state + '@') >= 0) {
				$(this).attr('class', 'removedline')
			}
			$('.polygon_num[line="' + $(this).attr('line') + '"]').remove()
			$('.text-line[line="' + $(this).attr('line') + '"]').remove()
		})
		if (!$('.item-line').length) numberline = 0
		$('.removedline').remove()
	}

	function state_line() {
		$('.item-line').each(function () {
			$(this).attr('stroke-width', 15)
		})
	}

	function remove_state_line() {
		$('.item-line').each(function () {
			$(this).attr('stroke-width', 4)
		})
	}

	function add_polygon(state_1, state_2, add) {
		add = typeof add !== 'undefined' ? add : false
		if (!$('.polygon[polygon_num="' + state_1 + ',' + state_2 + '"]').length || add) {
			x1 = parseInt($('.item-state[state="' + state_1 + '"]').attr('cx'))
			y1 = parseInt($('.item-state[state="' + state_1 + '"]').attr('cy'))
			x2 = parseInt($('.item-state[state="' + state_2 + '"]').attr('cx'))
			y2 = parseInt($('.item-state[state="' + state_2 + '"]').attr('cy'))

			m = (y2 - y1) / (x2 - x1)
			y0 = y1 - m * x1

			deg = (Math.atan(m) / Math.PI) * 180
			cdeg = Math.cos((deg / 180) * Math.PI)
			sdeg = Math.sin((deg / 180) * Math.PI)

			size = 15
			rad = 70

			if (x1 > x2 && y1 > y2) {
				p1x = x2 + cdeg * 29
				p1y = p1x * m + y0
				p2x = p1x + Math.cos(rad + (deg / 180) * Math.PI) * size
				p3x = p1x + Math.cos(-rad + (deg / 180) * Math.PI) * size
				p2y = p1y + Math.sin(rad + (deg / 180) * Math.PI) * size
				p3y = p1y + Math.sin(-rad + (deg / 180) * Math.PI) * size
			} else if (x1 > x2 && y1 < y2) {
				p1x = x2 + cdeg * 29
				p1y = p1x * m + y0
				p2x = p1x + Math.cos(rad - (deg / 180) * Math.PI) * size
				p3x = p1x + Math.cos(-rad - (deg / 180) * Math.PI) * size
				p2y = p1y - Math.sin(rad - (deg / 180) * Math.PI) * size
				p3y = p1y - Math.sin(-rad - (deg / 180) * Math.PI) * size
			} else if (x1 < x2 && y1 > y2) {
				p1x = x2 - cdeg * 29
				p1y = p1x * m + y0
				p2x = p1x - Math.cos(rad - (deg / 180) * Math.PI) * size
				p3x = p1x - Math.cos(-rad - (deg / 180) * Math.PI) * size
				p2y = p1y + Math.sin(rad - (deg / 180) * Math.PI) * size
				p3y = p1y + Math.sin(-rad - (deg / 180) * Math.PI) * size
			} else {
				p1x = x2 - cdeg * 29
				p1y = p1x * m + y0
				p2x = p1x - Math.cos(rad + (deg / 180) * Math.PI) * size
				p3x = p1x - Math.cos(-rad + (deg / 180) * Math.PI) * size
				p2y = p1y - Math.sin(rad + (deg / 180) * Math.PI) * size
				p3y = p1y - Math.sin(-rad + (deg / 180) * Math.PI) * size
			}

			point = p1x + ',' + p1y + ' ' + p2x + ',' + p2y + ' ' + p3x + ',' + p3y

			if (add) {
				add.attr('points', point)
			} else {
				colors = state_1 > state_2 ? '#a00' : '#00a'
				polygons = makeSVG('polygon', { class: 'polygon_num', fill: colors, points: point, polygon: state_1 + ',' + state_2, line: createlinenum })
				document.getElementById('body').appendChild(polygons)
			}
		}
	}

	function change_polygon(state) {
		$('.polygon_num').each(function () {
			states = $(this).attr('polygon').split(',')
			if (states[0] == state || states[1] == state) {
				add_polygon(states[0], states[1], $(this))
			}
		})
	}

	function add_text_line(state_1, state_2, lines, texts) {
		x1 = parseInt($('.item-state[state="' + state_1 + '"]').attr('cx'))
		y1 = parseInt($('.item-state[state="' + state_1 + '"]').attr('cy'))
		x2 = parseInt($('.item-state[state="' + state_2 + '"]').attr('cx'))
		y2 = parseInt($('.item-state[state="' + state_2 + '"]').attr('cy'))

		m = (y2 - y1) / (x2 - x1)
		y0 = y1 - m * x1
		X = (x1 + x2) / 2
		Y = m * X + y0

		deg = (Math.atan(m) / Math.PI) * 180

		if (state_1 > state_2) {
			if (x1 > x2 && y1 > y2) {
				X -= 10 * Math.sin((deg / 180) * Math.PI)
				Y += 10 * Math.cos((deg / 180) * Math.PI)
			} else if (x1 > x2 && y1 < y2) {
				X -= 10 * Math.sin((deg / 180) * Math.PI)
				Y += 10 * Math.sin(90 - (deg / 180) * Math.PI)
			} else if (x1 < x2 && y1 > y2) {
				X += 10 * Math.sin((deg / 180) * Math.PI)
				Y -= 10 * Math.cos((deg / 180) * Math.PI)
			} else {
				X += 10 * Math.sin((deg / 180) * Math.PI)
				Y -= 10 * Math.cos((deg / 180) * Math.PI)
			}
		} else {
			if (x1 > x2 && y1 > y2) {
				X -= 10 * Math.sin((deg / 180) * Math.PI)
				Y += 10 * Math.cos((deg / 180) * Math.PI)
			} else if (x1 > x2 && y1 < y2) {
				X -= 10 * Math.sin((deg / 180) * Math.PI)
				Y += 10 * Math.cos((deg / 180) * Math.PI)
			} else if (x1 < x2 && y1 > y2) {
				X += 10 * Math.cos(90 - (deg / 180) * Math.PI)
				Y -= 10 * Math.sin(90 - (deg / 180) * Math.PI)
			} else {
				X += 10 * Math.sin((deg / 180) * Math.PI)
				Y -= 10 * Math.cos((deg / 180) * Math.PI)
			}
		}

		if (lines) {
			if (!$('.text-line[states="' + state_1 + ',' + state_2 + '"]').length) {
				colors = state_1 > state_2 ? '#a00' : '#00a'
				txt = makeSVG('text', { class: 'text-line', line: lines, states: state_1 + ',' + state_2, fill: colors, stroke: '#fff', 'stroke-width': 1, x: X, y: Y })
				document.getElementById('body').appendChild(txt)
				$('.text-line[states="' + state_1 + ',' + state_2 + '"]').text(texts)
			} else {
				tl = $('.text-line[states="' + state_1 + ',' + state_2 + '"]')
				tl.text(tl.text() + ',' + texts)

				$('.text-line[states="' + state_1 + ',' + state_2 + '"]').attr('x', X)
				$('.text-line[states="' + state_1 + ',' + state_2 + '"]').attr('y', Y)
			}
		} else {
			$('.text-line[states="' + state_1 + ',' + state_2 + '"]').attr('x', X)
			$('.text-line[states="' + state_1 + ',' + state_2 + '"]').attr('y', Y)
		}
	}

	function change_text_line(state) {
		$('.text-line').each(function () {
			states = $(this).attr('states').split(',')
			if (states[0] == state || states[1] == state) {
				add_text_line(states[0], states[1], false, false)
			}
		})
	}

	//check
	$('#helps').click(function () {
		$('#help').removeClass('hidden')
	})

	$('#help-in-button').click(function () {
		$('#help').addClass('hidden')
	})

	$('.icon-text').click(function () {
		$('#input').removeClass('hidden')
	})

	$('#input-in-button').click(function () {
		$('.item-checked').text($('#input-in-input').val())
		$('#input').addClass('hidden')
		$('.item-checked.false').removeClass('false')
		$('.item-checked.true').removeClass('true')
	})

	$('#alert-in-button').click(function () {
		$('#alert-in-number').empty()
		$('#alert').addClass('hidden')
	})

	$('.icon-check').click(function () {
		error = false
		if (!$('.item-state[start=""]').length) {
			error = true
			$('#alert').removeClass('hidden')
			$('#alert-in-number').append('<p>You must select a state to start</p>')
		}

		if (!$('.item-state[end=""]').length) {
			error = true
			$('#alert').removeClass('hidden')
			$('#alert-in-number').append('<p>You must select at least one state to finish</p>')
		}

		if ($('.item-checked').text() == '') {
			error = true
			$('#alert').removeClass('hidden')
			$('#alert-in-number').append('<p>You must enter a string to check or enter a valid string</p>')
		}

		resetOption()

		if (!error) {
			check_texts_in()
		}
	})

	function check_texts_in() {
		create_array_state()

		console.log(array_of_lines)

		accepts = false
		ss = first_state - 1
		itm_che = $('.item-checked').text()

		var i = 0
		for (i = 0; i < itm_che.length; i++) {
			accept_it = false

			if (typeof array_of_lines[ss] != 'undefined') {
				felsehs = array_of_lines[ss].split(',')
				for (j = 0; j < felsehs.length; j++) {
					str = felsehs[j].split('.')
					if (str[0] == '~') {
						array_of_stacks.push(str[1] + '.' + i)
					} else if (!accept_it && str[0] == itm_che[i]) {
						accept_it = true
						ss = parseInt(str[1]) - 1
					} else if (accept_it && str[0] == itm_che[i]) {
						array_of_stacks.push(str[1] + '.' + (i + 1))
					}
				}
			}

			console.log(array_of_stacks)

			if (accept_it && itm_che.length - 1 == i) {
				if ($('.item-state[state="' + (ss + 1) + '"][end=""]').length) accepts = true
			} else if (array_of_stacks.length !== 0 && (!accepts || !accept_it)) {
				pops = array_of_stacks.pop()
				ch = pops.split('.')
				ss = parseInt(ch[0]) - 1
				i = parseInt(ch[1]) - 1
			} else if (!accept_it) {
				break
			}
		}

		if (itm_che == '~' && $('.item-state[start=""][end=""]').length) accepts = true

		$('.item-checked.false').removeClass('false')
		$('.item-checked.true').removeClass('true')
		if (accepts) {
			$('.item-checked').addClass('true')
		} else {
			$('.item-checked').addClass('false')
		}
	}

	function create_array_state() {
		array_of_state = []
		array_of_lines = []
		array_of_stacks = []

		$('.item-state').each(function () {
			index = parseInt($(this).attr('state')) - 1
			array_of_state[index] = $(this).attr('state')
		})

		$('.item-line').each(function () {
			state = $(this).attr('states').split(',')

			for (i = 0; i < state.length; i++) {
				states = state[i].split('.')

				state_1 = parseInt(states[0].replace('@', ''))
				state_2 = parseInt(states[2].replace('@', ''))
				felesh = states[1]

				if (typeof array_of_lines[state_1 - 1] != 'undefined') {
					array_of_lines[state_1 - 1] += ',' + felesh + '.' + state_2
				} else {
					array_of_lines[state_1 - 1] = felesh + '.' + state_2
				}
			}
		})

		$('.text-owner').each(function () {
			feleshs = $(this).text().split(',')
			state = parseInt($(this).attr('state'))

			for (i = 0; i < feleshs.length; i++) {
				felesh = feleshs[i]

				if (typeof array_of_lines[state - 1] != 'undefined') {
					array_of_lines[state - 1] += ',' + felesh + '.' + state
				} else {
					array_of_lines[state - 1] = felesh + '.' + state
				}
			}
		})

		first_state = $('.item-state[start=""]').attr('state')
	}
})

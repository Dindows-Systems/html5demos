@addEventListener('message', (e) ->

	@rgba 	= e.data.rgba
	@imgwidth	= e.data.width
	@imgheight	= e.data.height
	@id = e.data.id

	@start  = e.data.start
	@end	= e.data.end
	@effect = e.data.effect	

	@postMessage {
		id : @id,
		start: @start,
		end: @end,
		buffer : applyConv()
	}
	

, false)



matrix = 
	blur : [
		[1, 2, 1],
		[2, 4, 2],
		[1, 2, 1]
	],
	sharpen : [
		[0, -1, 0],
		[-1, 5, -1],
		[0, -1, 0]
	],
	sharpen2 : [
		[0, -2, 0],
		[-2, 11, -2],
		[0, -2, 0]
	],
	edge : [
		[0, 1, 0],
		[1, -4, 1],
		[0, 1, 0]
	],
	edge_enanche : [
		[0, 0, 0],
		[-1, 1, 0],
		[0, 0, 0]
	],
	edge_detect : [
		[0, 1, 0],
		[1, -4, 1],
		[0, 1, 0]
	],
	edge_detect2 : [
		[ 1,  1,  1],
     	[ 1, -7,  1],
     	[ 1,  1,  1]
	],
	edge_detect3 : [
		[-5,  0,  0],
      	[ 0,  0,  0],
      	[ 0,  0,  5]
	],
	emboss : [
		[-2, -1, 0],
		[-1, 1, 1],
		[0, 1, 2]
	],
	emboss_subtle : [
		[ 1,  1, -1],
    	[ 1,  3, -1],
     	[ 1, -1, -1]
	]
	gaussian : [
		[1, 2, 1],
		[2, 4, 2],
		[1, 2, 1]
	],
	mean : [
		[-1, -1, -1],
		[-1,  9, -1],
		[-1, -1, -1]
	]




calcIntersect = (mat1, mat2) ->
	tot = 0
	for y in [0...3]
		for x in [0...3]
			tot += mat1[y][x] * mat2[y][x]
	tot


getRGB = (x, y, c) ->
	index = (y * imgwidth + x) * 4
	rgba[index+c]



applyConv = ->
	allc = [[],[],[]]
	max = []
	singlepixel = [[],[],[]]
	allpixel = []

	for y in [0...imgheight]
		for x in [0...imgwidth]
			for c in [0..2]
				pixelval = calcIntersect(
					[
						[getRGB(x-1, y-1, c) , getRGB(x, y-1,c), getRGB(x+1, y-1,c)],
						[getRGB(x-1, y, c)	 , getRGB(x, y,c) , getRGB(x+1, y,c)  ],
						[getRGB(x-1, y, c)	 , getRGB(x, y,c) , getRGB(x+1, y,c)  ]
					],
					matrix[@effect]
				)
				if pixelval > max[c] or !max[c]
					max[c] = pixelval

				allc[c].push pixelval



	i = 0
	for y in [0...imgheight]
		for x in [0...imgwidth]
			for nc in [0..2]
				singlepixel[nc] = if 255*allc[nc][i]/max[nc] > 0 then parseInt(255*allc[nc][i]/max[nc]) else 0

			allpixel.push(singlepixel[0],singlepixel[1], singlepixel[2], 255)
			i++

	allpixel

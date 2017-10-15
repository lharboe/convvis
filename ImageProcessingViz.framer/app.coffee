# CLASSES

class InputLayer extends Layer
	constructor: (options={}) ->
		options.width = activePixelSize * canvasWidth
		options.height = activePixelSize * canvasHeight
		options.parent = inputFrame

		super options  

class InputPixel extends Layer
	constructor: (options={}) ->
		options.parent = inputImage
		options.size = activePixelSize
		super options
	

class Matrix extends Layer
	constructor: (options={}) ->
		@matrixSize = options.matrixSize
		@matrixValues = options.matrixValues
		@kernelPadding = options.kernelPadding
		@kernelStride = options.kernelStride
		@cells = []
		super options

class KernelCell extends Layer
	constructor: (options={}) ->
		super options

class InputPixelCell extends Layer
	constructor: (options={}) ->
		super options

class Loupe extends Layer
	constructor: (options={}) ->
		options.parent = inputFrame
		options.backgroundColor = "rgba(255,255,0,0.3)"
		super options

class Sum extends Layer
	constructor: (options={}) ->
		options.parent = SumDisplay
		options.size = SumDisplay.size
		super options

# CUSTOMIZABLE PARAMETERS
activePixelSize = 20
activeKernelSize = 3
activeKernelValues = [0.1,0.2,0.5,0.8,0.1,0.1,0.2,0.5,0.8]
activeKernelStride = 1
activeKernelPadding = 0

currentLoupePos = 0

# GET IMAGE

image = "images/picture.jpg"
imgSrc = new Image()
imgSrc.src = image

# GET PIXEL DATA OF IMAGE

canvas = document.createElement('canvas')
ctx = canvas.getContext('2d')
canvasHeight = Math.round(inputFrame.height / activePixelSize)
canvasWidth  = Math.round(canvasHeight / (imgSrc.height / imgSrc.width))
ctx.drawImage(imgSrc, 0, 0, canvasWidth, canvasHeight)
colorData = ctx.getImageData(0,0,canvasWidth,canvasHeight).data	

# CONVERT PIXEL DATA TO GRAY SCALE
# STORE PIXELS IN 'grayscaleData'

grayscaleData  = []
pixelIndex = 0
for pixel in [0...colorData.length/4]
	avg = (colorData[pixelIndex] + colorData[pixelIndex + 1] + colorData[pixelIndex + 2]) / 3
	grayscaleData.push(avg)
	pixelIndex += 4

#CREATE INPUT IMAGE LAYER 
inputImage = new InputLayer
inputImage.center()


i = 0
for h in [1..canvasHeight]
	for w in [1..canvasWidth]
		do ->
			bgColor = "rgb(#{grayscaleData[i]}, #{grayscaleData[i]}, #{grayscaleData[i]})"
			pixel = new InputPixel
				backgroundColor: bgColor
				x: (w - 1) * activePixelSize
				y: (h - 1) * activePixelSize
				scale: 1
				opacity: 1
		i += 1
		

activeKernel = new Matrix
	parent: kernelDisplay
	size: kernelDisplay.size
	matrixSize: activeKernelSize
	matrixValues: activeKernelValues 
	kernelPadding: activeKernelPadding
	kernelStride: activeKernelStride

i = 0
for row in [0...activeKernel.matrixSize]
	for column in [0...activeKernel.matrixSize]
		cell = new KernelCell
			parent: activeKernel
			width: (kernelDisplay.width-activeKernel.matrixSize)/activeKernel.matrixSize
			height: (kernelDisplay.width-activeKernel.matrixSize)/activeKernel.matrixSize
			x: row*(kernelDisplay.width/activeKernel.matrixSize)
			y: column*(kernelDisplay.height/activeKernel.matrixSize)
			backgroundColor: "white"
		activeKernel.cells.push(cell)
		label = new TextLayer
			template: 
				value: activeKernel.matrixValues[i]
			text: "{value}"
			color: "red"
			parent: activeKernel.cells[i]
		i++

loupeLayer = new Loupe
	width: activePixelSize*activeKernel.matrixSize
	height: activePixelSize*activeKernel.matrixSize


runButton.onTap (event, layer) ->
		loupeStep()

loupeStep = ->
	nextPos = currentLoupePos + activeKernelStride
	currentRow = Math.floor(currentLoupePos/canvasWidth)+1
	if(nextPos+activeKernelSize <= canvasWidth*currentRow)
		loupeLayer.x = (nextPos%canvasWidth*activePixelSize)
	else
		if (currentRow+activeKernelSize>canvasHeight)
			nextPos = 0
			loupeLayer.x = 0
			loupeLayer.y = 0
		else
			nextPos = canvasWidth*currentRow+1
			loupeLayer.x = 0
			loupeLayer.y = loupeLayer.y + activePixelSize
	currentLoupePos = nextPos
	updateInputPixelValues()

# convertToColumn = (values) ->
# 	newValues = []
# 	for i in [0...(values.length/activeKernelSize)]
# 		newfactor=i
# 		while(newfactor<values.length)
# 			newValues.push(values[newfactor])
# 			newfactor+=activeKernelSize
# 	return newValues

# GET ARRAY OF PIXEL VALUES BASED ON currentLoupePosition 
getInputPixelValues = ->
	values = []
	for i in [0...activeKernelSize]
		for j in [0...activeKernelSize]
			values.push(grayscaleData[currentLoupePos+i+(j*canvasWidth)])
	return values

# UPDATE INPUT PIXEL VALUES
updateInputPixelValues = ->
	values = getInputPixelValues()
	print('Current Pixels (by column)')
	for i in [0...values.length]
		cellValue = Utils.round(values[i])
		cellLabel = activeInput.cells[i].subLayers[0]
		
		# update each cell
		activeInput.cells[i].backgroundColor = "rgb(#{cellValue}, #{cellValue}, #{cellValue})"
		cellLabel.text = cellValue
		
		# ensure that the text label is visible
		if (cellValue < 128)
			cellLabel.color = "white"
		else
			cellLabel.color = "black"

# INITIALIZING INPUT MATRIX
# uses matrix class similiar 
activeInput = new Matrix
	parent: InputPixelDisplay
	size: InputPixelDisplay.size
	matrixSize: activeKernelSize
	matrixValues: getInputPixelValues() 

# ADD LABEL LAYERS TO THE INPUT PIXEL MATRIX
# GIVEN DEFAULT VALUES OF STARTING LOUPE
#very similiar 
i = 0
for row in [0...activeInput.matrixSize]
	for column in [0...activeInput.matrixSize]
		cell = new InputPixelCell
			parent: activeInput
			width: (InputPixelDisplay.width-activeInput.matrixSize)/activeInput.matrixSize
			height: (InputPixelDisplay.width-activeInput.matrixSize)/activeInput.matrixSize
			x: row*(InputPixelDisplay.width/activeInput.matrixSize)
			y: column*(InputPixelDisplay.height/activeInput.matrixSize)
			backgroundColor: "white"
		activeInput.cells.push(cell)
		label = new TextLayer
			template: 
				value: activeInput.matrixValues[i]
			text: "{value}"
			textAlign: "center"
			width: cell.width
			height: cell.height
			padding: 10
			fontSize: 12
			parent: activeInput.cells[i]
		i++

activeSum = new Sum
sum = 0
for i in [0..activeKernel.cells.length]
	sum = 10
	#Code below doesn't work, trying different ways to multiply label of inputMatrix by label of kernelMatirx
	#product of label of inputMatrix by label of kernelMatirx is added to the sum variable
	#sum += (activeKernel.cells[i].children*activeInput.cells[i])
labelSum = new TextLayer
	template:
		value: sum
	text: "{value}"
	parent: activeSum


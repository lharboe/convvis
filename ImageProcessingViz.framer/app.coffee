# CLASSES

class InputLayer extends Layer
	constructor: (options={}) ->
		super options  
		@width = activePixelSize * canvasWidth
		@height = activePixelSize * canvasHeight
		@parent = inputFrame
		
class OutputLayer extends Layer
	constructor: (options={}) ->
		super options
		@width = activePixelSize*activeOutputSize
		@height = activePixelSize*activeOutputSize
		@parent = outputFrame
		@.center()

class InputPixel extends Layer
	constructor: (options={}) ->
		super options
		@pixelIndex = options.pixelIndex
		@size = activePixelSize
		@parent = inputImage
		@onTap (event, layer) ->
			loupeTopLeftCorner = 0
			print "layer pixel index #{layer.pixelIndex}"
			currentRow = Math.floor(currentLoupePos/canvasWidth)
			# left edge
			if((layer.pixelIndex)%canvasWidth == 0)
				loupeTopLeftCorner = layer.pixelIndex - Math.floor(activeKernelSize/2)*canvasWidth
				print "left edge"
			# center
			else
				loupeTopLeftCorner = layer.pixelIndex - Math.floor(activeKernelSize/2)*canvasWidth - Math.floor(activeKernelSize/2)
			currentLoupePos = loupeTopLeftCorner
			loupeStepToPixelIndex(loupeTopLeftCorner)

class OutputPixel extends Layer
	constructor: (options={}) ->
		super options
		@parent = outputImage
		@size = activePixelSize
		@pixelIndex = options.pixelIndex
		@outputValue = options.outputValue
		@onTap (event, layer) ->
			print('Pixel clicked ==')
			print(layer.pixelIndex)
			print("output clicked, current loop pos")
			currentLoupePos = parseInt(outputToInputMap[(layer.pixelIndex)])
			print(typeof(currentLoupePos))
			print(currentLoupePos)
			loupeStepToPixelIndex(outputToInputMap[layer.pixelIndex])
						
# class InputPixel extends Layer
# 	constructor: (options={}) ->
# 		options.parent = inputImage
# 		options.size = activePixelSize
# 		@index = options.index
# ## not sure why this doesn't work
# # 		@onTap (event, layer) ->
# # 			print "hey"
# 		super options

class Matrix extends Layer
	constructor: (options={}) ->
		super options
		@matrixSize = options.matrixSize
		@matrixValues = options.matrixValues
		@kernelPadding = options.kernelPadding
		@kernelStride = options.kernelStride
		@cells = []

class KernelCell extends Layer
	constructor: (options={}) ->
		super options

class InputPixelCell extends Layer
	constructor: (options={}) ->
		super options

class Loupe extends Layer
	constructor: (options={}) ->
		super options

class Sum extends Layer
	constructor: (options={}) ->
		super options
		@parent = SumDisplay
		@backgroundColor = "white"
		@size = SumDisplay.size
		@sumLabel = new TextLayer
			fontSize: 18
			textAlign: "center"
			parent: SumDisplay
		@sumValue = 0
		@updateSum = ->
			sum = 0
			for i in [0...activeKernel.matrixValues.length]
				sum += (activeKernel.matrixValues[i]*activeInput.matrixValues[i])
			print(sum)
			print(activeInput)
			@sumValue = sum
			@sumLabel.text = Utils.round(sum)
			relativeFontSize = Math.abs(sum)*0.02+12
			@sumLabel.fontSize = relativeFontSize
			if sum > 0
				@sumLabel.color = 'green'
			else if sum < 0
				@sumLabel.color = 'red'
			else
				@sumLabel.color = 'black'
			@sumLabel.center()

# CUSTOMIZABLE PARAMETERS
activePixelSize = 20
activeKernelSize = 3
activeKernelValues = [0.1,0.2,0.5,0.8,0.1,0.1,0.2,0.5,0.8]
#activeKernelValues = [0,0,0,0,1,0,0,0,0]
activeKernelValues = [-1,-2,-1,0,0,0,1,2,1]
activeKernelStride = 1
activeKernelPadding = 0

currentLoupePos = 0
activeSum = new Sum


# GET IMAGE

image = "images/flower.jpg"
imgSrc = new Image()
imgSrc.src = image

# GET PIXEL DATA OF IMAGE

canvas = document.createElement('canvas')
ctx = canvas.getContext('2d')
canvasHeight = Math.round(inputFrame.height / activePixelSize)
canvasWidth  = Math.round(canvasHeight / (imgSrc.height / imgSrc.width))
ctx.drawImage(imgSrc, 0, 0, canvasWidth, canvasHeight)
colorData = ctx.getImageData(0,0,canvasWidth,canvasHeight).data	


print canvasHeight
print canvasWidth
totalSteps = (canvasHeight-2)*(canvasWidth-2)

# OUTPUT SIZE
# Only works for unit stride of 1, no padding
activeOutputSize = ((canvasWidth - activeKernelSize) + 1)

inputToOutputMap = {}
pastPos = 0
i=0
for col in [0..(activeOutputSize-1)]
	for row in [0..(activeOutputSize-1)]
		inputToOutputMap[row+activeKernelSize*col+(activeOutputSize-1)*col] = i
		i++
print(inputToOutputMap)

outputToInputMap = {}
for key, value of inputToOutputMap
	outputToInputMap[parseInt(value)] = parseInt(key)
print(outputToInputMap)

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
			value = i
			bgColor = "rgb(#{grayscaleData[i]}, #{grayscaleData[i]}, #{grayscaleData[i]})"
			pixel = new InputPixel
				backgroundColor: bgColor
				x: (w - 1) * activePixelSize
				y: (h - 1) * activePixelSize
				scale: 1
				opacity: 1
				pixelIndex: i
# 			label = new TextLayer
# 				template: 
# 					value: Utils.round(grayscaleData[i])
# 				text: "{value}"
# 				truncate: true
# 				textAlign: "center"
# 				width: pixel.width
# 				height: pixel.height
# 				fontSize: 10
# 				parent: pixel
		i += 1

outputImage = new OutputLayer
outputImage.center()

i = 0
for h in [1..activeOutputSize]
	for w in [1..activeOutputSize]
		do ->
			value = i
			bgColor = "black"
			pixel = new OutputPixel
				backgroundColor: bgColor
				x: (w - 1) * activePixelSize
				y: (h - 1) * activePixelSize
				scale: 1
				opacity: 1
				pixelIndex: i
				outputValue: 0
# 			label = new TextLayer
# 				template: 
# 					value: Utils.round(grayscaleData[i])
# 				text: "{value}"
# 				truncate: true
# 				textAlign: "center"
# 				width: pixel.width
# 				height: pixel.height
# 				fontSize: 10
# 				parent: pixel
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
	backgroundColor: "rgba(255,255,0,0.3)"
	parent: inputFrame
	width: activePixelSize*activeKernel.matrixSize
	height: activePixelSize*activeKernel.matrixSize

loupeOutput = new Loupe
	backgroundColor: "rgba(0,255,255,0.3)"
	parent: outputFrame
	width: activePixelSize
	height: activePixelSize

# loupeLayer.draggable.enabled = true
# loupeLayer.draggable.constraints = inputFrame.framee

runButton.onTap (event, layer) ->
		loupeStep()

loupeStepToPixelIndex = (index) ->
	print "loup step to pos #{index}"
	currentRow = Math.floor(currentLoupePos/canvasWidth)+1

	loupeLayer.x = index%canvasWidth*activePixelSize
	loupeLayer.y = Math.floor(index/canvasWidth)*activePixelSize
	currentLoupePos = index
	updateInputPixelValues()
	activeSum.updateSum()
	updateOutput(updateActivation())

loupeStep = ->
	nextPos = currentLoupePos + activeKernelStride
	currentRow = Math.floor(currentLoupePos/canvasWidth)+1
	print currentLoupePos
	print "currentLoupePos #{currentLoupePos}"
	print "canvasWidth #{canvasWidth}"
	if(nextPos+activeKernelSize <= canvasWidth*currentRow)
		loupeLayer.x = (nextPos%canvasWidth*activePixelSize)
	else
		if (currentRow+activeKernelSize>canvasHeight)
			nextPos = 0
			loupeLayer.x = 0
			loupeLayer.y = 0
		else
			nextPos = canvasWidth*currentRow
			loupeLayer.x = 0
			loupeLayer.y = loupeLayer.y + activePixelSize
	currentLoupePos = nextPos
	print "updated currentLoupePos #{currentLoupePos}"
	updateInputPixelValues()
	activeSum.updateSum()
	updateOutput(updateActivation())

moveOutputLoupe = (outputPos) ->
	widthDif = (outputFrame.width - outputImage.width)/activeOutputSize
	heightDif = (outputFrame.height - outputImage.height)/activeOutputSize
	print('width DIF')
	print(widthDif)
	loupeOutput.x = outputImage.subLayers[outputPos].x + activePixelSize 
	loupeOutput.y = outputImage.subLayers[outputPos].y + activePixelSize 


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
			print(currentLoupePos+i+(j*canvasWidth))
			values.push(grayscaleData[currentLoupePos+i+(j*canvasWidth)])
	print('values from')
	print(values)
	return values

# UPDATE INPUT PIXEL VALUES
updateInputPixelValues = ->
	values = getInputPixelValues()
	print('Current Pixels (by column)')
	for i in [0...values.length]
		cellValue = Utils.round(values[i])
		cellLabel = activeInput.cells[i].subLayers[0]
		
		# update each cell
		activeInput.matrixValues[i] = cellValue
		activeInput.cells[i].backgroundColor = "rgb(#{cellValue}, #{cellValue}, #{cellValue})"
		cellLabel.text = cellValue
		
		# ensure that the text label is visible
		if (cellValue < 128)
			cellLabel.color = "white"
		else
			cellLabel.color = "black"

updateOutput = (result)->
	pixel = Math.min(result, 255)
	sum = activeSum.sumValue
	print('currentloop')
	print(currentLoupePos)
	outputPos = inputToOutputMap[currentLoupePos]
	moveOutputLoupe(outputPos)
	outputImage.subLayers[outputPos].backgroundColor = "rgb(#{pixel}, #{pixel}, #{pixel})"

updateActivation = ->
	sum = activeSum.sumValue
	result = Math.max(sum, 0)
	aLabel.text = "Max(#{sum}, 0)=#{result}"
	return result

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

aFunction = new Layer
	parent: activationFunction
	backgroundColor: "white"
	size: activationFunction.size
	
aLabel = new TextLayer
	parent: aFunction
	template:
		value: activeSum.sumValue
		result: Math.max(activeSum.sumValue)
	text: "Max({value}, 0)={result}"
	textAlign: "center"
	size: aFunction.size
	fontSize: 14



# activeSum = new Sum
# sum = 0
# for i in [0...activeKernel.matrixValues.length]
# 	sum = 10
# 	#Code below doesn't work, trying different ways to multiply label of inputMatrix by label of kernelMatirx
# 	#product of label of inputMatrix by label of kernelMatirx is added to the sum variable
# 	sum += (activeKernel.matrixValues[i]*activeInput.matrixValues[i])
# labelSum = new TextLayer
# 	template:
# 		value: Utils.round(sum)
# 	text: "{value}"
# 	fontSize: 18
# 	textAlign: "center"
# 	parent: activeSum
# 	
# updateSum = ->
	

# Create slider
slider = new SliderComponent
	parent: toolbar
	point: Align.center
	knobSize: 44
	min: 0
	max: totalSteps

# Listen for slider value updates
slider.onValueChange ->
	Screen.backgroundColor = Color.mix("black", "#00AAFF", slider.value)
	



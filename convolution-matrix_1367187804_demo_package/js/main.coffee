document.addEventListener('DOMContentLoaded', ->
    handledrag()
    


)



NWORKERS = 1
canvas = document.getElementById 'canvas'
ctx = canvas.getContext '2d'
image = new Image()
workers = []
bytearray = []
typeffect = $("#effect").val()
start_time = '';

$("#effect").on('change', ->
    typeffect = $(this).val()

    if $("canvas").hasClass('done')
        startProcess()
)

$("#nworkers").slider(
    min : 1,
    max : 10,
    slide: (e, ui) ->
        $("#active_workers").html(ui.value)
        NWORKERS = parseInt(ui.value)
    stop: (e, ui) ->
        if $("canvas").hasClass('done')
            startProcess()
);


startLoading = ->
    $(".add").hide()
    $(".loading").show()

endLoading = ->
    $(".add").show()
    $(".loading").hide()


initworkers = ->
    for i in [0...NWORKERS]
        workers[i].addEventListener('message',(e) ->
            

            bytearray[e.data.id] = sliceBuffer(e.data.buffer, e.data.start, e.data.end)
            

            if bytearray.length == NWORKERS
                drawCanvas()

        , false);

drawCanvas = ->
    endLoading()
    $(".add").hide()

    tmp = []

    for i in [0...bytearray.length]
        tmp = tmp.concat(bytearray[i])


    imgdata = ctx.getImageData(0,0,canvas.width,canvas.height)
    imgdatalen = imgdata.data.length

    for i in [0...tmp.length]
        imgdata.data[i] = tmp[i]
    
    ctx.putImageData(imgdata, 0,0)
    $("canvas").addClass('done')

    end_time = new Date().getTime()
    total_time = end_time - start_time
    $("p.esecution").html('Total esecution time: '+total_time+'ms')
    


  
handledrag = ->
    dropbox = document.getElementById('dropbox')
    dropbox.addEventListener('dragenter', (e) ->
        #doNothing()
        $("#dropbox").css('opacity', 0.3)
    , false);
    dropbox.addEventListener('dragexit', (e) ->
        doNothing()        
    , false);
    dropbox.addEventListener('dragover', doNothing, false);
    dropbox.addEventListener('drop', drop, false)

doNothing = (e) ->
    e.stopPropagation()
    e.preventDefault()

drop = (e) ->
    e.stopPropagation()
    e.preventDefault()

    $("#dropbox").css('opacity', '1')

    startLoading()

    files = e.dataTransfer.files
    count = files.length

    if count > 0
        handleFiles(files)


handleFiles = (files) ->
    file = files[0]
    reader = new FileReader()
    reader.onloadend = endLoad
    reader.readAsDataURL(file)

endLoad = (e) ->
    image.src = e.target.result

    image.onload = ->
        if(image.width > 500 || image.height > 500)
            alert "Image width and height must be under 500px"
            endLoading()
            return false

        startProcess()

startProcess = ->
    startLoading()

    for i in [0...NWORKERS]
        workers[i] = new Worker('js/uok.js')

    initworkers()

    start_time = new Date().getTime()
    canvas.height = image.height
    canvas.width = image.width
    ctx.drawImage image, 0, 0 
    arraydata = ctx.getImageData(0, 0, image.width, image.height).data
    npixels = parseInt(arraydata.length / NWORKERS)

    for value, i in workers
        boh = i*npixels
        sendToWorker i, {
            id: i
            width:  image.width,
            height: image.height,
            effect: typeffect,
            start: boh,
            end: boh+npixels,
            rgba: sliceBuffer2(arraydata, (i*npixels)-boh, ((i*npixels)+npixels)+boh)
        }

sendToWorker = (id, data) ->
    workers[id].postMessage(data)

sliceBuffer2 = (array, start, end) ->
    final = []
    for i in [start...end]
        final[i] = array[i]
    final


sliceBuffer = (array, start, end) ->
    final = []
    for i in [start...end]
        final[i-start] = array[i]
    final

let canvas = document.querySelector('#mainCanvas')
let ctx = canvas.getContext('2d')
let divExpanded = false
let backgroundImageUrl = 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGFwZXIlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fA%3D%3D&w=1000&q=80'
let backgroundImageDataUri
let delta = 4
let svg = document.querySelector('#canvas')
svg.style.height = '110px'
svg.style.width = '950px'
let inputBox = document.querySelector('#text-input')
let submitBtn = document.querySelector('#draw-button')
let img = document.createElement('img');
// document.querySelector('body').append(canvas)

function urlContentToDataUri(url) {
    return fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise(callback => {
            let reader = new FileReader();
            reader.onload = function () { callback(this.result) };
            reader.readAsDataURL(blob);
        }));
}

const initBackgroundImageDataUri = async () => {
    backgroundImageDataUri = await urlContentToDataUri(backgroundImageUrl)
    return;
}

const setCanvasBackground = (src, i) => {
    return new Promise((resolve, reject) => {
        img.onload = () => {
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
            resolve()
        }
        img.onerror = reject
        img.src = src
    })
}

const initCanvas = async () => {
    canvas.height = 1200
    canvas.width = 880
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    await setCanvasBackground(backgroundImageDataUri)
    return;
}



let getLines = (text) => {
    let lines = text.split(/(.{1,50})(?:\s|$)/)
    let cleanedLines = lines.filter(e => e.length > 0)
    let fullLengthLines = cleanedLines.map(e => e + ' .'.repeat(Math.floor((50 - e.length) / 2)))
    return fullLengthLines
}

let downloadPageAndClearCanvas = async () => {
    let a = document.createElement('a')
    a.download = 'img.jpg'
    a.href = canvas.toDataURL()
    a.click()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    await setCanvasBackground(backgroundImageDataUri)
    return;
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const drawLineOnCanvas = (src, i) => {
    return new Promise((resolve, reject) => {
        img.onload = () => {
            // ctx.drawImage(img, 120, 50, 1600, 110, 0, 100 + 40 * i, 1080, 110);
            ctx.drawImage(img, -70, 40 * i);
            resolve()
        }
        img.onerror = reject
        img.src = src
    })
}

let writeLines = async (text) => {
    // canvas.style.display = "block"
    // console.log(canvas.style.display)
    await initBackgroundImageDataUri()
    await initCanvas()
    const lines = getLines(text)
    i = 0
    for (let line of lines) {
        inputBox.value = line
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mousedown', true, true);
        submitBtn.dispatchEvent(clickEvent);
        await wait(delta*1000)
        svg.innerHTML = svg.innerHTML.replaceAll('stroke: black', 'stroke: #1a0064') //#1a0064
        var xml = new XMLSerializer().serializeToString(svg);
        var svg64 = btoa(xml);
        var b64Start = 'data:image/svg+xml;base64,';
        var image64 = b64Start + svg64;
        await drawLineOnCanvas(image64, i)
        i++
        if (200 + 40 * i > canvas.height) {
            downloadPageAndClearCanvas()
            i = 0
        }
    }
    downloadPageAndClearCanvas()
}

function toogleTextArea() {
    let textInput = document.querySelector('#textInput')
    let bottomDiv = document.querySelector('.bottom')
    if (!divExpanded) {
        textInput.style.width = 'calc(100% - 2rem)'
        textInput.style.marginRight = '1rem'
        textInput.style.marginBottom = '0'
        bottomDiv.style.flexDirection = 'column'
        bottomDiv.style.alignItems = 'center'
        bottomDiv.style.height = 'calc(100% - 7rem)'
        divExpanded = true
    } else {
        textInput.style.width = '100%'
        textInput.style.marginRight = '0'
        textInput.style.marginBottom = '1rem'
        bottomDiv.style.alignItems = 'flex-start'
        bottomDiv.style.height = '4rem'
        bottomDiv.style.flexDirection = 'row'
        divExpanded = false
    }
}

function clickHandler() {
    if (divExpanded) toogleTextArea()
    delta = 16 - document.querySelector('#GPU-slider').value
    document.querySelector('#aiImg').style.display = 'none'
    let centerDiv = document.querySelector('.centerdiv')
    centerDiv.style.overflowY = 'auto'
    centerDiv.style.display = 'block'
    canvas.style.display = 'block'
    let text = document.querySelector('#textInput').value
    writeLines(text)
}
// text = ``

// writeLines(text)

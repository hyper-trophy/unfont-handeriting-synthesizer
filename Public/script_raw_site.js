let canvas = document.createElement('canvas')
let ctx = canvas.getContext('2d')

// let backgroundImageUrl =  'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGFwZXIlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fA%3D%3D&w=1000&q=80'
let backgroundImageUrl =  'https://drive.google.com/uc?export=view&id=14esMK8gGuhz4JUFQfjpyEYRgMXeXhRJr'
let backgroundImageDataUri

let images = [
    ["https://drive.google.com/uc?export=view&id=1nEye5N0b3SUyYpOHF7gXT3TMHYvANpHR", new Image()],
    ["https://drive.google.com/uc?export=view&id=1hUosOTOZL39YUhU0bYoKsOes2H1lUnJ4", new Image()],
    ["https://drive.google.com/uc?export=view&id=14esMK8gGuhz4JUFQfjpyEYRgMXeXhRJr", new Image()],
]

let svg = document.querySelector('#canvas')
svg.style.height = '110px'
svg.style.width = '1100px'
let inputBox = document.querySelector('#text-input')
let submitBtn = document.querySelector('#draw-button')
let img = document.createElement('img');
document.querySelector('body').append(canvas)

let initImages = async ()=>{
    await Promise.all(images.map(([url, img])=>
        new Promise(r=>{
            img.crossOrigin="anonymous"
            img.onload = _=>r()
            img.src = url
        })
    ))
    console.log('images loaded')
    return
}

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

let setCanvasBackgroundNew = () =>{
    let imgToDraw = images[Math.floor(Math.random() * images.length)][1]
    ctx.drawImage(imgToDraw, 0, 0, imgToDraw.width, imgToDraw.height, 0, 0, canvas.width, canvas.height);
}

const initCanvas = async () => {
    canvas.height = 1200
    canvas.width = 880
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // await setCanvasBackground(backgroundImageDataUri)
    setCanvasBackgroundNew()
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
    // await setCanvasBackground(backgroundImageDataUri)
    setCanvasBackgroundNew()
    return;
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const drawLineOnCanvas = (src, i) => {
    return new Promise((resolve, reject) => {
        img.onload = () => {
            ctx.drawImage(img, 120, 50, 1000, 110, 0, 100+40 * i, 880, 110);
            resolve()
        }
        img.onerror = reject
        img.src = src
    })
}

let writeLines = async (text) => {
    // await initBackgroundImageDataUri()
    await initImages()
    await initCanvas()
    const lines = getLines(text)
    i = 0
    for (let line of lines) {
        inputBox.value = line
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('mousedown', true, true);
        submitBtn.dispatchEvent(clickEvent);
        await wait(4000)
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

text = ``

writeLines(text)

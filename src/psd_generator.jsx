// just in case
preferences.rulerUnits = Units.PIXELS;  

var Mode = {
    DEBUG: 0,
    UI:1,
};

// UI:
var mode = Mode.UI;

// auto used for debug purposes (Bypass Input)
if (mode == Mode.DEBUG) {
    autoBase = File("/c/Users/dimit/Desktop/Menus 2017/Base 2017.psd");
    autoPage = File("/c/Users/dimit/Desktop/Menus 2017/page_7.txt");
}

if (mode == Mode.DEBUG)
    main();

var settings = new Window('dialog', 'Settings');  
settings.orientation = "column"
settings.alignChildren = "right"

var baseInput = settings.add("group")
baseInput.orientation = "row"
baseInput.add ("statictext", undefined, "Base PSD:");
var psdPath = baseInput.add ("edittext", undefined, "");
var psdButton = baseInput.add ("button", undefined, "...");
psdPath.minimumSize.width = 200
psdButton.maximumSize.width = 20

var menuInput = settings.add("group")
menuInput.orientation = "row"
menuInput.add ("statictext", undefined, "Menu:");
var menuPath = menuInput.add ("edittext", undefined, "");
var menuButton = menuInput.add ("button", undefined, "...");
menuPath.minimumSize.width = 200
menuButton.maximumSize.width = 20

var control = settings.add("group")
control.orientation = "row"
control.add ("button", undefined, "OK");
control.add ("button", undefined, "Cancel");

// Input Logic
var psdFile = null
var menuFiles = null

psdButton.addEventListener ("click", function () {
    psdFile = File.openDialog("Choose .psd base file", "*.psd")
    if (psdFile !== null)
        psdPath.text = psdFile
    })

menuButton.onClick = function () {
    menuFiles = openDialog("Choose .psd base file", "*.txt")
    if (menuFiles !== null)
        menuPath.text = menuFiles
    }

// Page Building
var rowLayerSet = null
var rowSmallLayerSet = null
var titleLayerSet = null
var firstLayer = null

function Row(nameBG, nameEN, nameGR, weigth, price) {
    this.nameBG = nameBG 
    this.nameEN = nameEN
    this.nameGR = nameGR
    this.weigth = weigth + " гр/gr"
    if (weigth[weigth.length - 1] == '.') {
        this.weigth = weigth
        }
    else if (weigth == "") {
        this.weigth = ""
        }
    this.price = price + " лв/lv"
    
    // Use of layes have strange positioning`
    this.shiftX = 0
    this.overlap = 0
    
    this.smallRows = false
    this.bold = false
    this.row = null
    this.form = null
    this.textBG = null
    this.textEN = null
    this.textGR = null
    var _this = this
    
    this.build = function() {
        if (_this.row == null) {
            if (_this.smallRows)
                _this.row = rowSmallLayerSet.duplicate(firstLayer, ElementPlacement.PLACEAFTER)
            else {
                _this.row = rowLayerSet.duplicate(firstLayer, ElementPlacement.PLACEAFTER)
                }
            _this.row.visible = false
            if (_this.nameEN)
                _this.row.name = _this.nameEN
            else if (_this.nameBG)
                _this.row.name = _this.nameBG
            else if (_this.nameGR)
                _this.row.name = _this.nameGR
            removeCopyFromName(_this.row.layers)
            _this.form = _this.row.layers.getByName("Row Form")
            _this.textBG =  _this.row.layers.getByName("Name BG")
            _this.textEN =  _this.row.layers.getByName("Name EN")
            _this.textGR =  _this.row.layers.getByName("Name GR")
            
            _this.textBG.textItem.contents = _this.nameBG
            _this.textBG.textItem.fauxBold = _this.bold
            _this.textEN.textItem.contents = _this.nameEN
            _this.textEN.textItem.fauxBold = _this.bold
            _this.textGR.textItem.contents = _this.nameGR
            _this.textGR.textItem.fauxBold = _this.bold
            _this.row.layers.getByName("Weigth").textItem.contents = _this.weigth
            _this.setPrice()
            }
        }
    this.afterPos = function() {
        _this.form.visible = false
        // useful for adding clipping background
        }
    this.setPrice = function() {
        var price = _this.row.layers.getByName("Price")
        price.textItem.contents = _this.price
        
        // Position in the middle of tag (Horizontally)
        if (!_this.smallRows) {
            var tagForm = _this.row.layers.getByName("Tag form")
            var tagMiddleX = (tagForm.bounds[2].value + tagForm.bounds[0].value) / 2;
            var priceMiddleX = (price.bounds[2].value + price.bounds[0].value) / 2;
            price.unlink()
            price.translate(-(priceMiddleX - tagMiddleX), 0)
            price.link(_this.row)
            }
        }
    }

function Title(nameBG, nameEN, nameGR) {
    // TODO: keep this in an array, incase of new languages/for less code!
    this.nameBG = nameBG 
    this.nameEN = nameEN
    this.nameGR = nameGR
    
    // Where text sould start stop
    this.paddingX= 0
    
    // Use of layes have strange positioning
    this.shiftX = 0
    this.overlap = 0
    
    this.title = null
    this.form = null
    var _this = this
    
    this.build = function() {
        if (_this.title == null) {
            _this.title = titleLayerSet.duplicate(firstLayer, ElementPlacement.PLACEAFTER)
            _this.title.visible = false
            _this.title.name = _this.nameEN
            removeCopyFromName(_this.title.layers)
            _this.form = _this.title.layers.getByName("Title form");
            _this.setTitle("Title BG", _this.nameBG)
            _this.setTitle("Title EN", _this.nameEN)            
            _this.setTitle("Title GR", _this.nameGR)
            }
        }
    this.afterPos = function() {
        // useful for adding clipping background
        }
    this.setTitle = function(title, name) {
        // Splits line in two if needed
        if (name.length > 14) {
            var lines = name.match(/^(.{0,14}) (.*)$/)
            var firstLine = _this.title.layers.getByName(title)
            firstLine.unlink()
            var secondLine = firstLine.duplicate(firstLine, ElementPlacement.PLACEAFTER)
            secondLine.unlink()
            firstLine.textItem.contents = lines[1]
            secondLine.textItem.contents = lines[2]
            // TODO : place center left/right
            firstLine.translate(0, -17)
            secondLine.translate(((firstLine.bounds[0].value + firstLine.bounds[2].value) / 2 - secondLine.bounds[0].value), 41)
            firstLine.link(_this.title)
            secondLine.link(_this.title)
            }
        else {
            _this.title.layers.getByName(title).textItem.contents = name
            }
        }
    }

function Section(title, rows) {
    this.title = title
    this.rows = rows
    }

function Page(sections) {
    this.sections = sections
    var _this = this
    
    this.build = function() {
        for (var i = 0; i < _this.sections.length; i++) {
            _this.sections[i].title.build()
            positionElem (_this.sections[i].title)
            _this.sections[i].title.afterPos()
            for (var j = 0; j < _this.sections[i].rows.length; j++) {
                _this.sections[i].rows[j].build()
                positionElem (_this.sections[i].rows[j])
                _this.sections[i].rows[j].afterPos()
                if (j + 1 == _this.sections[i].rows.length) {
                     _this.sections[i].rows[j].row.layers.getByName("Delimiter").visible = false
                    }
                }
            }
        }
    }

var psdFileRef = null

function positionElem(elem) {
    if (elem instanceof Row) {
        moveSetTo (elem.row, elem.form, elem.form.bounds[0].value, nextElemPosition)
        }
    else if (elem instanceof Title) {
        moveSetTo (elem.title, elem.form, elem.form.bounds[0].value, nextElemPosition)
        }
    
    if (elem instanceof Row && elem.smallRows) {
        nextElemPosition += 77
        return
        }
    nextElemPosition += 157 // used exact mesure in this menu review
    // sometimes you need to move accourding to element type! + offsets and overlaps
    }

function moveSetTo(set, layer, x, y) {
    var positionX = x - layer.bounds[0].value
    var positionY = y - layer.bounds[1].value
    set.translate(positionX, positionY);
    }

function addClippingBackground(mask, background) {
    var newBG = background.duplicate(mask, ElementPlacement.PLACEBEFORE)
    newBG.name = newBG.name.replace(/\b *copy ?\d*$/, "")
    newBG.grouped = true
    }

function removeCopyFromName(layerSet) {
    var layers = layerSet
    for (var i = 0; i < layers.length; i++) {
        layers[i].name = layers[i].name.replace(/\b *copy *\d*$/, "")
        if (layers[i].typename != "ArtLayer")
            removeCopyFromName(layers[i]) 
        }
    }

function removeLVFromPrice(price) {
    return price.replace(/ *лв\.? *\d*$/, '')
    }

function savePage(name) {
    var pageFile = new File(app.activeDocument.path + "/" + name + ".jpg")
    
    var options = new ExportOptionsSaveForWeb()
    options.format = SaveDocumentType.JPEG
    options.optimized = false
    options.quality = 100
    
    app.activeDocument.exportDocument(pageFile, ExportType.SAVEFORWEB, options)
    }

function extractLayers() {
    rowLayerSet = activeDocument.layers.getByName("Row")
    rowLayerSet.visible = false
    rowSmallLayerSet = activeDocument.layers.getByName("Row Small")
    rowSmallLayerSet.visible = false
    titleLayerSet = activeDocument.layers.getByName("Title")  
    titleLayerSet.visible = false
    
    var background = activeDocument.layers.getByName("Background")  
    // find any background textures if you want them to be dynamic
    
    firstLayer = activeDocument.layers[1]
    }

function trim(x) {
    return x.replace(/^\s+|\s+$/g,'')
}

/*
    format:
    delimiter - #
    
    Info line:
    I - tag,
    pieces 1 - small lines - "S", Large lines - "L"
    pieces 2 - bold - "B", not bold - "N"
    
    Title line:
    T - tag,
    pieces 1 - BG text
    pieces 2 - EN text
    pieces 3 - GR text
    
    Row line:
    R -  tag,
    pieces 1 - BG text
    pieces 2 - EN text
    pieces 3 - GR text
    pieces 4 - weight
    pieces 5 - price
 */
function parse(menuFile) {
    if (!menuFile.open('r'))
        return null
        
    var smallRows = false    
    var bold = false 
    var page = new Page([])
    var section = -1

    while (!menuFile.eof) {
        var line = menuFile.readln()
        var pieces = line.split('#')
        
        switch (pieces[0]) {
            case "I":
                smallRows = trim(pieces[1]) == "S"
               // if (pieces[2] != undefined)
                  //  bold = trim(pieces[2]) == "B"
                break;
            case "T": 
                var title = new Title(
                    trim(pieces[1]),
                    trim(pieces[2]),
                    trim(pieces[3])
                    )
                page.sections.push(new Section(title, []))
                section++
                break;
            case "R":
                var row = new Row(
                    trim(pieces[1]),
                    trim(pieces[2]),
                    trim(pieces[3]),
                    trim(pieces[4]),
                    removeLVFromPrice(trim(pieces[5]))
                    )
                row.smallRows = smallRows
                row.bold = bold
                page.sections[section].rows.push(row)
                break;
            }
       }
   
    menuFile.close()
    return page
    }

function buildPages() {
    if (mode == Mode.DEBUG) {
        var page = parse(autoPage)
        
        nextElemPosition = 19 // Top page padding
        psdFileRef = open(autoBase)
        
        app.activeDocument = psdFileRef
        extractLayers ()
        page.build()
        //savePage (page.sections[0].title.nameEN)
        
        //psdFileRef.close(SaveOptions.DONOTSAVECHANGES)  
    }
    else {
        for (var i = 0; i < menuFiles.length; i++) {
            var page = parse(menuFiles[i])
            
            nextElemPosition = 19
            psdFileRef = open(psdFile)
            
            app.activeDocument = psdFileRef
            extractLayers ()
            page.build()
            //savePage (page.sections[0].title.nameEN)
            
            //psdFileRef.close(SaveOptions.DONOTSAVECHANGES)
            }
        }
    }

// Main:
function main() {
    if (mode == Mode.UI) {
        if (settings.show () == 2 ||
        psdFile == null ||
        menuFiles == null)
            return
    }
    buildPages ()
}

// So that all UI elements have initialized
if (mode == Mode.UI) 
    main();
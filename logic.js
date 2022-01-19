//
// created by poeblo in 2022
//

//git https://github.com/parallax/jsPDF
import { templates } from "./templates.js";
import { jsPDF } from "./_site/jsPDF/src/jspdf.js";


//=========================================================================================
//=========================================================================================
//=========================================================================================
//=========================================================================================
//=========================================================================================


const actionEventsByType = {
    "input": "keyup",
    "checkbox": "click",
    "combobox": "click",
}

const htmlObjectCreators = { 
    "input" : function(key, values){
        const input = document.createElement("input")
        input.id = key
        input.className = "smoove"
        return input
    },
    "combobox" : function(key, values) {
        const select = document.createElement("select")
        select.id = key
        select.className = "smoove"

        const option = document.createElement("option")
        option.value = ""
        option.innerHTML = ""
        select.appendChild(option)

        for(const v of values){
            const option = document.createElement("option")
            option.innerHTML = v.label
            if(v.value){
                option.value = v.value
            } else {
                option.value = v.label
            }
            select.appendChild(option)
        }
        return select
    },
    "checkbox" : function(key, values) {
        const sw = document.createElement("label")
        sw.className = "switch"
        sw.style = "vertical-align: 13px;"

        const input = document.createElement("input")
        input.type = "checkbox"
        input.id = key

        const sp = document.createElement("span")
        sp.className = "slider round"

        sw.appendChild(input)
        sw.appendChild(sp)
        return sw
    } 
}

let templateValue = ""
let currentValues = {}
let currentTemplateName = ""

document.addEventListener('DOMContentLoaded', function(){
    loadDoctypesPicker()
    const convertButton = document.getElementById("convert")
    if(convertButton){
        convertButton.addEventListener('click', function() {
            console.log("Convert doc to pdf")
            const doc = new jsPDF();
            console.log(doc.getFontList() + "yes");
            doc.text(renderTemplate(), 10, 10);
            doc.save(templates[currentTemplateName].label + ".pdf");
            var base64URL = doc.output('datauri');
            var win = window.open(base64URL)
            win.document.write('<iframe src="' + base64URL  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        })
    }
})


function loadDoctypesPicker(){
    const select = document.getElementById("doctype_picker")
    for(const key of Object.keys(templates)){
        const option = document.createElement("option")
        option.value = key
        option.innerHTML = templates[key].label
        select.appendChild(option)
    }
    select.addEventListener('click', function() {
        closeTemplate()
        if(select.value){
            loadTemplate(select.value)
            currentTemplateName = select.value
        }
    }) 
}

function closeTemplate(){
    templateValue = ""
    currentValues = {}
    currentTemplateName = ""
    isPanelsHidden(true)
    clearActions()
}

function clearActions() {
    const actionsHolder = document.getElementById("actions_holder")
    if(actionsHolder){
        console.log("Clear actions")
        actionsHolder.innerHTML = ''
    }
}

function loadTemplate(templateName){
    console.log("Opening template " + templateName)

    templateValue = templates[templateName].template
    addActions(templates[templateName])
    renderTemplate()

    console.log("Template loaded")

    isPanelsHidden(false)
}

function isPanelsHidden(isVisible){
    const rh = document.getElementsByClassName("right_holder")
    for(const p of rh){
        p.hidden = isVisible
    }
    const lh = document.getElementsByClassName("left_holder")
    for(const p of lh){
        p.hidden = isVisible
    }}

function addActions(template) {
    const actionsHolder = document.getElementById("actions_holder")
    for(const action of template.actions){
        const actionObject = getActionObject(action)
        if(actionObject){
            actionsHolder.append(actionObject)
            setActionEventListner(action)
            currentValues[action.key] = ""
        }
    }
}

function getActionObject(action){
    const actionTemplate = htmlObjectCreators[action.type]
    if (actionTemplate){
        const parentdiv = document.createElement("div")
        parentdiv.className = "padding_base"
        const div = document.createElement('div')
        div.className = "action padding_base"

        const label = document.createElement("p")
        label.innerHTML = action.label

        div.appendChild(label)
        div.appendChild(actionTemplate(action.key, action.values))
        parentdiv.appendChild(div)
        return parentdiv
    } else {
        console.error("Action template for type " + action.type + "is missing")
    }
}

function setActionEventListner(action){
    const actionObject = document.getElementById(action.key)
    if(actionObject){
        const event = actionEventsByType[action.type]
        actionObject.addEventListener(event, function() {
            const actionObject = document.getElementById(action.key)
            if(actionObject){
                if(currentValues[action.key] != undefined){
                    currentValues[action.key] = actionObject.type === "checkbox" ? actionObject.checked : actionObject.value
                    renderTemplate(action.key)
                } else {
                    console.log("Can't find value in currentValue by key " + action.key)
                }
            }
        }, false)
        
    } else {
        console.error("Can't find element with id " + action.key)
    }
}

function renderTemplate() {
    const templateHolder = document.getElementById("template_holder") // надо бы вынести по нормальному
    if(templateHolder){
        let newValue = templateValue
        for(const key of Object.keys(currentValues)){
            newValue = newValue.replaceAll("${" + key + "}", currentValues[key])
        }
        templateHolder.innerHTML = newValue
        return String(newValue)
    } else {
        console.error("Template holder not found")
    }
}

document.getElementById('hider').onclick = function() {
    document.getElementById('hider').hidden = true;
  document.getElementById('freewall').hidden = true;
    }

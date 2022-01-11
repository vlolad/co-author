//
// created by poeblo in 2022
//

import { jsPDF } from "jspdf";
//git clone https://github.com/parallax/jsPDF
import { templates } from "templates.js"

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
const doc = new jsPDF();

document.addEventListener('DOMContentLoaded', function(){
    loadDoctypesPicker()
    convertButton = document.getElementById("convert")
    if(convertButton){
        convertButton.addEventListener(function() {
            console.log("Convert doc to pdf")
            doc.text(renderTemplate(), 10, 10);
            doc.save(templates[templateValue].label + ".pdf");
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
        }
    }) 
}

function closeTemplate(){
    templateValue = ""
    currentValues = {}
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
        return newValue
    } else {
        console.error("Template holder not found")
    }
}
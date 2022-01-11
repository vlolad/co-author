//todo: грузить из файла
const templates = {
    "test_template": {
        "label": "TEST DOCUMEN", //отображается в списочной форме дока
        "template": "lalal ${inputtest} lala ${combotest}",
        "actions":[
            {
                "key":"inputtest", //должен быть уникальным
                "label":"label input", //Название поля
                "type": "input", //Тип поля (input, combobox)
                "values": []
            },
            {
                "key":"combotest",
                "label":"combobox",
                "type": "combobox",
                "values": [ //значения в списке
                    {
                        label: "label1", //отображается в списке
                        value: "value1" //отображается в шаблоне
                    },
                    {
                        label: "label2",
                        value: "value2"
                    }, {
                        label: "label3",
                        value: "value3"
                    },
                ]
            }
        ]
    }
}
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
        return input
    },
    "combobox" : function(key, values) {
        const select = document.createElement("select")
        select.id = key

        for(const v of values){
            const option = document.createElement("option")
            option.value = v.value
            option.innerHTML = v.label
            select.appendChild(option)
        }
        return select
    },
    "checkbox" : function(key, values) {
        //нужн реализация создания объекта
    }
}

let templateValue = ""
let currentValues = {}

document.addEventListener('DOMContentLoaded', function(){ //проверка на загрузку страницы
    loadDoctypesPicker()
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
        if(select.value){
            loadTemplate(select.value)
        } else{
            closeTemplate()
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
    addActions(templates.test_template)
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
        const div = document.createElement('div')
        div.className = "action"

        const label = document.createElement("p")
        label.innerHTML = action.label

        div.appendChild(label)
        div.appendChild(actionTemplate(action.key, action.values))
        return div
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
    } else {
        console.error("Template holder not found")
    }
}
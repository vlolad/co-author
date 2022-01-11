//todo: грузить из файла
const templates = {
    "test_template": {
        "template":"lalal ${checktest} lalal ${inputtest} lala ${combotest}",
        "actions":[
            {
                "key":"inputtest",
                "label":"imput",
                "type": "input",
                "values": []
            },
            {
                "key":"combotest",
                "label":"combobox",
                "type": "combobox",
                "values": ["123", "1434"]
            }
        ]
    }
}

const actionEventsByType = {
    "input": "keyup",
    "checkbox": "click",
    "combobox": "click",
}

const actionsTemplates = { //todo доделать поля ввода
    "input" :       "<p>${label}</p><input id=\"${key}\">",
    "combobox" :    "<p>${label}</p><select id=\"${key}\"><option value=\"1\">test1</option>" + 
                                        "<option value=\"2\" selected=\"selected\">test2</option>" + 
                                        "<option value=\"3\">test3</option>" + 
                                    "</select>",
    "checkbox" :    "<p>${label}</p><input type=\"checkbox\" id=\"${key}\">"
}

let templateValue = ""
let currentValues = {}

document.addEventListener('DOMContentLoaded', function(){ //проверка на загрузку страницы
    templateValue = templates.test_template.template
    console.log(templateValue)
    addActions(templates.test_template)
    renderTemplate()
})


function addActions(template) {
    for(const action of template.actions){
        const actionObject = getActionObject(action)
        if(actionObject){
            document.getElementById("actions_holder").append(actionObject)
            setActionEventListner(action)
            currentValues[action.key] = ""
        }
    }
}

function getActionObject(action){
    let actionTemplate = actionsTemplates[action.type]
    if (actionTemplate){
        actionTemplate = actionTemplate.replaceAll("${label}", action.label)
        actionTemplate = actionTemplate.replaceAll("${key}", action.key)

        let div = document.createElement('div')
        div.className = "action"
        div.innerHTML = actionTemplate
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
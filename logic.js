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
                "values": ["value1", "value2", "value3"]
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
    "input" : function(key, values){
        const input = document.createElement("input")
        input.id = key
        return input
    },
    "combobox" :    function(key, values) {
        const select = document.createElement("select")
        select.id = key

        for(const v of values){
            const option = document.createElement("option")
            option.value = v
            option.innerHTML = v
            select.appendChild(option)
        }
        return select
    },
    // "<p>${label}</p><select id=\"${key}\"><option value=\"1\">test1</option>" + 
    //                                     "<option value=\"2\" selected=\"selected\">test2</option>" + 
    //                                     "<option value=\"3\">test3</option>" + 
    //                                 "</select>",
    "checkbox" :       function(key, values) {
    },
    // "<p>${label}</p><input type=\"checkbox\" id=\"${key}\">",
    "test": function(){
        return 1
    }
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
    const actionTemplate = actionsTemplates[action.type]
    if (actionTemplate){
        const div = document.createElement('div')
        div.className = "action"

        const label = document.createElement("p")
        label.innerHTML = action.label

        div.appendChild(label)
        div.appendChild(actionTemplate(action.key, action.values))
        console.log(div)
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
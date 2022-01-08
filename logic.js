//todo: грузить из файла
const templates = {
    "test_template": {
        "template":"lalal ${checktest} lalal ${fio} lala ${combotest} ",
        "actions":[
            {
                "key":"inputtest",
                "label":"imput",
                "type": "input"
            },
            {
                "key":"combotest",
                "label":"combobox",
                "type": "combobox",
                "values": ["123", "1434"]
            },
            {
                "key":"checktest",
                "label":"checkbox",
                "type": "checkbox"
            }
        ]
    }
}

const actionsTemplates = { //todo доделать поля ввода
    "input" :       "<p>${label}</p><input id=${key}>",
    "combobox" :    "<p>${label}</p><input id=${key}>", //прокидывать значения из values
    "checkbox" :    "<p>${label}</p><input type=\"checkbox\" id=\"${key}\" value=\"newsletter\">"
}

document.addEventListener('DOMContentLoaded', function(){ //проверка на загрузку страницы
    console.log(templates.test_template.template)
    var templateFiled = document.getElementById("document_template")
    templateFiled.innerHTML = String(templates.test_template.template)
    addActions(templates.test_template)
})


function addActions(template) {
    for(let action of template.actions){
        const actionObject = getActionObject(action)
        if(actionObject){
            document.getElementById("actions").append(actionObject)
            setActionEventListner(action)
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
    actionObject = document.getElementById(action.key)
    if(actionObject){
        if(action.type === "input"){
            actionObject.addEventListener('keypress', function() {
                //todo обработка нажатия и подстановка в текст с помощью replaceKeyInTemplate
            }, false)
        } else if(action.type === "checkbox"){
            actionObject.addEventListener('click', function() {
                //todo обработка нажатия и подстановка в текст с помощью replaceKeyInTemplate
            }, false)
        } else if(action.type === "combobox"){
            actionObject.addEventListener('click', function() {
                //todo обработка нажатия и подстановка в текст с помощью replaceKeyInTemplate
                //каким то образом надо обрать значение из values
            }, false)
        }
    } else {
        console.error("Can't find element with id " + action.key)
    }
}

function replaceKeyInTemplate(key, value){
    //todo брать из document текущее шаблона
    //и заменять в нем ключи key (добавить к нему ${}) на значение value
}
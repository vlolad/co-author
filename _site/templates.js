export const templates = {
    "test_template": {
        "label": "TEST DOCUMEN", //отображается в списочной форме дока
        "template": "${checkboxtest} lalal ${inputtest} lala ${combotest} \n lalal ${inputtest2} lala ${combotest2}",
        "actions":[
            {
                "key":"checkboxtest",
                "label":"poggers", //Название поля
                "type": "checkbox", //Тип поля (input, combobox)
                "values": []
            },
            {
                "key":"inputtest",
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
            },
            {
                "key":"inputtest2",
                "label":"label input", //Название поля
                "type": "input", //Тип поля (input, combobox)
                "values": []
            },
            {
                "key":"combotest2",
                "label":"combobox",
                "type": "combobox",
                "values": [ //значения в списке
                    {
                        label: "label1" //отображается в списке
                    },
                    {
                        label: "label2"
                    }, {
                        label: "label3"
                    },
                ]
            }
        ]
    },
    "dogovor_PO": {
        "label": "Договор на совместную разработку ПО",
        "template": "<h1>Соглашение соавторов на совместную разработку программы для ЭВМ</h1><br><br> <div style=\"float: right\"><b>«${date_n}» ${month} год г.</b></div> <b>г. Москва</b><br><br><br> а",
        "actions":[
            {
                "key":"date_n",
                "label":"Текущее число", //Название поля
                "type": "input", //Тип поля (input, combobox)
                "values": []
            },
            {
                "key":"month",
                "label":"Текущая дата",
                "type": "combobox_old",
                "values": ["январь", "февраль", "март", "апрель"]
            }
        ]
    }
}


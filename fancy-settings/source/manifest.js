// SAMPLE
this.manifest = {
    "name": "My Extension",
    "icon": "icon.png",
    "settings": [
        {
             "group": i18n.get("view"),
             "name": "enableIMDb",
             "type": "checkbox",
             "label": i18n.get("enableIMDb")
        },
        {
             "group": i18n.get("view"),
             "name": "enableRotten",
             "type": "checkbox",
             "label": i18n.get("enableRotten")
        }        
    ]
};
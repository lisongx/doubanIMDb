this.manifest = {
    "name": "doubanIMDb",
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
        },
        {
            "group": i18n.get("view"),
            "name": "enableWikipedia",
            "type": "checkbox",
            "label": i18n.get("enableWikipedia")
       }
    ]
};

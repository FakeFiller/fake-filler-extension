###Form Filler

This extension allows you to fill all form inputs (textboxes, textareas, radio buttons, dropdowns, etc.) with dummy data. It is a must for developers who work with forms as it avoids the need for manually entering values in fields.

https://chrome.google.com/webstore/detail/bnjjngeaknajbdcgpfkgnonkmififhfo

https://addons.mozilla.org/en-US/firefox/addon/form-filler-devtool/

##### Default shortcut
Use ***CTRL+SHIFT+F*** on Windows and ***CMD+SHIFT+F*** on Mac to fire the extension. This can be changed from the Chrome Extensions -> Keyboard Shortcuts.


## mul-language support
> this plugin allow you to define 'your language' in 'language.js'. so that the user can easily use.
### define
It's simple! There are two way to define it.

first: as a json object
```
 general:{
        "zh_cn": "常用设置",
        "es_es": "General"
    },
```

second: as a array.
simple but the sequence must same as the field 'locales'
```
locales:["zh_cn","es_es"],
general:["常用设置","General"]
```
yes! the effect of locales is define the order of language. so they are must be consistent.

finally: define the default language in 'language.js' as follow
```
defaultLocale:"es_es"
```

### use it

used:
```
<div>General</div>
```

now:
```
import language from "language.js"
<div>{language("general")}</div>
```
or
```
import language from "language.js"
<div>{language("general","es_es")}</div>
```




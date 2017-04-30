
/**
 * there are tow way to define the language object.
 * one is use a json like --  key : {"zh_cn":"中文","es_es":"English"}
 * another one use a array like -- ["中文","English"]
 *
 * tips: when you choice the second way to define the language,
 * the sequence of the field is limited. It should match the 'locales' array.
 * also, you can define the default language in the field "defaultLocale"
 * */
const language = {
    defaultLocale:"es_es",
    locales:["zh_cn","es_es"],
    appStore:{
        "zh_cn" : "应用商店",
        "es_es" : "app Store"
    },
    general:{
        "zh_cn": "常用设置",
        "es_es": "General"
    },
    custom:{
        "zh_cn": "自定义设置",
        "es_es": "Custom Fields"
    },
    shortcuts:{
        "zh_cn": "快捷键设置",
        "es_es": " Keyboard Shortcuts"
    },
    backup:
        ["备份/恢复设置","Backup && Restore"],
    restore:
        ["重置初始设置","Restore Factory Settings"],
    reset:
        ["重置","Reset"],
    saveSetting:
        ["保存设置","Saved settings."],
    changelog:
        ["更新日志","Changelog"],
    source:
        ["源码","Source"],
    emailSetting:
        ["邮箱设置","email Setting"],
    testMe:
        ["测试一下","Test Me"],
    passwordSetting:
        ["密码设置","Password Settings"],
    fieldOptions:
        ["匹配规则/字段选择","Field Options"],
    ignoreMatch:
        ["忽略字段匹配","Ignore Fields Match"],
    note:
        ["提醒","Note"],
    generalSetting:
        ["常用设置","General Settings"],
    trigger:
        ["触发事件","Trigger Events"],
    contextMenu:
        ["右击菜单","Context Menu"],
    username:
        ["用户名","Username"],
    lastUsername:
        ["使用上一次生成的用户名","Use a previously generated username"],
    lastName:
        ["使用先前生成的第一个和最后一个名称","Use a previously generated first and last name"],
    randomName:
        ["使用随机生成的用户名","Use a random name"],
    listName:
        ["从以下列表中选择（多个选项之间以英文逗号分隔）。","Select from the list below (List each name with a comma.):"],
    regexUsername:
        ["使用正则生成用户名","Use this regular expression:"],
    placeholderRegex:
        ["请输入一个正则表达式","A regular expression."],
    randomHostName:
        ["使用随机域名后缀","Use a randomly generated host name"],
    hostName:
        ["域名","Host name"],
    randomHost:
        ["使用随机生成的域名","Use a randomly generated host name"],
    password:
        ["密码","Password"],
    randomPassword:
        ["随机生成一个8位长度的密码","Generate a random 8 character password (is logged in the console)"],
    useThis:
        ["使用这个：","Use this:"],
    ignoreFile:
        ["input 标签中存在 <i>type=&quot;hidden&quot;</i>的将会被忽略","Inputs with <i>type=&quot;hidden&quot;</i> are always ignored."],
    confirmation:
        ["确认字段匹配","Confirmation Fields Match"],
    ignoreHidden:
        ["忽略隐藏的输入区域","Ignore all hidden/invisible fields"],
    ignoreExist:
        ["忽略已经有值的输入区域","Ignore fields that already have content"],
    matchTip:
        ["以上输入字段将会用于匹配输入区域"," Data entered in a preceding input field will be used for inputs matching any of these values."],
    agreeFieldMatch:
        ["同意条款字段匹配","Agree to Terms Fields Match"],
    agreeFieldMatchTip:
        ["checkbox 匹配到以上值时将会被选择。","Checkboxes matching any of these values will always be checked."],
    matchFieldUse:
        ["匹配输入框依据","Match Fields Using"],
    labelForInput:
        ["通过 Label 值获取 input 标签","Label text for the input tag"],
    IDForInput:
        ["通过 ID 号匹配 input","ID attribute of the input tag"],
    nameForInput:
        ["通过 Name 属性匹配","Name attribute of the input tag"],
    classForInput:
        ["通过 Class 属性匹配","Class class attribute of the input tag"],
    pleaseRefer:
        ["请点击","Please refer to the"],
    customSection:
        ["自定义模块","custom fields section",""],
    learnHowInputMatch:
        ["去学习 input 标签是如何被赋值的","to learn how input elements are matched."],
    atLeastOne:
        ["你至少选择一个选项","You must select at least one option."],
    triggerLabel:
        ["input 区域 click/change 事件触发器","Trigger click/change events on input fields"],
    clickMenu:
        ["添加右击菜单快速执行自动填充","Add items to the right click menu"]
};

function parseLanguage(key,locale) {
    if(!key){
        return "no key"
    }
    if(!language[key]){
        return "no tag"
    }
    locale = locale ? locale : language.defaultLocale;
    /**
     * first way to get value: by the json object
     */
    if(language[key][locale]){
        return language[key][locale];
    }
    /**
     *second way to get the value : by the array object
     */
    else if(language[key].length > 0){
        let index = 0;
        for(let i = 0; i < language.locales.length; i++){
            if(language.locales[i]==locale){
                index = i;
                break;
            }
        }
        return language[key][index] ? language[key][index] : 'no tag in array'
    }
    else return "no tag of key";
}

export default parseLanguage;
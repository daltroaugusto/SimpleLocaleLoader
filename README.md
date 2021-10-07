# SimpleLocaleLoader

A really minimal and simple ES6 module that uses eval() for basic and flexible localization or interpolation.

# Usage example

As this one is projected for really tiny, small projects (despite being really flexible, as opts to use eval), its usage is really simple. Examples below pressupose to be executed inside `<script type="module">` blocks or with your preferred bundler.
```html
<!-- index.html -->
<head>
    <title string="index.title"></title>
    <script type="module" src="index.script.mjs"></script>
</head>
<body>
    <span string="index.theText[0]"></span>
    <span string="index.theText[1]"></span>
</body>
```

```json
/* locales/en.json */
{
    "index": {
        "index": "title of this page",
        "theText": ["some text here", "more text here"]
    }
}
```

```json
/* locales/pt.json */
{
    "index": {
        "title": "título desta página",
        "theText": ["algum texto aqui", "mais texto aqui"]
    }
}
```

```json
/* locales/index.json */
[
    "pt", "en"
]
```
In the file above, you put all your available locale codes inside this one array.

```javascript
// index.script.mjs
import LocaleLoader from 'assets/localeloader.js';
const locales = new LocaleLoader('locales/index.json');

locales.initialize()
.then(() => {
    doSomething();
});
```
This one is a simple example of usage. `initialize` method, by default, will load the appropriated locale strings and fulfill document elements containing `string` or `placeholderstring` attributes with valid string keys. But let's say we don't want the default `en` fallbackLocale, or even to inject strings at startup...

```javascript
locales.initialize()
.then(() => {
    // do nothing
}, false, 'zh');
```

As we are explictly using `eval()` here, possibilities are broad. Risks too, so: **be aware, never EVER involve any user-inputted data within string tags**. Now let's check out more examples and features of this tiny lib...

## Placeholder injection
```html
<!-- index.html:some-line -->
<input type="password" placeholderstring="index.inputPasswd" />
```

## *localesloaded* custom event
This event happens after Object.localizeDocument() is completed, i.e. all possible strings are checked and fulfilled.
```javascript
/* index.script.mjs */
window.addEventListener('localesloaded', () => {
    const $ = (el) => document.querySelector(el);
    $('.loadingWrapper').className += ' loaded';
});
```

## Get a string
Let's say you just need to get a single string?
```javascript
const thisString = locales.getString('index.alert');
window.alert(thisString);
```

Important to notice that this one will work **only** if your locale strings were already loaded by your SimpleLocaleLoader object, i.e. on (after) `window.localesloaded` event or in a moment you're sure `initialize` promise is fulfilled.

### Get an array or object
By the same logic, you can get an entire array or object from your json's locale file.
```javascript
for(const item of locales.getString('index')) {
    doSomething(item);
}
```

# License

```

  Copyright 2021 Daltro A. Campanher de Souza

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
```

# preordain-md

This is preordain-md, an expansion of [GFM](https://help.github.com/articles/github-flavored-markdown/)

We support the entirety of github flavored markdown along with the ability to build custom elements. Custom elements are easy, just treat them as self-closing tags rather than what they normally would be; the runtime processor will take care of it all!

Here's an example:

`<mtg-set-symbol set="Battle for Zendikar"/>`

<mtg-set-symbol set="Battle for Zendikar"/>

## Why bother with a runtime processor?

DOMParser doesn't like custom elements; I like custom elements.

Writing a runtime processor is also great for stress relief after exams.

### Solution

This transform has to happen in the markdown element and CANNOT happen before due to the DOMParser not playing along.

We treat the markdown output as an intermediate representation; the self-closing custom element tags are dirty and need to be converted.

### Considerations
This allows arbitrary custom element injection inside markdown. In theory, even 

`<preordain-md work="notThisFileTitle"/>`

would allow recursive dependency fetching. That's probably a hole we don't want to go down.

We can layout custom elements however we want using the layout classes. Markup will not parse inside the html though.

Prices don't work as they require nested elements to display.

If you want to watch things melt, try putting this in the markdown

`<preordain-md work="thisFileTitle"/>`

### Demo

Fancy typography:

--- emdash = `---`!

--- "fancy quotes"

<div class="horizontal layout">

<mtg-card name="Preordain"/>

<mtg-set-symbol set="Battle for Zendikar"/>

<mtg-set-symbol set="Magic 2011"/>

</div>
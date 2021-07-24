'use strict';
const marked=require('marked')
module.exports = loader;

function loader(source) {
    // TODO
    console.log(source)
    return marked(source);
}

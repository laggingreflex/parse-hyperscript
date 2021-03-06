
const parseSelector = require('./selector')

module.exports = parse

function parse (args) {
  let children = []
  let attrs = {}
  let node

  for (var i = args.length - 1; i >= 0; i--) {
    const arg = args[i]

    if (i === 0) {
      node = arg
    } else if (Array.isArray(arg)) {
      children = arg
    } else if (isObj(arg)) {
      attrs = arg
    } else {
      children = [String(arg)]
    }
  }

  // is it a default tag or a custom element like a react class or a
  // functional component?
  if (isString(node)) {
    let selector = parseSelector(node)
    selector.id && (attrs.id = selector.id)

    if (selector.classes !== '') {
      if (attrs.class) {
        if (attrs.class instanceof Array) {
          attrs.class = selector.classes.split(/[ ]+/g).concat(attrs.class)
        } else if (typeof attrs.class === 'string') {
          attrs.class = selector.classes + ' ' + attrs.class
        } else if (typeof attrs.class === 'object') {
          const newClassesObj = {}
          selector.classes.split(/[ ]+/g).forEach(className => {
            newClassesObj[className] = true
          })
          Object.keys(attrs.class).forEach(existing => {
            newClassesObj[existing] = attrs.class[existing]
          })
          attrs.class = newClassesObj
        }
      } else {
        attrs.class = selector.classes
      }
    }

    return { node: selector.tag, attrs, children }
  } else {
    return { node, attrs, children }
  }
}

function isString (val) { return typeof val === 'string' }
function isObj (val) { return typeof val === 'object' }

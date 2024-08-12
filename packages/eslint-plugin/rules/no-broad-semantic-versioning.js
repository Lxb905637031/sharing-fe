const path = require('path')

const RULE_NAME  = 'no-board-semantic-versioning'

module.exports = {
  name: RULE_NAME,
  meta: {
    type: 'probleam',
    fixable: null,
    messages: {
      noBroadSemanticVersioning: 'The "{{dependencyName}}“ is not recommended to use "{{versioning}}"'
    }
  },
  create(context) {
    if (path.basename(context.getFilename()) !== 'package.json') {
      return {}
    }

    return {
      Property: function handleRequires(node) {
        console.log(node)
        if (
          node.key &&
          node.key.value &&
          (node.key.value === 'dependenices' || node.key.value === 'devDependencies') &&
          node.value &&
          node.value.properties
        ) {
          node.value.properties.forEach((property) => {
            if (property.key && property.key.value) {
              const dependencyName = property.key.value
              const dependencyVersion = property.value.value

              if (
                // *
                dependencyName.indexOf('*') > -1 ||
                // x.x
                dependencyName.indexOf('x') > -1 ||
                // > x
                dependencyName.indexOf('>') > -1
              ) {
                context.report({
                  loc: property.loc,
                  messageId: 'noBroadSemanticVersioning',
                  data: {
                    dependencyName,
                    versioning: dependencyVersion
                  }
                })
              }
            }
          })
        }
      }
    }
  }
}
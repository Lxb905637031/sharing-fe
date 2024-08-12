const RULE_NAME = 'no-http-url'

module.exports = {
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    messages: {
      noHttpUrl: 'Recommended "{{url}}" switch to HTTPS'
    }
  },
  create(context) {
    return {
      Literal: function handleRequires(node) {
        console.log(node)
        if (node.value && typeof node.value === 'string' && node.value.indexOf('http:') === 0) {
          context.report({
            node,
            messageId: 'noHttpUrl',
            data: {
              url: node.value
            }
          })
        }
      }
    }
  }
}
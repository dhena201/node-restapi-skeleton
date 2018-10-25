function namespace(name) {
    return name.replace(/(\b|\.)\w/g, l => l.toUpperCase()).replace('.', '')
}

function slashNotation(string, object) {
    return string.split('/').reduce((o, i) => o[i], object)
}

module.exports = {namespace, slashNotation};
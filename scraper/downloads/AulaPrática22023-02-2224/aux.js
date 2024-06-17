exports.myDateTime = function () {
    var d = new Date().toISOString().substring(0, 16)
    return d
}
    
exports.myName = function () {
    return "José Carlos Ramalho"
}

exports.turma = "EngWeb2023::TP1"
    
    
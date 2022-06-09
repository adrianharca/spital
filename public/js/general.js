function formatNumber(numberVar){
    if (10>numberVar) return "0" + numberVar;
    return "" + numberVar;
}
function formatDate(dateVar){
    return formatNumber(dateVar.getHours()) + ":" + formatNumber(dateVar.getMinutes()) + ":" + formatNumber(dateVar.getSeconds()) + ", " + formatNumber(dateVar.getDate()) +
     "." + formatNumber(dateVar.getMonth()+1) + "." +  dateVar.getFullYear();
}
function addToAudit(stringVar){
    var current = new Date();
    $("#audit").html($("#audit").html() + "<br/>" + stringVar + "( ora " + formatDate(current) + ")");
}
function checkIfNumber(label, numberStr, minVar, maxVar){
    errorMessageNotNumber = label + " trebuie să fie număr.";
    if (numberStr==null || numberStr===null || numberStr==undefined || numberStr=="") {
        alert(errorMessageNotNumber);
        return false;
    }
    if (isNaN(numberStr)) {
            alert(errorMessageNotNumber);
            return false;
        }
    var trueNumber = parseInt(numberStr);
    if (trueNumber<minVar) {
        alert(label + " trebuie să fie mai mare sau egal cu " + minVar + " (curent este " +trueNumber + ")");
        return false;
    }
    if (trueNumber>maxVar) {
        alert(label + " trebuie să fie mai mic sau egal cu " + maxVar + " (curent este " +trueNumber + ")");
        return false;
    }
    return true;
}
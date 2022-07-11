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
 function addJudete(judeteField){
     judeteField.appendChild(addOption("Bucureşti"));
     judeteField.appendChild(addOption("Alba"));
     judeteField.appendChild(addOption("Arad"));
     judeteField.appendChild(addOption("Argeș"));
     judeteField.appendChild(addOption("Bacău"));
     judeteField.appendChild(addOption("Bihor"));
     judeteField.appendChild(addOption("Bistriţa-Năsăud"));
     judeteField.appendChild(addOption("Botoşani"));
     judeteField.appendChild(addOption("Braşov"));
     judeteField.appendChild(addOption("Brăila"));
     judeteField.appendChild(addOption("Buzău"));
     judeteField.appendChild(addOption("Caraş-Severin"));
     judeteField.appendChild(addOption("Călăraşi"));
     judeteField.appendChild(addOption("Cluj"));
     judeteField.appendChild(addOption("Constanţa"));
     judeteField.appendChild(addOption("Covasna"));
     judeteField.appendChild(addOption("Dâmboviţa"));
     judeteField.appendChild(addOption("Dolj"));
     judeteField.appendChild(addOption("Galaţi"));
     judeteField.appendChild(addOption("Giurgiu"));
     judeteField.appendChild(addOption("Gorj"));
     judeteField.appendChild(addOption("Harghita"));
     judeteField.appendChild(addOption("Hunedoara"));
     judeteField.appendChild(addOption("Ialomiţa"));
     judeteField.appendChild(addOption("Iaşi"));
     judeteField.appendChild(addOption("Ilfov"));
     judeteField.appendChild(addOption("Maramureş"));
     judeteField.appendChild(addOption("Mehedinţi"));
     judeteField.appendChild(addOption("Mureş"));
     judeteField.appendChild(addOption("Neamţ"));
     judeteField.appendChild(addOption("Olt"));
     judeteField.appendChild(addOption("Prahova"));
     judeteField.appendChild(addOption("Satu Mare"));
     judeteField.appendChild(addOption("Sălaj"));
     judeteField.appendChild(addOption("Sibiu"));
     judeteField.appendChild(addOption("Suceava"));
     judeteField.appendChild(addOption("Teleorman"));
     judeteField.appendChild(addOption("Timiş"));
     judeteField.appendChild(addOption("Tulcea"));
     judeteField.appendChild(addOption("Vâlcea"));
     judeteField.appendChild(addOption("Vaslui"));
     judeteField.appendChild(addOption("Vrancea"));
 }
 function addOption(valueVar){
        const newOption = document.createElement('option');
        const optionText = document.createTextNode(valueVar);
        newOption.appendChild(optionText);
        newOption.setAttribute('value',valueVar);
        return newOption;
    }

function addDaysOfMonth(limit, day) {
        for (var i = 1; limit>=i; i++) {
          day.appendChild(addOption(i));
        };
    }

function checkIfNumberNoWarning(numberStr){

    if (numberStr==null || numberStr===null || numberStr==undefined || numberStr=="") {
        return false;
    }
    if (isNaN(numberStr)) {
            return false;
    }

    return true;
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
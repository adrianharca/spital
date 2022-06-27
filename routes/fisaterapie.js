const express = require('express');
const router = express.Router();
const url = require('url');
var emptyStr = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
var Comment = function (oraV, solPerfuzabilV, tratamentV, diurezaV, scaunV, varsatV, lichideIngerateV) {
    this.ora = oraV,
    this.solPerfuzabil = solPerfuzabilV,
    this.tratament = tratamentV,
    this.diureza = diurezaV,
    this.scaun = scaunV,
    this.varsat =  varsatV,
    this.lichideIngerate = lichideIngerateV
}

router.get('/', (req, res) => {
    const query = url.parse(req.url, true).query;
    var data = query.data;
    const pacientName = query.pacient;

    rh = emptyStr;
    diagnostic = emptyStr;
    //init
    if (pacientName!=null) {
        salon = "10";
        nrFo = "3199";
        nume = "Balazs";
        prenume = "Gina";
        varsta  = "4a 5l";
        if (data!=null){
            data = "28/29.08.22";
        }
    }
    comments = [];

    for(var i=0;i<24;i++){
       var oraV =  i;
        if (oraV.length<2)
            oraV = "0"+i;
        comments.push(new Comment(oraV,'','','','','',''));
   }

    //end init
    var row1col1=row1col2=row1col3=
                      row2col1=row2col2=row2col3=
                      row3col1=row3col2=row3col3=
                      row4col1=row4col2=row4col3=
                      row5col1=row5col2=row5col3=
                      row6col1=row6col2=row6col3=
                      row7col1=row7col2=row7col3="";

    pacient = {nume, prenume, varsta, rh, diagnostic};
    fisa = {salon, data, nrFo};
    detaliiFisa = {row1col1,row1col2,row1col3,
                  row2col1,row2col2,row2col3,
                  row3col1,row3col2,row3col3,
                  row4col1,row4col2,row4col3,
                  row5col1,row5col2,row5col3,
                  row6col1,row6col2,row6col3,
                  row7col1,row7col2,row7col3,
                    };
    res.render('fisaterapie', {fisa, pacient,detaliiFisa, comments} );

});




module.exports = router;
const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib

window.onload = () => {
  initData();
  $('input[name="field-reason"]').each(function(){
    $(this).on('click', function(){
      selectReason($(this).attr('value'));
    });
  });

  $('a.reason').each(function () {
    $(this).on('click', function () {
      selectReason($(this).attr('title'));
    });
  });

  $('input', document.forms[0]).each(function () {
    $(this).on('keyup', function () {
      saveData();
    });
  });

  var date = document.getElementById('field-birthday');

  date.addEventListener('input', function (e) {
    this.type = 'text';
    var input = this.value;
    if (/\D\/$/.test(input)) input = input.substr(0, input.length - 3);
    var values = input.split('/').map(function (v) {
      return v.replace(/\D/g, '')
    });
    if (values[0]) values[0] = checkValue(values[0], 31);
    if (values[1]) values[1] = checkValue(values[1], 12);
    var output = values.map(function (v, i) {
      return v.length == 2 && i < 2 ? v + '/' : v;
    });
    this.value = output.join('').substr(0, 14);
  });

  date.addEventListener('blur', function (e) {
    this.type = 'text';
    var input = this.value;
    var values = input.split('/').map(function (v, i) {
      return v.replace(/\D/g, '')
    });
    var output = '';

    if (values.length == 3) {
      var year = values[2].length !== 4 ? parseInt(values[2]) + 2000 : parseInt(values[2]);
      var month = parseInt(values[1]) - 1;
      var day = parseInt(values[0]);
      var d = new Date(year, month, day);
      if (!isNaN(d)) {
        // document.getElementById('result').innerText = d.toString();
        var dates = [d.getDate(), d.getMonth() + 1, d.getFullYear()];
        output = dates.map(function (v) {
          v = v.toString();
          return v.length == 1 ? '0' + v : v;
        }).join('/');
      };
    };
    this.value = output;
  });
}  

function checkValue(str, max) {
  if (str.charAt(0) !== '0' || str == '00') {
    var num = parseInt(str);
    if (isNaN(num) || num <= 0 || num > max) num = 1;
    str = num > parseInt(max.toString().charAt(0)) && num.toString().length == 1 ? '0' + num : num.toString();
  };
  return str;
};

function setLabel(fieldName, defaultValue) {
  $('span#label-' + fieldName).html(localStorage.getItem(fieldName) ? localStorage.getItem(fieldName): defaultValue);
}

async function initData() {
  if (localStorage.getItem('lastName')) {
    document.forms[0].lastname.value = localStorage.getItem('lastName');
    setLabel('lastName', 'Nom');
  }
  if (localStorage.getItem('firstName')) {
    document.forms[0].firstname.value = localStorage.getItem('firstName');
    setLabel('firstName', 'Prénom');
  }
  if (localStorage.getItem('birthDate')) {
    document.forms[0].birthday.value = localStorage.getItem('birthDate');
    setLabel('birthDate', '01/01/1970');
  }
  if (localStorage.getItem('placeOfBirth')) {
    document.forms[0].lieunaissance.value = localStorage.getItem('placeOfBirth');
    setLabel('placeOfBirth', 'Lyon');
  }
  if (localStorage.getItem('address')) {
    document.forms[0].address.value = localStorage.getItem('address');
    setLabel('address', '999 avenue de france');
  }
  if (localStorage.getItem('zipCode')) {
    document.forms[0].zipcode.value = localStorage.getItem('zipCode');
    setLabel('zipCode', '75001');
  }
  if (localStorage.getItem('town')) {
    document.forms[0].town.value = localStorage.getItem('town');
    setLabel('town', 'Paris');
  }
  if (localStorage.getItem('reasons')) {
    // document.forms[0].field-reason.value = localStorage.getItem('reasons');
    var reasons = getReasonsFromStorage();
    reasons.forEach(function (reason) {
      $('input[value="' + reason + '"]').prop("checked", true);
      if( $('.reason-' + reason).length > 0 ) {
        var elt = $('.reason-' + reason);
        if ( ! elt.hasClass('reason-selected')) {
          elt.addClass('reason-selected');
        }
      }
    });
  }
}

function saveData() {
  if (document.forms[0].lastname.value) {
    localStorage.setItem('lastName', document.forms[0].lastname.value);
    setLabel('lastName', 'Nom');
  }
  if (document.forms[0].firstname.value) {
    localStorage.setItem('firstName', document.forms[0].firstname.value);
    setLabel('firstName', 'Prénom');
  }
  if (document.forms[0].birthday.value) {
    localStorage.setItem('birthDate', document.forms[0].birthday.value);
    setLabel('birthDate', '01/01/1970');
  }
  if (document.forms[0].lieunaissance.value) {
    localStorage.setItem('placeOfBirth', document.forms[0].lieunaissance.value);
    setLabel('placeOfBirth', 'Lyon');
  }
  if (document.forms[0].address.value) {
    localStorage.setItem('address', document.forms[0].address.value);
    setLabel('address', '999 avenue de france');
  }
  if (document.forms[0].zipcode.value) {
    localStorage.setItem('zipCode', document.forms[0].zipcode.value);
    setLabel('zipCode', '75001');
  }
  if (document.forms[0].town.value) {
    localStorage.setItem('town', document.forms[0].town.value);
    setLabel('town', 'Paris');
  }
}

function getReasonsFromStorage() {
  if (!localStorage.getItem('reasons')) {
    return [];
  }
  else if ( localStorage.getItem('reasons') == '' ) {
    return [];
  }
  else {
    return localStorage.getItem('reasons').split(',');
  }
}

function selectReason(reason) {
  var elt = $('.reason-' + reason);
  if (elt.hasClass('reason-selected') ) {
    elt.removeClass('reason-selected');

    var reasons = getReasonsFromStorage();
    if (reasons.indexOf(reason) > -1) {
      reasons.splice(reasons.indexOf(reason), 1);
      localStorage.setItem('reasons', reasons);
    }
    $('input[value="' + reason + '"]').prop("checked", false);
  }
  else {
    elt.addClass('reason-selected');
    $('input[value="' + reason + '"]').prop("checked", true);
    var reasons = getReasonsFromStorage();
    if ( reasons.indexOf(reason) == -1 ) {
      reasons.push(reason)
      localStorage.setItem('reasons', reasons);
    }
  }
}

function isFormFilled(timeOffset) {
  count = 0;

  if (!localStorage.getItem('lastName')) {
    count++;
  }
  if (!localStorage.getItem('firstName')) {
    count++;
  }
  if (!localStorage.getItem('birthDate')) {
    count++;
  }
  if (!localStorage.getItem('placeOfBirth')) {
    count++;
  }
  if (!localStorage.getItem('address')) {
    count++;
  }
  if (!localStorage.getItem('zipCode')) {
    count++;
  }
  if (!localStorage.getItem('town')) {
    count++;
  }
  if (!localStorage.getItem('reasons')) {
    count++;
  }
  if (!timeOffset) {
    if( !$('#field-datesortie').val() ) {
      count++;
    }
    if( !$('#field-heuresortie').val() ) {
      count++;
    }
  }

  return (count == 0);
}

async function modifyPdf(timeOffset) {
  saveData();

  if( ! isFormFilled(timeOffset) ) {
    if (!timeOffset) {
      alert("Remplissez d'abord le formulaire,\nla prochaine fois, et n'oubliez pas le jour l'heure de sortie !");
    }
    else {
      alert("Remplissez d'abord le formulaire,\nla prochaine fois, vous pourrez générer le formulaire directement");
    }
  }
  else {
    let lastName = localStorage.getItem('lastName');
    let firstName = localStorage.getItem('firstName');
    let birthDate = localStorage.getItem('birthDate');
    let placeOfBirth = localStorage.getItem('placeOfBirth');
    let address = localStorage.getItem('address');
    let zipCode = localStorage.getItem('zipCode');
    let town = localStorage.getItem('town');

    let reasons = getReasonsFromStorage(); // localStorage.getItem('reasons')

    if (!timeOffset) {

      exitDateField = document.getElementById('field-datesortie').value;
      exitDate = exitDateField.substr(8, 2) + '/' + exitDateField.substr(5, 2) + '/' + exitDateField.substr(0, 4)
      exitTime = document.getElementById('field-heuresortie').value.replace(':', 'h');

      // prepare generation date
      creationCurrentDate = new Date();
    }
    else {
      var currentDate = new Date();
      currentDate.setMinutes(currentDate.getMinutes() + timeOffset);

      exitDate = currentDate.toLocaleDateString('fr-FR');

      // exitTimeMinutes = Math.ceil(currentDate.getMinutes()/ 10) * 10 ; // arrondi au dessus
      exitTimeMinutes = Math.floor(currentDate.getMinutes() / 10) * 10; // arrondi en dessous
      exitTime = `${currentDate.getHours()}h${exitTimeMinutes}`;

      // prepare generation date
      creationCurrentDate = new Date();
      if(timeOffset<0) {
        // set creation time 10 min before exit time
        creationCurrentDate.setMinutes(creationCurrentDate.getMinutes() + timeOffset - 10);
      }
      
    }

    
    let creationDate = creationCurrentDate.toLocaleDateString('fr-FR');
    let creationTime = `${creationCurrentDate.getHours()}h${creationCurrentDate.getMinutes()}`;

    // Fetch an existing PDF document
    const url = '/certificate.84dda806.pdf'
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const secondPage = pdfDoc.addPage();

    // Get the width and height of the first page
    const { width, height } = firstPage.getSize()

    // Draw a string of text diagonally across the first page
    firstPage.drawText("".concat(firstName, " ").concat(lastName), {
      x: 123,
      y: 686,
      size: 11,
      font: helveticaFont
    });
    firstPage.drawText(birthDate, {
      x: 123,
      y: 661,
      size: 11,
      font: helveticaFont
    });
    firstPage.drawText(placeOfBirth, {
      x: 92,
      y: 638,
      size: 11,
      font: helveticaFont
    });
    firstPage.drawText("".concat(address, " ").concat(zipCode, " ").concat(town), {
      x: 134,
      y: 613,
      size: 11,
      font: helveticaFont
    });

    if (reasons.includes("travail")) {
      firstPage.drawText("x", {
        x: 76,
        y: 527,
        size: 19,
        font: helveticaFont
      });
    }
    if (reasons.includes("courses")) {
      firstPage.drawText("x", {
        x: 76,
        y: 478,
        size: 19,
        font: helveticaFont
      });
    }
    if (reasons.includes("sante")) {
      firstPage.drawText("x", {
        x: 76,
        y: 436,
        size: 19,
        font: helveticaFont
      });
    }
    if (reasons.includes("famille")) {
      firstPage.drawText("x", {
        x: 76,
        y: 400,
        size: 19,
        font: helveticaFont
      });
    }
    if (reasons.includes("sport")) {
      firstPage.drawText("x", {
        x: 76,
        y: 345,
        size: 19,
        font: helveticaFont
      });
    }
    if (reasons.includes("judiciaire")) {
      firstPage.drawText("x", {
        x: 76,
        y: 298,
        size: 19,
        font: helveticaFont
      });
    }
    if (reasons.includes("missions")) {
      firstPage.drawText("x", {
        x: 76,
        y: 260,
        size: 19,
        font: helveticaFont
      });
    }

    firstPage.drawText(town, {
      x: 111,
      y: 226,
      size: 11,
      font: helveticaFont
    });

    firstPage.drawText(exitDate, {
      x: 92,
      y: 200,
      size: 11,
      font: helveticaFont
    });

    hours = String(exitTime).substring(0, exitTime.indexOf('h')).padStart(2, '0');
    minutes = String(exitTime).substring(exitTime.indexOf('h') + 1, 5).padStart(2, '0');

    firstPage.drawText(hours, {
      x: 200,
      y: 201,
      size: 11,
      font: helveticaFont
    });
    firstPage.drawText(minutes, {
      x: 220,
      y: 201,
      size: 11,
      font: helveticaFont
    });

    firstPage.drawText("Date de création:", {
      x: 464,
      y: 150,
      size: 7,
      font: helveticaFont
    });

    creationHours = String(creationTime).substring(0, creationTime.indexOf('h')).padStart(2, '0');
    creationMinutes = String(creationTime).substring(creationTime.indexOf('h') + 1, 5).padStart(2, '0');
    p = "".concat(creationHours, "h").concat(creationMinutes);
    firstPage.drawText("".concat(creationDate, " à ").concat(p), {
      x: 455,
      y: 144,
      size: 7,
      font: helveticaFont
    });


    qrCodeText = [
      "Cree le: ".concat(creationDate, " a ").concat(p),
      "Nom: ".concat(lastName),
      "Prenom: ".concat(firstName),
      "Naissance: ".concat(birthDate, " a ").concat(placeOfBirth),
      "Adresse: ".concat(address, " ").concat(zipCode, " ").concat(town),
      "Sortie: ".concat(exitDate, " a ").concat(hours, "h").concat(minutes),
      "Motifs: ".concat(reasons)].join("; ");

    let qrCode = await QRCode.toDataURL(qrCodeText).then((res) => res);
    console.log(qrCode);
    const pngImageBytes = await fetch(qrCode).then((res) => res.arrayBuffer())

    const pngImage = await pdfDoc.embedPng(qrCode)

    firstPage.drawImage(pngImage, {
      x: firstPage.getWidth() - 170,
      y: 155,
      width: 100,
      height: 100
    });

    secondPage.drawImage(pngImage, {
      x: 50,
      y: secondPage.getHeight() - 350,
      width: 300,
      height: 300
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()

    // Trigger the browser to download the PDF document
    download(pdfBytes, "covid19-attestation-" + lastName + "-" + firstName + "-" + exitDate + "-" + hours + minutes + ".pdf", "application/pdf");
    // window.location.href = '/';
  }
}
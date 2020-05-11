window.onload = () => {
  modifyPdf();
}  

const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib

// let lastName = 'MARIAGE';
// let firstName = 'Jean-Marie';
// let birthDate = '07/06/1950';
// let placeOfBirth = 'Valenciennes'
// let address = '2, rue Vincent Scotto';
// let zipCode = '13480';
// let town = 'Cabries';
// let reasons = [
//   // "travail",
//   "courses",
//   // "sante",
//   "famille",
//   // "sport",
//   // "judiciaire",
//   // "missions"
// ];
var currentDate = new Date();
currentDate.setMinutes(currentDate.getMinutes() - timeOffset);
let exitDate = currentDate.toLocaleDateString('fr-FR');

// let exitTimeMinutes = Math.ceil(currentDate.getMinutes()/ 10) * 10 ; // arrondi au dessus
let exitTimeMinutes = Math.floor(currentDate.getMinutes()/ 10) * 10 ; // arrondi en dessous
let exitTime = `${currentDate.getHours()}h${exitTimeMinutes}`;

var creationCurrentDate = new Date();
creationCurrentDate.setMinutes(creationCurrentDate.getMinutes() - timeOffset - 10);
let creationDate = creationCurrentDate.toLocaleDateString('fr-FR');
let creationTime = `${creationCurrentDate.getHours()}h${creationCurrentDate.getMinutes()}`;

async function modifyPdf() {
  // Fetch an existing PDF document
  const url = 'https://covid19.damprod.net/certificate.84dda806.pdf'
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
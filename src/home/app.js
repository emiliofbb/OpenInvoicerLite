
window.addEventListener("DOMContentLoaded", async (event) => {
    const docsContainer = document.getElementById('lasts-documents-container');
    const documents = await window.api.getAllDocuments();
    loadDocuments(documents, docsContainer);
});

function openDocument(documentId) {
    window.api.goTo({ window: "document_form" , args: documentId});
}

function loadDocuments(documents, container) {

    if (!documents || !Array.isArray(documents)) {
        return;
    }

    let docCard; 
    let i = 0, len = documents.length;
    while (i < len) {
        docCard = document.createElement("div");
        docCard.innerText = 
        "Id Documento: " + documents[i].id
        + "Cliente: " + documents[i].customer_name
        + "Empresa: " + documents[i].company_name
        + "Fecha de Creacion: " + documents[i].creation_date;
        container.appendChild(docCard);
        
        ++i;
    }

    return;

  container.innerHTML = "";
  Object.values(documents).forEach((doc) => {
    let address = doc.client.address;
    if (address === undefined) {
      address = "";
    }
    if (address.length > 25) {
      address = address.slice(0, 25 - 1) + "...";
    }
    const documentCard = document.createElement("div");
    documentCard.className = "doc-card";
    documentCard.innerHTML = `
    <button class="button-card" onclick="openDocument(${doc.id})">
      <h2>${doc.client.name}</h2>
      <p>
        Fecha Creación: <span class="value-highligth">${
          doc.creationDate === undefined ? "" : invoice.creationDate
        }</span>
      </p>
      <p>Código de Factura: <span class="value-highligth">${
        doc.id
      }</span></p>
      <p>
        Dirección del Cliente:
        <span class="value-highligth">${address}</span>
      </p>
    </button>`;
    container.appendChild(documentCard);
  });
}

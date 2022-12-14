const template = document.createElement("template");
const quotesRatesAPI = "https://demo-staging.app.portpro.io/v1/";
class QuotesRates extends HTMLElement {
  constructor() {
    
    super();
    // this.showInfo = true;
    // this.attachShadow({ mode: "open" });
    // this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.createUpperBar();
    this.getQuoteTotalCounts({ modalName: "LoadQuote" });
    this.getQuotes({ pageNumber: 1 });

    document
    .getElementById("quotesRatesSelect")
    .addEventListener("change", (event) => {
      const theValue = document.getElementById("quotesRatesSelect").value;
      if (theValue == "quotes") {
        document.getElementById("rates__div__id").remove();
        this.getQuoteTotalCounts({ modalName: "LoadQuote" });
        this.getQuotes({ pageNumber: 1 });
      }
      if (theValue == "rates") {
        document.getElementById("quotes__div__id").remove();
        this.getQuoteTotalCounts({ modalName: "LoadPricingSettings" });
        this.getRates({ pageNumber: 1 });
      }
    })

    document
    .getElementById("pagination__id")
    .addEventListener("change", (e) => {
      const theValue = document.getElementById("pagination__id").value;
      const quotesOrRates =
        document.getElementById("quotesRatesSelect").value;
      if (quotesOrRates == "quotes") {
        document.getElementById("quotes__div__id").remove();
        this.getQuotes({ pageNumber: theValue });
      }
      if (quotesOrRates == "rates") {
        document.getElementById("rates__div__id").remove();
        this.getRates({ pageNumber: theValue });
      }
    });
  }

  // create upper bar
  createUpperBar() {
    const quotesRatesHeight = this.getAttribute("quotesRatesHeight");
    const quotesRatesWidth = this.getAttribute('quotesRatesWidth');
    const para = document.createElement("div");
    para.innerHTML = `
<style>
    #main__div{
    }    
    #upperBar{
      display: flex;
      justify-content: space-between; 
      width:${quotesRatesWidth};
    }
    .pagination__div{
      display:flex;
    }
    #quotes__div__id, #rates__div__id{
      box-shadow: 0 15px 35px rgb(20 28 52 / 20%);
      overflow:scroll;
      height:${quotesRatesHeight};
      width:${quotesRatesWidth};

    }
    
    td{
      background-color: #fff;
    }
    body{
      font-family: Inter,sans-serif;
  }
  .pagination__div{
      display: flex;
      align-items: baseline;
  }
  #upperBar{
      margin-bottom: 10px;
  }
  #quotesRatesSelect, #pagination__id{
      /* width: 200px; */
      height: 30px;
      background: #fff;
      border-radius: 3px;
      box-shadow: 0 4px 6px rgb(20 28 52 / 20%);
      border: none;
  }
  #pagination__id{
      width: 50px;
  }
  .quotes__rates__page_number__text{
      margin-right: 10px;
      font-size: 13px;
  }   
  #quotes__div__id, #rates__div__id{
      padding: 10px;
      border-radius: 4px;
  }
  tr{
      font-size: 12px;
      color:#687d96
  }
  td{
      font-size: 13px;
  }
  tbody tr{
      color: black;
  }
  
  .badge-gray-100 {
      background-color: #dbe2eb;
      color: #172a41;
  }
  .badge {
      border-radius: 3px;
      display: inline-block;
      font-size: 10px;
      font-weight: 600;
      line-height: 15px;
      padding: 3px 5px;
      text-align: center;
      transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
      vertical-align: initial;
      white-space: nowrap;
  }
  .table-card td:first-child {
      border-bottom-left-radius: 5px;
      border-top-left-radius: 5px;
  }
  .table-card td {
      font-size: 12px;
      height: 30px;
      /* padding: 10px; */
  }
  .table-card td {
      /* border: none; */
      border: 0.5px solid rgba(0, 0, 0, 0.049);
      white-space: nowrap;
  }
  
  .table td{
      border-top: 1px solid hsla(210,8%,51%,.13);
      padding: 0.65rem 0.50rem;
      vertical-align: middle;
  }
  .powered__by__portpro__text{
    text-align: center;
    justify-content: center;
    align-items: center;
    width: ${quotesRatesWidth};
    background-color: #377DF6;
    color: white;
    padding: 5px 0;

}
.poweredby__text{

}
.portpro__text{
    font-size: 20px;
    font-weight: 700;
}
</style>
    <div id="main__div" >
      <div class="powered__by__portpro__text">
        <div class="poweredby__text">Powered by</div>
        <div class="portpro__text">PORTPRO</div>
      </div>
      <div id="upperBar">
        <select name="quotesRatesSelect" id="quotesRatesSelect" >
          <option value="quotes">Quotes</option>
          <option value="rates">Rates</option>
        </select>
        <div class="pagination__div">
          <div class='quotes__rates__page_number__text'>Page Number</div>
          <select name="pagination__pageNumber" id="pagination__id"></select>
          </select>
        </div>
      </div>
    </div>
`;
const quotesRatesMainDivFromWebsite = document.getElementById('quotes__rates__main__div');

quotesRatesMainDivFromWebsite.appendChild(para);
  }

  // 1. rendering some data
  getQuotes({ pageNumber }) {
    const theId = this.getAttribute("quotesRatesId");
    return new Promise((res, rej) => {
      fetch(
        `${quotesRatesAPI}tms/quotesRates?pageNumber=${pageNumber}&nPerPage=20&modelName=LoadQuote&token=${theId}`
      )
        .then((data) => data.json())
        .then((json) => {
            this.renderQuotes(json);
            res();
        })
        .catch((error) => {
          document.getElementById("main__div").remove();
          res();
        });
    });
  }

  // 2. getting rates
  getRates({ pageNumber }) {
    const theId = this.getAttribute("quotesRatesId");
    return new Promise((res, rej) => {
      fetch(
        `${quotesRatesAPI}tms/quotesRates?pageNumber=${pageNumber}&nPerPage=20&modelName=LoadPricingSettings&token=${theId}`
      )
        .then((data) => data.json())
        .then((json) => {
            this.renderRates(json);
            res();
        })
        .catch((error) =>{
          document.getElementById("main__div").remove();
          res()
        });
    });
  }

  // 3. onChanging qutoes or rates
  changeQuotesRates() {
    var x = document.getElementById("quotesRatesSelect").value;
  }

  // 4. getQuotesCount
  getQuoteTotalCounts({ modalName }) {
    const theId = this.getAttribute("quotesRatesId");
    return new Promise((res, rej) => {
      fetch(
        `${quotesRatesAPI}tms/quotesRatesCount?modelName=${modalName}&token=${theId}`
      )
        .then((data) => data.json())
        .then((json) => {
          console.log(json);
            const { quotesCount } = json;
            const totalPages = Math.ceil(quotesCount / 20);
            console.log(totalPages);
            this.renderPagination(totalPages);
            res();
        })
        .catch((error) => {
          document.getElementById("main__div").remove();
          console.log("error inside getQuotesTotalCounts")
          res()
      });
    });
  }

  renderQuotes(data) {
    const para = document.createElement("div");
    para.id='quotes__div__id';
    para.innerHTML = `
    <div class="quotes__div">
    <table class="table table-card">
      <thead>
        <tr>
          ${[
            "Status",
            "Customer",
            "Port / Shipper",
            "Consignee",
            "Quote #",
            "City",
            "State",
            "Zip Code",
            "# of Loads",
            "Valid Upto",
            "Base Price ($)",
            "Xtra Price",
            "Total Price",
          ]
            .map(
              (th) =>
                `<th
              
              scope="col"
              className='text-center'
            >
              ${th}
            </th>`
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
      ${data
        .map((d) => {
          const basePriceObj = d.pricing.find((obj) => {
            return obj.name === "Base Price";
          });
          const basePrice = basePriceObj
            ? parseFloat(basePriceObj.finalAmount)
            : 0;
          let extraPrice = 0;
          d.pricing.forEach((obj) => {
            if (obj.name !== "Base Price")
              extraPrice = extraPrice + parseFloat(obj.finalAmount);
          });
          return `<tr key=${d._id} class="data__mapped">
              <td width="50">
                ${
                  d.active
                    ? `<span class=" badge badge-soft-green">Active</span>`
                    : `<span class=" badge badge-gray-100">Expired</span>`
                }
              </td>
              <td>${d.caller && d.caller?.company_name ?d.caller?.company_name :""}</td>
              <td>
                ${d.shipper
                  .map((e, i) => {
                    return e.company_name;
                  })
                  .join("")}
              </td>
              <td>${d.consignee
                .map((e, i) => {
                  return e.company_name;
                })
                .join("")}</td>
              <td>${d?.quote ?d.quote: ""}</td>
              <td>${d?.city ? d.city :""}</td>
              <td>${d?.state ? d.state : ""}</td>
              <td>${d?.zipCode ? d.zipCode :""}</td>
              <td>${d?.numberofLoad}</td>
              <td>${d?.validUpTo ? d.validUpTo : ""}</td>
              <td width="50" className="text-right">
                ${basePrice}
              </td>
              <td width="50" className="text-right">
                ${extraPrice}
              </td>
              <td width="50" className="text-right">
                ${parseFloat(basePrice + extraPrice)}
              </td>
              
            </tr>`;
        })
        .join("")}
    </tbody>
    </table>
    </div>`;
    // document.body.appendChild(para);
    document.getElementById('main__div').appendChild(para)
  }

  renderRates(data) {
    const ratesDiv = document.createElement("div");
    ratesDiv.id='rates__div__id'
    ratesDiv.innerHTML = `
    <div class="rates__div">
            <table class="table table-card">
              <thead>
                <tr>
                  ${[
                    "status",
                    "Customer",
                    "Port / Shipper",
                    "Consignee",
                    "Zip Code",
                    "City",
                    "State",
                    "Base Price ($)",
                    "Extra Prices",
                    "Total Prices",
                  ]
                    .map(
                      (th) =>
                        `<th
                      
                      scope="col"
                      className='text-center'
                    >
                      ${th}
                    </th>`
                    )
                    .join("")}
                </tr>
              </thead>
              <tbody>
                ${data
                  .map((d) => {
                    const basePriceObj = d.pricing.find((obj) => {
                      return obj.name === "Base Price";
                    });
                    const basePrice = basePriceObj
                      ? parseFloat(basePriceObj.finalAmount)
                      : 0;
                    let extraPrice = 0;
                    d.pricing.forEach((obj) => {
                      if (obj.name !== "Base Price")
                        extraPrice = extraPrice + parseFloat(obj.finalAmount);
                    });
                    return `<tr key={d._id} class="data__mapped">
                        <td width="50">
                          ${
                            d.active
                              ? `<span class=" badge badge-soft-green">Active</span>`
                              : `<span class=" badge badge-gray-100">Expired</span>`
                          }
                        </td>
                        <td>${d.caller && d.caller?.company_name ? d.caller.company_name : ""}</td>
                        <td>
                          ${d.shipper
                            .map((e, i) => {
                              return e.company_name;
                            })
                            .join("")}
                        </td>
                        <td>${d.consignee
                          .map((e, i) => {
                            return e.company_name;
                          })
                          .join("")}</td>
                        <td>${d?.zipCode ? d.zipCode : ""}</td>
                        <td>${d?.city ? d.city : ""}</td>
                        <td>${d?.state ? d.state: ""}</td>
                        <td><div class="font-12">${basePrice.toFixed(
                          2
                        )}</div></td>
                        <td><div class="font-12">${
                          extraPrice && extraPrice.toFixed(2)
                        }</div></td>
                        <td><div class="font-12"> ${(
                          basePrice + extraPrice
                        ).toFixed(2)}</div></td>
                        
                        
                      </tr>`;
                  })
                  .join("")}
              </tbody>
            </table>
        </div>
    `;
    document.getElementById('main__div').appendChild(ratesDiv)
  }

  renderPagination(totalPages) {
    const selectElement = document.getElementById("pagination__id");
    var child = selectElement.lastElementChild;
    while (child) {
      selectElement.removeChild(child);
      child = selectElement.lastElementChild;
    }
    for (let index = 1; index <= totalPages; index++) {
      const selectOption = document.createElement("option");
      selectOption.label = index;
      selectOption.value = index;
      selectElement.appendChild(selectOption);
    }
    // document.body.appendChild(para);
  }

}

window.customElements.define("quotes-rates", QuotesRates);

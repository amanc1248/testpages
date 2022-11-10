
console.log(window.location.href);
const template = document.createElement("template");
// template.innerHTML = ;

class QuotesRates extends HTMLElement {
  constructor() {
    super();
    this.showInfo = true;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.createUpperBar();

  }

  connectedCallback() {
    this.getQuotes();
    // this.getRates();
    document.getElementById("quotesRatesSelect").addEventListener('change',(event)=>{
      // console.log(event)
      const theValue = document.getElementById("quotesRatesSelect").value;
      console.log("selectedvalue: ", theValue)
      if(theValue=='quotes'){
        document.getElementById('rates__div__id').remove();
        this.getQuotes();
      }
      if(theValue=='rates'){
        document.getElementById('quotes__div__id').remove();
        this.getRates();
      }
    })
  }

  // create upper bar
  createUpperBar(){
    const para = document.createElement("div");
para.innerHTML = `
<select name="quotesRatesSelect" id="quotesRatesSelect">
    <option value="quotes">Quotes</option>
    <option value="rates">Rates</option>
</select>
`;
document.body.appendChild(para);
  }

  // 1. rendering some data
  getQuotes() {
    return new Promise((res, rej) => {
      fetch("http://localhost:5000/tms/quotesRates?pageNumber=1&nPerPage=20&modelName=LoadQuote")
        .then((data) => data.json())
        .then((json) => {
          console.log(json);
          this.renderQuotes(json);
          res();
        })
        .catch((error) => rej(error));
    });
  }

  // 2. getting rates
  getRates(){
    return new Promise((res, rej) => {
      fetch("http://localhost:5000/tms/quotesRates?pageNumber=1&nPerPage=20&modelName=LoadPricingSettings")
        .then((data) => data.json())
        .then((json) => {
          console.log(json);
          this.renderRates(json);
          res();
        })
        .catch((error) => rej(error));
    });
  }

  // 3. onChanging qutoes or rates
  changeQuotesRates(){
    var x = document.getElementById("quotesRatesSelect").value;
    // document.getElementById('quotesRatesSelect').addEventListener('')
    console.log(x)
  }


  renderQuotes(data) {
    console.log("i am rendering quotes")

    const para = document.createElement("div");
    para.innerHTML = `
    <div class="quotes__div" id="quotes__div__id">
    <h1>Quotes</h1>
        <table className="table table-card">
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
          ].map(
            (th) =>
              `<th
              
              scope="col"
              className='text-center'
            >
              ${th}
            </th>`
          )}
        </tr>
      </thead>
      <tbody>
      ${data.map((d) => {
        const basePriceObj = d.pricing.find((obj) => {
          return obj.name === "Base Price";
        });
        const basePrice = basePriceObj ? parseFloat(basePriceObj.finalAmount) : 0;
        let extraPrice = 0;
        d.pricing.forEach((obj) => {
          if (obj.name !== "Base Price")
            extraPrice = extraPrice + parseFloat(obj.finalAmount);
        });
        return `<tr key=${d._id}>
              <td width="50">
                {d.active ? (
                  <span class=" badge badge-soft-green">Active</span>
                ) : (
                  <span class=" badge badge-gray-100">Expired</span>
                )}
              </td>
              <td>${d.caller && d.caller.company_name}</td>
              <td>
                ${d.shipper
                  .map((e, i) => {
                    return e.company_name;
                  })
                  .join(", ")}
              </td>
              <td>${d.consignee
                .map((e, i) => {
                  return e.company_name;
                })
                .join(", ")}</td>
              <td>${d.quote}</td>
              <td>${d.city}</td>
              <td>${d.state}</td>
              <td>${d.zipCode}</td>
              <td>${d.numberofLoad}</td>
              <td>${d.validUpTo}</td>
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
      })}
    </tbody>
    </table>
    </div>`;
    document.body.appendChild(para);
  }

  renderRates(data){
    console.log("i am rendering rates")
    const ratesDiv = document.createElement('div');
    ratesDiv.innerHTML = `
    <div class="rates__div" id="rates__div__id">
    <h1>Rates</h1>
            <table className="table table-card">
              <thead>
                <tr>
                  ${["status",
                    "Customer",
                    "Port / Shipper",
                    "Consignee",
                    "Zip Code",
                    "City", 
                    "State", 
                    "Base Price ($)",
                    "Extra Prices",
                    "Total Prices"
                  ].map((th) => (
                    `<th
                      
                      scope="col"
                      className='text-center'
                    >
                      ${th}
                    </th>`
                  ))}
                </tr>
              </thead>
              <tbody>
                ${ 
                  data.map((d) => {
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
                    return (
                      `<tr key={d._id}>
                        <td width="50">
                          ${d.active ? (
                            `<span class=" badge badge-soft-green">Active</span>`
                          ) : (
                            `<span class=" badge badge-gray-100">Expired</span>`
                          )}
                        </td>
                        <td>${d.caller && d.caller.company_name}</td>
                        <td>
                          ${d.shipper
                            .map((e, i) => {
                              return e.company_name;
                            })
                            .join(", ")}
                        </td>
                        <td>${d.consignee.map((e, i) => { return e.company_name }).join(', ')}</td>
                        <td>${d.zipCode}</td>
                        <td>${d.city}</td>
                        <td>${d.state}</td>
                        <td><div class="font-12">${basePrice.toFixed(2)}</div></td>
                        <td><div class="font-12">${extraPrice && extraPrice.toFixed(2)}</div></td>
                        <td><div class="font-12"> ${(basePrice + extraPrice).toFixed(2)}</div></td>
                        
                        
                      </tr>`
                    );
                  })}
              </tbody>
            </table>
        </div>
    `;
    document.body.appendChild(ratesDiv);
  }
}
window.customElements.define("quotes-rates", QuotesRates);

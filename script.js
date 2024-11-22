import { API_BASE_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const seachForm = document.querySelector(".search-form");
  const productList = document.querySelector(".product-list");
  const priceChat = document.querySelector(".price-chart");
  const title = document.querySelector(".title");
  const exampleProductList = document.querySelector(".product-list-example");
  const exampleSection = document.querySelector(".example-products");

  if (
    !seachForm ||
    !productList ||
    !priceChat ||
    !title ||
    !exampleProductList ||
    !exampleSection
  ) {
    console.error("Um ou mais elementos não foram encontrados no DOM.");
    return;
  }

  let myChart = "";

  function displayExampleProducts() {
    const exampleProducts = [
      {
        title: "iPhone 13",
        price: 3490.99,
        image:
          "https://a-static.mlcdn.com.br/800x560/apple-iphone-13-128gb-meia-noite-tela-61-12mp/magazineluiza/234661800/a57c1ab14765ab0b7ca87de98ba94b94.jpg",
        link: "https://www.mercadolivre.com.br/apple-iphone-13-128-gb-meia-noite-distribuidor-autorizado/p/MLB1018500844?pdp_filters=item_id:MLB4381812076#is_advertising=true&searchVariation=MLB1018500844&position=2&search_layout=stack&type=pad&tracking_id=4c65af4a-1185-42f3-8155-2fb9414ce3f3&is_advertising=true&ad_domain=VQCATCORE_LST&ad_position=2&ad_click_id=NTFlMDNkZDYtYmIxZS00NzkwLTk3YzctMDNlZDMzYTAxYWM4",
      },
      {
        title: "Notebook Dell Inspiron",
        price: 3999.99,
        image: "https://imgs.casasbahia.com.br/55066981/1g.jpg",
        link: "https://www.mercadolivre.com.br/notebook-dell-inspiron-i15-intel-core-i5-1235u-12-geraco-16gb-ram-512-ssd-windows-11-home-tela-156-full-hd-i15-i120k-m30p/p/MLB29561656",
      },
      {
        title: "Camiseta Nike",
        price: 129.99,
        image:
          "https://images.tcdn.com.br/img/img_prod/817109/camiseta_nike_sportswear_knit_masculina_28460_1_21f63733270b341c8db12a46d05dfdf1.jpg",
        link: "https://produto.mercadolivre.com.br/MLB-4138544344-camiseta-nike-sb-masculina-_JM",
      },
      {
        title: "Smart Watch",
        price: 449.0,
        image:
          "https://http2.mlstatic.com/D_NQ_NP_619994-MLU74591229718_022024-O.webp",
        link: "https://www.mercadolivre.com.br/smartband-samsung-galaxy-fit3-tela-amoled-16-pulseira-esportiva-prata-resistente-agua-monitor-cardiaco/p/MLB34062353",
      },
    ];

    exampleProductList.innerHTML = exampleProducts
      .map(
        (product) => `
          <div class="product-card-example">
            <a href="${product.link}" target="_blank">
              <img src="${product.image}" alt="${product.title}" />
            </a>
            <a href="${product.link}" target="_blank">
              <h3>${product.title}</h3>
            </a>
            <p class="product-price">${product.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}</p>
          </div>
        `
      )
      .join("");
  }

  displayExampleProducts();

  seachForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    exampleSection.style.display = "none";

    const inputValue = event.target[0].value;

    const data = await fetch(`${API_BASE_URL}${inputValue}`);

    const products = (await data.json()).results.slice(0, 10);

    displayItems(products);
    updatePriceChart(products);
  });

  function displayItems(products) {
    productList.innerHTML = products
      .map(
        (product) => `
          <div class="product-card">
            <a href="${product.permalink}" target="_blank">
              <img src="${product.thumbnail.replace(
                /\w\.jpg/gi,
                "W.jpg"
              )}" alt="${product.title}" />
            </a>
            <a href="${product.permalink}" target="_blank">
              <h3>${product.title}</h3>
            </a>
            <p class="product-price">${product.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}</p>
            <p class="product-store">Loja: ${product.seller.nickname}</p>
            <a href="${
              product.permalink
            }" target="_blank" class="details-button">Veja mais detalhes</a>
          </div>
        `
      )
      .join("");

    productList.classList.add("show");
    priceChat.style.display = "block";
  }

  function updatePriceChart(products) {
    const ctx = priceChat.getContext("2d");

    if (myChart) {
      myChart.destroy();
    }

    myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: products.map(
          (product) => product.title.substring(0, 20) + "..."
        ),
        datasets: [
          {
            label: "Preço (R$)",
            data: products.map((product) => product.price),
            backgroundColor: "rgba(46, 204, 113, 0.6)",
            borderColor: "rgba(46, 204, 113, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                });
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Comparação de preços",
            font: {
              size: 18,
            },
          },
        },
      },
    });
  }

  title.addEventListener("click", () => {
    productList.innerHTML = "";
    productList.classList.remove("show");

    priceChat.style.display = "none";

    seachForm.reset();

    exampleSection.style.display = "block";
  });
});

const parentContainer = document.querySelector("#main-container");

const totalShipsNode = document.querySelector("#total-ships");
const allShipsContainer = document.createElement("ul");
const h2TitleGroup = document.querySelectorAll("h2");

parentContainer.insertBefore(allShipsContainer, totalShipsNode);

const fillTheListWithSons = (parentElement, objectGroup) => {
  console.log(objectGroup);
  const parent = parentElement;
  parent.innerHTML = objectGroup.reduce(
    (oldStringConcatenation, currentStringConcatenation) =>
      `${oldStringConcatenation} <p>${currentStringConcatenation.name}<p>`,
    ``
  );
};

const renderingAllShips = async () => {
  const response = await fetch("https://swapi.dev/api/starships/");
  const { count, results } = await response.json();
  const itemsPerPage = results.length;
  const numberOfFetches = Math.ceil(count / itemsPerPage);
  const pagesGroup = new Array(numberOfFetches).fill("empty");
  const totalShipsResponse = await Promise.all(
    pagesGroup.map((placeHolder, index) =>
      fetch(`https://swapi.dev/api/starships/?page=${index + 1}`)
    )
  );
  const pagesResponse = Promise.all(
    totalShipsResponse.map((promisePage) => promisePage.json())
  );

  const pagesData = await pagesResponse;
  const shipsGroup = pagesData
    .map((page) => page.results)
    .reduce(
      (oldShipsGroup, newShipsGroup) => [...oldShipsGroup, ...newShipsGroup],
      []
    );
  parentContainer.insertBefore(
    document.createTextNode(`${count}`),
    h2TitleGroup[1]
  );
  fillTheListWithSons(allShipsContainer, shipsGroup);
};

renderingAllShips();

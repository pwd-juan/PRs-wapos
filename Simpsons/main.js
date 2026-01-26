const CartaPersonaje = document.querySelector("#cartaPersonaje");
const DivImg = document.querySelector("#cartaPersonaje img");
const DivNombre = document.querySelector("#cartaPersonaje h2");
const DivEstado = document.querySelector("#cartaPersonaje h3");
const DivCarga = document.querySelector(".loader .circle")
const Random = document.querySelector("#random");
const CantPersonajes = 1182;
const UrlBase = "https://thesimpsonsapi.com/api/characters/";
const UrlBaseImg = "https://cdn.thesimpsonsapi.com/500";

let idPersonaje;
let datosPersonaje;


Random.addEventListener('click', construir);

function construir() {
    idPersonaje = generarIdRandom(CantPersonajes);
    
    if (DivCarga.className.lastIndexOf(" ") != -1) {
        DivImg.classList.add("hide");
        DivNombre.classList.add("hide");
        DivEstado.classList.add("hide");
        DivCarga.classList.remove("hide");
    }

    fetch(UrlBase + idPersonaje).then(
        (res) => {
            return res.json();
        }
    ).then((json) => {
        DivImg.classList.remove("hide");
        DivImg.src = UrlBaseImg + json["portrait_path"];
        DivImg.alt = "Imagen de " + json["name"] + " de los Simpsons.";
        DivCarga.classList.add("hide");

        DivNombre.classList.remove("hide");
        DivEstado.classList.remove("hide");

        DivNombre.textContent = json["name"];
        
        DivEstado.textContent = json["status"];
    });
}

function generarIdRandom(idMax) {
    return Math.floor(Math.random() * idMax + 1);
}

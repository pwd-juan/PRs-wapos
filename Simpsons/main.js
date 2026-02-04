const CartaPersonaje = document.querySelector("#cartaPersonaje");
const DivImg = document.querySelector("#cartaPersonaje img");
const DivNombre = document.querySelector("#cartaPersonaje h2");
const DivEstado = document.querySelector("#cartaPersonaje h3");
const DivGenero = document.querySelector("#genero");
const DivGeneroImg = document.querySelector("#genero img");
const DivCarga = document.querySelector(".loader .circle")
const Random = document.querySelector("#random");
const DivContLista = document.querySelector("#listaFavs");
const DivGaleria = document.querySelector("#listaFavs main");
const CantPersonajes = 1182;
const BotonGusta = document.querySelector("#fav");
const BotonLista = document.querySelector("#lista");
const BotonCerrar = document.querySelector("#listaFavs header button");
const UrlBase = "https://thesimpsonsapi.com/api/characters/";
const UrlBaseImg = "https://cdn.thesimpsonsapi.com/500";

const BotonBusqueda = document.querySelector("#botonBusqueda");
const CuadroBusqueda = document.querySelector("#cuadroBusqueda");

let idPersonaje;
let listaPersonajes = crearAlmacenamiento();

Random.addEventListener('click', ()=>{ 
    idPersonaje = generarIdRandom(CantPersonajes); 
    construir(idPersonaje); 
});
BotonGusta.addEventListener('click', iterarLista);
BotonLista.addEventListener('click', mostrarLista);
BotonCerrar.addEventListener('click', () => { DivContLista.classList.add("hide"); })
DivGaleria.addEventListener('click', (e) => { eliminarDeLista(e) })
BotonBusqueda.addEventListener('click', ()=>{
    let contenido = parseInt(CuadroBusqueda.value, 10);
    if (!contenido) return;
    idPersonaje = contenido;
    construir(contenido);
});

function construir(id) {
    if (DivCarga.className.lastIndexOf(" ") != -1) {
        DivImg.classList.add("hide");
        DivNombre.classList.add("hide");
        DivEstado.classList.add("hide");
        DivGenero.classList.add("hide");
        DivGenero.classList.remove("genero");
        DivCarga.classList.remove("hide");
    }

    fetch(UrlBase + id).then(
        (res) => {
            return res.json();
        }
    ).then((json) => {
        let imgGenero = obtenerImgGenero(json["gender"]);

        DivImg.src = UrlBaseImg + json["portrait_path"];
        DivImg.alt = "Imagen de " + json["name"] + " de los Simpsons.";
        DivGeneroImg.src = imgGenero;
        DivGeneroImg.alt = "Genere: " + json["gender"];
        DivGeneroImg.title = "Genere: " + json["gender"];

        DivNombre.textContent = json["name"];
        DivEstado.textContent = json["status"];

        DivImg.classList.remove("hide");
        DivNombre.classList.remove("hide");
        DivEstado.classList.remove("hide");
        DivGenero.classList.remove("hide");
        DivGenero.classList.add("genero");
        DivCarga.classList.add("hide");
    });
}

function obtenerImgGenero(x) {
    if (x === "Male") {
        return "img/genero/m.png";
    } else if (x === "Female") {
        return "img/genero/f.png";
    } else {
        return "img/genero/n.gif";
    }
}

function generarIdRandom(idMax) {
    return Math.floor(Math.random() * idMax + 1);
}

function iterarLista() {
    console.log(idPersonaje)
    if (
        idPersonaje !== undefined &&
        !(estaRepetido(idPersonaje))
    ) {
        listaPersonajes.push(idPersonaje);
        localStorage.setItem("favs", listaPersonajes);
    }
}

function mostrarLista() {
    DivContLista.classList.toggle("hide");

    limpiarGaleria();
    recuperarDatos();
}

function limpiarGaleria() {
    while (DivGaleria.firstChild) {
        DivGaleria.removeChild(DivGaleria.firstChild);
    }
}

function recuperarDatos() {
    listaPersonajes.forEach(id => {
        fetch(UrlBase + id)
            .then(
                (res) => {
                    return res.json();
                }
            ).then(
                (json) => {
                    let article = document.createElement("article");
                    let img = document.createElement("img");
                    let h3 = document.createElement("h3");
                    let button = document.createElement("button");
                    let imgButton = document.createElement("img");
                    button.classList.add("boton");

                    img.src = UrlBaseImg + json["portrait_path"];
                    h3.textContent = 'ID: ' + json["id"];
                    imgButton.src = "img/x.png";
                    imgButton.alt = "Icono boton cerrar.";
                    imgButton.id = id;
                    button.id = id;

                    button.appendChild(imgButton);

                    article.appendChild(img);
                    article.appendChild(h3);
                    article.appendChild(button);
                    DivGaleria.appendChild(article);
                }
            )
    });
}

function crearAlmacenamiento() {
    let lista = [];

    if (!localStorage.getItem("favs")) {
        localStorage.setItem("favs", lista);
    } else {
        listaStr = localStorage.getItem("favs");

        // https://dev.to/soyleninjs/6-formas-de-convertir-un-string-en-array-con-javascript-320n
        lista = listaStr.split(',');

        for (let i = 0; i < lista.length; i++) {
            if (typeof (lista[i]) == 'string') {
                lista[i] = parseInt(lista[i], 10);
            }
        }
    }

    return lista;
}

function estaRepetido(idBuscar) {
    return listaPersonajes.includes(idBuscar);
}

function eliminarDeLista(e) {
    if (!e.target.id) return;

    let idEliminar = parseInt(e.target.id, 10);

    listaPersonajes.splice(listaPersonajes.lastIndexOf(idEliminar), 1);

    localStorage.setItem("favs", listaPersonajes);

    e.target.closest("article").remove();
}
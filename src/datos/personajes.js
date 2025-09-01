import instance from "./api";
import { useEffect, useState } from 'react';
import axios from "axios";
import Modal from "./modal";
import './per.css';

const Personajes = () => {
  const [Personajes, setPersonajes] = useState([]);
  const [Error, setError] = useState(null);

  const [Seleccionado, setSeleccionado] = useState(null);
  const [InfoAdi, setInfoAdi] = useState({ films: [], vehicles: [], starships: [] });

  const[PagActual, setPagActual] = useState(1);
  const Campos = 10;
  
  useEffect(() => {
    const ObtenerPersonajes = async () => {
      try {
        const res = await instance.get("api/people");
        const perDatos = res.data;

        const perConPlaneta = await Promise.all(
          perDatos.map(async (p) => {
            try {
              const planetaRes = await instance.get(p.homeworld);
              return { ...p, planeta: planetaRes.data.name || "Desconocido" };
            } catch {
              return { ...p, planeta: "Desconocido" };
            }
          })
        );

        setPersonajes(perConPlaneta);
      } catch (err) {
        setError(err);
      }
    };

    ObtenerPersonajes();
  }, []);

  const CardClick = async (personaje) => {
    setSeleccionado (personaje);

    try {
      const films = await Promise.all(personaje.films.map(url => axios.get(url).then(res => res.data.title)));
      const vehicles = await Promise.all(personaje.vehicles.map(url => axios.get(url).then(res => res.data.name)));
      const starships = await Promise.all(personaje.starships.map(url => axios.get(url).then(res => res.data.name)));
    
      setInfoAdi({ films, vehicles, starships});
    } catch (error) {
      console.error("Error cargando datos adicionales", error);
    }
  };

  const LimpiarSeleccion = () => {
    setSeleccionado(null);
    setInfoAdi({ films: [], vehicles: [], starships: [] });
  };

  if (Error) {
    return (
      <p style={{ textAlign: "center", color: "red" }}>
        Error: {Error.message || "Ocurrió un error"}
      </p>
    );
  }

   const UltimoDato = PagActual * Campos;
   const PrimerDato = UltimoDato - Campos;
   const DatoActual = Personajes.slice(PrimerDato, UltimoDato);
   const PagTotales = Math.ceil(Personajes.length / Campos);

  return (
    <div className="per-contenedor">
        <h2 className="titulo">Personajes de Star Wars</h2>

        <div className="per-grid">
            {DatoActual.map((p) => (
                <div
                key={p.id}
                className="per-card"
                onClick={() => CardClick(p)}
                >
                    <h3 className="per-name">{p.name}</h3>
                    <div class="per-info">
                        <span class="label">Altura:</span>
                        <span class="value">{p.height} cm</span>
                    </div>
                    <div class="per-info">
                        <span class="label">Peso:</span>
                        <span class="value">{p.mass} kg</span>
                    </div>
                    <div class="per-info">
                        <span class="label">Color de Cabello:</span>
                        <span class="value">{p.hair_color}</span>
                    </div>
                    <div class="per-info">
                        <span class="label">Color de Piel:</span>
                        <span class="value">{p.skin_color}</span>
                    </div>
                    <div class="per-info">
                        <span class="label">Color de Ojos:</span>
                        <span class="value">{p.eye_color}</span>
                    </div>
                    <div class="per-info">
                        <span class="label">Fecha de Nacimiento:</span>
                        <span class="value">{p.birth_year}</span>
                    </div>
                    <div class="per-info">
                        <span class="label">Género:</span>
                        <span class="value">{p.gender}</span>
                    </div>
                    <div class="per-info">
                        <span class="label">Planeta de Nacimiento:</span>
                        <span class="value">{p.planeta}</span>
                    </div>
                </div>

            ))}
        </div>
        <div className="paginacion">
                <button onClick={() => setPagActual(PagActual -1)} disabled={PagActual === 1}>Anterior</button>
                <span>Pagina {PagActual} de {PagTotales}</span>
                <button onClick={() => setPagActual(PagActual + 1)} disabled={PagActual === PagTotales}>Siguiente</button>
        </div>

        <Modal
          isOpen={!!Seleccionado}
          onClose={LimpiarSeleccion}
          personaje={{ ...Seleccionado, ...InfoAdi}}
        />
    </div>
  );
};

export default Personajes;
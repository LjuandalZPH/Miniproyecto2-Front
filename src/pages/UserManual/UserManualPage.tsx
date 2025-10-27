import { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { FaHome, FaFilm, FaHeart, FaSearch, FaUniversalAccess } from "react-icons/fa";
import "./UserManualPage.scss";
import type { JSX } from "react";

/**
 * Represents a section within the user manual.
 * @typedef {Object} Section
 * @property {string} title - The title of the section.
 * @property {JSX.Element} icon - The icon displayed next to the title.
 * @property {JSX.Element} content - The content displayed when the section is expanded.
 * @property {string} [videoUrl] - Optional URL for the demo video.
 */
interface Section {
  title: string;
  icon: JSX.Element;
  content: JSX.Element;
  videoUrl?: string;
}

/**
 * Renders the User Manual page component.
 * Includes expandable accordion sections with text and video demonstrations.
 *
 * @function UserManualPage
 * @returns {JSX.Element} A rendered user manual with accessible sections and videos.
 */
export const UserManualPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /**
   * Toggles a section open or closed when the header is clicked.
   *
   * @param {number} index - The index of the section to be toggled.
   * @returns {void}
   */
  const toggleSection = (index: number): void =>
    setOpenIndex(openIndex === index ? null : index);

  /**
   * Defines all sections displayed in the user manual.
   *
   * @constant
   * @type {Section[]}
   */
  const sections: Section[] = [
    {
      title: "Introducción",
      icon: <FaFilm />,
      content: (
        <p>
          Bienvenido a la <b>Aplicación de Películas</b>. Esta guía te mostrará cómo navegar, buscar y gestionar tus películas favoritas.
          <br />
          <b>Consejos:</b> Asegúrate siempre de iniciar sesión para acceder a funciones personalizadas como favoritos e historial.
          <br />
          <b>Accesibilidad:</b> Todos los elementos interactivos son accesibles mediante teclado e incluyen etiquetas ARIA.
        </p>
      ),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      title: "Navegación",
      icon: <FaHome />,
      content: (
        <ul>
          <li><b>Inicio:</b> Descubre películas destacadas, títulos en tendencia y nuevos lanzamientos. Las secciones están claramente etiquetadas para facilitar la navegación con teclado.</li>
          <li><b>Películas:</b> Explora todos los títulos disponibles y mira los tráilers. Usa la barra de búsqueda para filtrar resultados rápidamente.</li>
          <li><b>Favoritos:</b> Guarda películas para ver más tarde. Los lectores de pantalla anuncian el estado de favorito para mejorar la accesibilidad.</li>
          <li><b>Perfil:</b> Administra la configuración de tu cuenta, actualiza tu contraseña y revisa tu historial de visualización.</li>
        </ul>
      ),
      videoUrl: "https://www.w3schools.com/html/movie.mp4",
    },
    {
      title: "Reproducción de Video",
      icon: <FaFilm />,
      content: (
        <p>
          Haz clic en cualquier tarjeta de película para abrir el reproductor del tráiler. Usa los controles de pantalla completa, silencio y pausa/reproducción según lo necesites.
          <br />
          <b>Consejos:</b> Pasa el cursor sobre los videos para reproducirlos automáticamente. Para mayor accesibilidad, puedes habilitar subtítulos si están disponibles.
          <br />
          <b>Accesibilidad:</b> Los controles son navegables con teclado y muestran estados de enfoque para los lectores de pantalla.
        </p>
      ),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      title: "Favoritos",
      icon: <FaHeart />,
      content: (
        <div>
          <p>
            La función de <b>Favoritos</b> te permite mantener una lista personalizada de las películas que más te gustan. Puedes acceder a ellas en cualquier momento, incluso después de recargar la aplicación.
          </p>

          <ol>
            <li>
              Haz clic en el ícono <FaHeart color="#ff6b6b" /> en cualquier tarjeta de película para agregarla a tu lista de favoritos.
            </li>
            <li>
              Para eliminar una película, simplemente haz clic en el mismo ícono nuevamente — se desactivará.
            </li>
            <li>
              Accede a todos tus favoritos guardados desde la sección <b>Favoritos</b> en la barra de navegación principal.
            </li>
          </ol>

          <p>
            <b>Cómo funciona:</b> Tus películas favoritas se almacenan de forma segura en el almacenamiento local de tu navegador, garantizando acceso instantáneo sin necesidad de iniciar sesión. No se envían datos a servidores externos.
          </p>

          <p>
            <b>Consejos de accesibilidad:</b> Todos los íconos de corazón incluyen etiquetas ARIA y soporte para teclado (<kbd>Tab</kbd> + <kbd>Enter</kbd> para alternar). Los lectores de pantalla anuncian los cambios de estado.
          </p>

          <p>
            <b>Solución de problemas:</b> Si tu lista de favoritos aparece vacía, verifica que el almacenamiento o las cookies de tu navegador no estén deshabilitados, ya que son necesarios para recordar las películas guardadas.
          </p>
        </div>
      ),
      videoUrl: "https://www.w3schools.com/html/movie.mp4",
    },
    {
      title: "Búsqueda",
      icon: <FaSearch />,
      content: (
        <p>
          Usa la barra de búsqueda para encontrar películas rápidamente por título o palabra clave. Los resultados se actualizan dinámicamente mientras escribes.
          <br />
          <b>Consejos:</b> Incluye palabras clave como género o nombre de actor para obtener resultados más precisos.
          <br />
          <b>Accesibilidad:</b> El campo de búsqueda tiene una etiqueta ARIA y es totalmente operable con el teclado.
        </p>
      ),
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      title: "Accesibilidad (WCAG)",
      icon: <FaUniversalAccess />,
      content: (
        <ul>
          <li>Soporte de navegación por teclado en todos los botones, menús y elementos interactivos.</li>
          <li>Diseño de alto contraste para mejorar la legibilidad de usuarios con discapacidad visual.</li>
          <li>Indicadores de enfoque, etiquetas ARIA y notificaciones accesibles para lectores de pantalla.</li>
          <li>Todos los videos incluyen reproducción al pasar el cursor y subtítulos opcionales cuando están disponibles.</li>
        </ul>
      ),
    },
  ];

  return (
    <div className="user-manual-page">
      <Navbar />
      <header className="manual-header">
        <h1>Manual de Usuario</h1>
        <p>Guía interactiva con demostraciones en video y cumplimiento de accesibilidad.</p>
      </header>

      <main className="manual-content">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`accordion-section ${openIndex === index ? "open" : ""}`}
          >
            <button
              className="accordion-title"
              onClick={() => toggleSection(index)}
              aria-expanded={openIndex === index}
            >
              <span className="icon">{section.icon}</span>
              {section.title}
              <span className="arrow">{openIndex === index ? "▲" : "▼"}</span>
            </button>

            {openIndex === index && (
              <div className="accordion-content">
                {section.content}
                {section.videoUrl && (
                  <div className="video-container">
                    <video
                      src={section.videoUrl}
                      muted
                      loop
                      playsInline
                      preload="none"
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                    />
                    <p className="hint">(Pasa el cursor sobre el video para reproducir la demostración)</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};

// Initialize Mapbox with your access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYWxlamFuZHJvcXVpbnRvIiwiYSI6ImNseDZxbGFpcjE1ZHMyanNjZWg1eDIzejkifQ.VYiLvOBYgX5WwchhqO0I8w';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-3.7038, 40.4168], // Centrado en España
    zoom: 5
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', () => {
    map.addSource('flood-risk', {
        type: 'geojson',
        data: 'riesgo-inundacion.geojson'
    });

    map.addLayer({
        id: 'flood-risk-lines',
        type: 'line',
        source: 'flood-risk',
        layout: {},
        paint: {
            'line-color': '#FF6347', // Color de las líneas de riesgo
            'line-width': 2
        }
    });

    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    // Mostrar popup con información detallada en español y estilos diferenciados
    map.on('mousemove', 'flood-risk-lines', (e) => {
        const properties = e.features[0].properties;
        popup.setLngLat(e.lngLat)
            .setHTML(`
                <div style="font-family: Helvetica, sans-serif;">
                    <strong>Nombre del ARPSI:</strong> <span style="font-weight: normal;">${properties.NameofAPSF}</span><br>
                    <strong>Número de inundaciones registradas:</strong> <span style="font-weight: normal;">${properties['Nº_DE_INU']}</span><br>
                    <strong>Subregión:</strong> <span style="font-weight: normal;">${properties.NOMBRE_SUB}</span><br>
                    <strong>Longitud del caudal en peligro:</strong> <span style="font-weight: normal;">${properties.LONGITUD_S} km</span><br>
                    <strong>Fecha de Actualización:</strong> <span style="font-weight: normal;">${properties.FECHA_ÚLT}</span><br>
                    <strong>Criterio de selección:</strong> <span style="font-weight: normal;">${properties.CRIT_SELEC}</span>
                </div>
            `)
            .addTo(map);
    });

    map.on('mouseleave', 'flood-risk-lines', () => {
        popup.remove();
    });
});

// Cambiar el mensaje inicial en el cuadro de información
document.getElementById('info-box').innerHTML = 'Pasa el cursor por las áreas con riesgo potencial significativo de inundación para conocer más detalles';

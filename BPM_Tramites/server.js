const express = require('express');
const fs = require('fs');
const path = require('path');
const archivoTitulos = path.join(__dirname, 'data', 'titulos.json');
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use('/data', express.static('data'));
const archivoEstudiantes =
    path.join(__dirname,
    'data',
    'estudiantes.json');
const archivoMaterias =
path.join(
    __dirname,
    'data',
    'materias.json'
);
/* ==========================
   LEER JSON
========================== */

function obtenerEstudiantes(){

    if(!fs.existsSync(
        archivoEstudiantes
    )){
        fs.writeFileSync(
            archivoEstudiantes,
            '[]'
        );
    }

    return JSON.parse(
        fs.readFileSync(
            archivoEstudiantes,
            'utf8'
        )
    );
}

/* ==========================
   GUARDAR JSON
========================== */

function guardarEstudiantes(
    estudiantes
){

    fs.writeFileSync(
        archivoEstudiantes,
        JSON.stringify(
            estudiantes,
            null,
            4
        )
    );
}

/* ==========================
   REGISTRO
========================== */

app.post('/registro',
(req,res)=>{

    const nuevo =
        req.body;

    const estudiantes =
        obtenerEstudiantes();

    const existe =
        estudiantes.find(
            e => e.ru === nuevo.ru
        );

    if(existe){

        return res.status(400)
        .json({
            mensaje:
            'El RU ya existe'
        });
    }

    estudiantes.push(
        nuevo
    );

    guardarEstudiantes(
        estudiantes
    );

    res.json({
        mensaje:
        'Registro exitoso'
    });

});

/* ==========================
   LOGIN
========================== */

app.post('/login',
(req,res)=>{

    const {
        ru,
        password
    } = req.body;

    const estudiantes =
        obtenerEstudiantes();

    const usuario =
        estudiantes.find(
            e =>
            e.ru === ru &&
            e.password === password
        );

    if(usuario){

        return res.json({

            success:true,

            usuario:{

                ru:
                usuario.ru,

                nombre:
                usuario.nombre,

                carrera:
                usuario.carrera
            }

        });
    }

    res.status(401)
    .json({

        success:false,

        mensaje:
        'Credenciales incorrectas'

    });

});

/* ==========================
   LISTAR ESTUDIANTES
========================== */

app.get('/estudiantes',
(req,res)=>{

    const estudiantes =
        obtenerEstudiantes();

    res.json(
        estudiantes
    );

});

/* ==========================
   BUSCAR ESTUDIANTE
========================== */

app.get(
'/estudiantes/:ru',
(req,res)=>{

    const ru =
        req.params.ru;

    const estudiantes =
        obtenerEstudiantes();

    const estudiante =
        estudiantes.find(
            e => e.ru === ru
        );

    if(!estudiante){

        return res.status(404)
        .json({
            mensaje:
            'No encontrado'
        });
    }

    res.json(
        estudiante
    );

});

/* ==========================
   ACTUALIZAR
========================== */

app.put(
'/estudiantes/:ru',
(req,res)=>{

    const ru =
        req.params.ru;

    const datos =
        req.body;

    let estudiantes =
        obtenerEstudiantes();

    const indice =
        estudiantes.findIndex(
            e => e.ru === ru
        );

    if(indice === -1){

        return res.status(404)
        .json({
            mensaje:
            'No encontrado'
        });
    }

    estudiantes[indice] = {

        ...estudiantes[indice],

        ...datos
    };

    guardarEstudiantes(
        estudiantes
    );

    res.json({
        mensaje:
        'Actualizado'
    });

});
app.get('/materias',
(req,res)=>{

    const materias =
    JSON.parse(
        fs.readFileSync(
            archivoMaterias,
            'utf8'
        )
    );

    res.json(
        materias
    );

});
const archivoInscripciones =
path.join(
    __dirname,
    'data',
    'inscripciones.json'
);

app.post('/inscripcion',
(req,res)=>{

    const nuevaInscripcion =
        req.body;

    let inscripciones = [];

    if(fs.existsSync(
        archivoInscripciones
    )){

        inscripciones =
        JSON.parse(
            fs.readFileSync(
                archivoInscripciones,
                'utf8'
            )
        );
    }

    inscripciones.push(
        nuevaInscripcion
    );

    fs.writeFileSync(
        archivoInscripciones,
        JSON.stringify(
            inscripciones,
            null,
            4
        )
    );

    res.json({
        mensaje:
        'Inscripción registrada'
    });

});
app.get('/inscripciones',
(req,res)=>{

    let inscripciones = [];

    if(fs.existsSync(
        archivoInscripciones
    )){

        inscripciones =
        JSON.parse(
            fs.readFileSync(
                archivoInscripciones,
                'utf8'
            )
        );
    }

    res.json(
        inscripciones
    );

});

/* ==========================
   SERVIDOR
========================== */

app.listen(3000,()=>{

    console.log(
        'Servidor ejecutándose en:'
    );

    console.log(
        'http://localhost:3000'
    );

});

app.post('/solicitud-titulo', (req, res) => {
    const { ru, modalidad, proyecto } = req.body;

    if (!ru || !modalidad) {
        return res.status(400).json({ mensaje: 'Datos insuficientes para el trámite.' });
    }

    let titulos = [];
    if (fs.existsSync(archivoTitulos)) {
        titulos = JSON.parse(fs.readFileSync(archivoTitulos, 'utf8'));
    }

    // Verificar si ya tiene un trámite de título en curso
    const tramiteExiste = titulos.find(t => t.ru === ru && t.estado_actual !== 'Rechazado');
    if (tramiteExiste) {
        return res.status(400).json({ mensaje: 'Ya cuentas con un trámite de titulación activo.' });
    }

    const idTramite = `TIT-${Date.now()}`;
    const nuevaSolicitud = {
        id_tramite: idTramite,
        ru: ru,
        modalidad: modalidad,
        proyecto: proyecto || 'No aplica',
        estado_actual: 'Revision_Documentos',
        fecha_creacion: new Date().toISOString()
    };

    titulos.push(nuevaSolicitud);
    fs.writeFileSync(archivoTitulos, JSON.stringify(titulos, null, 4));

    // Guardar traza en el historial
    let historial = [];
    if (fs.existsSync(archivoHistorial)) {
        historial = JSON.parse(fs.readFileSync(archivoHistorial, 'utf8'));
    }
    
    historial.push({
        id_log: `LOG-${Date.now()}`,
        id_tramite: idTramite,
        estado_anterior: 'Ninguno',
        estado_nuevo: 'Revision_Documentos',
        fecha_cambio: new Date().toISOString(),
        responsable: 'Sistema (Estudiante)',
        observaciones: `Solicitud de título iniciada bajo la modalidad de ${modalidad}.`
    });
    fs.writeFileSync(archivoHistorial, JSON.stringify(historial, null, 4));

    res.json({
        mensaje: 'Trámite de titulación iniciado correctamente',
        id_tramite: idTramite
    });
});
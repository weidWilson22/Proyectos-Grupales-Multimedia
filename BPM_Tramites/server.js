const express = require('express');
const fs = require('fs');
const path = require('path');
const archivoTitulos = path.join(__dirname, 'data', 'titulos.json');
const app = express();
const archivoHistorial = path.join(__dirname, 'data', 'historial.json');
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

/* GUARDAR JSON*/

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

/* =====REGISTR0*/

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

/*LOGIN*/

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

const archivoRequisitosJson = path.join(__dirname, 'data', 'requisitos.json');

// 2. Tu endpoint único, unificado y corregido
// =========================================================================
// ENDPOINTS DE TRÁMITES DE TITULACIÓN (ESTUDIANTES Y ADMINISTRACIÓN)
// =========================================================================

// 1. Crear o iniciar la solicitud de titulación (Estudiante)
app.post('/solicitud-titulo', (req, res) => {
    const archivoRequisitosJson = path.join(__dirname, 'data', 'requisitos.json');
    const archivoRecordJson = path.join(__dirname, 'data', 'record_academico.json');

    const { ru, nombre, ci, modalidad, proyecto } = req.body;

    if (!ru || !ci || !proyecto) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios en el formulario.' });
    }

    // ==========================================
    // VALIDACIÓN 1: REVISAR EL RÉCORD ACADÉMICO REAL
    // ==========================================
    if (fs.existsSync(archivoRecordJson)) {
        const registroAcademico = JSON.parse(fs.readFileSync(archivoRecordJson, 'utf8'));
        
        // Buscamos al estudiante por su R.U. dentro del archivo
        const estudianteInfo = registroAcademico.find(e => e.ru === ru);

        if (!estudianteInfo) {
            return res.status(400).json({ 
                mensaje: `No se encontró un récord académico para el R.U. ${ru}. Verifique sus datos.` 
            });
        }

        // Validamos si tiene la lista de materias aprobadas y cuenta con registros
        if (!estudianteInfo.materiasAprobadas || estudianteInfo.materiasAprobadas.length === 0) {
            return res.status(400).json({ 
                mensaje: 'El estudiante no cuenta con materias concluidas en su historial académico.' 
            });
        }

        // Validación de cantidad mínima de materias aprobadas para titulación
        if (estudianteInfo.materiasAprobadas.length < 5) {
            return res.status(400).json({ 
                mensaje: 'No cumple con la cantidad mínima de materias aprobadas para titulación.' 
            });
        }

        console.log(`✅ Récord aprobado para R.U. ${ru}. Materias concluidas: ${estudianteInfo.materiasAprobadas.length}`);
        
    } else {
        console.log("Aviso: record_academico.json no detectado físicamente.");
    }

    // ==========================================
    // VALIDACIÓN 2: VERIFICAR SOLICITUD DUPLICADA
    // ==========================================
    let titulos = [];
    if (fs.existsSync(archivoRequisitosJson)) {
        titulos = JSON.parse(fs.readFileSync(archivoRequisitosJson, 'utf8'));
    }

    const tramiteExiste = titulos.find(t => t.ru === ru && t.estado_actual !== 'Rechazado');
    if (tramiteExiste) {
        return res.status(400).json({ mensaje: 'Ya cuentas con un trámite de titulación activo o pendiente.' });
    }

    // ==========================================
    // 3. GUARDAR EN TU REQUISITOS.JSON
    // ==========================================
    const idTramite = `TIT-${Date.now()}`;
    
    const nuevaSolicitud = {
        id_tramite: idTramite,
        ru: ru,
        nombre_estudiante: nombre,
        ci_estudiante: ci,
        modalidad: modalidad || 'Tesis de Grado',
        proyecto: proyecto, 
        estado_actual: 'Revision_Documentos',
        fecha_creacion: new Date().toISOString()
    };

    titulos.push(nuevaSolicitud);
    fs.writeFileSync(archivoRequisitosJson, JSON.stringify(titulos, null, 4));

    res.json({
        mensaje: 'Trámite de titulación iniciado correctamente',
        id_tramite: idTramite
    });
});

// 2. Obtener todas las solicitudes registradas (Admin)
app.get('/admin/solicitudes', (req, res) => {
    const archivoRequisitosJson = path.join(__dirname, 'data', 'requisitos.json');
    
    let titulos = [];
    if (fs.existsSync(archivoRequisitosJson)) {
        titulos = JSON.parse(fs.readFileSync(archivoRequisitosJson, 'utf8'));
    }
    
    res.json(titulos);
});

// 3. Cambiar el estado o aceptar la solicitud (Admin)
app.post('/admin/cambiar-estado', (req, res) => {
    const archivoRequisitosJson = path.join(__dirname, 'data', 'requisitos.json');
    const { id_tramite, nuevo_estado } = req.body;

    if (!id_tramite || !nuevo_estado) {
        return res.status(400).json({ mensaje: 'Faltan parámetros obligatorios.' });
    }

    let titulos = [];
    if (fs.existsSync(archivoRequisitosJson)) {
        titulos = JSON.parse(fs.readFileSync(archivoRequisitosJson, 'utf8'));
    }

    // Buscamos el trámite por su ID único
    const tramite = titulos.find(t => t.id_tramite === id_tramite);

    if (!tramite) {
        return res.status(404).json({ mensaje: 'No se encontró el trámite especificado.' });
    }

    // Actualizamos el estado (ej. de 'Revision_Documentos' a 'Aprobado')
    tramite.estado_actual = nuevo_estado;

    // Sobrescribimos el archivo con el estado actualizado
    fs.writeFileSync(archivoRequisitosJson, JSON.stringify(titulos, null, 4));

    res.json({ 
        mensaje: `El trámite ha sido actualizado a: ${nuevo_estado} con éxito.` 
    });
});


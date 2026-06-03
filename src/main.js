import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import GUI from 'lil-gui';

const ALTURA_BASE = 5;
const LONGITUD_BRAZO1 = 10;
const LONGITUD_BRAZO2 = 7;
const LONGITUD_BRAZO3_INICIAL = 20;

const ESCENA = new THREE.Scene();
ESCENA.background = new THREE.Color(0xffffff);

const CAMARA = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

CAMARA.position.set(50, 40, 50);
CAMARA.lookAt(0, 25, 0);

const RENDERIZADOR = new THREE.WebGLRenderer({ antialias: true });
RENDERIZADOR.setSize(window.innerWidth, window.innerHeight);
RENDERIZADOR.setPixelRatio(window.devicePixelRatio);
RENDERIZADOR.shadowMap.enabled = true;

document.getElementById('canvas-container')
    .appendChild(RENDERIZADOR.domElement);

const RENDERIZADOR_ETIQUETAS = new CSS2DRenderer();
RENDERIZADOR_ETIQUETAS.setSize(window.innerWidth, window.innerHeight);

RENDERIZADOR_ETIQUETAS.domElement.style.position = 'absolute';
RENDERIZADOR_ETIQUETAS.domElement.style.top = '0px';
RENDERIZADOR_ETIQUETAS.domElement.style.pointerEvents = 'none';

document.getElementById('canvas-container')
    .appendChild(RENDERIZADOR_ETIQUETAS.domElement);

const CONTROL_CAMARA = new OrbitControls(
    CAMARA,
    RENDERIZADOR.domElement
);

CONTROL_CAMARA.enableDamping = true;
CONTROL_CAMARA.target.set(0, 25, 0);

ESCENA.add(new THREE.AmbientLight(0x404050, 0.8));

const LUZ_DIRECCIONAL = new THREE.DirectionalLight(0xffffff, 1.2);
LUZ_DIRECCIONAL.position.set(50, 100, 50);
ESCENA.add(LUZ_DIRECCIONAL);

ESCENA.add(
    new THREE.PointLight(0x64c8ff, 0.5, 200)
        .position.set(-30, 50, -30)
);

function crearEtiquetaHTML(texto, color = '#333', tamanoFuente = '10px') {
    const div = document.createElement('div');

    div.className = 'grid-label';
    div.textContent = texto;

    div.style.color = color;
    div.style.fontSize = tamanoFuente;
    div.style.fontFamily = 'monospace';
    div.style.fontWeight = 'bold';

    return div;
}

function crearParedesCaja() {
    const tamanoCaja = 50;
    const alturaPared = 60;
    const paso = 10;

    const materialPared = new THREE.LineBasicMaterial({
        color: 0xcccccc
    });

    for (let h = 0; h <= alturaPared; h += paso) {
        const puntos = [
            new THREE.Vector3(-tamanoCaja, h, -tamanoCaja),
            new THREE.Vector3(tamanoCaja, h, -tamanoCaja),
            new THREE.Vector3(tamanoCaja, h, tamanoCaja),
            new THREE.Vector3(-tamanoCaja, h, tamanoCaja),
            new THREE.Vector3(-tamanoCaja, h, -tamanoCaja)
        ];

        ESCENA.add(
            new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(puntos),
                materialPared
            )
        );
    }

    for (let x = -tamanoCaja; x <= tamanoCaja; x += paso) {
        ESCENA.add(
            new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(x, 0, -tamanoCaja),
                    new THREE.Vector3(x, alturaPared, -tamanoCaja)
                ]),
                materialPared
            )
        );

        ESCENA.add(
            new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(x, 0, tamanoCaja),
                    new THREE.Vector3(x, alturaPared, tamanoCaja)
                ]),
                materialPared
            )
        );
    }

    for (let z = -tamanoCaja; z <= tamanoCaja; z += paso) {
        ESCENA.add(
            new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(-tamanoCaja, 0, z),
                    new THREE.Vector3(-tamanoCaja, alturaPared, z)
                ]),
                materialPared
            )
        );

        ESCENA.add(
            new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(tamanoCaja, 0, z),
                    new THREE.Vector3(tamanoCaja, alturaPared, z)
                ]),
                materialPared
            )
        );
    }
}

function crearEtiquetas() {
    const rango = 50;

    for (let i = -rango; i <= rango; i += 10) {
        if (i === 0) continue;

        const etiqueta = new CSS2DObject(
            crearEtiquetaHTML(i.toString(), '#333', '12px')
        );
        etiqueta.position.set(i, 0.5, -rango - 5);
        ESCENA.add(etiqueta);

        const etiqueta2 = new CSS2DObject(
            crearEtiquetaHTML(i.toString(), '#333', '12px')
        );
        etiqueta2.position.set(i, 0.5, rango + 5);
        ESCENA.add(etiqueta2);
    }

    for (let h = 10; h <= 60; h += 10) {
        const etiquetaAltura = new CSS2DObject(
            crearEtiquetaHTML(h + ' cm', '#666', '12px')
        );

        etiquetaAltura.position.set(rango + 5, h, 0);
        ESCENA.add(etiquetaAltura);
    }

    const etiquetaEjeXPos = new CSS2DObject(
        crearEtiquetaHTML('+X', '#cc0000', '14px')
    );
    etiquetaEjeXPos.position.set(rango + 3, 1, 0);
    ESCENA.add(etiquetaEjeXPos);

    const etiquetaEjeXNeg = new CSS2DObject(
        crearEtiquetaHTML('-X', '#cc0000', '14px')
    );
    etiquetaEjeXNeg.position.set(-rango - 5, 1, 0);
    ESCENA.add(etiquetaEjeXNeg);

    const etiquetaEjeZPos = new CSS2DObject(
        crearEtiquetaHTML('+Z', '#00cc00', '14px')
    );
    etiquetaEjeZPos.position.set(0, 1, rango + 3);
    ESCENA.add(etiquetaEjeZPos);

    const etiquetaEjeZNeg = new CSS2DObject(
        crearEtiquetaHTML('-Z', '#00cc00', '14px')
    );
    etiquetaEjeZNeg.position.set(0, 1, -rango - 5);
    ESCENA.add(etiquetaEjeZNeg);

    const etiquetaEjeY = new CSS2DObject(
        crearEtiquetaHTML('+Y', '#0000cc', '14px')
    );
    etiquetaEjeY.position.set(-rango - 5, 15, 0);
    ESCENA.add(etiquetaEjeY);
}

crearParedesCaja();
crearEtiquetas();

ESCENA.add(new THREE.GridHelper(200, 20, 0xcccccc, 0xeeeeee));

const piso = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.9,
        transparent: true,
        opacity: 0.2
    })
);

piso.rotation.x = -Math.PI / 2;
ESCENA.add(piso);

function crearMaterial(color) {
    return new THREE.MeshStandardMaterial({
        color,
        roughness: 0.3,
        metalness: 0.7
    });
}

const materialBase = crearMaterial(0x1a1a1a);
const materialArticulacion = crearMaterial(0x808080);
const materialBrazo = crearMaterial(0xcccccc);
const materialPinza = crearMaterial(0xff8c00);

// --- Construcción del Robot ---

const mallaBase = new THREE.Mesh(
    new THREE.CylinderGeometry(8, 10, ALTURA_BASE, 32),
    materialBase
);
mallaBase.position.y = ALTURA_BASE / 2;
ESCENA.add(mallaBase);

const grupoArticulacion1 = new THREE.Group();
grupoArticulacion1.position.y = ALTURA_BASE;
ESCENA.add(grupoArticulacion1);

const mallaArticulacion1 = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    materialArticulacion
);
grupoArticulacion1.add(mallaArticulacion1);

const mallaBrazo1 = new THREE.Mesh(
    new THREE.CylinderGeometry(2, 2, LONGITUD_BRAZO1, 16),
    materialBrazo
);
mallaBrazo1.position.y = LONGITUD_BRAZO1 / 2;
grupoArticulacion1.add(mallaBrazo1);

const grupoArticulacion2 = new THREE.Group();
grupoArticulacion2.position.y = LONGITUD_BRAZO1;
grupoArticulacion1.add(grupoArticulacion2);

const mallaArticulacion2 = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 32, 32),
    materialArticulacion
);
grupoArticulacion2.add(mallaArticulacion2);

const mallaBrazo2 = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.5, LONGITUD_BRAZO2, 16),
    materialBrazo
);
mallaBrazo2.position.y = LONGITUD_BRAZO2 / 2;
grupoArticulacion2.add(mallaBrazo2);

const grupoArticulacion3 = new THREE.Group();
grupoArticulacion3.position.y = LONGITUD_BRAZO2;
grupoArticulacion2.add(grupoArticulacion3);

const mallaArticulacion3 = new THREE.Mesh(
    new THREE.SphereGeometry(2, 32, 32),
    materialArticulacion
);
grupoArticulacion3.add(mallaArticulacion3);

const mallaBrazo3 = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, LONGITUD_BRAZO3_INICIAL, 16),
    materialBrazo
);
mallaBrazo3.position.y = LONGITUD_BRAZO3_INICIAL / 2;
grupoArticulacion3.add(mallaBrazo3);

const grupoPinza = new THREE.Group();
grupoPinza.position.y = LONGITUD_BRAZO3_INICIAL;
grupoArticulacion3.add(grupoPinza);

// --- Gripper / Pinza ---

const basePinza = new THREE.Mesh(
    new THREE.CylinderGeometry(2, 2.5, 2, 16),
    materialPinza
);
basePinza.position.y = 1;
grupoPinza.add(basePinza);

const dedo1 = new THREE.Mesh(new THREE.BoxGeometry(1, 4, 1), materialPinza);
dedo1.position.set(-1.5, 4, 0);
grupoPinza.add(dedo1);

const dedo2 = new THREE.Mesh(new THREE.BoxGeometry(1, 4, 1), materialPinza);
dedo2.position.set(1.5, 4, 0);
grupoPinza.add(dedo2);

const puntaDedo1 = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), materialPinza);
puntaDedo1.position.set(-1.5, 6, 0);
grupoPinza.add(puntaDedo1);

const puntaDedo2 = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), materialPinza);
puntaDedo2.position.set(1.5, 6, 0);
grupoPinza.add(puntaDedo2);

// --- Lógica de Control y GUI ---

const articular = {
    uno: { angulo: 0, nombre: 'q1 (Base) [°]' },
    dos: { angulo: 0, nombre: 'q2 (Hombro) [°]' },
    tres: { longitud: 20, nombre: 'q3 (Codo) [cm]' }
};

const estadoGuardado = { uno: 0, dos: 0, tres: 20 };
const gui = new GUI({ title: 'Control del Robot' });

function mostrarAdvertencia(mensaje) {
    alert('VALOR FUERA DE RANGO\n\n' + mensaje);
}

let actualizando = false;

function validarYActualizar() {
    if (actualizando) return;

    let advertencia = '', valido = true;
    if (articular.uno.angulo < -45 || articular.uno.angulo > 225) {
        advertencia = 'q1: -45° a 225°';
        valido = false;
    } else if (articular.dos.angulo < 0 || articular.dos.angulo > 125) {
        advertencia = 'q2: 0° a 125°';
        valido = false;
    } else if (articular.tres.longitud < 0 || articular.tres.longitud > 30) {
        advertencia = 'q3: 0 a 30 cm';
        valido = false;
    }

    if (!valido) {
        mostrarAdvertencia(advertencia);
        articular.uno.angulo = estadoGuardado.uno;
        articular.dos.angulo = estadoGuardado.dos;
        articular.tres.longitud = estadoGuardado.tres;
        gui.controllersRecursive().forEach(c => c.updateDisplay());
        return;
    }

    estadoGuardado.uno = articular.uno.angulo;
    estadoGuardado.dos = articular.dos.angulo;
    estadoGuardado.tres = articular.tres.longitud;

    grupoArticulacion1.rotation.y = THREE.MathUtils.degToRad(articular.uno.angulo);
    grupoArticulacion2.rotation.x = THREE.MathUtils.degToRad(articular.dos.angulo);

    const escala = articular.tres.longitud / LONGITUD_BRAZO3_INICIAL;
    mallaBrazo3.scale.y = escala;
    mallaBrazo3.position.y = articular.tres.longitud / 2;
    grupoPinza.position.y = articular.tres.longitud;

    actualizarPosicionEfector();
}

function actualizarPosicionEfector() {
    const q1 = THREE.MathUtils.degToRad(articular.uno.angulo);
    const q2 = THREE.MathUtils.degToRad(articular.dos.angulo);
    const q3 = articular.tres.longitud;

    const c1 = Math.cos(q1), s1 = Math.sin(q1);
    const c2 = Math.cos(q2), s2 = Math.sin(q2);

    const q3_prof = LONGITUD_BRAZO2 + q3;
    const L1 = LONGITUD_BRAZO1;

    const marco3_x = q3_prof * c1 * s2;
    const marco3_y = q3_prof * s1 * s2;
    const marco3_z = q3_prof * c2 + L1;

    const pinza = 8;
    const total_x = marco3_x + pinza * c1 * s2;
    const total_y = marco3_y + pinza * s1 * s2;
    const total_z = marco3_z + pinza * c2;

    const threeX = total_y;
    const threeZ = total_x;
    const threeY = total_z + ALTURA_BASE;

    document.getElementById('pos-x').textContent = threeX.toFixed(1);
    document.getElementById('pos-y').textContent = threeY.toFixed(1);
    document.getElementById('pos-z').textContent = threeZ.toFixed(1);
}

function forwardKinematics(q1_rad, q2_rad, q3) {
    const c1 = Math.cos(q1_rad), s1 = Math.sin(q1_rad);
    const c2 = Math.cos(q2_rad), s2 = Math.sin(q2_rad);
    const d = LONGITUD_BRAZO2 + q3 + 8;
    return {
        x: d * s1 * s2,
        y: d * c2 + LONGITUD_BRAZO1 + ALTURA_BASE,
        z: d * c1 * s2
    };
}

gui.add(articular.uno, 'angulo').name(articular.uno.nombre).listen();
gui.add(articular.dos, 'angulo').name(articular.dos.nombre).listen();
gui.add(articular.tres, 'longitud').name(articular.tres.nombre).listen();

gui.onChange(() => validarYActualizar());

// --- Trayectoria ---

const trayectoria = {
    duracion: 3,
    q1_inicial: 0, q1_final: 90,
    q2_inicial: 0, q2_final: 45,
    q3_inicial: 20, q3_final: 25,
    enEjecucion: false,
    tiempoInicio: 0
};

let coeficientes = { q1: [], q2: [], q3: [] };

function calcularCoeficientesQuintico(q0, qf, t0, tf) {
    const T = tf - t0;
    const a0 = q0;
    const a1 = 0;
    const a2 = 0;
    const a3 = (20 * (qf - q0)) / (2 * T * T * T);
    const a4 = (-30 * (qf - q0)) / (2 * T * T * T * T);
    const a5 = (12 * (qf - q0)) / (2 * T * T * T * T * T);
    return [a0, a1, a2, a3, a4, a5];
}

function evaluarPolinomio(coef, t) {
    return coef[0] + coef[1] * t + coef[2] * t * t + coef[3] * t * t * t + coef[4] * t * t * t * t + coef[5] * t * t * t * t * t;
}

function validarRangoTrayectoria() {
    if (trayectoria.q1_inicial < -45 || trayectoria.q1_inicial > 225 ||
        trayectoria.q1_final < -45 || trayectoria.q1_final > 225) {
        alert('VALOR FUERA DE RANGO\n\nq1: -45° a 225°');
        return false;
    }
    if (trayectoria.q2_inicial < 0 || trayectoria.q2_inicial > 125 ||
        trayectoria.q2_final < 0 || trayectoria.q2_final > 125) {
        alert('VALOR FUERA DE RANGO\n\nq2: 0° a 125°');
        return false;
    }
    if (trayectoria.q3_inicial < 0 || trayectoria.q3_inicial > 30 ||
        trayectoria.q3_final < 0 || trayectoria.q3_final > 30) {
        alert('VALOR FUERA DE RANGO\n\nq3: 0 a 30 cm');
        return false;
    }
    return true;
}

function iniciarTrayectoria() {
    if (!validarRangoTrayectoria()) return;

    trayectoria.tiempoInicio = performance.now();
    coeficientes.q1 = calcularCoeficientesQuintico(
        trayectoria.q1_inicial, trayectoria.q1_final, 0, trayectoria.duracion
    );
    coeficientes.q2 = calcularCoeficientesQuintico(
        trayectoria.q2_inicial, trayectoria.q2_final, 0, trayectoria.duracion
    );
    coeficientes.q3 = calcularCoeficientesQuintico(
        trayectoria.q3_inicial, trayectoria.q3_final, 0, trayectoria.duracion
    );
    trayectoria.enEjecucion = true;
}

function resetearTrayectoria() {
    trayectoria.enEjecucion = false;
    articular.uno.angulo = trayectoria.q1_inicial;
    articular.dos.angulo = trayectoria.q2_inicial;
    articular.tres.longitud = trayectoria.q3_inicial;
    gui.controllersRecursive().forEach(c => c.updateDisplay());
    validarYActualizar();
}

const carpetaTrayectoria = gui.addFolder('Trayectoria (Polinomio 5° orden)');
carpetaTrayectoria.add(trayectoria, 'duracion').name('Duración [s]').onFinishChange(validarRangoTrayectoria);
carpetaTrayectoria.add(trayectoria, 'q1_inicial').name('q1 inicial [°]').onFinishChange(validarRangoTrayectoria);
carpetaTrayectoria.add(trayectoria, 'q1_final').name('q1 final [°]').onFinishChange(validarRangoTrayectoria);
carpetaTrayectoria.add(trayectoria, 'q2_inicial').name('q2 inicial [°]').onFinishChange(validarRangoTrayectoria);
carpetaTrayectoria.add(trayectoria, 'q2_final').name('q2 final [°]').onFinishChange(validarRangoTrayectoria);
carpetaTrayectoria.add(trayectoria, 'q3_inicial').name('q3 inicial [cm]').onFinishChange(validarRangoTrayectoria);
carpetaTrayectoria.add(trayectoria, 'q3_final').name('q3 final [cm]').onFinishChange(validarRangoTrayectoria);
carpetaTrayectoria.add({ iniciar: iniciarTrayectoria }, 'iniciar').name('Iniciar');
carpetaTrayectoria.add({ resetear: resetearTrayectoria }, 'resetear').name('Resetear');

// --- Trayectoria Cartesiana (xd, yd, zd) ---

const TIEMPO_INICIAL = 0;
const TIEMPO_FINAL = 10;
const T_MUESTREO = 0.01;

function inverseKinematics(x, y, z) {
    const L1 = LONGITUD_BRAZO1, L2 = LONGITUD_BRAZO2, base = ALTURA_BASE;
    const y_rel = y - L1 - base;
    const d = Math.sqrt(x*x + z*z + y_rel*y_rel);
    const eps = 0.01;
    const d_min = L2 + 8, d_max = L2 + 8 + 30;
    if (d < d_min - eps || d > d_max + eps) return null;
    const q1 = Math.atan2(x, z);
    const s2v = Math.sqrt(x*x + z*z) / d;
    const c2v = y_rel / d;
    let q2 = Math.atan2(s2v, c2v);
    if (q2 < 0) q2 = 0;
    const q3 = d - L2 - 8;
    const q1d = THREE.MathUtils.radToDeg(q1);
    const q2d = THREE.MathUtils.radToDeg(q2);
    const q1n = ((q1d % 360) + 360) % 360;
    if (q1n > 225 && q1n < 315) return null;
    if (q2d < 0 || q2d > 125 || q3 < 0 || q3 > 30) return null;
    return { q1: q1d, q2: q2d, q3 };
}

function posicionValida(x, y, z) {
    return inverseKinematics(x, y, z) !== null;
}

function coefQuinticoCartesiano(q0, qf, T) {
    const T3 = T*T*T, T4 = T3*T, T5 = T4*T;
    return [q0, 0, 0, 20*(qf-q0)/(2*T3), -30*(qf-q0)/(2*T4), 12*(qf-q0)/(2*T5)];
}

function generarDatosTrayectoria(xi, yi, zi, xf, yf, zf) {
    const T = TIEMPO_FINAL - TIEMPO_INICIAL;
    const cx = coefQuinticoCartesiano(xi, xf, T);
    const cy = coefQuinticoCartesiano(yi, yf, T);
    const cz = coefQuinticoCartesiano(zi, zf, T);
    const n = Math.floor(T / T_MUESTREO) + 1;
    const t = new Float64Array(n);
    const xd = new Float64Array(n);
    const yd = new Float64Array(n);
    const zd = new Float64Array(n);
    const q1d = new Float64Array(n);
    const q2d = new Float64Array(n);
    const q3d = new Float64Array(n);
    for (let i = 0; i < n; i++) {
        const ti = i * T_MUESTREO;
        t[i] = ti;
        xd[i] = evaluarPolinomio(cx, ti);
        yd[i] = evaluarPolinomio(cy, ti);
        zd[i] = evaluarPolinomio(cz, ti);
        const ik = inverseKinematics(xd[i], yd[i], zd[i]);
        if (ik) { q1d[i] = ik.q1; q2d[i] = ik.q2; q3d[i] = ik.q3; }
        else { q1d[i] = NaN; q2d[i] = NaN; q3d[i] = NaN; }
    }
    return { t, xd, yd, zd, q1d, q2d, q3d };
}

function dibujarGrafica(canvas, datos, label, color) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const PAD_T = 28, PAD_B = 22, PAD_L = 44, PAD_R = 8;
    const PW = W - PAD_L - PAD_R, PH = H - PAD_T - PAD_B;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);

    let min = Infinity, max = -Infinity;
    for (const v of datos) { if (isNaN(v)) continue; if (v < min) min = v; if (v > max) max = v; }
    if (!isFinite(min)) { min = 0; max = 1; }
    const rng = max - min || 1;
    const yMin = min - rng * 0.08, yMax = max + rng * 0.08, ySpan = yMax - yMin;

    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
        const y = PAD_T + (i / 4) * PH;
        ctx.beginPath(); ctx.moveTo(PAD_L, y); ctx.lineTo(W - PAD_R, y); ctx.stroke();
    }

    ctx.fillStyle = '#333';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, W / 2, 16);

    ctx.fillStyle = '#666';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
        ctx.fillText((yMax - (i / 4) * ySpan).toFixed(1), PAD_L - 4, PAD_T + (i / 4) * PH + 3);
    }

    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
        ctx.fillText((i / 5 * 10).toFixed(0), PAD_L + (i / 5) * PW, H - PAD_B + 14);
    }
    ctx.fillText('t [s]', W / 2, H - 3);

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    let started = false;
    const n = datos.length;
    for (let i = 0; i < n; i++) {
        if (isNaN(datos[i])) { started = false; continue; }
        const x = PAD_L + (i / (n - 1)) * PW;
        const y = PAD_T + ((yMax - datos[i]) / ySpan) * PH;
        if (!started) { ctx.moveTo(x, y); started = true; }
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(PAD_L, PAD_T, PW, PH);
}

const cartesianGUI = { xf: 20, yf: 30, zf: 10 };
const carpetaCart = gui.addFolder('Trayectoria Cartesiana (x,y,z)');
carpetaCart.add(cartesianGUI, 'xf').name('Xf [cm]').min(-45).max(45).step(0.5);
carpetaCart.add(cartesianGUI, 'yf').name('Yf [cm]').min(-11).max(60).step(0.5);
carpetaCart.add(cartesianGUI, 'zf').name('Zf [cm]').min(-45).max(45).step(0.5);
carpetaCart.add({ generar: generarGraficasCartesianas }, 'generar').name('Generar Gráficas');
carpetaCart.add({ ejecutar: ejecutarTrayectoriaCartesiana }, 'ejecutar').name('Ejecutar Trayectoria');
carpetaCart.open();

function mostrarNoAlcanzable() {
    const modal = document.getElementById('chart-modal');
    modal.style.display = 'flex';
    const ids = ['chart-x','chart-y','chart-z','chart-q1','chart-q2','chart-q3'];
    const cs = ids.map(id => document.getElementById(id));
    cs.forEach(c => { c.width = 300; c.height = 210; });
    requestAnimationFrame(() => {
        cs.forEach(c => {
            const ctx = c.getContext('2d');
            ctx.clearRect(0, 0, 300, 210);
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, 300, 210);
            ctx.fillStyle = '#999';
            ctx.font = '13px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Posición no alcanzable', 150, 105);
        });
    });
}

const CART_COLORS = { x: '#ff6b6b', y: '#51cf66', z: '#4dabf7', q1: '#9b59b6', q2: '#e67e22', q3: '#1abc9c' };

function generarGraficasCartesianas() {
    const { x: xi, y: yi, z: zi } = forwardKinematics(
        THREE.MathUtils.degToRad(articular.uno.angulo),
        THREE.MathUtils.degToRad(articular.dos.angulo),
        articular.tres.longitud
    );
    const { xf, yf, zf } = cartesianGUI;

    if (!posicionValida(xf, yf, zf)) { mostrarNoAlcanzable(); return; }

    const datos = generarDatosTrayectoria(xi, yi, zi, xf, yf, zf);
    const modal = document.getElementById('chart-modal');
    modal.style.display = 'flex';

    const ids = ['chart-x','chart-y','chart-z','chart-q1','chart-q2','chart-q3'];
    const cs = ids.map(id => document.getElementById(id));
    cs.forEach(c => { c.width = 300; c.height = 210; });

    requestAnimationFrame(() => {
        dibujarGrafica(cs[0], datos.xd, 'xd(t)', CART_COLORS.x);
        dibujarGrafica(cs[1], datos.yd, 'yd(t)', CART_COLORS.y);
        dibujarGrafica(cs[2], datos.zd, 'zd(t)', CART_COLORS.z);
        dibujarGrafica(cs[3], datos.q1d, 'q1d(t) [°]', CART_COLORS.q1);
        dibujarGrafica(cs[4], datos.q2d, 'q2d(t) [°]', CART_COLORS.q2);
        dibujarGrafica(cs[5], datos.q3d, 'q3d(t) [cm]', CART_COLORS.q3);
    });
}

document.getElementById('close-charts').addEventListener('click', () => {
    document.getElementById('chart-modal').style.display = 'none';
});

const cartCoef = { x: null, y: null, z: null };
const cartTrayectoria = { enEjecucion: false, tiempoInicio: 0 };

function ejecutarTrayectoriaCartesiana() {
    if (cartTrayectoria.enEjecucion || trayectoria.enEjecucion) return;

    const { x: xi, y: yi, z: zi } = forwardKinematics(
        THREE.MathUtils.degToRad(articular.uno.angulo),
        THREE.MathUtils.degToRad(articular.dos.angulo),
        articular.tres.longitud
    );
    const { xf, yf, zf } = cartesianGUI;

    if (!posicionValida(xf, yf, zf)) {
        alert('Posición final no alcanzable');
        return;
    }

    const T = TIEMPO_FINAL - TIEMPO_INICIAL;
    cartCoef.x = coefQuinticoCartesiano(xi, xf, T);
    cartCoef.y = coefQuinticoCartesiano(yi, yf, T);
    cartCoef.z = coefQuinticoCartesiano(zi, zf, T);

    cartTrayectoria.tiempoInicio = performance.now();
    cartTrayectoria.enEjecucion = true;
}

validarYActualizar();

window.addEventListener('resize', () => {
    CAMARA.aspect = window.innerWidth / window.innerHeight;
    CAMARA.updateProjectionMatrix();
    RENDERIZADOR.setSize(window.innerWidth, window.innerHeight);
    RENDERIZADOR_ETIQUETAS.setSize(window.innerWidth, window.innerHeight);
});

function animacion() {
    requestAnimationFrame(animacion);

    if (trayectoria.enEjecucion) {
        const tActual = (performance.now() - trayectoria.tiempoInicio) / 1000;

        if (tActual >= trayectoria.duracion) {
            articular.uno.angulo = trayectoria.q1_final;
            articular.dos.angulo = trayectoria.q2_final;
            articular.tres.longitud = trayectoria.q3_final;
            trayectoria.enEjecucion = false;
        } else {
            articular.uno.angulo = evaluarPolinomio(coeficientes.q1, tActual);
            articular.dos.angulo = evaluarPolinomio(coeficientes.q2, tActual);
            articular.tres.longitud = evaluarPolinomio(coeficientes.q3, tActual);
        }
        validarYActualizar();
        gui.controllersRecursive().forEach(c => c.updateDisplay());
    } else if (cartTrayectoria.enEjecucion) {
        const tActual = (performance.now() - cartTrayectoria.tiempoInicio) / 1000;

        if (tActual >= TIEMPO_FINAL) {
            const xv = evaluarPolinomio(cartCoef.x, TIEMPO_FINAL);
            const yv = evaluarPolinomio(cartCoef.y, TIEMPO_FINAL);
            const zv = evaluarPolinomio(cartCoef.z, TIEMPO_FINAL);
            const ik = inverseKinematics(xv, yv, zv);
            if (ik) { articular.uno.angulo = ik.q1; articular.dos.angulo = ik.q2; articular.tres.longitud = ik.q3; }
            cartTrayectoria.enEjecucion = false;
        } else {
            const xd = evaluarPolinomio(cartCoef.x, tActual);
            const yd = evaluarPolinomio(cartCoef.y, tActual);
            const zd = evaluarPolinomio(cartCoef.z, tActual);
            const ik = inverseKinematics(xd, yd, zd);
            if (ik) { articular.uno.angulo = ik.q1; articular.dos.angulo = ik.q2; articular.tres.longitud = ik.q3; }
        }
        validarYActualizar();
        gui.controllersRecursive().forEach(c => c.updateDisplay());
    }

    CONTROL_CAMARA.update();
    RENDERIZADOR.render(ESCENA, CAMARA);
    RENDERIZADOR_ETIQUETAS.render(ESCENA, CAMARA);
}

animacion();
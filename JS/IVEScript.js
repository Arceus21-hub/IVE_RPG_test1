// --------------------
// 🎶 Integrantes y Roles
// --------------------
const miembros = [
  {
    nombre: "An Yujin",
    rol: "Líder / Guerrera",
    hp: 120,
    maxHp: 120,
    dmg: 15,
    crit: 0.2,
    nivel: 1,
    exp: 0,
    imagen: "IVEpics/yujin1.png",
  },
  {
    nombre: "Gaeul",
    rol: "Estratega / Support",
    hp: 100,
    maxHp: 100,
    dmg: 10,
    crit: 0.1,
    nivel: 1,
    exp: 0,
    imagen: "IVEpics/gaeul1.png",
  },
  {
    nombre: "Rei",
    rol: "Healer / Soporte",
    hp: 90,
    maxHp: 90,
    dmg: 8,
    crit: 0.05,
    nivel: 1,
    exp: 0,
    imagen: "IVEpics/rei1.png",
  },
  {
    nombre: "Liz",
    rol: "Maga / DPS",
    hp: 80,
    maxHp: 80,
    dmg: 20,
    crit: 0.25,
    nivel: 1,
    exp: 0,
    imagen: "IVEpics/liz1.png",
  },
  {
    nombre: "Wonyoung",
    rol: "Arquera / DPS",
    hp: 85,
    maxHp: 85,
    dmg: 18,
    crit: 0.3,
    nivel: 1,
    exp: 0,
    imagen: "IVEpics/wony1.png",
  },
  {
    nombre: "Leeseo",
    rol: "Aprendiz / Balanceada",
    hp: 95,
    maxHp: 95,
    dmg: 12,
    crit: 0.15,
    nivel: 1,
    exp: 0,
    imagen: "IVEpics/leeseo1.png",
  },
];

// Party inicial:
let party = [miembros[0], miembros[1], miembros[2], miembros[3], miembros[4], miembros[5]];
let enemigo = { nombre: "Hater de Twitter", hp: 200, maxHp: 200, dmg: 12 };


// Control de turnos:
let turnoIndex = 0;
let record = {
  enemigosDerrotados: 0,
  dañoHecho: 0,
  dañoPorSkills: 0,
  dañoTotal: 0,
  items: [],
};

// --------------------
// ⚔️ Sistema de combate
// --------------------

// Vida del enemigo (barra + texto):
function actualizarUI() {
  document.getElementById("enemigoVida").style.width =
    (enemigo.hp / enemigo.maxHp) * 100 + "%";
  document.getElementById(
    "enemigoHP"
  ).innerText = `${enemigo.hp} / ${enemigo.maxHp}`;

  //Vida total de la party (barra + texto):
  let totalHP = party.reduce((a, p) => a + p.hp, 0);
  let totalMax = party.reduce((a, p) => a + p.maxHp, 0);
  document.getElementById("partyVida").style.width =
    (totalHP / totalMax) * 100 + "%";
  document.getElementById(
    "partyHP"
  ).innerText = `Total Party: ${totalHP} / ${totalMax}`;

  //Texto del turno actual:
  document.getElementById("turno").innerText = `Turno actual: ${
    turnoActual().nombre
  } (${turnoActual().rol})`;

    //Nivel de la integrante activa
  document.getElementById("nivelIntegrante").innerText =
    `Nivel: ${turnoActual().nivel}`;


  //Imagen del miembro durante su turno:
  let imgTurno = document.getElementById("turnoImg");
  if (turnoActual().imagen) {
    imgTurno.src = turnoActual().imagen;
  } else {
    imgTurno.src = "img/enemigo.png"; // Imagen del enemigo
  }

  //Panel de “record” (estadísticas y drops):
  document.getElementById("record").innerHTML = `
    <p>-Enemigos derrotados: ${record.enemigosDerrotados}</p>
    <p>-Daño normal hecho: ${record.dañoHecho}</p>
    <p>Daño hecho con skills: ${record.dañoPorSkills}</p>
    <p><h2>🥧 Daño total: ${record.dañoTotal}</h2></p>
    <p>-Items conseguidos: ${record.items.length}</p>
    <p><h2>🍟 Lista de Drops: </h2><p>${record.items
      .map((item) => `<li>${item}</li>`)
      .join("")}`;
}




function log(msg) {
  let est = document.getElementById("estado");
  est.innerHTML += msg + "<br>";
  est.scrollTop = est.scrollHeight;
}

function turnoActual() {
  if (turnoIndex < party.length) {
    return party[turnoIndex];
  } else {
    return enemigo;
  }
}

function siguienteTurno() {
  turnoIndex = (turnoIndex + 1) % (party.length + 1);
  actualizarUI();
}

// --------------------
// 🎯 Acciones
// --------------------
function accion(tipo) {
  let actor = turnoActual();

  if (actor === enemigo) {
    log("No puedes controlar al enemigo!");
    return;
  }

  if (tipo === "ataque") {
    let crit = Math.random() < actor.crit;
    let daño = crit ? actor.dmg * 2 : actor.dmg;
    enemigo.hp -= daño;
    record.dañoHecho += daño;
    record.dañoTotal += daño;
    log(
      `${actor.nombre} ataca e inflige ${daño} de daño ⚔️ ${
        crit ? "(CRITICO❗❗❗)" : ""
      }`
    );
  }

  if (tipo === "skill") {
    let daño = actor.dmg + 10;
    enemigo.hp -= daño;
    log(
      `${actor.nombre} usa su HABILIDAD ESPECIAL 🔮 y hace ${daño} de daño ✨!`
    );
    record.dañoPorSkills += daño;
    record.dañoTotal += daño;
  }

  if (enemigo.hp <= 0) {
    log("🎉 ¡Enemigo derrotado!");
    record.enemigosDerrotados++;
    ganarEXP(actor, 50);

    // 🎁 Drop aleatorio
    const dropsPosibles = [
      "Fragmento de Lightstick",
      "Photocard Común",
      "Album LOVE DIVE",
      "DIVE Notes",
      "Yujin’s Leadership Badge 🛡️",
      "Wonyoung’s Star Tiara 🌟",
      "Rei’s Heart Amulet ❤️",
      "Liz’s Harmony Pendant 🎶",
      "Gaeul’s Swift Blade 🗡️",
      "Leeseo’s Spark of Youth 🔥",
    ];
    const drop =
      dropsPosibles[Math.floor(Math.random() * dropsPosibles.length)];
    record.items.push(drop);
    log(`🎁 Drop obtenido: ${drop}`);

    enemigo = {
      nombre: "Hater",
      hp: 200 + record.enemigosDerrotados * 20,
      maxHp: 200 + record.enemigosDerrotados * 20,
      dmg: 12 + record.enemigosDerrotados,
    };
  }

  siguienteTurno();
  if (turnoActual() === enemigo) enemigoActua();
  actualizarUI();
}

function enemigoActua() {
  let objetivo = party[Math.floor(Math.random() * party.length)];
  let daño = enemigo.dmg;
  objetivo.hp -= daño;
  log(
    `💀 ${enemigo.nombre} golpea a ${objetivo.nombre} y le quita ${daño} de vida.`
  );
  if (objetivo.hp <= 0) {
    log(`❌ ${objetivo.nombre} ha caído...`);
  }
  siguienteTurno();
}

// --------------------
// 🆙 Sistema de niveles
// --------------------
function ganarEXP(personaje, cantidad) {
  personaje.exp += cantidad;
  if (personaje.exp >= 100) {
    personaje.exp -= 100;
    personaje.nivel++;
    personaje.maxHp += 20;
    personaje.hp = personaje.maxHp;
    personaje.dmg += 5;
    personaje.crit += 0.05;
    log(`✨ ${personaje.nombre} subió a nivel ${personaje.nivel}!`);
  }
}

// --------------------
// 🧪 Items
// --------------------
function usarItem() {
  let actor = turnoActual();
  actor.hp = Math.min(actor.maxHp, actor.hp + 30);
  log(`${actor.nombre} usó una poción y recuperó 30 de vida 💚.`);
  siguienteTurno();
  if (turnoActual() === enemigo) enemigoActua();
  actualizarUI();
}

// --------------------
// Inicializar
// --------------------
actualizarUI();

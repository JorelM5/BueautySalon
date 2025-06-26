const SHEET_URL = 'https://docs.google.com/forms/d/e/2PACX-1vR4E995E2N9Q4fq75TF4_rwOX5rAE5L_ryOcq8JUDl5rDdo__yw6E0sUvDOnii8vUSsF9AYEQfkBzUk/formResponse';

const form = document.getElementById('corteForm');
const fechaHoy = document.getElementById('fechaHoy');
const totalCortes = document.getElementById('totalCortes');
const totalIngresos = document.getElementById('totalIngresos');
const totalPropinas = document.getElementById('totalPropinas');

function actualizarResumen() {
  const hoy = new Date().toISOString().slice(0,10);
  fechaHoy.textContent = hoy;

  const registros = JSON.parse(localStorage.getItem('registros')||'[]')
    .filter(r => r.fecha===hoy);

  const cortes = registros.length;
  const ingresos = registros.reduce((a,r)=>a+r.precio,0);
  const propinas = registros.reduce((a,r)=>a+r.propina,0);

  totalCortes.textContent = cortes;
  totalIngresos.textContent = ingresos.toFixed(2);
  totalPropinas.textContent = propinas.toFixed(2);
}

form.addEventListener('submit', ev => {
  ev.preventDefault();
  const r = {
    cliente: form.cliente.value,
    empleado: form.empleado.value,
    precio: parseFloat(form.precio.value),
    propina: parseFloat(form.propina.value),
    fecha: new Date().toISOString().slice(0,10)
  };
  const data = new FormData();
  data.append('entry.123456', r.cliente);
  data.append('entry.234567', r.empleado);
  data.append('entry.345678', r.precio);
  data.append('entry.456789', r.propina);
  data.append('entry.567890', r.fecha);

  fetch(SHEET_URL, { method:'POST', body:data, mode:'no-cors' });

  const regs = JSON.parse(localStorage.getItem('registros')||'[]');
  regs.push(r);
  localStorage.setItem('registros', JSON.stringify(regs));

  form.reset();
  actualizarResumen();
});
window.addEventListener('load', actualizarResumen);

const API_URL = 'http://localhost:3001/api/annonces';

async function chargerAnnonces(categorie = '') {
  const container = document.getElementById('catalogue');
  
  container.innerHTML = `
    <div class="animate-pulse bg-white p-3 rounded-xl border border-gray-200 flex gap-3 h-24">
      <div class="w-20 h-20 bg-gray-200 rounded-lg"></div>
      <div class="flex-1 space-y-2 py-1">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>`;

  try {
    const url = categorie ? `${API_URL}?categorie=${categorie}` : API_URL;
    const response = await fetch(url);
    const annonces = await response.json();

    if (!annonces.length) {
      container.innerHTML = `<p class="text-center text-sm text-gray-500 py-6">Aucune annonce trouvée.</p>`;
      return;
    }

    container.innerHTML = annonces.map(item => `
      <article class="flex gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm items-center">
        <img 
          src="${item.photos ? item.photos : 'https://via.placeholder.com/80'}" 
          alt="${item.titre}" 
          class="w-20 h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0"
        >
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-sm text-gray-900 truncate">${item.titre}</h3>
          <p class="text-xs text-gray-500 mt-0.5">${item.prix ? item.prix + ' €' : 'Gratuit / Prêt'}</p>
          <span class="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
            🌱 ${item.co2_economise || 0} kg CO₂ évités
          </span>
        </div>
      </article>
    `).join('');

  } catch (error) {
    container.innerHTML = `<p class="text-center text-sm text-red-500 py-6">Erreur de connexion avec l'API.</p>`;
  }
}

function filtrerParCategorie(nom) {
  chargerAnnonces(nom);
}

let timer;
document.getElementById('searchInput').addEventListener('input', (e) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    chargerAnnonces(e.target.value);
  }, 300);
});

chargerAnnonces();
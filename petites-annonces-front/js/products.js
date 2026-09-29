import { apiFetch } from './api.js';

export async function renderAnnonces() {
  const container = document.getElementById('annonces-list');
  if (!container) return;

  try {
    const annonces = await apiFetch('/annonces');
    container.innerHTML = '';

    annonces.forEach(annonce => {
      const card = document.createElement('article');
      card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300';

      card.innerHTML = `
        <img src="${annonce.imageUrl || '/assets/images/placeholder.jpg'}" alt="${annonce.titre}" class="w-full h-48 object-cover">
        <div class="p-4">
          <span class="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full mb-2">
            ${annonce.categorie}
          </span>
          <h3 class="text-lg font-bold text-gray-800">${annonce.titre}</h3>
          <p class="text-sm text-gray-600 mt-1 line-clamp-2">${annonce.description}</p>

          <div class="mt-3 flex items-center justify-between text-sm">
            <span class="font-bold text-emerald-600">${annonce.prix > 0 ? annonce.prix + ' €' : 'Don / Prêt'}</span>
            <span class="text-xs text-gray-500 font-medium">🌱 -${annonce.co2Economy || 0} kg CO₂</span>
          </div>

          <a href="/annonce.html?id=${annonce.id}" class="mt-4 block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded transition-colors">
            Voir l'annonce
          </a>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = `<p class="text-red-500 text-center col-span-full">Impossible de charger les annonces pour le moment.</p>`;
  }
}
// Simple service to fetch breed/animal data and simulate adoption submission
// Uses public TheDogAPI / TheCatAPI and jsonplaceholder for demo POSTs

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchBreeds(type = '') {
  try {
    if (type === 'dog') {
      const data = await fetchJson('https://api.thedogapi.com/v1/breeds');
      return data.map(b => ({ id: b.id, name: b.name, origin: b.origin || b.country_code || 'N/A', emoji: '🐕' }));
    }

    if (type === 'cat') {
      const data = await fetchJson('https://api.thecatapi.com/v1/breeds');
      return data.map(b => ({ id: b.id, name: b.name, origin: b.origin || b.country_code || 'N/A', emoji: '🐈' }));
    }

    // combine a few popular breeds from both APIs when type is unspecified
    const [dogs, cats] = await Promise.all([
      fetchJson('https://api.thedogapi.com/v1/breeds'),
      fetchJson('https://api.thecatapi.com/v1/breeds'),
    ]);

    const dogList = dogs.slice(0, 8).map(b => ({ id: `d-${b.id}`, name: b.name, origin: b.origin || b.country_code || 'N/A', emoji: '🐕' }));
    const catList = cats.slice(0, 8).map(b => ({ id: `c-${b.id}`, name: b.name, origin: b.origin || b.country_code || 'N/A', emoji: '🐈' }));
    return [...dogList, ...catList];
  } catch (err) {
    throw err;
  }
}

export async function fetchAnimals({ type = '', limit = 12 } = {}) {
  try {
    const results = [];
    if (!type || type === 'dog') {
      const dogs = await fetchJson(`https://api.thedogapi.com/v1/images/search?limit=${limit}&has_breeds=1`);
      results.push(...dogs.map(i => ({ id: i.id, name: i.breeds && i.breeds[0] ? i.breeds[0].name : '狗狗', type: 'dog', breed: i.breeds && i.breeds[0] ? i.breeds[0].name : '米克斯', image: i.url })));
    }
    if (!type || type === 'cat') {
      const cats = await fetchJson(`https://api.thecatapi.com/v1/images/search?limit=${limit}&has_breeds=1`);
      results.push(...cats.map(i => ({ id: i.id, name: i.breeds && i.breeds[0] ? i.breeds[0].name : '貓咪', type: 'cat', breed: i.breeds && i.breeds[0] ? i.breeds[0].name : '雜種', image: i.url })));
    }

    return results.slice(0, limit);
  } catch (err) {
    throw err;
  }
}

export async function submitAdoption(application) {
  // For demo purposes, post to jsonplaceholder to simulate a successful submission
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(application),
  });
  if (!res.ok) throw new Error('Failed to submit adoption');
  return res.json();
}

// Fetch from Taiwan government open data (COA / data.gov.tw)
// Try a default endpoint; map common fields to a simple model.
export async function fetchTaiwanOpenAnimals(url = '/api/moa/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&IsTransData=1') {
  // try relative proxy first (vite dev proxy), fallback to official MOA host
  let data
  try {
    data = await fetchJson(url)
  } catch (e) {
    // fallback to official MOA host
    data = await fetchJson('https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&IsTransData=1')
  }
  // data may be an object with .Data or an array directly
  const list = Array.isArray(data) ? data : (Array.isArray(data.Data) ? data.Data : [])
  return list.map((item, idx) => {
    // heuristics for common field names in Taiwan animal open datasets
    const id = item.animal_id || item.id || item.AnimalId || item.animalId || item.animalId || idx
    const name = item.animal_name || item.name || item.AnimalName || item.animalName || item['動物名稱'] || ''
    const kindRaw = item.animal_kind || item.kind || item.Species || item.species || item['動物類別'] || ''
    const kind = ('' + kindRaw).toLowerCase()
    const breed = item.animal_Variety || item.animal_variety || item.animalVariety || item.animal_breed || item.breed || item['品種'] || item['犬種'] || ''
    const city = item.animal_area_pkid || item.animal_place || item['收容所名稱'] || item['動物所在地'] || item.area || ''
    const image = item.album_file || item.image || item.pic || item['照片'] || item.img || ''
    const color = item.animal_color || item.color || item['毛色'] || item.color_desc || ''
    const sexRaw = item.animal_sex || item.sex || item['性別'] || ''
    const sex = ('' + sexRaw).replace(/F|f|女|female/gi, '母').replace(/M|m|公|male/gi, '公') || sexRaw
    const postedAt = item.shelter_update || item.publish_date || item.create_date || item['刊登日期'] || item['建立時間'] || item.UploadDate || ''
    const opendate = item.animal_opendate || item.opendate || item.open_date || item['開放日期'] || ''
    const contactPhone = item.shelter_tel || item.contact_tel || item.tel || item['連絡電話'] || item.phone || ''
    const region = item.county || item.town || item.area || item.region || item['區域'] || ''
    const remark = item.animal_remark || item.remark || item['描述'] || item.description || ''

    // normalize species to 'dog' / 'cat' if possible
    let species = ''
    if (/dog|犬|狗|canine/i.test(kindRaw) || /dog/i.test(breed)) species = 'dog'
    else if (/cat|貓|feline/i.test(kindRaw) || /cat/i.test(breed)) species = 'cat'
    else species = kindRaw || ''

    return {
      id,
      name: name || (breed || species || `動物 ${id}`),
      species,
      breed: breed || '',
      description: remark || '',
      variety: breed || '',
      color: color || '',
      sex: sex || '',
      postedAt: postedAt || '',
      opendate: opendate || '',
      contactPhone: contactPhone || '',
      region: region || city || '',
      origin: breed || city || '',
      emoji: /cat|貓/i.test(species) ? '🐈' : '🐕',
      raw: item,
      image,
    }
  })
}

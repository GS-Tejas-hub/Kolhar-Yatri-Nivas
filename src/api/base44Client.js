// Frontend-only stub for base44 APIs using localStorage.
// Preserves method names used in the original codebase.
import lodgesData from '@/data/lodges.json'

const STORAGE_KEYS = {
  LODGES: 'kyn_lodges',
  BOOKINGS: 'kyn_bookings',
  USER: 'kyn_user',
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function generateId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`
}

// Seed demo data once if empty to ensure all pages show content
function normalizeLodge(raw) {
  const item = { ...raw }
  if (!item.id) item.id = generateId('lodge')
  if (!item.created_date) item.created_date = new Date().toISOString()
  if (typeof item.available === 'undefined') item.available = true
  if (typeof item.featured === 'undefined') item.featured = false
  return item
}

function seedDemoData() {
  const lodges = read(STORAGE_KEYS.LODGES, null)
  if (!lodges) {
    const dataset = Array.isArray(lodgesData) ? lodgesData : []
    const normalized = (dataset.length > 0 ? dataset : [
      {
        name: 'Deluxe Mountain View',
        description: 'Spacious deluxe room with stunning mountain views and modern amenities.',
        short_description: 'Deluxe room with mountain view',
        price_per_night: 4500,
        max_guests: 3,
        lodge_type: 'deluxe',
        amenities: ['Wi-Fi', 'AC', 'TV', 'Breakfast', 'Parking'],
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000',
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1000',
        ],
        featured: true,
        location: 'Kolhar',
        available: true,
      },
      {
        name: 'Cozy Riverside Cottage',
        description: 'Charming cottage by the riverside with serene ambiance and private patio.',
        short_description: 'Riverside cottage with patio',
        price_per_night: 3800,
        max_guests: 4,
        lodge_type: 'cottage',
        amenities: ['Wi-Fi', 'TV', 'Coffee', 'Parking'],
        images: [
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000',
        ],
        featured: true,
        location: 'Kolhar',
        available: true,
      },
      {
        name: 'Premium Suite',
        description: 'Elegant premium suite with separate living area and luxury finishes.',
        short_description: 'Spacious premium suite',
        price_per_night: 6500,
        max_guests: 4,
        lodge_type: 'suite',
        amenities: ['Wi-Fi', 'AC', 'TV', 'Breakfast', 'Coffee', 'Parking'],
        images: [
          'https://images.unsplash.com/photo-1501117716987-c8e5d3d52f8b?w=1000',
        ],
        featured: false,
        location: 'Kolhar',
        available: true,
      },
    ]).map(normalizeLodge)
    write(STORAGE_KEYS.LODGES, normalized)
  }

  const bookings = read(STORAGE_KEYS.BOOKINGS, null)
  if (!bookings) {
    write(STORAGE_KEYS.BOOKINGS, [])
  }
}

seedDemoData()

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))

export const base44 = {
  auth: {
    async me() {
      await delay()
      return read(STORAGE_KEYS.USER, null)
    },
    logout() {
      write(STORAGE_KEYS.USER, null)
      window.location.reload()
    },
    redirectToLogin() {
      // Fake-login as admin for full access
      const user = { id: 'user_admin', full_name: 'Admin', role: 'admin' }
      write(STORAGE_KEYS.USER, user)
      window.location.reload()
    },
  },
  entities: {
    Lodge: {
      async list(orderBy) {
        await delay()
        let lodges = read(STORAGE_KEYS.LODGES, [])
        if (orderBy === '-created_date') {
          lodges = lodges.slice().sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
        }
        return lodges
      },
      async filter(where = {}) {
        const lodges = await this.list()
        return lodges.filter((l) => Object.entries(where).every(([k, v]) => l[k] === v))
      },
      async create(data) {
        await delay()
        const lodges = read(STORAGE_KEYS.LODGES, [])
        const item = { ...data, id: generateId('lodge'), created_date: new Date().toISOString() }
        lodges.push(item)
        write(STORAGE_KEYS.LODGES, lodges)
        return item
      },
      async update(id, data) {
        await delay()
        const lodges = read(STORAGE_KEYS.LODGES, [])
        const idx = lodges.findIndex((l) => l.id === id)
        if (idx >= 0) {
          lodges[idx] = { ...lodges[idx], ...data }
          write(STORAGE_KEYS.LODGES, lodges)
          return lodges[idx]
        }
        throw new Error('Lodge not found')
      },
      async delete(id) {
        await delay()
        const lodges = read(STORAGE_KEYS.LODGES, [])
        write(
          STORAGE_KEYS.LODGES,
          lodges.filter((l) => l.id !== id)
        )
        return { success: true }
      },
    },
    Booking: {
      async list(orderBy) {
        await delay()
        let bookings = read(STORAGE_KEYS.BOOKINGS, [])
        if (orderBy === '-created_date') {
          bookings = bookings
            .slice()
            .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
        }
        return bookings
      },
      async filter(where = {}) {
        const bookings = await this.list()
        return bookings.filter((b) => Object.entries(where).every(([k, v]) => b[k] === v))
      },
      async create(data) {
        await delay()
        const bookings = read(STORAGE_KEYS.BOOKINGS, [])
        const item = {
          ...data,
          id: generateId('booking'),
          created_date: new Date().toISOString(),
        }
        bookings.push(item)
        write(STORAGE_KEYS.BOOKINGS, bookings)
        return item
      },
      async update(id, data) {
        await delay()
        const bookings = read(STORAGE_KEYS.BOOKINGS, [])
        const idx = bookings.findIndex((b) => b.id === id)
        if (idx >= 0) {
          bookings[idx] = { ...bookings[idx], ...data }
          write(STORAGE_KEYS.BOOKINGS, bookings)
          return bookings[idx]
        }
        throw new Error('Booking not found')
      },
      async delete(id) {
        await delay()
        const bookings = read(STORAGE_KEYS.BOOKINGS, [])
        write(
          STORAGE_KEYS.BOOKINGS,
          bookings.filter((b) => b.id !== id)
        )
        return { success: true }
      },
    },
  },
  integrations: {
    Core: {
      async SendEmail(payload) {
        await delay(100)
        console.log('Simulated email sent', payload)
        return { success: true }
      },
      async UploadFile({ file }) {
        await delay(100)
        // Convert to object URL to simulate uploaded URL
        const file_url = URL.createObjectURL(file)
        return { file_url }
      },
    },
  },
}



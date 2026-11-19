import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../utils/api';

export const DEFAULT_SERVICES = [
  {
    _id: '6aff53a093e842cc7ed693a1',
    name: 'Haircut',
    description: 'A premium haircut tailored specifically to your facial structure and lifestyle.',
    price: 25,
    duration: 30,
    category: 'Hair',
    image: '/images/services/hair-cut.jpg'
  },
  {
    _id: '6aff53a093e842cc7ed693a2',
    name: 'Beard Trim',
    description: 'Precision beard sculpting including hot towel treatment and straight razor lining.',
    price: 15,
    duration: 20,
    category: 'Beard',
    image: '/images/services/beard-trim.jpg'
  },
  {
    _id: '6aff53a093e842cc7ed693a3',
    name: 'Hair Styling',
    description: 'Professional styling using luxury products providing that perfect finish.',
    price: 30,
    duration: 25,
    category: 'Styling',
    image: '/images/services/hair-styling.jpg'
  }
];

// Helper to get initial user from localStorage
const getInitialUser = () => {
  try {
    const adminInfo = localStorage.getItem('adminInfo');
    return adminInfo ? JSON.parse(adminInfo) : null;
  } catch (e) {
    return null;
  }
};

export const useStore = create((set, get) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  user: getInitialUser(),
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('adminInfo');
    set({ user: null });
  },
  
  services: DEFAULT_SERVICES,
  isLoadingServices: false,
  servicesFetched: false,
  fetchServices: async () => {
    if (get().servicesFetched && get().services.length > 0 && get().services !== DEFAULT_SERVICES) return;
    
    set({ isLoadingServices: true });
    try {
      const endpoint = API_URL ? `${API_URL}/api/services` : '/api/services';
      const { data } = await axios.get(endpoint, { timeout: 10000 });
      
      if (Array.isArray(data) && data.length > 0) {
        // Filter and sort for the 3 signature services as required by the design
        const uniqueData = Array.from(new Map(data.map(item => [item.name, item])).values());
        const targetNames = ['Haircut', 'Beard Trim', 'Hair Styling'];
        const strictlyThree = uniqueData.filter(item => targetNames.includes(item.name));
        strictlyThree.sort((a, b) => targetNames.indexOf(a.name) - targetNames.indexOf(b.name));
        
        const finalServices = strictlyThree.length > 0 ? strictlyThree : uniqueData;
        set({ services: finalServices, servicesFetched: true });
      }
    } catch (error) {
      console.warn('Could not fetch services from API, using default services:', error.message);
      // Keep DEFAULT_SERVICES on error so UI never breaks
    } finally {
      set({ isLoadingServices: false });
    }
  }
}));

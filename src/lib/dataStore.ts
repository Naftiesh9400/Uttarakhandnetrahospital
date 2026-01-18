// localStorage-based data store for admin management

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  experience: string;
  description: string;
  image: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  doctor: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

const KEYS = {
  doctors: 'netra_doctors',
  services: 'netra_services',
  appointments: 'netra_appointments',
  contacts: 'netra_contacts',
};

// Default data
const defaultDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Ananya Sharma',
    qualification: 'MBBS, MS (Ophthalmology)',
    specialization: 'Senior Ophthalmologist',
    experience: '15+ Years',
    description: 'Expert in cataract surgery and comprehensive eye care with over 15 years of experience.',
    image: '/src/assets/doctor-1.jpg',
  },
  {
    id: '2',
    name: 'Dr. Rajesh Kumar',
    qualification: 'MBBS, DNB (Ophthalmology)',
    specialization: 'Retina Specialist',
    experience: '12+ Years',
    description: 'Specialized in diabetic retinopathy and retinal disorders treatment.',
    image: '/src/assets/doctor-2.jpg',
  },
  {
    id: '3',
    name: 'Dr. Priya Mehta',
    qualification: 'MBBS, DOMS, FRCS',
    specialization: 'Pediatric Ophthalmologist',
    experience: '10+ Years',
    description: 'Dedicated to providing specialized eye care for children and young patients.',
    image: '/src/assets/doctor-3.jpg',
  },
];

const defaultServices: Service[] = [
  { id: '1', title: 'Comprehensive Eye Examination', description: 'Complete vision and eye health evaluation using advanced diagnostic equipment.', icon: 'Eye' },
  { id: '2', title: 'Cataract Surgery', description: 'Advanced, painless cataract treatment with quick recovery using latest techniques.', icon: 'Sparkles' },
  { id: '3', title: 'LASIK Surgery', description: 'Freedom from glasses with safe laser vision correction procedures.', icon: 'Zap' },
  { id: '4', title: 'Retina Care', description: 'Treatment for diabetic retinopathy and other retinal disorders.', icon: 'Target' },
  { id: '5', title: 'Pediatric Eye Care', description: 'Specialized eye care services designed for children of all ages.', icon: 'Baby' },
  { id: '6', title: 'Glaucoma Treatment', description: 'Early detection and long-term management of glaucoma.', icon: 'Shield' },
];

// Generic helpers
const getData = <T>(key: string, defaultData: T[]): T[] => {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return defaultData;
    }
  }
  return defaultData;
};

const setData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Doctors
export const getDoctors = (): Doctor[] => getData(KEYS.doctors, defaultDoctors);
export const setDoctors = (doctors: Doctor[]): void => setData(KEYS.doctors, doctors);
export const addDoctor = (doctor: Omit<Doctor, 'id'>): Doctor => {
  const doctors = getDoctors();
  const newDoctor = { ...doctor, id: Date.now().toString() };
  setDoctors([...doctors, newDoctor]);
  return newDoctor;
};
export const updateDoctor = (id: string, doctor: Partial<Doctor>): void => {
  const doctors = getDoctors();
  setDoctors(doctors.map(d => d.id === id ? { ...d, ...doctor } : d));
};
export const deleteDoctor = (id: string): void => {
  setDoctors(getDoctors().filter(d => d.id !== id));
};

// Services
export const getServices = (): Service[] => getData(KEYS.services, defaultServices);
export const setServices = (services: Service[]): void => setData(KEYS.services, services);
export const addService = (service: Omit<Service, 'id'>): Service => {
  const services = getServices();
  const newService = { ...service, id: Date.now().toString() };
  setServices([...services, newService]);
  return newService;
};
export const updateService = (id: string, service: Partial<Service>): void => {
  const services = getServices();
  setServices(services.map(s => s.id === id ? { ...s, ...service } : s));
};
export const deleteService = (id: string): void => {
  setServices(getServices().filter(s => s.id !== id));
};

// Appointments
export const getAppointments = (): Appointment[] => getData(KEYS.appointments, []);
export const setAppointments = (appointments: Appointment[]): void => setData(KEYS.appointments, appointments);
export const addAppointment = (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>): Appointment => {
  const appointments = getAppointments();
  const newAppointment: Appointment = {
    ...appointment,
    id: Date.now().toString(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  setAppointments([...appointments, newAppointment]);
  return newAppointment;
};
export const updateAppointmentStatus = (id: string, status: Appointment['status']): void => {
  const appointments = getAppointments();
  setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
};
export const deleteAppointment = (id: string): void => {
  setAppointments(getAppointments().filter(a => a.id !== id));
};

// Contact Requests
export const getContactRequests = (): ContactRequest[] => getData(KEYS.contacts, []);
export const setContactRequests = (contacts: ContactRequest[]): void => setData(KEYS.contacts, contacts);
export const addContactRequest = (contact: Omit<ContactRequest, 'id' | 'createdAt' | 'isRead'>): ContactRequest => {
  const contacts = getContactRequests();
  const newContact: ContactRequest = {
    ...contact,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    isRead: false,
  };
  setContactRequests([...contacts, newContact]);
  return newContact;
};
export const markContactAsRead = (id: string): void => {
  const contacts = getContactRequests();
  setContactRequests(contacts.map(c => c.id === id ? { ...c, isRead: true } : c));
};
export const deleteContactRequest = (id: string): void => {
  setContactRequests(getContactRequests().filter(c => c.id !== id));
};

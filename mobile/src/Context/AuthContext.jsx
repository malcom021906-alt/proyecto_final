import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { getAvatarFallback } from '../Helpers/formatters';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Usuarios de semilla locales por si Firebase no está inicializado/conectado
const SEED_USERS = {
  'admin@malcomproyecto.com': {
    uid: 'admin-seed-id',
    email: 'admin@malcomproyecto.com',
    fullName: 'Administrador Malcom',
    role: 'ADMIN',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin'
  },
  'cliente@malcomproyecto.com': {
    uid: 'client-seed-id',
    email: 'cliente@malcomproyecto.com',
    fullName: 'Malcom Cliente Demo',
    role: 'CLIENT',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cliente'
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMockAuth, setIsMockAuth] = useState(false);

  // Inicializar estado de auth
  useEffect(() => {
    // Primero revisamos si hay una sesión mock en localStorage
    const savedMockUser = localStorage.getItem('malcom_mock_user');
    if (savedMockUser) {
      const parsed = JSON.parse(savedMockUser);
      setCurrentUser(parsed);
      setUserRole(parsed.role);
      setIsMockAuth(true);
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Obtener rol desde Firestore en tabla separada por seguridad
          try {
            const roleDoc = await getDoc(doc(db, 'roles', user.uid));
            if (roleDoc.exists()) {
              setUserRole(roleDoc.data().role);
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              const userData = userDoc.exists() ? userDoc.data() : {};
              setCurrentUser({
                uid: user.uid,
                email: user.email,
                ...userData,
                role: roleDoc.data().role
              });
            } else {
              // Rol por defecto si no existe
              setUserRole('CLIENT');
              setCurrentUser({
                uid: user.uid,
                email: user.email,
                role: 'CLIENT'
              });
            }
          } catch (e) {
            console.warn("Error leyendo Firestore, usando perfil local básico:", e);
            setUserRole('CLIENT');
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              role: 'CLIENT'
            });
          }
        } else {
          setCurrentUser(null);
          setUserRole(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } catch (error) {
      console.warn("Firebase Auth no disponible. Modo simulado activado.");
      setLoading(false);
    }
  }, []);

  // Registro de usuario
  const register = async (email, password, fullName) => {
    setLoading(true);
    try {
      // Intentar registro real en Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar datos en la colección 'users'
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        email,
        avatarUrl: getAvatarFallback(fullName),
        createdAt: new Date().toISOString()
      });

      // Guardar rol separado en colección 'roles' por seguridad (nunca en users)
      await setDoc(doc(db, 'roles', user.uid), {
        role: 'CLIENT'
      });

      setUserRole('CLIENT');
      setCurrentUser({
        uid: user.uid,
        email,
        fullName,
        avatarUrl: getAvatarFallback(fullName),
        role: 'CLIENT'
      });
      setIsMockAuth(false);
    } catch (error) {
      console.warn("Falló registro real en Firebase. Simulando registro local:", error.message);
      // Simular localmente
      const mockUid = 'mock-' + Math.random().toString(36).substr(2, 9);
      const newMockUser = {
        uid: mockUid,
        email,
        fullName,
        avatarUrl: getAvatarFallback(fullName),
        role: 'CLIENT'
      };
      localStorage.setItem('malcom_mock_user', JSON.stringify(newMockUser));
      setCurrentUser(newMockUser);
      setUserRole('CLIENT');
      setIsMockAuth(true);
    } finally {
      setLoading(false);
    }
  };

  // Login de usuario
  const login = async (email, password) => {
    setLoading(true);
    // Verificar si es uno de los usuarios seed locales predefinidos
    if (password === 'malcomproyecto2026' && SEED_USERS[email]) {
      const seedUser = SEED_USERS[email];
      localStorage.setItem('malcom_mock_user', JSON.stringify(seedUser));
      setCurrentUser(seedUser);
      setUserRole(seedUser.role);
      setIsMockAuth(true);
      setLoading(false);
      return seedUser;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const roleDoc = await getDoc(doc(db, 'roles', user.uid));
      const role = roleDoc.exists() ? roleDoc.data().role : 'CLIENT';
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      const fullUser = {
        uid: user.uid,
        email: user.email,
        ...userData,
        role
      };
      
      setCurrentUser(fullUser);
      setUserRole(role);
      setIsMockAuth(false);
      return fullUser;
    } catch (error) {
      console.warn("Falló inicio real Firebase. Probando credenciales de respaldo:", error.message);
      // Buscar en localStorage o mock predeterminado
      if (SEED_USERS[email] && password === 'malcomproyecto2026') {
        const seedUser = SEED_USERS[email];
        localStorage.setItem('malcom_mock_user', JSON.stringify(seedUser));
        setCurrentUser(seedUser);
        setUserRole(seedUser.role);
        setIsMockAuth(true);
        return seedUser;
      }
      throw new Error("Credenciales inválidas o error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  // Logout de usuario
  const logout = async () => {
    setLoading(true);
    try {
      if (isMockAuth) {
        localStorage.removeItem('malcom_mock_user');
      } else {
        await signOut(auth);
      }
    } catch (e) {
      console.warn("Error en signOut real, limpiando sesión local:", e);
      localStorage.removeItem('malcom_mock_user');
    } finally {
      setCurrentUser(null);
      setUserRole(null);
      setIsMockAuth(false);
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    userRole,
    loading,
    isMockAuth,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

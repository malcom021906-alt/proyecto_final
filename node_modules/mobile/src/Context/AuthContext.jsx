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

const SEED_USERS = {
  'admin@proyectostore.com': {
    uid: 'admin-seed-id',
    email: 'admin@proyectostore.com',
    fullName: 'Administrador TecnoStore',
    role: 'ADMIN',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin'
  },
  'cliente@proyectostore.com': {
    uid: 'client-seed-id',
    email: 'cliente@proyectostore.com',
    fullName: 'Cliente Demo TecnoStore',
    role: 'CLIENT',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cliente'
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMockAuth, setIsMockAuth] = useState(false);

  // Inicializar estado de auth con validación de token activa
  useEffect(() => {
    const savedMockUser = localStorage.getItem('tecnostore_mock_user');
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
          try {
            // Obtener y verificar el token físico real de Firebase
            const tokenResult = await user.getIdTokenResult(true);
            const expirationTime = new Date(tokenResult.expirationTime).getTime();

            // Si el token ya expiró
            if (Date.now() >= expirationTime) {
              console.warn("Sesión expirada detectada.");
              await signOut(auth);
              setCurrentUser(null);
              setUserRole(null);
              window.location.href = '/login';
              return;
            }

            // Programar temporizador de cierre si expira en primer plano
            const timeLeft = expirationTime - Date.now();
            const sessionTimeout = setTimeout(async () => {
              console.warn("Sesión expirada en tiempo real. Redirigiendo a Login...");
              await signOut(auth);
              setCurrentUser(null);
              setUserRole(null);
              window.location.href = '/login';
            }, timeLeft);

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
              setUserRole('CLIENT');
              setCurrentUser({
                uid: user.uid,
                email: user.email,
                role: 'CLIENT'
              });
            }

            return () => clearTimeout(sessionTimeout);
          } catch (e) {
            console.warn("Error validando token o leyendo Firestore, usando perfil básico:", e);
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
      localStorage.setItem('tecnostore_mock_user', JSON.stringify(newMockUser));
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
    if (password === 'proyectostore2026' && SEED_USERS[email]) {
      const seedUser = SEED_USERS[email];
      localStorage.setItem('tecnostore_mock_user', JSON.stringify(seedUser));
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
      if (SEED_USERS[email] && password === 'proyectostore2026') {
        const seedUser = SEED_USERS[email];
        localStorage.setItem('tecnostore_mock_user', JSON.stringify(seedUser));
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
        localStorage.removeItem('tecnostore_mock_user');
      } else {
        await signOut(auth);
      }
    } catch (e) {
      console.warn("Error en signOut real, limpiando sesión local:", e);
      localStorage.removeItem('tecnostore_mock_user');
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

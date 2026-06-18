"use client"
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';


const AuthContext = createContext();
function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, (user) =>{
      if (user) {
        setUser(user);
        setLoading(false);
        router.push('/');
      } else {
        if (pathname === '/main') {
          router.push('/login');
        } 
      }
      
    })

    return () => unsubscribe();
  },[router, pathname])

  return (
    <AuthContext.Provider value = {{user,loading}}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { useAuth, AuthProvider};
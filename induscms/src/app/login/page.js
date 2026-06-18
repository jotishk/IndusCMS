'use client'

import styles from "./loginpage.module.css";


import { X,ChevronUp,Clock,Plus, MoveLeft, MoveRight } from 'lucide-react';
import { useEffect,useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider, translateErr } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const ua = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(ua);
    if (isMobile) {
      router.replace("/unsupported");
    } else {
      router.push('/login'); 
    }
  }, [router]);
  return (
    <div className = {styles.pagecontainer}>
      {loading && <div className = {styles.loadingoverlay}></div>}
      <Header/>
      <div className = {styles.signupcontainer}>
        <LoginDiv setLoading = {setLoading}/>
      </div>
      
    </div>
    
  );
}

function Header() {
  return (
    <div className = {[styles.header]}>
      <img className = {styles.headerlogo} src="/header/logo.png" />
    </div>
  );
}

function LoginDiv({setLoading}) {
  return (
    <div className = {styles.signupformdiv}>
      <p className = {styles.signupformtitle}>Login to your account</p>
      <p className = {styles.signupformsubtitle}>Please enter your details</p>
      <LoginForm setLoading = {setLoading} />
      
    </div>
  );
}

function LoginForm({setLoading}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  
  const router = useRouter();

  async function handleLogin() {
    
    setErr('');
    
    if (email === '' || password === '') {
      setErr('Email or Password is invalid.')
      return;
    }
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth,email,password);
      router.push('/');
    } catch (err) {
      setErr(err.code);
    }  finally {
      setLoading(false);
    }
  }
  return (
    <>
      <ErrStatusBar code = {err}/>
      <form onSubmit = {(e) => {e.preventDefault(); handleLogin()}}>
        <input value = {email} type = "email" className = {`${styles.signupforminput} ${styles.signupforminputtop}`} placeholder='Email address' onChange={e=>setEmail(e.target.value)}></input>
        <input value = {password} type = "password" className = {styles.signupforminput} placeholder='Password' onChange={e=>setPassword(e.target.value)}></input>
        {/* <button onClick = {handleForgotPassword} className = {styles.signupformforgot} href ="">Forgot password</button> */}
        <input className = {styles.signupformsubmit} value = "Log in" type = "submit"></input>
        
      </form>
    </>
    
  );
}

function LoginGoogle({setLoading}) {
  const [err, setErr] = useState('');
  const router = useRouter();
  async function handleSigninGoogle() {
    setLoading(true);
    setErr('');
    try {
      await signInWithPopup(auth,provider);
      router.push('/');
    } catch (err) {
      setErr(err.code);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ErrStatusBar code = {err}/>
      <button type="button" onClick = {handleSigninGoogle} className={styles.signupgooglebtn} value="Sign in with Google">
        <img className={styles.signupgooglelogo} src="/header/googlelogo.png"  />
        <p className = {styles.signupgoogletxt}>Sign in with Google</p>
      </button>
    </>
  );
}

function ErrStatusBar({code}) {
  const [closed,setClosed] = useState(false);
  
  useEffect(() => {
    if (code) {
      setClosed(false);
    }
  }, [code]);

  function closeBar() {
    setClosed(true);
  }
  return (
    code !== '' && !closed
    ? <div className={styles.signuperrbar}>
      <button onClick = {closeBar} className = {styles.closeerrbtn}><X className = {styles.closeerrx} color='white'/></button>
      {translateErr(code)}
    </div> 
    : null

  );
}
import React, { useState, useEffect } from 'react';
import {
    IonButton,
    IonContent,
    IonInput,
    IonInputPasswordToggle,
    IonPage,
    IonTitle,
    IonModal,
    IonText,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonAlert,
} from '@ionic/react';
import { supabase } from '../utils/supabaseClients';
import bcrypt from 'bcryptjs';

const AlertBox: React.FC<{ message: string; isOpen: boolean; onClose: () => void }> = ({ message, isOpen, onClose }) => {
  return (
    <IonAlert
      isOpen={isOpen}
      onDidDismiss={onClose}
      header="Notification"
      message={message}
      buttons={['OK']}
    />
  );
};

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      ion-content {
        --background: transparent;
        background-image: url('https://mir-s3-cdn-cf.behance.net/project_modules/source/8dd854104252675.5f5f519992330.gif');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }

      .login-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.65);
        padding: 30px;
        border-radius: 20px;
        backdrop-filter: blur(6px);
        box-shadow: 0 0 20px aqua;
        max-width: 90%;
        margin: 25% auto 0 auto;
      }

      .login-avatar {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        overflow: hidden;
        border: 5px solid aqua;
        box-shadow: 0 0 12px aqua;
        margin-bottom: 20px;
      }

      .login-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }

      .login-header {
        font-size: 28px;
        font-weight: bold;
        color: white;
        text-shadow: 0 0 8px aqua;
        text-align: center;
        margin-bottom: 20px;
      }

      ion-input {
        width: 100%;
        --background: #111;
        --color: white;
        --placeholder-color: #aaa;
        --highlight-color-focused: aqua;
        --border-color: aqua;
        --padding-start: 16px;
        --padding-end: 16px;
        margin-bottom: 10px;
        border-radius: 10px;
      }

      ion-button {
        --background: aqua;
        --color: black;
        font-weight: bold;
        margin-top: 10px;
        box-shadow: 0 0 10px aqua;
        border-radius: 8px;
      }

      ion-button[fill="clear"] {
        color: aqua;
        --color: aqua;
        --background-hover: rgba(0, 255, 255, 0.1);
        text-decoration: underline;
        margin-top: 5px;
        font-size: 14px;
        font-weight: 500;
      }

      .register-text {
        margin-top: 20px;
        text-align: center;
        color: white;
        font-size: 16px;
        font-weight: 400;
      }

      .register-text a {
        color: aqua;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.3s ease, text-shadow 0.3s ease;
      }

      .register-text a:hover {
        color: #00ffff;
        text-shadow: 0 0 10px aqua;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleOpenVerificationModal = () => {
    if (!email.includes('@') || !email.includes('.')) {
      setAlertMessage("Please enter a valid email address.");
      setShowAlert(true);
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage("Passwords do not match.");
      setShowAlert(true);
      return;
    }

    setShowVerificationModal(true);
  };

  const doRegister = async () => {
    setShowVerificationModal(false);

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        throw new Error("Account creation failed: " + error.message);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const { error: insertError } = await supabase.from("users").insert([
        {
          username,
          user_email: email,
          user_firstname: firstName,
          user_lastname: lastName,
          user_password: hashedPassword,
        },
      ]);

      if (insertError) {
        throw new Error("Failed to save user data: " + insertError.message);
      }

      setShowSuccessModal(true);
    } catch (err) {
      if (err instanceof Error) {
        setAlertMessage(err.message);
      } else {
        setAlertMessage("An unknown error occurred.");
      }
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <IonContent className='ion-padding'>
        <h1 style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textShadow: '0 0 12px orange',
          fontSize: '3rem'
        }}>Create your account</h1>

        <IonInput label="Username" labelPlacement="stacked" fill="outline" type="text" placeholder="Enter a unique username" value={username} onIonChange={e => setUsername(e.detail.value!)} style={{ marginTop: '15px', color: 'aqua' }} />
        <IonInput label="First Name" labelPlacement="stacked" fill="outline" type="text" placeholder="Enter your first name" value={firstName} onIonChange={e => setFirstName(e.detail.value!)} style={{ marginTop: '15px', color: 'aqua' }} />
        <IonInput label="Last Name" labelPlacement="stacked" fill="outline" type="text" placeholder="Enter your last name" value={lastName} onIonChange={e => setLastName(e.detail.value!)} style={{ marginTop: '15px', color: 'aqua' }} />
        <IonInput label="Email" labelPlacement="stacked" fill="outline" type="email" placeholder="youremail@nbsc.edu.ph" value={email} onIonChange={e => setEmail(e.detail.value!)} style={{ marginTop: '15px', color: 'aqua' }} />
        <IonInput label="Password" labelPlacement="stacked" fill="outline" type="password" placeholder="Enter password" value={password} onIonChange={e => setPassword(e.detail.value!)} style={{ marginTop: '15px', color: 'aqua' }}>
          <IonInputPasswordToggle slot="end" />
        </IonInput>
        <IonInput label="Confirm Password" labelPlacement="stacked" fill="outline" type="password" placeholder="Confirm password" value={confirmPassword} onIonChange={e => setConfirmPassword(e.detail.value!)} style={{ marginTop: '15px', color: 'aqua' }}>
          <IonInputPasswordToggle slot="end" />
        </IonInput>

        <IonButton onClick={handleOpenVerificationModal} expand="full" shape='round' style={{ marginTop: '15px' }}>
          Register
        </IonButton>
        <p style={{ textAlign: 'center', color: 'white' }}>
          Already have an account? <a href="/it36-lab">Sign in</a>
        </p>

        <IonModal isOpen={showVerificationModal} onDidDismiss={() => setShowVerificationModal(false)}>
          <IonContent className="ion-padding">
            <IonCard className="ion-padding" style={{ marginTop: '25%', color: 'aqua' }}>
              <IonCardHeader>
                <IonCardTitle>User Registration Details</IonCardTitle>
                <hr />
                <IonCardSubtitle>Username</IonCardSubtitle>
                <IonCardTitle>{username}</IonCardTitle>

                <IonCardSubtitle>Email</IonCardSubtitle>
                <IonCardTitle>{email}</IonCardTitle>

                <IonCardSubtitle>Name</IonCardSubtitle>
                <IonCardTitle>{firstName} {lastName}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent></IonCardContent>

              {/* ✅ Updated Buttons Below */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '5px', gap: '10px' }}>
                <IonButton
                  fill="outline"
                  onClick={() => setShowVerificationModal(false)}
                  style={{
                    background: 'white',
                    color: 'black',
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px aqua'
                  }}
                >
                  Cancel
                </IonButton>
                <IonButton
                  onClick={doRegister}
                  style={{
                    background: 'white',
                    color: 'black',
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px aqua'
                  }}
                >
                  Confirm
                </IonButton>
              </div>
            </IonCard>
          </IonContent>
        </IonModal>

        <IonModal isOpen={showSuccessModal} onDidDismiss={() => setShowSuccessModal(false)}>
          <IonContent className="ion-padding" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center', marginTop: '35%' }}>
            <IonTitle style={{ marginTop: '35%', color: 'white' }}>Registration Successful 🎉</IonTitle>
            <IonText style={{ color: 'white' }}>
              <p>Your account has been created successfully.</p>
              <p>Please check your email address.</p>
            </IonText>
            <IonButton routerLink="/it36-lab" routerDirection="back" color="primary">
              Go to Login
            </IonButton>
          </IonContent>
        </IonModal>

        <AlertBox message={alertMessage} isOpen={showAlert} onClose={() => setShowAlert(false)} />
      </IonContent>
    </IonPage>
  );
};

export default Register;

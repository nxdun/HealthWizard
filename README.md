# Smart Healthcare System for Urban Hospitals

## User Interface

| Homepage(gif) | Doctors Page |
| --- | --- |
| ![Homepage](https://ik.imagekit.io/cq1p7u6vo/HealthWizard/Recording%202024-10-20%20at%2017.23.07.gif?updatedAt=1729425372504) | ![Doctors Page](https://ik.imagekit.io/cq1p7u6vo/HealthWizard/doctors%20page.jpeg?updatedAt=1729425372840) |

| Admin Dashboard | Appointment Booking |
| --- | --- |
| ![Admin Dashboard](https://ik.imagekit.io/cq1p7u6vo/HealthWizard/Admin-userDashboiard.jpeg?updatedAt=1729425370011) | ![Appointment Booking](https://ik.imagekit.io/cq1p7u6vo/HealthWizard/appointment%20booking.jpg?updatedAt=1729425369292) |

| User Profile | Server Config |
| --- | --- |
| ![profile](https://ik.imagekit.io/cq1p7u6vo/HealthWizard/Screenshot_20-10-2024_17224_localhost.jpeg?updatedAt=1729425369488) | ![Appointment Booking](https://ik.imagekit.io/cq1p7u6vo/HealthWizard/Admin%20Configuration%20Management.jpeg?updatedAt=1729425369398) |

## Functionalities
- Role Based Authentication ( Used MongoDB Discriminators For Inheritance )
```
Person
├── Doctor - See Ongoing Appointments, Change Status Of Them
├── Health Care Manager - Scan QR Code And Validate Patient Appointment
├── Administrator - Access Server DashBoard With Advanced Interactions, Manage Server Configuration, Analytics Dashboard
├── Patient - Book Appointments, See Pending Appointments, Pay For The Appointment,See Doctors List,  Apply For a Doctor
```
- Design Patterns
  
```
MVC architecture
├── Singleton
├── Factory
├── Stratergy
├── Observer
```
  
## TOOLS

- JWT Authentication
- Redux Store
- REACT ( TAILWIND + Pure CSS(postcss), Higher Order Components, Advanced File Organization, ThreeJS, Image Upload )
- Express (Advanced File Organization, Event Emitter, IIFE Functions )
- MongoDB ( Discriminators

## Structure

```
backend/
│
├── app.js                     # Main application
├── models/                    # Contains all models
│   ├── globalModel.js          # Singleton Global Model
│   ├── person.js               # Base class for Person
│   ├── Configurations.js               # Backup Instace For Configuration
│   ├── patient.js              # Patient class inherits from Person
│   ├── doctor.js               # Doctor class inherits from Person
│   ├── hospitalStaff.js        # HospitalStaff class inherits from Person
│   ├── healthcareManager.js    # HealthcareManager inherits from Person
│   ├── appointment.js          # Appointment model
│   ├── hospitalFactory.js      # Factory for hospital types
│   └── paymentStrategy.js      # Strategy for payment methods
│
├── routes/                    # API endpoints
│   ├── patientRoutes.js        # Patient-related API routes
│   ├── doctorRoutes.js         # Doctor-related API routes
│   ├── hospitalStaffRoutes.js  # HospitalStaff-related API routes
│   ├── healthcareManagerRoutes.js # HealthcareManager-related routes
│   ├── appointmentRoutes.js    # Appointment-related API routes
│   └── paymentRoutes.js        # Payment-related API routes
│
└── services/                  # Business logic and services
    ├── appointmentService.js   # Service handling appointments
    ├── reportService.js        # Service handling reports
    └── hospitalService.js      # Service handling hospital services

```

## Enviroment Variables (Dev)
 - Frontend

```
REACT_APP_SERVER_DOMAIN=http://localhost:5000/api
REACT_APP_CLOUDINARY_BASE_URL=https://api.cloudinary.com/v1_1/<>/image/upload
REACT_APP_CLOUDINARY_CLOUD_NAME=
REACT_APP_CLOUDINARY_PRESET=
REACT_FORMIK_SECRET=https://formspree.io/f/ 
```

- Backend
```
PORT=5000
MONGO_URI=mongodb+srv://<url>
TEST_MONGO_URI=TEST_MONGO_URI =mongodb+srv://<test-url>
JWT_SECRET=
```

### Unit Testing

Implement unit tests for individual components and functions to validate their 
behavior in isolation.
  ```
  --BACKEND
      npm test filename.test.js
  ```

### Class Diagram (Click it.. For a Suprise)
[![ClassDiagram](https://mermaid.ink/img/pako:eNq9WltvEzkU_ivWIKSwG6oU2tIMCIltKFSiUDU87XYf3BknsZixsx5PS-j2v6-vE9-mCSnaRqKxfc7nc_exy11W0BJleVZUsGkmGM4ZrK8IED9Pn4IPFb2GFTgXJBW4xXwBppjMK8QpAZCU4BQWnLIVmKAGzwm4gJwjRhrNrxANhEa40wsA_O7OYtJwSArULZ5QMsPzlkGOxT6FGnWLH2mzxBxWX1dLBBbOIIk9R_zMwA-edRQ3FJegQbxdumiDKWdCO8DF94C2MBKh6arhqB6kJDQs91dEftGDzpDWUMZCYEYZOGFI8IsNrRBASuEZzxXPQtylTVFINLRBn_tALG9ncEaEbDNoPRGLsN77zRtsid--fcCug56NP9AbYYYaEd6JIOPpguEbRwtwVi8rJKmUof24ihHuflYQjRRuereDPn5AnChc6eMp4srFZwRzLLA_0Tku3M19xvXWxndLuJIqqmAO1xrEbnCB_DUr8oXDaAOhloM4C6YOToo01PUCsYbKZGdiA62rZ069HKmCy3CGwHqdtRPhAlDS65BIJBcXkX9GZjRcgmXJkN3cKnSD0e0FozNcoYGfklp4YWgh9hBMqEynYRffUw5ns6GKwo8IVnxRCP3OIYFzxESJWiCGOZgxWhsFPZU1aMp9auFsEi7UqMQFrD7iRuZ0pFhR0JZwIRJv1-q9Wy6pyDrp1r_-BnA9CiygK8E7jRFWvXZZ9i9K251ryS5RQVnZhBS1MogJroH5LaQWmPNVQCvc8-VaBiliA_slIGGoFmm8iYpQjmcru9hEbtVO0A6NfVCq-dgFzRIVIiXxD5V6kejyKCS0wc0g9OUQWGRLkrTxtFigshVR6PjN9dqayTO5dG1RiLA2QWUdEUqRNoIXzbEtGjkdm4LRCkVmQ0vIlKCBaX5CON8ghkdm8iYGHWaO4botHAP22iBK38gOGj8RFAmtL9GSMplxMjv0oJOGqaE8GtdBITS9hGSOkjYYrKlgojpN8FwdQVoFcAJZGRdYQ6RpFEmkn1C-dJRTtRU3TYvkt5D4H3Yiqn04ew1Z4U7r06KARO44ML4MdJwjgmQpSJC4Wnrxbg5L1VwGXZKrtM8TKczUfOzP3gLcVxW6nA4XuKyqXmDoE0v882WmxYqLqZ5P1-BozVdRV3FDlOzkHmwuDRiwRla9Ju03adxd7iyOW--i4HUXIy96ye3b2VlKxfD2fu4qpO56bBeVOmX1-fuetLUsnO5RbJJBF3iHY9DFRFcPOK5RdOr1shJ0O3G5xfhrDFDI-0zlMicO8sRyn5e0okBq2uMrxxSO14wWpXNzkw07d2eUqM7EZaf8eu4CkVJo240_0-mC3sYyh76LoiskuOvpmRPdgF747Lak3ZnQFAwvvS6hpO11JS5dtOGx5c3uE8Qhrpp0F7pKp4dd6LsIbFPhjGywli2en0UGJZVBqQhfMqoP-2S7J1i8vi-hYEfaXS31rchOJwp9yLnNlTOQ0zNAQjhRDEvRzKuj0_MEGKwF9m6ez7wrm2KX3LG3dhHnjDTi_ifSZBdhOuZfI8v6Vn3akhLtZJ8Q49dIFnd1TuNg7wapgHpMO0iS5SBqER-4qv6f3WNnheRDTre6TUZttZ9WJy5iZj7RpMn5xPWjs4NfrWw7WabqlZQp3X3q7a3sonQLHTEMDIq-SyKfVJSmGvKkopV-gFrgpdHUfWS8yvavMvD8ufniP-nkJro286Ue-3LQNpJVM6coHJDR3t5vAY4A0J1bEyOAN_8KtvgdrY8yeCezQpn3Hk2iD6N4QV_O43nvvppYDnO329S8uMTau31NDq4p_dZsYrEFKnBVP4PfGudgAftZ5Jf4xpaDCpNvqPxKrUau3CG7ftnIZYFp2sq-9zzAEfZBuYztjVzpfk-pZ5-iNEby5rDZTF4kWqM7bI4vunPGTwBjic1b6VeKLuqjIyBGMEUrV4V6YwR0xTTXr1N4LWOogQrkqGd4gDY80h8g7Tlqu3oR6a24HOGxPcaV-A1fiSPYLVEzXFX5k3eTyfH7o6Fs-Og3lD8ZqR87fn6LS77IX7xWtXL9B6LuLNawqeKl4U9Hx-KzHXz0RKDBkxH5y9BjOxro08mr0ZbQcYuisUO_auQ_Ru9HW1s86qY7bF1KNeTkpfyEkK9NC6ret00T6r7rWyF1IphwGMvPZqSTBa5KH8gk8KNx_HfOx8P1OHgnSAvqVlrjguPT48lxGu4LX9ieNgHg1OOdoMIDYScQW7J3Yo7PwJ1g_EK_E4Sp9I91yc8BZMOsRqK9xGWWZ6ozvsrEqrheZLn4WqIZFCf7VXZF7gUpbDmdrkiR5Zy1aJgx2s4XWT6DVSNGujk3f6u3JEtI_qTUHWb5XfY9yw9Ge4eHL44Oxwej8dHh4eF4mK2yfP_gYG80fjUS9evFeCSW74fZD8U_2hsf7u-Pxsejl0cH-2LlYJjJw4uyc_M_BeSv-_8A3AyJvg?type=png)](https://mermaid.live/edit#pako:eNq9WltvEzkU_ivWIKSwG6oU2tIMCIltKFSiUDU87XYf3BknsZixsx5PS-j2v6-vE9-mCSnaRqKxfc7nc_exy11W0BJleVZUsGkmGM4ZrK8IED9Pn4IPFb2GFTgXJBW4xXwBppjMK8QpAZCU4BQWnLIVmKAGzwm4gJwjRhrNrxANhEa40wsA_O7OYtJwSArULZ5QMsPzlkGOxT6FGnWLH2mzxBxWX1dLBBbOIIk9R_zMwA-edRQ3FJegQbxdumiDKWdCO8DF94C2MBKh6arhqB6kJDQs91dEftGDzpDWUMZCYEYZOGFI8IsNrRBASuEZzxXPQtylTVFINLRBn_tALG9ncEaEbDNoPRGLsN77zRtsid--fcCug56NP9AbYYYaEd6JIOPpguEbRwtwVi8rJKmUof24ihHuflYQjRRuereDPn5AnChc6eMp4srFZwRzLLA_0Tku3M19xvXWxndLuJIqqmAO1xrEbnCB_DUr8oXDaAOhloM4C6YOToo01PUCsYbKZGdiA62rZ069HKmCy3CGwHqdtRPhAlDS65BIJBcXkX9GZjRcgmXJkN3cKnSD0e0FozNcoYGfklp4YWgh9hBMqEynYRffUw5ns6GKwo8IVnxRCP3OIYFzxESJWiCGOZgxWhsFPZU1aMp9auFsEi7UqMQFrD7iRuZ0pFhR0JZwIRJv1-q9Wy6pyDrp1r_-BnA9CiygK8E7jRFWvXZZ9i9K251ryS5RQVnZhBS1MogJroH5LaQWmPNVQCvc8-VaBiliA_slIGGoFmm8iYpQjmcru9hEbtVO0A6NfVCq-dgFzRIVIiXxD5V6kejyKCS0wc0g9OUQWGRLkrTxtFigshVR6PjN9dqayTO5dG1RiLA2QWUdEUqRNoIXzbEtGjkdm4LRCkVmQ0vIlKCBaX5CON8ghkdm8iYGHWaO4botHAP22iBK38gOGj8RFAmtL9GSMplxMjv0oJOGqaE8GtdBITS9hGSOkjYYrKlgojpN8FwdQVoFcAJZGRdYQ6RpFEmkn1C-dJRTtRU3TYvkt5D4H3Yiqn04ew1Z4U7r06KARO44ML4MdJwjgmQpSJC4Wnrxbg5L1VwGXZKrtM8TKczUfOzP3gLcVxW6nA4XuKyqXmDoE0v882WmxYqLqZ5P1-BozVdRV3FDlOzkHmwuDRiwRla9Ju03adxd7iyOW--i4HUXIy96ye3b2VlKxfD2fu4qpO56bBeVOmX1-fuetLUsnO5RbJJBF3iHY9DFRFcPOK5RdOr1shJ0O3G5xfhrDFDI-0zlMicO8sRyn5e0okBq2uMrxxSO14wWpXNzkw07d2eUqM7EZaf8eu4CkVJo240_0-mC3sYyh76LoiskuOvpmRPdgF747Lak3ZnQFAwvvS6hpO11JS5dtOGx5c3uE8Qhrpp0F7pKp4dd6LsIbFPhjGywli2en0UGJZVBqQhfMqoP-2S7J1i8vi-hYEfaXS31rchOJwp9yLnNlTOQ0zNAQjhRDEvRzKuj0_MEGKwF9m6ez7wrm2KX3LG3dhHnjDTi_ifSZBdhOuZfI8v6Vn3akhLtZJ8Q49dIFnd1TuNg7wapgHpMO0iS5SBqER-4qv6f3WNnheRDTre6TUZttZ9WJy5iZj7RpMn5xPWjs4NfrWw7WabqlZQp3X3q7a3sonQLHTEMDIq-SyKfVJSmGvKkopV-gFrgpdHUfWS8yvavMvD8ufniP-nkJro286Ue-3LQNpJVM6coHJDR3t5vAY4A0J1bEyOAN_8KtvgdrY8yeCezQpn3Hk2iD6N4QV_O43nvvppYDnO329S8uMTau31NDq4p_dZsYrEFKnBVP4PfGudgAftZ5Jf4xpaDCpNvqPxKrUau3CG7ftnIZYFp2sq-9zzAEfZBuYztjVzpfk-pZ5-iNEby5rDZTF4kWqM7bI4vunPGTwBjic1b6VeKLuqjIyBGMEUrV4V6YwR0xTTXr1N4LWOogQrkqGd4gDY80h8g7Tlqu3oR6a24HOGxPcaV-A1fiSPYLVEzXFX5k3eTyfH7o6Fs-Og3lD8ZqR87fn6LS77IX7xWtXL9B6LuLNawqeKl4U9Hx-KzHXz0RKDBkxH5y9BjOxro08mr0ZbQcYuisUO_auQ_Ru9HW1s86qY7bF1KNeTkpfyEkK9NC6ret00T6r7rWyF1IphwGMvPZqSTBa5KH8gk8KNx_HfOx8P1OHgnSAvqVlrjguPT48lxGu4LX9ieNgHg1OOdoMIDYScQW7J3Yo7PwJ1g_EK_E4Sp9I91yc8BZMOsRqK9xGWWZ6ozvsrEqrheZLn4WqIZFCf7VXZF7gUpbDmdrkiR5Zy1aJgx2s4XWT6DVSNGujk3f6u3JEtI_qTUHWb5XfY9yw9Ge4eHL44Oxwej8dHh4eF4mK2yfP_gYG80fjUS9evFeCSW74fZD8U_2hsf7u-Pxsejl0cH-2LlYJjJw4uyc_M_BeSv-_8A3AyJvg)
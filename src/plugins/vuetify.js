// src/plugins/vuetify.js
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css'; // Importa los estilos de Material Design Icons
import {
    VImg,
    VBtn,
    VCard,
    VTextField,
    VCardText,
    VIcon,
    VAlert,
    VSlideXReverseTransition
} from 'vuetify/components';

export default createVuetify({
    components: {
        VImg,
        VBtn,
        VCard,
        VTextField,
        VCardText,
        VIcon,
        VAlert,
        VSlideXReverseTransition
    },
    icons: {
        defaultSet: 'mdi', // Establece Material Design Icons como el set de iconos por defecto
    },
});

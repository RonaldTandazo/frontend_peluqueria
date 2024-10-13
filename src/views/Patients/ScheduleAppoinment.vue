<template>
    <v-app>
        <ToolBar pageTitle="Schedule Appoinment"></ToolBar>
        <v-container>
            <v-row>
                <v-col cols="12" class="d-flex justify-start">
                    <h2 class="text-h4">Schedule Appoinment</h2>
                </v-col>
            </v-row>
            <v-row>
                <AdaptativeBreadcrumbs :routes="routes"></AdaptativeBreadcrumbs>
            </v-row>
            <v-sheet>
                <CustomCalendar style="width: 100%;"/>
            </v-sheet>
        </v-container>
    </v-app>
</template>

<script>
import ToolBar from '../../components/General/ToolBar.vue';
import AdaptativeBreadcrumbs from '../../components/General/AdaptativeBreadcrumbs.vue';
import CustomCalendar from '../../components/General/CustomCalendar.vue';
import { jwtDecode } from 'jwt-decode';

export default {
    name: 'ScheduleAppoinment',
    components: {
        ToolBar,
        AdaptativeBreadcrumbs,
        CustomCalendar
    },
    data: () => ({
        userInfo: null,
        record: null,
        state: 'new',
        isModalOpen: false,
        selectedDate: null,
        selectedEvent: null,
        routes: [
            {
                title: 'Home',
                disabled: false,
                href: '/home'
            },
            {
                title: 'Patients Dashboard',
                disabled: false,
                href: '/patients'
            },
            {
                title: 'Schedule Appoinment',
                disabled: true,
                href: '/patients/schedule_appoinment'
            }
        ],
        type: 'month',
        weekday: [0, 1, 2, 3, 4, 5, 6],
        value: [new Date()],
        events: []
    }),

    mounted() {
        const token = localStorage.getItem('jwt');
        if (token) {
            try {
                this.userInfo = jwtDecode(token);
            } catch (error) {
                console.error('Invalid token', error);
            }
        }
    }
};
</script>
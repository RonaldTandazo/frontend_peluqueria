<template>
    <div>
        <v-row>
            <v-col cols="6" class="d-flex justify-start">
                <v-btn
                    prepend-icon="mdi-calendar-plus-outline"
                    color="white"
                    class="me-2"
                    ref="modalBtn"
                    @click="isModalOpen = true; state='new'"
                >
                    New Appointment
                </v-btn>
            </v-col>
        </v-row>
        <div class="calendar">
            <div class="calendar-header">
                <v-btn @click="prevMonth" icon="mdi-chevron-left" elevation="4" variant="solo" density="comfortable"></v-btn>
                <h2 class="text-h5">{{ currentMonthName }} {{ currentYear }}</h2>
                <v-btn @click="nextMonth" icon="mdi-chevron-right" elevation="4" variant="solo" density="comfortable"></v-btn>
            </div>

            <div class="calendar-grid">
                <div class="day-name week-day" v-for="(day, index) in dayNames" :key="index">{{ day }}</div>
                <div
                    class="calendar-day"
                    v-for="(date, index) in daysInMonth"
                    :key="index"
                    :class="{ 'is-today': isToday(date), 'is-selected': isSelected(date) }"
                    @click="selectDate(date)"
                >
                    <span v-if="date != null" class="text-body-2">{{ date.getDate() }}</span>
                    <div v-if="date != null && hasEvents(date)">
                        <template v-for="event in getEventsForDate(date)" 
                            :key="event.id"
                        >
                            <ul>
                                <li
                                    :key="event.id"
                                    @click.stop="selectEvent(event)"
                                >
                                    <v-chip elevation="2" class="event cursor-pointer" :style="{ '--chip-hover-color': event.importance }"
                                        density="compact" @click="isModalOpen = true; state='edit'; record=event"
                                    >
                                        <v-icon :color="event.importance" class="me-2">mdi-alert-circle</v-icon>
                                        {{ event.title }}
                                    </v-chip>
                                </li>
                            </ul>
                        </template>
                    </div>
                </div>
            </div>
            <v-dialog v-model="isModalOpen" max-width="600px">
                <EventModal 
                    v-model="isModalOpen" 
                    @close="isModalOpen = false" 
                    @getDoctors="getDoctorsBySpeciality"
                    @save="saveAppointment" 
                    :state="state" 
                    :record="record" 
                    :specialities="specialities"
                    :doctors="doctors"
                />
            </v-dialog>
        </div>
    </div>
</template>
  
<script>
    import EventModal from "../../components/Patients/EventModal.vue";
    import { doctorService } from '../../services/doctorService';
    import { appointmentService } from '../../services/appointmentService';

    export default {
        name: 'CustomCalendar',
        components: {
            EventModal
        },
        props: {
            specialities: {
                type: Array,
                required: true
            },
            userInfo: {
                type: Object,
                required: true
            }
        },
        data() {
            return {

                currentDate: new Date(),
                selectedDate: null,
                events: [
                    {
                        id: 1, 
                        speciality: 1,
                        doctor: 1,
                        title: "Event 1", 
                        description: "Description 1", 
                        date: new Date(2024,9,1), 
                        start_time: "08:00", 
                        end_time: "09:00",
                        importance: "#D50000"
                    },
                    {
                        id: 2, 
                        title: "Event 2", 
                        description: "Description 2", 
                        date: new Date(2024,9,1), 
                        start: "10:00", 
                        end: "10:30",
                        importance: "#FF6D00"
                    },
                    {
                        id: 3, 
                        title: "Event 3", 
                        description: "Description 3", 
                        date: new Date(2024,9,1), 
                        start: "00:00", 
                        end: "01:00",
                        importance: "#2962FF"
                    },
                    {
                        id: 4, 
                        title: "Event 4", 
                        description: "Description 4", 
                        date: new Date(2024,9,1), 
                        start: "15:15", 
                        end: "15:30",
                        importance: "#00C853"
                    }
                ],
                state: 'new',
                isModalOpen: false,
                doctors: []
            };
        },
        computed: {
            currentYear() {
                return this.currentDate.getFullYear();
            },
            currentMonth() {
                return this.currentDate.getMonth();
            },
            currentMonthName() {
                const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(this.currentDate);
                return monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
            },
            dayNames() {
                return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            },
            daysInMonth() {
                const days = [];
                const year = this.currentYear;
                const month = this.currentMonth;

                const firstDay = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();

                for (let i = 0; i < firstDay; i++) {
                    days.push(null);
                }

                // Llenar los días del mes
                for (let i = 1; i <= daysInMonth; i++) {
                    days.push(new Date(year, month, i));
                }

                return days
            }
        },
        methods: {
            prevMonth() {
                const newDate = new Date(this.currentDate);
                newDate.setMonth(this.currentDate.getMonth() - 1);
                this.currentDate = newDate;
            },
            nextMonth() {
                const newDate = new Date(this.currentDate);
                newDate.setMonth(this.currentDate.getMonth() + 1);
                this.currentDate = newDate;
            },
            isToday(date) {
                const today = new Date();
                return (
                    date &&
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear()
                );
            },
            isSelected(date) {
                return this.selectedDate && date && date.getTime() === this.selectedDate.getTime();
            },
            selectDate(date) {
                this.selectedDate = date;
                this.$emit('date-selected', date);
            },
            getEventsForDate(date) {
                return this.events.filter(
                    (event) => event.date.toDateString() === date.toDateString()
                );
            },
            selectEvent(event) {
                this.$emit('event-selected', event);
            },
            hasEvents(day) {
                return this.getEventsForDate(day).length > 0;
            },

            async saveAppointment(appointmentData){
                try{
                    if(appointmentData != null){
                        const appointment = appointmentData
                        const [year, month, day] = appointment.date.split('-');
                        appointment.patientId = this.userInfo.user_id

                        if(appointment.status == "new"){
                            const found_appointment = this.events.find(e => e.id === appointment.id);
                            if(found_appointment){
                                return null
                            }

                            appointment.status = 'A'
                            this.events.push({
                                patientId: appointment.patientId,
                                specialityId: appointment.speciality,
                                doctorId: appointment.doctor,
                                title: appointment.title,
                                description: appointment.description,
                                date: new Date(year, month-1, day),
                                startTime: appointment.startTime,
                                endTime: appointment.endTime,
                                importance: appointment.importance,
                            });
                            this.totalItems += 1 
                            console.log(appointment)
                            const response = await appointmentService.store(appointment)
                            console.log(response)
                        }else{
                            const found_appointment = this.events.find(e => e.id === appointment.id);

                            if (found_appointment) {
                                found_appointment.appointmentId = appointment.appointmentId,
                                found_appointment.patientId = appointment.patientId,
                                found_appointment.specialityId = appointment.speciality,
                                found_appointment.doctorId = appointment.doctor,
                                found_appointment.title = appointment.title,
                                found_appointment.description = appointment.description,
                                found_appointment.date = new Date(year, month-1, day),
                                found_appointment.startTime = appointment.startTime,
                                found_appointment.endTime = appointment.endTime,
                                found_appointment.importance = appointment.importance
                            }
                        }
                    }
                }catch (error) {
                    console.log(error)
                }
            },

            async getDoctorsBySpeciality(speciality){
                try{
                    const response = await doctorService.getDoctorsBySpeciality(speciality);
                    if (!response.success) {
                        this.$emit('notify', {message: response.message, ok: response.success, show: true});
                    } else {
                        this.doctors = response.data.map(doctor => ({
                            value: doctor.id,
                            label: doctor.nombre
                        }));
                    }
                }catch(error){
                    this.$emit('notify', {message: "Error While Searching", ok: false, show: true});
                }
            }
        }
    };
</script>
  
<style scoped>
    .calendar {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 1.5%;
    }
    .calendar-header {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 20px;
    }
    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 5px;
        width: 100%;
    }
    .calendar-day {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        min-height: 100px;
        position: relative;
    }
    .week-day {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: #258eff;
        color: white;
        position: relative;
    }
    .is-today {
        background-color: #f0f8ff;
    }
    .is-selected {
        border-color: #007bff;
    }
    .date-btn:hover {
        background-color: #3f9cff;
        color: white;
    }
    ul {
        list-style-type: none;
        padding-left: 0;
    }
    li {
        list-style-type: none;
    }
    .event {
        background-color: #6eb4ff28;
        color: #007bff;
        padding: 2px 5px;
        margin-top: 5px;
    }
    .event:hover {
        background-color: var(--chip-hover-color) !important;
        color: white !important;
    }
    .event:hover .v-icon {
        color: white !important;
    }     
</style>
  
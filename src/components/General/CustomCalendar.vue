<template>
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
                <v-btn
                    v-if="date != null"
                    variant="text"
                    class="date-btn"
                    border
                    rounded
                >
                <span class="text-body-2">{{ date.getDate() }}</span>
                </v-btn>
                <div v-if="date != null && hasEvents(date)">
                    <template v-for="event in getEventsForDate(date)" 
                        :key="event.id"
                    >
                        <ul>
                            <li
                                :key="event.id"
                                @click.stop="selectEvent(event)"
                            >
                                <v-chip elevation="2" class="event cursor-pointer" :style="{ '--chip-hover-color': event.importance }">
                                    <v-icon :color="event.importance" class="me-2">mdi-alert-circle</v-icon>
                                    {{ event.title }}
                                </v-chip>
                            </li>
                        </ul>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
    export default {
        data() {
            return {
                currentDate: new Date(),
                selectedDate: null,
                events: [
                    {
                        id: 1, 
                        title: "Event 1", 
                        description: "Description 1", 
                        date: new Date(2024,9,1), 
                        start: "9:45 am", 
                        end: "10:30 am",
                        importance: "#D50000"
                    },
                    {
                        id: 2, 
                        title: "Event 2", 
                        description: "Description 2", 
                        date: new Date(2024,9,1), 
                        start: "9:45 am", 
                        end: "10:30 am",
                        importance: "#FF6D00"
                    },
                    {
                        id: 3, 
                        title: "Event 3", 
                        description: "Description 3", 
                        date: new Date(2024,9,1), 
                        start: "9:45 am", 
                        end: "10:30 am",
                        importance: "#2962FF"
                    },
                    {
                        id: 4, 
                        title: "Event 4", 
                        description: "Description 4", 
                        date: new Date(2024,9,1), 
                        start: "9:45 am", 
                        end: "10:30 am",
                        importance: "#00C853"
                    }
                ],
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

                // Agregar los días vacíos antes del primer día
                for (let i = 0; i < firstDay; i++) {
                    days.push(null);
                }

                // Llenar los días del mes
                for (let i = 1; i <= daysInMonth; i++) {
                    days.push(new Date(year, month, i));
                }

                // Filtrar solo los días que no son nulos
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
                this.$emit('date-selected', date); // Acción al seleccionar fecha
            },
            getEventsForDate(date) {
                return this.events.filter(
                    (event) => event.date.toDateString() === date.toDateString()
                );
            },
            selectEvent(event) {
                this.$emit('event-selected', event); // Acción al seleccionar evento
            },
            hasEvents(day) {
                return this.getEventsForDate(day).length > 0;
            }
        },
    };
</script>
  
<style scoped>
    .calendar {
        display: flex;
        flex-direction: column;
        align-items: center;
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
        min-height: 25px;
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
  
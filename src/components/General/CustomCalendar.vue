<template>
    <div class="calendar">
        <div class="calendar-header">
            <button @click="prevMonth">Anterior</button>
            <h2>{{ currentMonthName }} {{ currentYear }}</h2>
            <button @click="nextMonth">Siguiente</button>
        </div>

        <div class="calendar-grid">
            <div class="day-name" v-for="(day, index) in dayNames" :key="index">{{ day }}</div>
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
                    {{ date.getDate() }}
                </v-btn>
                <div v-if="date != null && hasEvents(date)">
                    <template v-for="event in getEventsForDate(day)" 
                        :key="event.id"
                    >
                        <!-- <ul>
                            <li
                                :key="event.id"
                                class="event"
                                @click.stop="selectEvent(event)"
                            >
                                <v-chip prepend-icon="mdi-star-four-points">
                                    {{ event.title }}
                                </v-chip>
                            </li>
                        </ul> -->
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
                    { id: 1, title: "Evento 1", date: new Date(2024, 9, 15) },
                    { id: 2, title: "Evento 2", date: new Date(2024, 9, 15) },
                    { id: 3, title: "Evento 3", date: new Date(2024, 9, 20) },
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
        gap: 10px;
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
    .is-today {
        background-color: #f0f8ff;
    }
    .is-selected {
        border-color: #007bff;
    }
    .event {
        background-color: #007bff;
        color: white;
        padding: 2px 5px;
        margin-top: 5px;
        border-radius: 3px;
        cursor: pointer;
    }
    .date-btn:hover {
        background-color: #007bff;
        color: white;
        font-size: smaller;
    }
</style>
  
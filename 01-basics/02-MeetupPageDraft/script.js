import Vue from './vue.esm.browser.js';

/** URL адрес API */
const API_URL = 'https://course-vue.javascript.ru/api';

/** ID митапа для примера; используйте его при получении митапа */
const MEETUP_ID = 6;

/**
 * Возвращает ссылку на изображение митапа для митапа
 * @param meetup - объект с описанием митапа (и параметром meetupId)
 * @return {string} - ссылка на изображение митапа
 */
function getMeetupCoverLink(meetup) {
  return `${API_URL}/images/${meetup.imageId}`;
}

/**
 * Словарь заголовков по умолчанию для всех типов элементов программы
 */
const agendaItemTitles = {
  registration: 'Регистрация',
  opening: 'Открытие',
  break: 'Перерыв',
  coffee: 'Coffee Break',
  closing: 'Закрытие',
  afterparty: 'Afterparty',
  talk: 'Доклад',
  other: 'Другое',
};

/**
 * Словарь иконок для для всех типов элементов программы.
 * Соответствует имени иконок в директории /assets/icons
 */
const agendaItemIcons = {
  registration: 'key',
  opening: 'cal-sm',
  talk: 'tv',
  break: 'clock',
  coffee: 'coffee',
  closing: 'key',
  afterparty: 'cal-sm',
  other: 'cal-sm',
};

export const app = new Vue({
  el: '#app',

  data: {
    //
    meetups: null
  },

  mounted() {
    // Требуется получить данные митапа с API
    this.getMeetups()
  },

  computed: {
    //
    finalMeetup() {
      // Требуется помнить о том, что изначально митапа может не быть.
      // В этом случае и вычисляемый митап - это null.
      if (this.meetups === null) {
        return null;
      }

      return {
        ...this.meetups,

        cover: this.meetups.imageId
          ? getMeetupCoverLink(this.meetups)
          : null,

        date: new Date(this.meetups.date),

        localeDate: new Date(this.meetups.date).toLocaleString(
          navigator.language,
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          },
        ),

        agenda: this.meetups.agenda.map((agendaItem) => ({
          ...agendaItem,
          icon: `icon-${agendaItemIcons[agendaItem.type]}.svg`,
          title: agendaItem.title || agendaItemTitles[agendaItem.type],
        })),
      };
    },
  },

  methods: {
    // Получение данных с API предпочтительнее оформить отдельным методом,
    // а не писать прямо в mounted()
    async getMeetups() {
      this.meetups = await fetch(`${API_URL}/meetups/${MEETUP_ID}`,).then((res) => res.json());
      console.log(this.meetups)
    }
  },
});

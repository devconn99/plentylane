<template>
  <b-container class="container-fluid position-relative">
    <b-alert
      @dismiss-count-down="countDownChanged"
      :show="alert.show"
      fade
      dismissible
      class="d-alert position-absolute"
      style="width: 100%"
      :variant="alert.variant"
      @dismissed="alert.show = 0"
    >
      <p>{{ alert.msg }}</p>
    </b-alert>
    <div class="d-flex justify-content-center" >
      <div style="width:50%">
        <h3 class="mt-4">Question</h3>
        <h5 class="mt-2">Subject : {{question.subject}}</h5>
        <span>
          Body : <caption class="d-inline-block"> {{question.body}}</caption>  
        </span>

        <b-form-group label="Write your answer here." class="mt-2">
          <b-textarea v-model="answerObject.answer" rows="5" />
        </b-form-group>
        <b-button
          @click="answerTheQuestion()"
          class="mt-2 btnGreen btnBigSize btn50 text-uppercase hover-slide-left"
          :disabled="!enablePostButton"
        >
          <span>Answer</span>
        </b-button>
      </div>
    </div>
  </b-container>
</template>

<script>
import Loading from 'vue-loading-overlay';
import api from '../api';

export default {
  name: "PostAnswer",
  components: { Loading },
  data: () => ({
    alert: {
      show: 0,
      msg: "",
      variant: "success"
    },
    token: '',
    mealId: "",
    question: {
      subject: null,
      body: null
    },
    answerObject: {
      answer: "",
      userUID: "",
      subject: ""
    }
  }),
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.clearData();
      const { user, token, meal, question } = vm.$route.query;
      vm.token = token;
      vm.mealId = meal;
      localStorage.setItem("plAccessToken", token);
      const decodedQuestion = Buffer.from(question, 'base64').toString('ascii');
      if (decodedQuestion) {
        vm.question = JSON.parse(decodedQuestion)
        vm.answerObject.subject = `Re - ${vm.question.subject}`
      }
      vm.answerObject.userUID = user
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.clearData();
    const _loading = this.$loading.show();
    const { user, token, meal, question } = to.query;
    this.token = token;
    this.mealId = meal;
    const decodedQuestion = Buffer.from(question, 'base64').toString('ascii');
    if (decodedQuestion) {
      this.question = JSON.parse(decodedQuestion);
      vm.answerObject.subject = `Re - ${vm.question.subject}`;
    }
    this.answerObject.userUID = user;
    localStorage.setItem("plAccessToken", token);
    const cb = () => {
      next();
      if (_loading && _loading.hide) {
        _loading.hide();
      }
    };
  },
  mounted() {
    window.onbeforeunload = function() {
      localStorage.removeItem("plAccessToken")
    };
  },
  computed: {
    enablePostButton() {
      const { answer, userUID } = this.answerObject
      const { body, subject } = this.question
      const token = this.token;
      return !!(answer && userUID && token && subject && body)
    }
  },
  methods: {
    clearData() {
      this.isLoaded = false;
      this.hideGlobalLoader()
    },
    hideGlobalLoader() {
      if (this.$loader && this.$loader.hide) {
        setTimeout(() => {
          this.$loader.hide()
        }, 0);
      }
    },
    answerTheQuestion() {
      const { answer, userUID } = this.answerObject
      if (answer && userUID) {
        const answerObject = this.answerObject
        api.dashboard.meals.cookAnswerByMealId(this.mealId, answerObject).then(res => {
          this.alert = {
            variant: 'success',
            msg: "Answer post successful!",
            show: 5
          }
          this.answerObject = {
            answer: "",
            userUID: "",
            subject: ""
          }
          // localStorage.removeItem("plAccessToken")
          setTimeout(() => {
            this.$router.push("/dashboard")  
          }, 5000);
        }).catch(err => {
          this.alert = {
            variant: 'danger',
            msg: "Internal server error!",
            show: 5
          }
        })
      } else {
        this.alert = {
          variant: 'warning',
          msg: "Write an answer!",
          show: 5
        }
      }
    },
    countDownChanged(dismissCountDown) {
      this.alert.show = dismissCountDown
    },
  }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
</style>

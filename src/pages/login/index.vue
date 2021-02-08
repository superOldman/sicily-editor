<script type='text/ecmascript-6'>
/* COMPONENT DOCUMENT
 * author: skm
 * date: 2020/03/17
 * desc: login
 */
import SkmService from '../../services/api'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      userData: {
        username: 'superOldman',
        password: '1'
      },
      registerData: {
        username: '',
        email: '',
        password: ''
      }
    }
  },
  mounted() {
    this.init()
    this.addKeyBoardListener()
  },
  computed: {
    ...mapGetters('userMessageModule', ['getUserInfo'])
  },
  destroyed() {
    this.removeKeyBoardListener()
  },
  methods: {
    async init() {
      if (!this.getUserInfo) {
        const result = await SkmService.islogin()
        if (result && result.code === 200) {
          this.$router.push({ name: 'home' })
          this.$store.commit('userMessageModule/refushUser', result.userMessage)
        } else {
          this.initDom()
        }
      } else {
        this.$router.push({ name: 'home' })
      }
    },
    initDom() {
      const Auth = {
        vars: {
          lowin: document.querySelector('.lowin'),
          lowin_brand: document.querySelector('.lowin-brand'),
          lowin_wrapper: document.querySelector('.lowin-wrapper'),
          lowin_login: document.querySelector('.lowin-login'),
          lowin_wrapper_height: 0,
          login_back_link: document.querySelector('.login-back-link'),
          forgot_link: document.querySelector('.forgot-link'),
          login_link: document.querySelector('.login-link'),
          login_btn: document.querySelector('.login-btn'),
          register_link: document.querySelector('.register-link'),
          password_group: document.querySelector('.password-group'),
          password_group_height: 69,
          lowin_register: document.querySelector('.lowin-register'),
          lowin_footer: document.querySelector('.lowin-footer'),
          box: document.getElementsByClassName('lowin-box'),
          option: {}
        },
        register(e) {
          Auth.vars.lowin_login.className += ' lowin-animated'
          setTimeout(() => {
            Auth.vars.lowin_login.style.display = 'none'
          }, 500)
          Auth.vars.lowin_register.style.display = 'block'
          Auth.vars.lowin_register.className += ' lowin-animated-flip'
          Auth.setHeight(
            Auth.vars.lowin_register.offsetHeight +
            Auth.vars.lowin_footer.offsetHeight
          )
          e.preventDefault()
        },
        login(e) {
          Auth.vars.lowin_register.classList.remove('lowin-animated-flip')
          Auth.vars.lowin_register.className += ' lowin-animated-flipback'
          Auth.vars.lowin_login.style.display = 'block'
          Auth.vars.lowin_login.classList.remove('lowin-animated')
          Auth.vars.lowin_login.className += ' lowin-animatedback'
          setTimeout(() => {
            Auth.vars.lowin_register.style.display = 'none'
          }, 500)
          setTimeout(() => {
            Auth.vars.lowin_register.classList.remove(
              'lowin-animated-flipback'
            )
            Auth.vars.lowin_login.classList.remove('lowin-animatedback')
          }, 1000)
          Auth.setHeight(
            Auth.vars.lowin_login.offsetHeight +
            Auth.vars.lowin_footer.offsetHeight
          )
          e.preventDefault()
        },
        forgot(e) {
          Auth.vars.password_group.classList += ' lowin-animated'
          Auth.vars.login_back_link.style.display = 'block'
          setTimeout(() => {
            Auth.vars.login_back_link.style.opacity = 1
            Auth.vars.password_group.style.height = 60
            Auth.vars.password_group.style.margin = 0
          }, 100)
          Auth.vars.login_btn.innerText = 'Forgot Password'
          Auth.setHeight(
            Auth.vars.lowin_wrapper_height - Auth.vars.password_group_height
          )
          Auth.vars.lowin_login
            .querySelector('form')
            .setAttribute('action', Auth.vars.option.forgot_url)
          e.preventDefault()
        },
        loginback(e) {

          Auth.vars.password_group.classList.remove('lowin-animated')
          Auth.vars.password_group.classList += ' lowin-animated-back'
          Auth.vars.password_group.style.display = 'block'

          console.log('heihgt', Auth.vars.password_group_height)
          setTimeout(() => {
            Auth.vars.login_back_link.style.opacity = 0
            Auth.vars.password_group.style.height =
              Auth.vars.password_group_height + 'px'
            Auth.vars.password_group.style.marginBottom = 30 + 'px'
          }, 100)
          setTimeout(() => {
            Auth.vars.login_back_link.style.display = 'none'
            Auth.vars.password_group.classList.remove('lowin-animated-back')
          }, 1000)
          Auth.vars.login_btn.innerText = 'Sign In'
          Auth.vars.lowin_login
            .querySelector('form')
            .setAttribute('action', Auth.vars.option.login_url)
          Auth.setHeight(Auth.vars.lowin_wrapper_height)
          e.preventDefault()
        },
        setHeight(height) {
          Auth.vars.lowin_wrapper.style.minHeight = height + 'px'
        },
        brand() {
          Auth.vars.lowin_brand.classList += ' lowin-animated'
          setTimeout(() => {
            Auth.vars.lowin_brand.classList.remove('lowin-animated')
          }, 1000)
        },
        init(option) {
          Auth.setHeight(
            Auth.vars.box[0].offsetHeight + Auth.vars.lowin_footer.offsetHeight
          )
          // Auth.vars.password_group.style.height =
          //   Auth.vars.password_group.offsetHeight + "px";
          // Auth.vars.password_group_height =
          //   Auth.vars.password_group.offsetHeight + 'px';
          // Auth.vars.lowin_wrapper_height = Auth.vars.lowin_wrapper.offsetHeight;
          // Auth.vars.option = option;
          Auth.vars.lowin_login
            .querySelector('form')
            .setAttribute('action', option.login_url)
          const len = Auth.vars.box.length - 1
          for (let i = 0; i <= len; i++) {
            if (i !== 0) {
              Auth.vars.box[i].className += ' lowin-flip'
            }
          }
          Auth.vars.forgot_link.addEventListener('click', e => {
            Auth.forgot(e)
          })
          Auth.vars.register_link.addEventListener('click', e => {
            Auth.brand()
            Auth.register(e)
          })
          Auth.vars.login_link.addEventListener('click', e => {
            Auth.brand()
            Auth.login(e)
          })
          Auth.vars.login_back_link.addEventListener('click', e => {
            Auth.loginback(e)
          })
        }
      }
      Auth.init({
        login_url: '#login',
        forgot_url: '#forgot'
      })
    },
    login() {
      SkmService.signin(this.userData).then(data => {
        if (data.code === 200) {
          console.log('登陆成功！')

          let pageName = 'home'
          let url = window.location.href
          if (url.indexOf('?') !== -1) {
            pageName = url.split('?redirect=%2F')[1]
          }
          this.$router.push({ name: pageName })
        } else {
          this.$alert(data.message, '登录错误', { confirmButtonText: '确定' })
        }
      })
    },
    register() {
      SkmService.register(this.registerData).then(data => {
        if (data.code === 200) {
          this.$router.go(0)
        } else {
          alert(data.message)
        }
      })
    },
    addKeyBoardListener() {
      window.addEventListener('keydown', this.keyboardListenerFn)
    },
    keyboardListenerFn(e) {
      if (e && e.keyCode === 13) {
        this.login()
      }
    },
    removeKeyBoardListener() {
      console.log('chanshu?')
      window.removeEventListener('keydown', this.keyboardListenerFn)
    }
  }
}
</script>

<template>
  <div class="lowin lowin-red">
    <div class="lowin-brand">
      <img src="../../assets/images/kodinger.jpg" alt="logo" />
    </div>
    <div class="lowin-wrapper">
      <!-- 登陆 -->
      <div class="lowin-box lowin-login">
        <div class="lowin-box-inner">
          <form>
            <p>Sign in to continue</p>
            <div class="lowin-group">
              <label>
                邮箱
                <span class="login-back-link">登陆?</span>
              </label>
              <input type="email" autocomplete="email" name="email" v-model="userData.username" class="lowin-input username" />
            </div>
            <div class="lowin-group password-group">
              <label>
                密码
                <span class="forgot-link">忘记密码?</span>
              </label>
              <input type="password" name="password" autocomplete="current-password" class="lowin-input passwd" v-model="userData.password" />
            </div>
            <div @click="login" class="lowin-btn login-btn loginBtn">登陆</div>
            <div class="text-foot">
              没有账号?
              <span class="register-link">注册</span>
            </div>
          </form>
        </div>
      </div>

      <!-- 注册 -->
      <div class="lowin-box lowin-register">
        <div class="lowin-box-inner">
          <form>
            <p>创建你的账号</p>
            <div class="lowin-group">
              <label>用户名</label>
              <input type="text" name="username" autocomplete="username" class="lowin-input" v-model="registerData.username" />
            </div>
            <div class="lowin-group">
              <label>邮箱</label>
              <input type="email" autocomplete="email" name="email" class="lowin-input" v-model="registerData.email" />
            </div>
            <div class="lowin-group">
              <label>密码</label>
              <input type="password" name="password" autocomplete="current-password" class="lowin-input" v-model="registerData.password" />
            </div>
            <div class="lowin-btn" @click="register">注册</div>
            <div class="text-foot">
              已经有账号?
              <a href class="login-link">登陆</a>
            </div>
          </form>
        </div>
      </div>
    </div>
    <footer class="lowin-footer"></footer>
  </div>
</template>

<style >
@import "./index.css";
</style>
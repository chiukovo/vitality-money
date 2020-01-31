<template lang='pug'>
.root
  #claps
    .claps.claps-left
    .claps.claps-right
  #header
    Header
  #main
    //- style A
    splitpanes(class="default-theme" v-show="mainStyle == 'A'")
      pane(size="20")
        splitpanes(horizontal)
          pane(size="30")
            UserInfo(v-if="checkIsset('A')")
          pane(size="70")
            ItemDetail(v-if="checkIsset('A')")
      pane(size="80")
        splitpanes(horizontal)
          pane(size="42")
            MainItem(v-if="checkIsset('A')")
          pane(size="44")
            History(v-if="checkIsset('A')")
          pane(size="14")
            Operating(v-if="checkIsset('A')")

    //- style B
    splitpanes(class="default-theme"  v-show="mainStyle == 'B'")
      pane(size="80")
        splitpanes(horizontal)
          pane(size="42")
            MainItem(v-if="checkIsset('B')")
          pane(size="44")
            History(v-if="checkIsset('B')")
          pane(size="14")
            Operating(v-if="checkIsset('B')")
      pane(size="20")
        splitpanes(horizontal)
          pane(size="30")
            UserInfo(v-if="checkIsset('B')")
          pane(size="70")
            ItemDetail(v-if="checkIsset('B')")
  #footer
    Footer
    Sound
</template>

<script>
import { mapState } from 'vuex'
import { Splitpanes, Pane } from 'splitpanes'
import websocketService from '~/plugins/service/websocketService.js'
import Header from '~/components/Header'
import Footer from '~/components/Footer'
import UserInfo from '~/components/UserInfo'
import ItemDetail from '~/components/ItemDetail'
import MainItem from '~/components/MainItem'
import History from '~/components/History'
import Sound from "~/components/Sound"
import Operating from '~/components/Operating'
import '@/assets/sass/style.scss'
export default {
  components: {
    Splitpanes,
    Pane,
    Header,
    Footer,
    Sound,
    UserInfo,
    ItemDetail,
    MainItem,
    History,
    Operating
  },
  mixins: [websocketService],
  head() {
    return {
      htmlAttrs: {
        class: 'gennki ' + this.themeStyle
      }
    }
  },
  data() {
    return {
      themeStyle: 'default'
    }
  },
  computed: mapState({
    mainStyle: state => state.localStorage.customSetting.mainStyle,
    theme: state => state.localStorage.customSetting.theme,
  }),
  watch: {
    theme(style) {
      this.themeStyle = style
    },
  },
  beforeMount() {
    this.checkDevice()
  },
  mounted() {
    let _this = this

    if (typeof this.theme != 'undefined') {
      this.themeStyle = this.theme
    } else {
      this.$store.commit('setTheme', 'default')
    }

    this.checkLogin()
  },
  methods: {
    checkIsset(type) {
      return type == this.mainStyle
    }
  }
}
</script>
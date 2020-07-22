<template>
  <div v-if="asyncDataReady" class="container">
    <TheNavbar />
    <div v-if="mode === 'edit'">
      <b-form-group
        id="fieldset-1"
        label="Title"
        label-for="input-1"
        label-cols="auto"
        :invalid-feedback="invalidFeedback1"
        :state="state1"
      >
        <b-form-input
          id="input-1"
          size="lg"
          v-model="note.title"
          :state="state1"
          trim
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="fieldset-2"
        description="Enter folder path separated by /"
        label="Folder"
        label-for="input-2"
        label-cols="auto"
        :invalid-feedback="invalidFeedback2"
        :state="state2"
      >
        <b-form-input
          id="input-2"
          v-model="note.folder"
          :state="state2"
          trim
        ></b-form-input>
      </b-form-group>
    </div>
    <div v-else class="mb-3">
      <h2>{{ note.title }}</h2>
      <div>
        Folder: <b>{{ note.folder }}</b>
      </div>
      <div>{{ note.status }}: {{ getDate }}</div>
    </div>
    <h4 id="use-md" v-if="mode === 'edit'">Use Markdown!</h4>
    <markdown-editor
      class="d-none d-md-block"
      ref="md"
      :toolbar="mode === 'edit' ? toolbar : 'fullscreen'"
      v-model="note.contents"
      :options="options"
    ></markdown-editor>
    <markdown-editor
      class="d-md-none"
      ref="mdsm"
      :toolbar="mode === 'edit' ? toolbarSm : 'fullscreen'"
      v-model="note.contents"
      :options="options"
    ></markdown-editor>
    <div class="error" v-if="showError && !note.contents">
      Please enter something.
    </div>
    <div v-if="mode === 'edit'">
      <b-button size="lg" class="ed-btn" variant="primary" @click="save"
        >Save</b-button
      >
      <b-button size="lg" class="ed-btn" variant="secondary" @click="cancel"
        >Cancel</b-button
      >
      <img class="loader" v-show="loaderShow" src="../assets/save-loader.gif" />
    </div>
    <div v-else>
      <b-button size="lg" class="ed-btn" variant="secondary" @click="cancel"
        >Back</b-button
      >
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar.vue'
import { getNote, saveNote } from '@/asyncActions'

export default {
  components: {
    TheNavbar
  },
  props: {
    id: {
      type: [Number, String],
      default: 0
    },
    mode: {
      type: String,
      default: 'edit'
    }
  },
  data() {
    return {
      note: null,
      showError: false,
      asyncDataReady: false,
      loaderShow: false,
      toolbar:
        'clean redo undo bold italic strikethrough heading image link numlist bullist code quote preview fullscreen',
      toolbarSm:
        'preview fullscreen redo undo bold italic | strikethrough heading image link numlist bullist | code quote clean',
      options: {
        lineNumbers: true,
        // styleActiveLine: true,
        // styleSelectedText: true,
        lineWrapping: true
        // indentWithTabs: true,
        // tabSize: 2,
        // indentUnit: 2
      }
    }
  },
  computed: {
    state1() {
      if (this.note.title === null) {
        return null
      } else {
        return !!this.note.title
      }
    },
    state2() {
      return !!this.note.folder
    },
    invalidFeedback1() {
      if (this.note.title === '') {
        return 'Please enter something.'
      } else {
        return ''
      }
    },
    invalidFeedback2() {
      if (this.note.folder === '') {
        return 'Please enter something.'
      } else {
        return ''
      }
    },
    getDate() {
      const d = new Date(this.note.ts)
      const mins = d.getMinutes()
      return `${d.getDate()}/${d.getMonth() +
        1}/${d.getFullYear()} ${d.getHours()}:${mins < 10 ? '0' + mins : mins}`
    }
  },
  methods: {
    save() {
      if (this.note.title === null) {
        this.note.title = ''
      }
      if (this.state1 && this.state2 && this.note.contents) {
        this.note.folder = this.note.folder.replace(/^\/+|\/+$/g, '')
        if (this.note.id !== 0) {
          this.note.status = 'Updated'
        }
        this.note.ts = Date.now()
        this.loaderShow = true
        saveNote(this.note)
      } else if (!this.note.contents) {
        this.showError = true
      }
    },
    cancel() {
      this.$router.push({ name: 'home' })
    }
  },
  created() {
    const id = parseInt(this.id)
    if (id) {
      getNote(id).then(note => {
        this.note = note
        this.$nextTick(() => {
          this.asyncDataReady = true
          this.$emit('ready')
        })
      })
    } else {
      this.note = {
        id,
        title: null,
        folder: 'main',
        contents: '',
        status: 'Created',
        ts: 0
      }
      this.$nextTick(() => {
        this.asyncDataReady = true
        this.$emit('ready')
      })
    }
  },
  updated() {
    if (this.mode === 'view') {
      this.$refs.md.command('preview')
      this.$refs.mdsm.command('preview')
    }
  }
}
</script>

<style scoped>
#use-md {
  font-family: 'Galada', cursive;
}
.error {
  color: red;
  font-size: 0.9rem;
}
.ed-btn {
  float: right;
  margin: 10px 0 10px 10px;
}
.loader {
  float: right;
  margin: 10px;
}
</style>

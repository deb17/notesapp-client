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
    <markdown-editor
      ref="md"
      :toolbar="mode === 'edit' ? toolbar : 'fullscreen'"
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
// import store from '../store'
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
      toolbar:
        'clean redo undo bold italic strikethrough heading image link numlist bullist code quote preview fullscreen',
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
      return `${d.getDate()}/${d.getMonth() +
        1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
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
      // this.note = store.notes.find(note => note.id === parseInt(this.id))
      getNote(id).then(note => {
        this.note = note
        this.$nextTick(() => {
          this.asyncDataReady = true
          this.$emit('ready')
          // if (this.mode === 'view') {
          //   this.$refs.md.command('preview')
          // }
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
    console.log('updated hook')
    // this.$emit('ready')
    if (this.mode === 'view') {
      this.$refs.md.command('preview')
    }
  }
}
</script>

<style scoped>
.error {
  color: red;
  font-size: 0.9rem;
}
.ed-btn {
  float: right;
  margin: 10px 0 0 10px;
}
</style>

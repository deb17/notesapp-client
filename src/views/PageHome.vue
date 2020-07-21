<template>
  <div v-if="asyncDataReady" class="container">
    <TheNavbar />
    <b-alert v-model="showAlert" variant="success" show dismissible>{{
      msg
    }}</b-alert>
    <h3 v-if="notes.length === 0">There are no notes to show.</h3>
    <transition-group name="slide-fade" tag="ul">
      <folder-item
        v-for="name in uniqueStart"
        :key="name"
        :notelist="getNotes(name)"
        :name="name"
        @deleteFolder="deleteFolder"
        @delEvent="delMsg"
      />
    </transition-group>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import FolderItem from '@/components/FolderItem'
import { getNotes, delFolderServer } from '@/asyncActions'

export default {
  components: {
    TheNavbar,
    FolderItem
  },
  data() {
    const paramsMsg = this.$route.params.msg
    return {
      notes: [],
      msg: paramsMsg,
      showAlert: !!paramsMsg,
      asyncDataReady: false
    }
  },
  computed: {
    folderNames() {
      let prev = ''
      const result = []
      this.notes.forEach(note => {
        if (note.folder !== prev) {
          prev = note.folder
          result.push(prev)
        }
      })
      return result
    },
    uniqueStart() {
      const folders = this.folderNames
      let prev = ''
      const result = []
      folders.forEach(name => {
        const firstPart = name.split('/')[0]
        if (firstPart !== prev) {
          prev = firstPart
          result.push(name)
        }
      })
      return result
    }
  },
  methods: {
    getNotes(name) {
      const firstPart = name.split('/')[0]
      return this.notes.filter(note => note.folder.startsWith(firstPart))
    },
    deleteFolder({ name, msg, server }) {
      if (server) {
        delFolderServer({ folder: name }).then(data => {
          this.notes = this.notes.filter(note => !note.folder.startsWith(name))
          if (msg) {
            this.msg = data.msg
            this.showAlert = true
          }
        })
      } else {
        this.notes = this.notes.filter(note => !note.folder.startsWith(name))
      }
    },
    sortNotes() {
      this.notes.sort((a, b) => {
        if (a.folder.startsWith('main')) {
          if (b.folder.startsWith('main')) {
            if (a.folder < b.folder) {
              return -1
            } else if (a.folder > b.folder) {
              return 1
            } else {
              return 0
            }
          } else {
            return -1
          }
        } else if (b.folder.startsWith('main')) {
          return 1
        } else if (a.folder < b.folder) {
          return -1
        } else if (a.folder > b.folder) {
          return 1
        } else {
          return 0
        }
      })
    },
    delMsg(data) {
      this.msg = data.msg
      this.showAlert = true
    }
  },
  created() {
    getNotes().then(data => {
      this.notes = data.notes
      this.sortNotes()
      this.asyncDataReady = true
      this.$emit('ready')
    })
  }
}
</script>

<style scoped>
ul {
  margin-top: 20px;
  margin-left: 40px;
}
@media (max-width: 575.9px) {
  ul {
    margin-left: 20px;
  }
}
h3 {
  margin-top: 40px;
}
</style>
